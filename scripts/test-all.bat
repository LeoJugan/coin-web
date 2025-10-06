@echo off
echo 開始執行完整測試套件...

echo.
echo ========================================
echo 1. 執行單元測試
echo ========================================
call npm run test:unit:coverage
if %errorlevel% neq 0 (
    echo 單元測試失敗！
    exit /b 1
)

echo.
echo ========================================
echo 2. 執行整合測試
echo ========================================
call npm run test:integration
if %errorlevel% neq 0 (
    echo 整合測試失敗！
    exit /b 1
)

echo.
echo ========================================
echo 3. 執行 E2E 測試
echo ========================================
call npm run test:e2e
if %errorlevel% neq 0 (
    echo E2E 測試失敗！
    exit /b 1
)

echo.
echo ========================================
echo 4. 執行程式碼檢查
echo ========================================
call npm run lint
if %errorlevel% neq 0 (
    echo 程式碼檢查失敗！
    exit /b 1
)

echo.
echo ========================================
echo 5. 執行類型檢查
echo ========================================
call npm run type-check
if %errorlevel% neq 0 (
    echo 類型檢查失敗！
    exit /b 1
)

echo.
echo ========================================
echo 所有測試通過！
echo ========================================



