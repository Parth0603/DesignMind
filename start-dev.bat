@echo off
echo Starting DesignMind Development Environment...
echo.
echo Frontend will run on: http://localhost:5173
echo Backend will run on: http://localhost:5000
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Press any key to exit
pause > nul