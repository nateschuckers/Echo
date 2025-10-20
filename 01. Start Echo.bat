@echo off
echo ===================================
echo  Starting Local Web Server
echo ===================================
echo.
echo  - Your application will be available at: http://localhost:8000
echo  - Press CTRL+C in this window to stop the server.
echo.
echo ===================================

start "Python Server" python -m http.server 8000
timeout /t 2 /nobreak > nul
start http://localhost:8000