#!/bin/bash
# RTL Chat for ZCode — one-click installer for macOS
set -u

echo "=========================================="
echo " RTL Chat for ZCode — one-click installer"
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
NODE_BIN="$(command -v node)"

# --- find ZCode's app.asar -------------------------------------------------
# ZCODE_ASAR (if set) wins; otherwise check the default locations
ASAR="${ZCODE_ASAR:-}"
if [ -z "$ASAR" ]; then
  for p in \
    "/Applications/ZCode.app/Contents/Resources/app.asar" \
    "$HOME/Applications/ZCode.app/Contents/Resources/app.asar"
  do
    if [ -f "$p" ]; then ASAR="$p"; break; fi
  done
fi

if [ -z "$ASAR" ]; then
  echo "[!] ZCode was not found in the default locations."
  echo
  read -r -p "Enter the full path to ZCode's app.asar (or press Enter to cancel): " ASAR
fi
if [ -z "$ASAR" ] || [ ! -f "$ASAR" ]; then
  echo "[X] Path not found: ${ASAR:-<empty>}"
  echo
  echo "    (Press any key to close this window)"
  read -r -n 1
  exit 1
fi
echo "ZCode found: $ASAR"
echo

# --- quit ZCode --------------------------------------------------------------
osascript -e 'tell application "ZCode" to quit' >/dev/null 2>&1
pkill -x ZCode >/dev/null 2>&1
sleep 2

# --- run the patch (as admin when the asar is not writable) ------------------
run_patch() {
  if [ -w "$ASAR" ]; then
    ZCODE_ASAR="$ASAR" "$NODE_BIN" "$HERE/asar-work/patch-asar.mjs" --apply
  else
    # /Applications is admin-owned: re-run the patch as root via a password dialog
    echo "Patching $ASAR needs administrator privileges..."
    inner="export ZCODE_ASAR='$(printf '%s' "$ASAR" | sed "s/'/'\\\\''/g")'; cd '$(printf '%s' "$HERE" | sed "s/'/'\\\\''/g")'; '$NODE_BIN' asar-work/patch-asar.mjs --apply"
    apple="$(printf '%s' "$inner" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')"
    osascript -e "do shell script \"$apple\" with administrator privileges"
  fi
}

if ! run_patch; then
  echo
  echo "[X] Patch FAILED - read the error above."
  echo "    \"anchor missing\" means your ZCode version needs an updated patch."
  echo
  echo "    (Press any key to close this window)"
  read -r -n 1
  exit 1
fi

echo
echo "[OK] Installed. Start ZCode normally and look for the RTL toggle"
echo "     near the chat input box (bottom toolbar). Click it to toggle RTL."
echo
echo "    (Press any key to close this window)"
read -r -n 1
