# rtl-chat-zcode

RTL (right-to-left) chat patch for **ZCode Desktop** — smart **any-rtl**: any text block containing Persian/Arabic becomes right-aligned, pure-English blocks (and code, tables, math, UI chrome) stay left-aligned. Ships with the **Vazirmatn** font, an **always-visible on/off toggle**, one-click **install/uninstall**, and no floating badge.

> This is a community-made patch. It modifies ZCode's internal `app.asar` to auto-load a small browser extension. NOT affiliated with ZCode. Re-apply after every ZCode update (or just run `install.bat` again).

---

## 🇮🇷 راهنمای فارسی

پکیج راست‌چین کردن چت فارسی در ZCode Desktop — با تشخیص هوشمند any-rtl، دکمه خاموش/روشن همیشه در دسترس، فونت وزیرمتن، و نصب/حذف با یک کلیک.

### ✨ قابلیت‌ها

- **تشخیص any-rtl** — جهت هر پاراگراف از روی *وجود حتی یک حرف فارسی/عربی* در همان پاراگراف. «ZCode یه ابزار خوبیه» راست‌چین میشود؛ پاراگراف انگلیسی کنارش چپ‌چین میماند؛ متنی که با عدد یا مارک‌داون شروع شود هم دیگر راست‌چین نمیشود (رفع باگ issue #1).
- **فقط متن تولیدشده** — هدرها، لیبل‌ها، رابط thinking، دکمه‌ها و کروم ZCode دست‌نخورده میمانند؛ اسکرول‌بار هم همیشه سمت راست میماند.
- **دکمه خاموش/روشن RTL** — در نوار ابزار جعبه پیام (یا به‌صورت دکمه شناور بالای آن). در حالت خاموش آیکونش خط‌خورده میشود ولی **هیچ‌وقت ناپدید نمیشود**. انتخاب شما ذخیره میشود.
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

روی **`uninstall.bat`** دوبار کلیک کنید — بکاپ اصلی را سر جایش برمیگرداند و ZCode دقیقاً مثل قبل میشود.

> چرا حذف از داخل خود ZCode ممکن نیست؟ چون این پچ در `app.asar` (خارج از دسترس افزونه) نوشته میشود، نه در سیستم افزونه ZCode. اگر روزی ZCode سیستم افزونه رسمی بدهد، همین پکیج میتواند به آن مهاجرت کند.

### 🎛 استفاده

- **دکمه RTL** کنار جعبه پیام: کلیک = خاموش/روشن. حالت در حافظه میماند.
- کد، جدول، فرمول و ترمینال همیشه چپ‌چین میمانند.
- خروجی کد و متن انگلیسی خالص دیگر راست‌چین نمیشود.

### 🔧 پیشرفته: راست‌چین کردن بخشهای دیگر (تسک‌ها و ...)

به‌صورت پیشفرض فقط تایم‌لاین چت اسکن میشود — صفر ریسک برای بقیه محیط. برای اضافه کردن یک بخش دیگر (مثلاً پنل تسک‌ها)، selector آن بخش را در `localStorage` بگذارید:

```js
// در کنسول DevTools صفحه چت (Ctrl+Shift+I):
localStorage.setItem('rtlChat:extraScopes', '[SELECTOR-بخش-موردنظر]')
// پاک کردن: localStorage.removeItem('rtlChat:extraScopes')
```

قبل از فعال کردن هر scope جدید، یک بار `install.bat` را دوباره اجرا کنید تا بکاپ تازه باشد و در ریپو هم `git commit` بزنید. selectorهای دقیق تسک‌ها هنوز باید از DOM واقعی ZCode استخراج شوند (با `--remote-debugging-port=9229` قابل بررسی است).

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
| دکمه RTL نیست | ZCode را کامل ببندید و باز کنید؛ اگر آپدیت شده، `install.bat` را دوباره بزنید. اگر نوار ابزار پیدا نشود، دکمه شناور بالای جعبه پیام (گوشه پایین-راست) میآید — در حالت خاموش آیکونش خطخورده است. |
| بعد از آپدیت ZCode پچ رفت | دوباره `install.bat`. |
| متنها راستچین نمیشوند | دکمه RTL را چک کنید (حالت خاموش = آیکون خطخورده). |

---

## 🇬🇧 English (quick)

1. Install [Node.js](https://nodejs.org).
2. Double-click **`install.bat`** (it finds ZCode, closes it, patches `app.asar`, keeps a backup in `asar-work\app.asar.bak`).
3. Start ZCode — use the RTL toggle near the chat input. Click again to turn it off; the button never disappears (slashed icon = off).
4. Uninstall: double-click **`uninstall.bat`** (restores the original `app.asar`).

**any-rtl:** any text block with a Persian/Arabic/Hebrew character → RTL; English-only blocks, code, tables and all UI chrome stay LTR. Scrollbar stays on the right. Vazirmatn font is embedded for RTL text.

**Extra scopes:** `localStorage.setItem('rtlChat:extraScopes', '<css-selector>')` extends any-rtl to other panels (empty by default).

Re-run `install.bat` after every ZCode update.

---

## 🙏 Credits

- Original patch & ZCode DOM mapping: [the-Ashkanian/rtl-chat-zcode](https://github.com/the-Ashkanian/rtl-chat-zcode)
- any-rtl detection ported from [zamanimm/obsidian-any-rtl](https://github.com/zamanimm/obsidian-any-rtl) (which builds on [Content RTL](https://github.com/SirwanAfifi/content-rtl) and [RTL Support](https://github.com/esm7/obsidian-rtl))
- Font: [Vazirmatn](https://github.com/rastikerdar/vazirmatn) by Saber Rastikerdar
