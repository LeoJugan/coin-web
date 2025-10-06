@echo off
setlocal enabledelayedexpansion

REM 測試執行腳本 (Windows 版本)
REM 用法: scripts\test.bat [unit|integration|e2e|all]

set "test_type=%1"
if "%test_type%"=="" set "test_type=all"

echo 開始測試執行...
echo 測試類型: %test_type%

REM 檢查依賴
echo 檢查依賴...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 錯誤: Node.js 未安裝
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo 錯誤: npm 未安裝
    exit /b 1
)

echo 依賴檢查完成

REM 安裝依賴
echo 安裝依賴...
call npm ci
if %errorlevel% neq 0 (
    echo 錯誤: 依賴安裝失敗
    exit /b 1
)
echo 依賴安裝完成

REM 執行測試
if "%test_type%"=="unit" (
    echo 執行單元測試...
    call npm run test:unit:coverage
    if %errorlevel% neq 0 (
        echo 單元測試失敗
        exit /b 1
    )
    echo 單元測試完成
) else if "%test_type%"=="integration" (
    echo 執行整合測試...
    call npm run test:integration
    if %errorlevel% neq 0 (
        echo 整合測試失敗
        exit /b 1
    )
    echo 整合測試完成
) else if "%test_type%"=="e2e" (
    echo 執行 E2E 測試...
    call npm run test:e2e
    if %errorlevel% neq 0 (
        echo E2E 測試失敗
        exit /b 1
    )
    echo E2E 測試完成
) else if "%test_type%"=="all" (
    echo 執行所有測試...
    call npm run test:all
    if %errorlevel% neq 0 (
        echo 測試失敗
        exit /b 1
    )
    echo 所有測試完成
) else (
    echo 未知的測試類型: %test_type%
    echo 支援的類型: unit, integration, e2e, all
    exit /b 1
)

REM 生成測試報告
echo 生成測試報告...
if not exist reports mkdir reports

if exist coverage (
    xcopy /E /I coverage reports\coverage
    echo 覆蓋率報告已生成: reports\coverage\
)

if exist playwright-report (
    xcopy /E /I playwright-report reports\playwright-report
    echo E2E 測試報告已生成: reports\playwright-report\
)

echo 測試執行完成！



