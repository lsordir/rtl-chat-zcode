# rtl-zcode

**RTL for ZCode Desktop — done right.** Smart **any-rtl**: any text block containing an RTL character (Persian, Arabic, Hebrew, …) flows right-to-left; English text, code, tables and all UI chrome stay left-aligned.

## 🎬 Demo

| Persian | العربية |
|:---:|:---:|
| <video src="https://github.com/user-attachments/assets/ab6ba04f-870c-47a0-a2f1-44c2895bbf42" controls muted playsinline width="380"></video> | <video src="https://github.com/user-attachments/assets/cb4ca5e3-3121-4827-aff3-45c5d6dd2aac" controls muted playsinline width="380"></video> |

## ✨ Features

- **Any-rtl detection** — decided per text block by RTL-character *presence*, not the first word. `ZCode یه ابزار خوبیه` → RTL, English paragraphs → LTR. Code, tables, math, inputs and diffs are never touched.
- **App-wide** — chat, task list, sidebar, dialogs.
- **RTL toggle** — an RTL-symbol icon in the composer toolbar, right of the mode selector. Click to turn RTL on/off; the choice persists. The button never disappears and never shows on the welcome screen.
- **Vazirmatn font** — embedded (~100 KB, no install, no internet), applied only to RTL text.
- **Live** — directions fix themselves while responses stream.
- **One-click install & uninstall** — no terminal needed.

## 🚀 Install

