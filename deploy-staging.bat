@echo off
echo === Deploying to STAGING ===
echo.

REM Commit any uncommitted changes
git add -A
git status --short
echo.

set /p msg="Commit message (or press Enter to skip commit): "
if not "%msg%"=="" (
    git commit -m "%msg%"
)

echo.
echo Pushing to staging repo (harel2710.github.io/police-staging/)...
git push staging staging:main
echo.
echo === Done! Staging URL: https://harel2710.github.io/police-staging/ ===
echo Deploy takes ~1 minute to go live.
pause
