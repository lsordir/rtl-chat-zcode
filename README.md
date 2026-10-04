# rtl-zcode

**RTL for ZCode Desktop — done right.** Smart **any-rtl**: any text block containing a Persian/Arabic character flows right-to-left; English text, code, tables and all UI chrome stay left-aligned.

## ✨ Features

- **Any-rtl detection** — decided per text block by RTL-character *presence*, not the first word. `ZCode یه ابزار خوبیه` → RTL, English paragraphs → LTR. Code, tables, math, inputs and diffs are never touched.
- **App-wide** — chat, task list, sidebar, dialogs.
- **`Fa` toggle** — in the composer toolbar, right of the mode selector. Click to turn RTL on/off; the choice persists. The button never disappears and never shows on the welcome screen.
- **Vazirmatn font** — embedded (~100 KB, no install, no internet), applied only to RTL text.
- **Live** — directions fix themselves while responses stream.
- **One-click install & uninstall** — no terminal needed.

## 🚀 Install

Prerequisite: [Node.js](https://nodejs.org).

1. Download or clone this repo.
2. Double-click **`install.bat`** — it finds ZCode, closes it, patches its `app.asar` and keeps pristine backups.
3. Start ZCode normally. Done.

> Re-run `install.bat` after every ZCode update.

## 🗑 Uninstall

Double-click **`uninstall.bat`**. It surgically removes the two injected snippets from `app.asar` — no backup needed, works even if ZCode updated since. Pristine backups (kept in `%LOCALAPPDATA%\rtl-chat-zcode\app.asar.bak` and `asar-work\app.asar.bak`) are restored automatically if the surgical path ever fails.

## 🎛 The Fa toggle

Sits in the composer toolbar next to the permission mode selector:

- **On** — bright, like every other control.
- **Off** — dimmed. RTL is fully disabled, the toggle stays reachable.
- Tooltip shows the current state.

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| `node` not found | Install Node.js, reopen the terminal. |
| `EPERM` while patching | Run PowerShell as Administrator. |
| `anchor missing` | Your ZCode version changed the internals — the patch needs an update. |
| Toggle missing after update | Run `install.bat` again. |
| Everything still LTR | Check the `Fa` toggle (dimmed = off). |

---

<details>
<summary><b>🇮🇷 راهنمای فارسی</b></summary>

<div dir="rtl">

## راست‌چین هوشمند برای ZCode Desktop

هر متنی که حرف فارسی/عربی دارد راست‌چین میشود؛ متن انگلیسی، کد و رابط برنامه دست‌نخورده میماند.

## ✨ قابلیتها

- **تشخیص any-rtl** — جهت هر پاراگراف از روی وجود حتی یک حرف فارسی/عربی در همان پاراگراف؛ نه از روی کلمه اول. متن انگلیسی، کد، جدول، فرمول و فیلدهای ورودی هرگز تغییر نمیکنند.
- **کل محیط** — چت، لیست تسکها، سایدبار و پنجرهها.
- **دکمه Fa** — در نوار ابزار جعبه پیام، کنار انتخابگر حالت دسترسی. کلیک = خاموش/روشن؛ انتخاب در حافظه میماند و دکمه هیچوقت ناپدید نمیشود.
- **فونت وزیرمتن** — داخل پچ جاسازی شده؛ بدون نصب و بدون اینترنت، فقط برای متنهای راست‌چین.
- **بهروزرسانی زنده** — جهت متنها موقع استریم شدن جواب فوراً درست میشود.

## 🚀 نصب

پیشنیاز: [Node.js](https://nodejs.org).

1. این ریپو را دانلود یا clone کنید.
2. روی **`install.bat`** دوبار کلیک کنید — ZCode را پیدا میکند، میبندد، پچ میزند و بکاپ سالم نگه میدارد.
3. ZCode را عادی باز کنید.

> بعد از هر آپدیت ZCode یک بار دیگر `install.bat` را اجرا کنید.

## 🗑 حذف

روی **`uninstall.bat`** دوبار کلیک کنید — دو قطعه تزریقشده را به روش جراحی از `app.asar` برمیدارد و به بکاپها هم نیاز ندارد. بکاپهای سالم در `%LOCALAPPDATA%\rtl-chat-zcode\app.asar.bak` نگه داشته میشوند و در صورت نیاز خودکار بازیابی میشوند.

## 🛠 نصب دستی

```powershell
$env:ZCODE_ASAR = "C:\Users\YOU\AppData\Local\Programs\ZCode\resources\app.asar"
node asar-work\patch-asar.mjs --apply    # باید ببینید: APPLY DONE
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
- **زر Fa**: في شريط أدوات صندوق الكتابة بجانب محدد صلاحيات الوصول؛ نقرة واحدة للتفعيل أو التعطيل، والاختيار محفوظ، والزر لا يختفي أبداً.
- **خط وزيرمتن (Vazirmatn)**: مضمّن داخل الإضافة (~100 كيلوبايت) بلا تثبيت ولا إنترنت، ويُطبق على النصوص RTL فقط.
- **تحديث فوري**: تُصحَّح الاتجاهات أثناء توليد الردود مباشرة.

## 🚀 التثبيت

المتطلب: [Node.js](https://nodejs.org).

1. حمّل هذا المستودع أو استنسخه.
2. شغّل الملف **`install.bat`** بالنقر المزدوج — يجد ZCode، يغلقه، يعدّل ملف `app.asar` ويحفظ نسخاً احتياطية سليمة.
3. افتح ZCode كالمعتاد.

> أعد تشغيل `install.bat` بعد كل تحديث لـ ZCode.

## 🗑 الإزالة

شغّل **`uninstall.bat`** — يزيل الجزأين المُدرجين جراحياً من `app.asar` دون الحاجة إلى نسخة احتياطية، حتى لو تحدّث ZCode بعد التثبيت. تُحفظ نسخة احتياطية أصلية في `%LOCALAPPDATA%\rtl-chat-zcode\app.asar.bak` وتُستعاد تلقائياً عند الحاجة.

## 🛠 التثبيت اليدوي

```powershell
$env:ZCODE_ASAR = "C:\Users\YOU\AppData\Local\Programs\ZCode\resources\app.asar"
node asar-work\patch-asar.mjs --apply    # يجب أن ترى: APPLY DONE
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