Prerequisite: [Node.js](https://nodejs.org).

1. Download or clone this repo.
2. Run the one-click installer for your system:
   - **Windows** — double-click **`install.bat`**
   - **macOS** — double-click **`install.command`**<br>
     The first time, macOS may block it: right-click the file → **Open** → **Open** again (or run `xattr -dr com.apple.quarantine install.command` in Terminal). If ZCode lives in `/Applications`, you will be asked for your macOS password — that is normal, it's needed to patch the app.

   The installer finds ZCode, closes it, patches its `app.asar` and keeps pristine backups.
3. Start ZCode normally. Done.

> Re-run the installer after every ZCode update.

## 🗑 Uninstall

Double-click **`uninstall.bat`** (Windows) or **`uninstall.command`** (macOS). It surgically removes the two injected snippets from `app.asar` — no backup needed, works even if ZCode updated since. Pristine backups (kept in `%LOCALAPPDATA%\rtl-chat-zcode\app.asar.bak` on Windows, `~/Library/Application Support/rtl-chat-zcode/app.asar.bak` on macOS, and `asar-work\app.asar.bak` in the repo) are restored automatically if the surgical path ever fails.

## 🎛 The RTL toggle

Sits in the composer toolbar next to the permission mode selector:

- **On** — bright, like every other control.
- **Off** — dimmed. RTL is fully disabled, the toggle stays reachable.
- Tooltip shows the current state.

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| `node` not found | Install Node.js, reopen the terminal. |
| `EPERM` while patching | Windows: run PowerShell as Administrator. macOS: the installer will ask for your password; if it doesn't, move ZCode to `~/Applications`. |
| macOS: "cannot be opened because it is from an unidentified developer" | Right-click the `.command` file → **Open** → **Open** again. Or `xattr -dr com.apple.quarantine install.command`. |
| `anchor missing` | Your ZCode version changed the internals — the patch needs an update. |
| Toggle missing after update | Run the installer again. |
| Everything still LTR | Check the RTL toggle (dimmed = off). |

---

<details>
<summary><b>🇮🇷 راهنمای فارسی</b></summary>

<div dir="rtl">

## راست‌چین هوشمند برای ZCode Desktop

هر متنی که حرف فارسی/عربی دارد راست‌چین میشود؛ متن انگلیسی، کد و رابط برنامه دست‌نخورده میماند.

## ✨ قابلیتها

- **تشخیص any-rtl** — جهت هر پاراگراف از روی وجود حتی یک حرف فارسی/عربی در همان پاراگراف؛ نه از روی کلمه اول. متن انگلیسی، کد، جدول، فرمول و فیلدهای ورودی هرگز تغییر نمیکنند.
- **کل محیط** — چت، لیست تسکها، سایدبار و پنجرهها.
- **دکمه راست‌چین (نماد RTL)** — در نوار ابزار جعبه پیام، سمت راستِ انتخابگر حالت دسترسی. کلیک = خاموش/روشن؛ انتخاب در حافظه میماند و دکمه هیچوقت ناپدید نمیشود.
- **فونت وزیرمتن** — داخل پچ جاسازی شده؛ بدون نصب و بدون اینترنت، فقط برای متنهای راست‌چین.
- **بهروزرسانی زنده** — جهت متنها موقع استریم شدن جواب فوراً درست میشود.

## 🚀 نصب

پیشنیاز: [Node.js](https://nodejs.org).

1. این ریپو را دانلود یا clone کنید.
2. نصب‌کننده سیستم‌تان را اجرا کنید:
   - **ویندوز** — روی **`install.bat`** دوبار کلیک کنید.
   - **مک** — روی **`install.command`** دوبار کلیک کنید. اولین بار ممکن است مک آن را بلوک کند: راست‌کلیک → **Open** → دوباره **Open** (یا `xattr -dr com.apple.quarantine install.command` در ترمینال). اگر ZCode در `/Applications` است، رمز کاربری مک خواسته می‌شود — این عادی است.

   نصب‌کننده ZCode را پیدا میکند، میبندد، `app.asar` را پچ میزند و بکاپ سالم نگه میدارد.
3. ZCode را عادی باز کنید.

> بعد از هر آپدیت ZCode یک بار دیگر نصب‌کننده را اجرا کنید.

## 🗑 حذف

روی **`uninstall.bat`** (ویندوز) یا **`uninstall.command`** (مک) دوبار کلیک کنید — دو قطعه تزریقشده را به روش جراحی از `app.asar` برمیدارد و به بکاپها هم نیاز ندارد، حتی اگر ZCode آپدیت شده باشد. بکاپهای سالم در `%LOCALAPPDATA%\rtl-chat-zcode\app.asar.bak` (ویندوز) و `~/Library/Application Support/rtl-chat-zcode/app.asar.bak` (مک) و `asar-work\app.asar.bak` (داخل ریپو) نگه داشته میشوند و در صورت نیاز خودکار بازیابی میشوند.

## 🛠 نصب دستی

ویندوز (PowerShell):

```powershell
$env:ZCODE_ASAR = "C:\Users\YOU\AppData\Local\Programs\ZCode\resources\app.asar"
node asar-work\patch-asar.mjs --apply    # باید ببینید: APPLY DONE
```

مک (Terminal):

```bash
export ZCODE_ASAR="/Applications/ZCode.app/Contents/Resources/app.asar"
node asar-work/patch-asar.mjs --apply    # باید ببینید: APPLY DONE
```

</div>

</details>

<details>
<summary><b>🇸🇦 الدليل بالعربية</b></summary>

<div dir="rtl">

## محاذاة من اليمين إلى اليسار لـ ZCode Desktop

أي فقرة تحتوي على حرف فارسي أو عربي تُعرض من اليمين إلى اليسار، بينما يبقى النص الإنجليزي والشيفرات وواجهة البرنامج كما هي.

## ✨ الميزات

- **كشف any-rtl**: يُحدَّد اتجاه كل فقرة بحسب وجود أي حرف RTL فيها، وليس بحسب الكلمة الأولى. الشيفرات والجداول والمعادلات وحقول الإدخال لا تُمَس أبداً.
- **على مستوى التطبيق كله**: المحادثات وقائمة المهام والشريط الجانبي والحوارات.
- **زر RTL (رمز المحاذاة يميناً)**: في شريط أدوات صندوق الكتابة، يمين محدد صلاحيات الوصول؛ نقرة واحدة للتفعيل أو التعطيل، والاختيار محفوظ، والزر لا يختفي أبداً.
- **خط وزيرمتن (Vazirmatn)**: مضمّن داخل الإضافة (~100 كيلوبايت) بلا تثبيت ولا إنترنت، ويُطبق على النصوص RTL فقط.
- **تحديث فوري**: تُصحَّح الاتجاهات أثناء توليد الردود مباشرة.

## 🚀 التثبيت

المتطلب: [Node.js](https://nodejs.org).

1. حمّل هذا المستودع أو استنسخه.
2. شغّل المُثبِّت لنظامك:
   - **ويندوز** — انقر نقراً مزدوجاً على **`install.bat`**
   - **ماك** — انقر نقراً مزدوجاً على **`install.command`**<br>
     في المرة الأولى قد يمنعه النظام: انقر بزر أيمن → **Open** → **Open** مجدداً (أو نفّذ `xattr -dr com.apple.quarantine install.command` في الطرفية). إذا كان ZCode في `/Applications` فسيُطلب منك كلمة مرور الماك — وهذا طبيعي، فهو مطلوب لتعديل التطبيق.

   المُثبِّت يجد ZCode ويغلقه ويعدّل `app.asar` ويحفظ نسخاً احتياطية سليمة.
3. افتح ZCode كالمعتاد.

> أعد تشغيل المُثبِّت بعد كل تحديث لـ ZCode.

## 🗑 الإزالة

انقر نقراً مزدوجاً على **`uninstall.bat`** (ويندوز) أو **`uninstall.command`** (ماك) — يزيل الجزأين المُدرجين جراحياً من `app.asar` دون الحاجة إلى نسخة احتياطية، حتى لو تحدّث ZCode بعد التثبيت. تُحفظ النسخ الاحتياطية الأصلية في `%LOCALAPPDATA%\rtl-chat-zcode\app.asar.bak` (ويندوز) و`~/Library/Application Support/rtl-chat-zcode/app.asar.bak` (ماك) و`asar-work\app.asar.bak` (داخل المستودع) وتُستعاد تلقائياً عند الحاجة.

## 🛠 التثبيت اليدوي

ويندوز (PowerShell):

```powershell
$env:ZCODE_ASAR = "C:\Users\YOU\AppData\Local\Programs\ZCode\resources\app.asar"
node asar-work\patch-asar.mjs --apply    # يجب أن ترى: APPLY DONE
```

ماك (Terminal):

```bash
export ZCODE_ASAR="/Applications/ZCode.app/Contents/Resources/app.asar"
node asar-work/patch-asar.mjs --apply    # يجب أن ترى: APPLY DONE
```

</div>

</details>

---

## 🙏 Credits

- Built on [the-Ashkanian/rtl-chat-zcode](https://github.com/the-Ashkanian/rtl-chat-zcode) — the original patch and the ZCode DOM mapping.
- Any-rtl approach ported from [zamanimm/obsidian-any-rtl](https://github.com/zamanimm/obsidian-any-rtl) (which builds on [Content RTL](https://github.com/SirwanAfifi/content-rtl) and [RTL Support](https://github.com/esm7/obsidian-rtl)).
- [Vazirmatn](https://github.com/rastikerdar/vazirmatn) font by Saber Rastikerdar.

## 📜 License

MIT — see [LICENSE](LICENSE). The original work this project builds on remains credited to its author.
