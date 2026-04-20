@echo off

echo Stopping Node.js applications...
taskkill /F /IM node.exe /T >nul 2>&1

echo Stopping database...
docker compose down

echo Environment stopped successfully.
pause