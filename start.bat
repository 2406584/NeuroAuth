@echo off

:: Start the database in the background
echo Starting database...
docker compose up -d

:: Wait for the database to be ready (10 seconds)
echo Waiting for DB to initialize...
timeout /t 10 /nobreak

:: Start the frontend in a NEW command prompt window
echo Launching frontend...
start cmd /k "cd frontend && npm run dev"

echo Migrating database...
start cmd /k "npx prisma db push"
timeout /t 10 /nobreak

echo Seeding database...
start cmd /k "npx prisma db seed"

:: Start the backend/application in the CURRENT window
echo Starting backend...
npm run dev