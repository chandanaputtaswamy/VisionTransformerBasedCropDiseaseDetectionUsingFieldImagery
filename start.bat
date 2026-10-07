@echo off
echo ===================================================================
echo   AgriVision: Vision Transformer Crop Disease Detection System
echo ===================================================================
echo.
echo Backend REST API: http://localhost:5000
echo React Frontend:   http://localhost:5173
echo.
echo Starting both services... Press Ctrl+C to stop.
echo.
if not exist "backend\venv\Scripts\activate.bat" (
    echo Python environment not found. Follow the first-time setup in README.md.
    exit /b 1
)
call "backend\venv\Scripts\activate.bat"
npm start
pause
