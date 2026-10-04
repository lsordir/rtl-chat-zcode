// Builds extension/rtl-chat.js from rtl-chat.js by embedding the Vazirmatn
// woff2 fonts (fonts/) as data-URI @font-face rules between the FONT_FACE
// markers. Replaces the old manual "copy rtl-chat.js to extension/" step.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'rtl-chat.js')
const OUT = path.join(ROOT, 'extension', 'rtl-chat.js')
const MARK = /\/\*@FONT_FACE_START@\*\/''\/\*@FONT_FACE_END@\*\//

function face(weight, file) {
  const p = path.join(ROOT, 'fonts', file)
  if (!fs.existsSync(p)) {
    console.warn(`warning: fonts/${file} not found — building without it`)
    return ''
  }
  const b64 = fs.readFileSync(p).toString('base64')
  return `@font-face{font-family:'Vazirmatn';font-style:normal;font-weight:${weight};` +
    `font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2')}`
}

const fontCss = face(400, 'Vazirmatn-Regular.woff2') + face(700, 'Vazirmatn-Bold.woff2')
let src = fs.readFileSync(SRC, 'utf8')
if (!MARK.test(src)) {
  console.error('font marker missing in rtl-chat.js (/*@FONT_FACE_START@*/ ... /*@FONT_FACE_END@*/)')
  process.exit(1)
}
// base64 alphabet has no backtick or ${, so a plain template literal is safe
src = src.replace(MARK, () => (fontCss ? '`\n  ' + fontCss + '\n  `' : "''"))
fs.writeFileSync(OUT, src)
console.log(`built extension/rtl-chat.js — ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB` +
  (fontCss ? ' (Vazirmatn embedded)' : ' (no fonts)'))
