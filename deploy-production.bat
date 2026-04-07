@echo off
echo === Deploying to PRODUCTION ===
echo WARNING: This pushes to the LIVE app that all users see!
echo.

set /p confirm="Are you sure? (y/n): "
if /i not "%confirm%"=="y" (
    echo Cancelled.
    pause
    exit /b
)

echo.
echo Merging staging into master...
git checkout master
git merge staging --no-edit
echo.
echo Pushing to production (harel2710.github.io/police-exam-app/)...
git push origin master
echo.
echo Switching back to staging branch...
git checkout staging
echo.
echo === Done! Production URL: https://harel2710.github.io/police-exam-app/ ===
echo Deploy takes ~1 minute to go live.
pause
