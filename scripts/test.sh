#!/bin/bash

# 測試執行腳本
# 用法: ./scripts/test.sh [unit|integration|e2e|all]

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函數：打印彩色訊息
print_message() {
    echo -e "${2}${1}${NC}"
}

# 函數：檢查依賴
check_dependencies() {
    print_message "檢查依賴..." $BLUE
    
    if ! command -v node &> /dev/null; then
        print_message "錯誤: Node.js 未安裝" $RED
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_message "錯誤: npm 未安裝" $RED
        exit 1
    fi
    
    print_message "依賴檢查完成" $GREEN
}

# 函數：安裝依賴
install_dependencies() {
    print_message "安裝依賴..." $BLUE
    npm ci
    print_message "依賴安裝完成" $GREEN
}

# 函數：執行單元測試
run_unit_tests() {
    print_message "執行單元測試..." $BLUE
    npm run test:unit:coverage
    print_message "單元測試完成" $GREEN
}

# 函數：執行整合測試
run_integration_tests() {
    print_message "執行整合測試..." $BLUE
    npm run test:integration
    print_message "整合測試完成" $GREEN
}

# 函數：執行 E2E 測試
run_e2e_tests() {
    print_message "執行 E2E 測試..." $BLUE
    npm run test:e2e
    print_message "E2E 測試完成" $GREEN
}

# 函數：執行所有測試
run_all_tests() {
    print_message "執行所有測試..." $BLUE
    npm run test:all
    print_message "所有測試完成" $GREEN
}

# 函數：生成測試報告
generate_report() {
    print_message "生成測試報告..." $BLUE
    
    # 建立報告目錄
    mkdir -p reports
    
    # 複製覆蓋率報告
    if [ -d "coverage" ]; then
        cp -r coverage reports/
        print_message "覆蓋率報告已生成: reports/coverage/" $GREEN
    fi
    
    # 複製 Playwright 報告
    if [ -d "playwright-report" ]; then
        cp -r playwright-report reports/
        print_message "E2E 測試報告已生成: reports/playwright-report/" $GREEN
    fi
}

# 主函數
main() {
    local test_type=${1:-all}
    
    print_message "開始測試執行..." $YELLOW
    print_message "測試類型: $test_type" $BLUE
    
    check_dependencies
    install_dependencies
    
    case $test_type in
        unit)
            run_unit_tests
            ;;
        integration)
            run_integration_tests
            ;;
        e2e)
            run_e2e_tests
            ;;
        all)
            run_all_tests
            ;;
        *)
            print_message "未知的測試類型: $test_type" $RED
            print_message "支援的類型: unit, integration, e2e, all" $YELLOW
            exit 1
            ;;
    esac
    
    generate_report
    print_message "測試執行完成！" $GREEN
}

# 執行主函數
main "$@"



