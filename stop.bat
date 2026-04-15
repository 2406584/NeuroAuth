@echo off

:: Kill all Node.js processes (Frontend and Backend)
echo Stopping Node.js applications...
taskkill /F /IM node.exe /T >nul 2>&1

:: Shut down the database containers
echo Stopping database...
docker compose down

echo Environment stopped successfully.
pause