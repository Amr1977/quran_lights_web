#!/usr/bin/env bash
# VPS Watchdog — health checks, service recovery, alerts
set -euo pipefail

CONFIG=/etc/watchdog/config
LOG=/var/log/watchdog.log
LOCK=/run/watchdog.lock

# ── load config ──────────────────────────────────────────
if [[ -f $CONFIG ]]; then
  # shellcheck source=/dev/null
  source "$CONFIG"
fi

TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-}"
ALERT_EMAIL="${ALERT_EMAIL:-amr.lotfy.othman@gmail.com}"
REBOOT_ON_HANG="${REBOOT_ON_HANG:-false}"
CHECK_INTERVAL="${CHECK_INTERVAL:-300}"

# ── helpers ──────────────────────────────────────────────
log()  { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" >> "$LOG"; }
log_n() { echo -n "$*" >> "$LOG"; }

notify_telegram() {
  local msg="$1"
  if [[ -n "$TELEGRAM_BOT_TOKEN" && -n "$TELEGRAM_CHAT_ID" ]]; then
    curl -s -o /dev/null --max-time 10 \
      "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d "chat_id=${TELEGRAM_CHAT_ID}" \
      -d "text=${msg}" \
      -d "parse_mode=Markdown" 2>/dev/null || true
  fi
}

notify_email() {
  local subject="$1" body="$2"
  if command -v mail &>/dev/null; then
    echo "$body" | mail -s "$subject" "$ALERT_EMAIL" 2>/dev/null || true
  fi
}

notify() {
  local subject="$1" body="$2"
  notify_email "[Watchdog] $subject" "$body"
  notify_telegram "*⚠️ Watchdog Alert*%0A%0A**$subject**%0A%0A$body"
}

# ── checks ──────────────────────────────────────────────
FAILED=false
ERRORS=""

check() {
  local name="$1"
  shift
  if ! eval "$*" &>/dev/null; then
    FAILED=true
    ERRORS+="- $name: $*"$'\n'
    log "FAIL: $name"
    return 1
  fi
  log_n "."
  return 0
}

recover() {
  local name="$1" action="$2"
  log "RECOVER: $name — $action"
  eval "$action" &>/dev/null || true
  notify "Recovery attempted" "$name was down. Tried: $action"
}

# ── main ─────────────────────────────────────────────────
exec 200>"$LOCK"
flock -n 200 || { log "skipped (another run in progress)"; exit 1; }

log "─── watchdog check ───"

# 1. system resources
MEM_PCT=$(free | awk '/Mem:/ {printf "%.0f", $3/$2 * 100}')
SWAP_PCT=$(free | awk '/Swap:/ {printf "%.0f", $3/$2 * 100}')
DISK_PCT=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
LOAD=$(uptime | awk -F'load average:' '{print $2}' | cut -d, -f1 | tr -d ' ')

log "[${MEM_PCT}% mem | ${SWAP_PCT}% swap | ${DISK_PCT}% disk | load ${LOAD}]"

if [[ $MEM_PCT -gt 90 ]]; then
  log "WARN: memory >90%"
  notify "High memory" "Memory at ${MEM_PCT}% — swap ${SWAP_PCT}%"
fi

if [[ $DISK_PCT -gt 85 ]]; then
  log "WARN: disk >85%"
  notify "Low disk space" "Disk at ${DISK_PCT}%"
fi

# 2. nginx
check "nginx" "systemctl is-active --quiet nginx" || recover "nginx" "systemctl start nginx"

# 3. PM2 processes
if command -v pm2 &>/dev/null; then
  OFFLINE=$(pm2 list 2>/dev/null | grep -c "errored\|stopped" || true)
  if [[ $OFFLINE -gt 0 ]]; then
    log "WARN: $OFFLINE PM2 processes errored/stopped"
    ERRORS+="- $OFFLINE PM2 processes are down"$'\n'
    FAILED=true
    pm2 list 2>/dev/null | grep "errored\|stopped" | while read -r line; do
      ID=$(echo "$line" | awk '{print $2}')
      NAME=$(echo "$line" | awk '{print $4}')
      log "RECOVER: restarting PM2 $NAME (id=$ID)"
      pm2 restart "$ID" &>/dev/null || true
    done
    notify "PM2 services down" "$OFFLINE PM2 processes were restarted"
  fi
fi

# 4. API health check (et3am)
check "et3am API" "curl -sf --max-time 10 https://api.et3am.com/api/health" || recover "et3am API" "systemctl restart nginx; pm2 restart et3am-backend"

# 5. API health check (quran-lights)
check "quran-lights" "curl -sf --max-time 10 https://quran-lights.web.app" || true

# 6. network — try to reach external host
check "external connectivity" "ping -c1 -W3 8.8.8.8" || {
  notify "Network down" "Cannot reach 8.8.8.8. Skipping further checks."
  log "NETWORK: unreachable"
}

# ── final ────────────────────────────────────────────────
if $FAILED; then
  log "FAILURES:\n$ERRORS"
  notify "Watchdog — failures detected" "$ERRORS"
else
  log "OK"
fi
