<#
.SYNOPSIS
  Deploys the app by pushing code to GitHub and publishing to Power Platform.

.DESCRIPTION
  This script will:
    1) Ensure the Git remote is configured (origin).
    2) Set the local branch to 'main'.
    3) Push the current branch to GitHub.
    4) Build the app and run `pac code push` to publish to Power Platform.

.NOTES
  Run this from the repository root using PowerShell (pwsh).
  Example: pwsh ./deploy.ps1
#>

Set-StrictMode -Version Latest

$repoRoot = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
Set-Location $repoRoot

# Git settings
$remoteName = 'origin'
$remoteUrl = 'https://github.com/jeromedawnnextgen/hr-resource-management.git'
$branchName = 'main'

Write-Host "[1/4] Ensuring Git remote '$remoteName' points to $remoteUrl..." -ForegroundColor Cyan
$existing = git remote get-url $remoteName 2>$null
if (-not $existing) {
    git remote add $remoteName $remoteUrl
    Write-Host "Added remote '$remoteName'." -ForegroundColor Green
} elseif ($existing -ne $remoteUrl) {
    Write-Host "Remote '$remoteName' exists but points to '$existing'. Updating to '$remoteUrl'." -ForegroundColor Yellow
    git remote set-url $remoteName $remoteUrl
} else {
    Write-Host "Remote '$remoteName' already configured." -ForegroundColor Green
}

Write-Host "[2/4] Ensuring branch is '$branchName'..." -ForegroundColor Cyan
# Create / switch to main branch
if (-not (git show-ref --verify --quiet refs/heads/$branchName)) {
    git branch -M $branchName
    Write-Host "Created and switched to branch '$branchName'." -ForegroundColor Green
} else {
    git switch $branchName
    Write-Host "Switched to existing branch '$branchName'." -ForegroundColor Green
}

Write-Host "[3/4] Pushing to GitHub..." -ForegroundColor Cyan
git push -u $remoteName $branchName

Write-Host "[4/4] Building and pushing to Power Platform..." -ForegroundColor Cyan
# Ensure dependencies are installed and the app builds before pushing
npm install
npm run build

if (Get-Command pac -ErrorAction SilentlyContinue) {
    pac code push
} else {
    Write-Host "ERROR: 'pac' CLI not found in PATH. Install the Microsoft Power Platform CLI (pac) and re-run." -ForegroundColor Red
    exit 1
}

Write-Host "Deployment complete." -ForegroundColor Green
