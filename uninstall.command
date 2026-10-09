#!/bin/bash
# RTL Chat for ZCode — one-click uninstaller for macOS
set -u

echo "=========================================="
echo " RTL Chat for ZCode — one-click uninstall"
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
  echo "[X] ZCode was not found in the default locations."
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

# --- helpers -----------------------------------------------------------------
# run_cmd <writable-target> <command-string>
# runs the command as the user when <writable-target> is writable,
# otherwise as root via an administrator-password dialog
run_cmd() {
  local target="$1"; shift
  local cmd="$1"
  if [ -w "$target" ]; then
    eval "$cmd"
  else
    local apple
    apple="$(printf '%s' "$cmd" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')"
    osascript -e "do shell script \"$apple\" with administrator privileges"
  fi
}

q() { printf '%q' "$1"; }

# --- surgical removal ----------------------------------------------------------
PATCH_CMD="export ZCODE_ASAR=$(q "$ASAR"); cd $(q "$HERE"); $(q "$NODE_BIN") asar-work/patch-asar.mjs --unpatch"

if run_cmd "$ASAR" "$PATCH_CMD"; then
  echo
  echo "[OK] RTL patch removed from ZCode. Start ZCode normally."
  echo "     A pristine backup also lives at:"
  echo "     ~/Library/Application Support/rtl-chat-zcode/app.asar.bak"
  echo
  echo "    (Press any key to close this window)"
  read -r -n 1
  exit 0
fi

# --- fallback: restore a pristine backup ---------------------------------------
STABLE_BAK="$HOME/Library/Application Support/rtl-chat-zcode/app.asar.bak"
REPO_BAK="$HERE/asar-work/app.asar.bak"

restore() { # restore <backup-file>
  if [ ! -f "$1" ]; then return 1; fi
  echo "[!] Surgical removal failed. Restoring the pristine backup instead..."
  local cmd="cp -f $(q "$1") $(q "$ASAR")"
  if run_cmd "$ASAR" "$cmd"; then
    echo "[OK] Original app.asar restored from: $1"
    return 0
  fi
  return 1
}

if restore "$STABLE_BAK"; then
  echo
  echo "    (Press any key to close this window)"
  read -r -n 1
  exit 0
fi
if restore "$REPO_BAK"; then
  echo
  echo "    (Press any key to close this window)"
  read -r -n 1
  exit 0
fi

echo "[X] No backup found and surgical removal failed."
echo "    Reinstall the same ZCode version, then run this uninstaller again."
echo
echo "    (Press any key to close this window)"
read -r -n 1
exit 1
