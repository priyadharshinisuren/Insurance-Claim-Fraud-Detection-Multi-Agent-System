@echo off
echo ========================================================
echo   Starting Guardian AI Claims Fraud Detection Backend  
echo ========================================================
echo.

if not exist .venv (
    echo [ERROR] Virtual environment .venv not found.
    echo Please create it first.
    pause
    exit /b
)

echo [INFO] Activating virtual environment...
call .venv\Scripts\activate

echo [INFO] Starting FastAPI server on http://127.5.0.1:8000...
echo [INFO] To run the frontend, open 'frontend/index.html' in your browser.
echo.
uvicorn src.server:app --reload --port 8000

pause
