# rtl-chat-zcode

RTL (right-to-left) chat patch for **ZCode Desktop** — smart **any-rtl**: any text block containing Persian/Arabic becomes right-aligned, pure-English blocks (and code, tables, math, UI chrome) stay left-aligned. Ships with the **Vazirmatn** font, an **always-visible on/off toggle**, one-click **install/uninstall**, and no floating badge.

> This is a community-made patch. It modifies ZCode's internal `app.asar` to auto-load a small browser extension. NOT affiliated with ZCode. Re-apply after every ZCode update (or just run `install.bat` again).

---

## 🇮🇷 راهنمای فارسی

پکیج راست‌چین کردن چت فارسی در ZCode Desktop — با تشخیص هوشمند any-rtl، دکمه خاموش/روشن همیشه در دسترس، فونت وزیرمتن، و نصب/حذف با یک کلیک.

### ✨ قابلیت‌ها

- **تشخیص any-rtl** — جهت هر پاراگراف از روی *وجود حتی یک حرف فارسی/عربی* در همان پاراگراف. «ZCode یه ابزار خوبیه» راست‌چین میشود؛ پاراگراف انگلیسی کنارش چپ‌چین میماند؛ متنی که با عدد یا مارک‌داون شروع شود هم دیگر راست‌چین نمیشود (رفع باگ issue #1).
- **فقط متن تولیدشده** — هدرها، لیبل‌ها، رابط thinking، دکمه‌ها و کروم ZCode دست‌نخورده میمانند؛ اسکرول‌بار هم همیشه سمت راست میماند.
- **دکمه Fa (خاموش/روشن RTL)** — در نوار ابزار جعبه پیام، دقیقاً سمت راستِ انتخابگر حالت دسترسی (Full access و ...) با فونت و استایل بومی خود ZCode. روشن = چیپ پررنگ، خاموش = کدر. در حالت خاموش هم **هیچ‌وقت ناپدید نمیشود** و در صفحه شروع/خوشآمد اصلاً نشان داده نمیشود — فقط وقتی کامپوزر بالا آمده باشد. انتخاب شما ذخیره میشود.
- **راست‌چین کل محیط** — علاوه بر چت، لیست تسک‌ها، سایدبار و پنجرهها هم اسکن میشوند: هر متن حاوی حرف فارسی راست‌چین میشود (با فونت وزیرمتن)، متنهای انگلیسی و کروم برنامه دستنخورده میمانند. کد، فرمول، فیلدهای ورودی و دیفها هرگز تغییر نمیکنند.
- **فونت وزیرمتن** — داخل خود پچ جاسازی شده؛ بدون نصب فونت روی ویندوز و بدون اینترنت. کد و جدول فونت قبلی خودشان را نگه میدارند.
- **بهروزرسانی زنده** — موقع استریم شدن جواب، جهت پاراگرافها بلافاصله درست میشود.

### 🚀 نصب با یک کلیک

پیشنیاز: [Node.js](https://nodejs.org) نصب باشد.

1. روی **`install.bat`** دوبار کلیک کنید. (اگر ZCode باز باشد، خودش میبنددش.)
2. پیام `[OK] Installed` را ببینید.
3. ZCode را عادی باز کنید — دکمه RTL کنار جعبه پیام است.

پچ روی فایل `resources\app.asar` داخل نصب ZCode اعمال میشود (خودکار در `AppData\Local\Programs\ZCode` یا `C:\Program Files\ZCode` پیدا میشود). بکاپ در `asar-work\app.asar.bak` ساخته میشود — پاکش نکنید.

> بعد از هر **آپدیت خودکار ZCode**، پچ پاک میشود؛ فقط دوباره `install.bat` را اجرا کنید.

### 🗑 حذف با یک کلیک

روی **`uninstall.bat`** دوبار کلیک کنید. حذف به روش **جراحی** انجام میشود: فقط دو خط تزریقی از `app.asar` برداشته میشود — نیازی به بکاپ نیست و حتی اگر ZCode بعد از نصب آپدیت شده باشد هم درست کار میکند.

**بکاپ دولایه هم به عنوان بیمه نگه داشته میشود:**
1. **بکاپ پایدار** — موقع نصب (فقط از asar دستنخوردهٔ اولیه) یک کپی کامل در `%LOCALAPPDATA%\rtl-chat-zcode\app.asar.bak` گرفته میشود؛ جای آن به پوشه پروژه وابسته نیست.
2. **بکاپ محلی** — کنار اسکریپت پچ در `asar-work\app.asar.bak`.

اگر روش جراحی به هر دلیلی شکست خورد، uninstaller خودکار سراغ همین بکاپها میرود. بازگردانی دستی:
```powershell
Copy-Item -Force "$env:LOCALAPPDATA\rtl-chat-zcode\app.asar.bak" "مسیر\resources\app.asar"
```

> چرا حذف از داخل خود ZCode ممکن نیست؟ چون این پچ در `app.asar` (خارج از دسترس افزونه) نوشته میشود، نه در سیستم افزونه ZCode. سیستم پلاگین ZCode فقط skills/commands/hooks/MCP را میشناسد و راهی برای تزریق CSS/JS به رابط چت ندارد.

### 🎛 استفاده

- **دکمه Fa** در نوار ابزار جعبه پیام (سمت راستِ انتخابگر Full access): کلیک = خاموش/روشن. حالت در حافظه میماند.
- کل محیط (چت، تسک‌ها، سایدبار) اسکن میشود؛ فقط متنهای دارای حرف فارسی جهت میگیرند.
- کد، جدول، فرمول و فیلدهای ورودی همیشه چپ‌چین میمانند.

### 🔧 پیشرفته

راست‌چین به صورت app-wide است و نیازی به تنظیم ندارد. اگر خواستید بخشی را مستثنا کنید یا رفتار را محدود کنید، selectorها در `rtl-chat.js` (ثابت‌های `SKIP_SEL`، `DIR_SELECTORS` و `scanBlocks`) قابل ویرایش هستند؛ بعد از تغییر `node tools\build.mjs` را اجرا کنید.

### ✅ تأیید نصب (اختیاری)

1. ZCode را با فلگ دیباگ باز کنید:
   ```powershell
   Start-Process "مسیر\ZCode.exe" -ArgumentList "--remote-debugging-port=9229"
   ```
2. چند ثانیه صبر، بعد: `node verify-no-inject.mjs`
3. باید ببینید: `toggle=true`, `style=true`, `mode=any-rtl`, `rtlAttr=on`

### 🛠 نصب دستی (اگر bat کار نکرد)

```powershell
# PowerShell در پوشه پروژه
$env:ZCODE_ASAR = "C:\Users\YOU\AppData\Local\Programs\ZCode\resources\app.asar"
node asar-work\patch-asar.mjs --apply   # باید APPLY DONE ببیندید
```

بازگردانی دستی:
```powershell
Copy-Item -Force asar-work\app.asar.bak "مسیر\resources\app.asar"
```
(اگر ZCode زیر Program Files است، PowerShell را Run as administrator باز کنید.)

### ⚠️ عیبیابی

| مشکل | راه‌حل |
|------|--------|
| `node` پیدا نشد | Node.js را نصب کنید و ترمینال را ببندید و دوباره باز کنید. |
| `EPERM` موقع پچ | PowerShell را Run as administrator باز کنید. |
| `anchor missing` | نسخه ZCode عوض شده — پچ باید بهروز شود. |
| دکمه Fa نیست | ZCode را کامل ببندید و باز کنید؛ اگر آپدیت شده، `install.bat` را دوباره بزنید. اگر نوار ابزار پیدا نشود، چند ثانیه بعد دکمه شناور بالای جعبه پیام (گوشه پایین-راست) میآید. |
| بعد از آپدیت ZCode پچ رفت | دوباره `install.bat`. |
| متنها راستچین نمیشوند | دکمه RTL را چک کنید (حالت خاموش = آیکون خطخورده). |

---

## 🇬🇧 English (quick)

1. Install [Node.js](https://nodejs.org).
2. Double-click **`install.bat`** (it finds ZCode, closes it, patches `app.asar`, keeps a pristine backup in `%LOCALAPPDATA%\rtl-chat-zcode\app.asar.bak` plus `asar-work\app.asar.bak`).
3. Start ZCode — the **Fa** toggle sits in the composer toolbar, right of the Full access selector. Click to toggle; it never disappears while the composer exists and never shows on the welcome screen.
4. Uninstall: double-click **`uninstall.bat`** — surgically removes the two injected snippets (works even after ZCode updates); falls back to the pristine backups.

**any-rtl, app-wide:** any text block with a Persian/Arabic/Hebrew character → RTL (chat, tasks, sidebar, dialogs); English-only blocks, code, tables, inputs and all UI chrome stay LTR. Scrollbar stays on the right. Vazirmatn font is embedded for RTL text.

Re-run `install.bat` after every ZCode update.

---

## 🙏 Credits

- Original patch & ZCode DOM mapping: [the-Ashkanian/rtl-chat-zcode](https://github.com/the-Ashkanian/rtl-chat-zcode)
- any-rtl detection ported from [zamanimm/obsidian-any-rtl](https://github.com/zamanimm/obsidian-any-rtl) (which builds on [Content RTL](https://github.com/SirwanAfifi/content-rtl) and [RTL Support](https://github.com/esm7/obsidian-rtl))
- Font: [Vazirmatn](https://github.com/rastikerdar/vazirmatn) by Saber Rastikerdar
