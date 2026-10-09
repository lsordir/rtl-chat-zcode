#!/bin/bash
# RTL Chat for ZCode — launch ZCode with CDP + extension injector (macOS)
set -u

echo "=========================================="
echo " RTL Chat for ZCode — CDP launcher"
echo "=========================================="
echo

if ! command -v node >/dev/null 2>&1; then
  echo "[X] Node.js not found. Install it from https://nodejs.org and run this again."
  echo
  echo "    (Press any key to close this window)"
  read -r -n 1
  exit 1
fi

HERE="$(cd "$(dirname "$0")" && pwd)"
EXT_DIR="$HERE/extension"
INJECTOR="$HERE/inject-cdp.mjs"

# --- find ZCode ------------------------------------------------------------
APP=""
for p in "/Applications/ZCode.app" "$HOME/Applications/ZCode.app"; do
  if [ -d "$p" ]; then APP="$p"; break; fi
done

if [ -z "$APP" ]; then
  echo "[X] ZCode.app was not found in /Applications or ~/Applications."
  echo
  echo "    (Press any key to close this window)"
  read -r -n 1
  exit 1
fi

EXE="$APP/Contents/MacOS/ZCode"
if [ ! -x "$EXE" ]; then
  # main executable = the largest file in Contents/MacOS
  MAIN="$(ls -S "$APP/Contents/MacOS" 2>/dev/null | head -1)"
  if [ -n "$MAIN" ]; then EXE="$APP/Contents/MacOS/$MAIN"; fi
fi
if [ ! -x "$EXE" ]; then
  echo "[X] Could not find the ZCode executable inside $APP"
  echo
  echo "    (Press any key to close this window)"
  read -r -n 1
  exit 1
fi

echo "[RTL Chat] ZCode found: $APP"

# --- quit any running ZCode -------------------------------------------------
osascript -e 'tell application "ZCode" to quit' >/dev/null 2>&1
pkill -x ZCode >/dev/null 2>&1
sleep 3

# --- start ZCode with CDP + extension ---------------------------------------
echo "[RTL Chat] Starting ZCode with CDP + extension..."
open -a "$APP" --args \
  --remote-debugging-port=9229 \
  --load-extension="$EXT_DIR" \
  --disable-extensions-except="$EXT_DIR"
if [ $? -ne 0 ]; then
  "$EXE" --remote-debugging-port=9229 \
    --load-extension="$EXT_DIR" \
    --disable-extensions-except="$EXT_DIR" >/dev/null 2>&1 &
fi

echo "[RTL Chat] Waiting for CDP..."
sleep 5

echo "[RTL Chat] Starting CDP injector daemon..."
echo
node "$INJECTOR"
echo
echo "[RTL Chat] Injector stopped. Look for the red badge in the chat window."
echo "           Verify anytime with: node inject-cdp.mjs --verify"
echo
echo "    (Press any key to close this window)"
read -r -n 1
