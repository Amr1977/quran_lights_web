# Deploy Firebase Security Rules - PowerShell Version
Write-Host "Deploying Firebase security rules..." -ForegroundColor Green

# Check if firebase-tools is installed
try {
    $firebaseVersion = firebase --version
    Write-Host "Firebase CLI version: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "Firebase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Deploy the rules
Write-Host "Deploying Firebase rules..." -ForegroundColor Green
firebase deploy --only database

if ($LASTEXITCODE -eq 0) {
    Write-Host "Firebase rules deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Test the review submission form on your website" -ForegroundColor White
    Write-Host "2. Access the admin panel at: https://your-domain.com/admin-reviews.html" -ForegroundColor White
    Write-Host "3. Approve or reject reviews as needed" -ForegroundColor White
    Write-Host ""
    Write-Host "Note: Make sure to secure the admin panel in production!" -ForegroundColor Yellow
} else {
    Write-Host "Error deploying Firebase rules!" -ForegroundColor Red
    Write-Host "Please check your Firebase configuration and try again." -ForegroundColor Red
} 