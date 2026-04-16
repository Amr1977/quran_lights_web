# Security Policy

## Reporting Security Issues

If you discover a security vulnerability, please email amr@example.com with:
- Description of the issue
- Steps to reproduce
- Any potential fixes (optional)

**Please DO NOT create a public GitHub issue for security vulnerabilities.**

---

## Supported Versions

| Version | Supported |
|---------|------------|
| 2.0.x   | ✅ |
| 1.x     | ⚠️ Security fixes only |

---

## Security Best Practices

- Never commit API keys or secrets to version control
- Use environment variables for sensitive configuration
- Keep dependencies updated
- Follow the principle of least privilege

---

## Data Storage

- User data is stored locally in the browser (localStorage)
- Optional Firebase sync uses secure authentication
- No personal data is stored on third-party servers

---

## Authentication

- Email/password authentication via Firebase Auth
- All auth tokens are JWT-based
- Sessions expire after reasonable time periods
