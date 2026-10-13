#!/bin/bash
# iCloud 同期対策: npm install が node_modules を実フォルダで作り直したときに、
# 実体を node_modules.nosync（iCloud が同期しない名前）へ移して symlink を張り直す。
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -d node_modules ] && [ ! -L node_modules ]; then
  rm -rf node_modules.nosync
  mv node_modules node_modules.nosync
  ln -s node_modules.nosync node_modules
  xattr -w 'com.apple.fileprovider.ignore#P' 1 node_modules.nosync 2>/dev/null || true
  echo "node_modules -> node_modules.nosync に張り直しました"
else
  echo "変更なし（既に symlink です）"
fi
