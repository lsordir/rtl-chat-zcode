# rtl-zcode

**RTL for ZCode Desktop — done right.** Smart **any-rtl**: any text block containing a Persian/Arabic character flows right-to-left; English text, code, tables and all UI chrome stay left-aligned.

**راست‌چین کردن هوشمند ZCode Desktop.** هر متنی که حرف فارسی/عربی دارد راست‌چین میشود؛ متن انگلیسی، کد و رابط برنامه دست‌نخورده میماند.

---

## ✨ Features

- **Any-rtl detection** — decided per text block by RTL-character *presence*, not the first word. `ZCode یه ابزار خوبیه` → RTL, English paragraphs → LTR. Code, tables, math, inputs and diffs are never touched.
- **App-wide** — chat, task list, sidebar, dialogs.
- **`Fa` toggle** — in the composer toolbar, right of the mode selector. Click to turn RTL on/off; the choice persists. The button never disappears and never shows on the welcome screen.
- **Vazirmatn font** — embedded (~100 KB, no install, no internet) and applied only to RTL text.
- **Live** — directions fix themselves while responses stream.
- **One-click install & uninstall** — no terminal needed.

## 🚀 Install

Prerequisite: [Node.js](https://nodejs.org).

1. Download/clone this repo.
2. Double-click **`install.bat`** — it finds ZCode, closes it, patches its `app.asar` and keeps pristine backups.
3. Start ZCode normally. Done.

> Re-run `install.bat` after every ZCode update.

## 🗑 Uninstall

Double-click **`uninstall.bat`**. It surgically removes the two injected snippets from `app.asar` — no backup needed, works even if ZCode updated since. Pristine backups (kept in `%LOCALAPPDATA%\rtl-chat-zcode\app.asar.bak` and `asar-work\app.asar.bak`) are restored automatically if the surgical path ever fails.

## 🎛 The Fa toggle

Sits in the composer toolbar next to the permission mode selector:

- **On** — bright, like every other control.
- **Off** — dimmed. RTL is fully disabled, the toggle stays reachable.
- Persian tooltip shows the current state.

## 🛠 Manual install (if the .bat can't)

```powershell
$env:ZCODE_ASAR = "C:\Users\YOU\AppData\Local\Programs\ZCode\resources\app.asar"
node asar-work\patch-asar.mjs --apply    # look for: APPLY DONE
```

Restore manually:

```powershell
Copy-Item -Force "$env:LOCALAPPDATA\rtl-chat-zcode\app.asar.bak" "C:\Users\YOU\AppData\Local\Programs\ZCode\resources\app.asar"
```

(Run PowerShell as Administrator if ZCode lives in `C:\Program Files`.)

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| `node` not found | Install Node.js, reopen the terminal. |
| `EPERM` while patching | Run PowerShell as Administrator. |
| `anchor missing` | Your ZCode version changed the internals — the patch needs an update. |
| Toggle missing after update | Run `install.bat` again. |
| Everything still LTR | Check the `Fa` toggle (dimmed = off). |

## 🙏 Credits

- Built on [the-Ashkanian/rtl-chat-zcode](https://github.com/the-Ashkanian/rtl-chat-zcode) — the original patch and the ZCode DOM mapping.
- Any-rtl approach ported from [zamanimm/obsidian-any-rtl](https://github.com/zamanimm/obsidian-any-rtl) (which builds on [Content RTL](https://github.com/SirwanAfifi/content-rtl) and [RTL Support](https://github.com/esm7/obsidian-rtl)).
- [Vazirmatn](https://github.com/rastikerdar/vazirmatn) font by Saber Rastikerdar.

## 📜 License

MIT — see [LICENSE](LICENSE). The original work this project builds on remains credited to its author.
