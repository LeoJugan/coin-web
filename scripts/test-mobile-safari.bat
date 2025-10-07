@echo off
echo Running Mobile Safari E2E Tests...
echo.

REM 設置環境變數
set CI=true
set DEBUG=pw:api

REM 運行 Mobile Safari 測試
npx playwright test --project="Mobile Safari" --reporter=html --headed

echo.
echo Test completed. Check test-results folder for detailed reports.
pause
