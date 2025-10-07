#!/bin/bash

echo "Running Mobile Safari E2E Tests..."
echo

# 設置環境變數
export CI=true
export DEBUG=pw:api

# 運行 Mobile Safari 測試
npx playwright test --project="Mobile Safari" --reporter=html --headed

echo
echo "Test completed. Check test-results folder for detailed reports."
