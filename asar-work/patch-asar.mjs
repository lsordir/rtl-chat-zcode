import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const APPLY = process.argv.includes('--apply')
const UNPATCH = process.argv.includes('--unpatch')

// ZCode install path — auto-detected per platform, or set ZCODE_ASAR
function asarCandidates() {
  if (process.platform === 'win32') {
    return [
      path.join(process.env['ProgramFiles'] || 'C:/Program Files', 'ZCode/resources/app.asar'),
      path.join(process.env.LOCALAPPDATA || '', 'Programs/ZCode/resources/app.asar')
    ]
  }
  // macOS (and other *nix): default install locations
  return [
    '/Applications/ZCode.app/Contents/Resources/app.asar',
    path.join(os.homedir(), 'Applications/ZCode.app/Contents/Resources/app.asar')
  ]
}
const ASAR = process.env.ZCODE_ASAR ||
  asarCandidates().find(p => p && fs.existsSync(p)) ||
  asarCandidates()[0]

// Stable, repo-independent backup: survives moving/deleting this folder.
function stableDir() {
  if (process.platform === 'win32') {
    return path.join(process.env.LOCALAPPDATA || __dirname, 'rtl-chat-zcode')
  }
  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library/Application Support/rtl-chat-zcode')
  }
  return path.join(os.homedir(), '.local/share/rtl-chat-zcode')
}
const STABLE_DIR = stableDir()
const STABLE_BACKUP = path.join(STABLE_DIR, 'app.asar.bak')

// Extension folder sits next to this package: rtl-chat-patch/extension
// Works no matter where you extract the zip (no hardcoded username).
const EXT = path.resolve(__dirname, '..', 'extension').replace(/\\/g, '/')

const BACKUP = path.join(__dirname, 'app.asar.bak')
const ORIG_JS = path.join(__dirname, 'index.js.orig')
const PATCHED_JS = path.join(__dirname, 'index.js.patched')

function readHeaderMeta(fd) {
  const b8 = Buffer.alloc(8)
  fs.readSync(fd, b8, 0, 8, 0)
  const headerBufLen = b8.readUInt32LE(4)
  const head = Buffer.alloc(headerBufLen)
  fs.readSync(fd, head, 0, headerBufLen, 8)
  const slen = head.readUInt32LE(4)
  const header = JSON.parse(head.subarray(8, 8 + slen).toString('utf8'))
  return { header, headerBufLen, dataStart: 8 + headerBufLen }
}

function findEntry(header, parts) {
  let cur = header
  for (const p of parts) cur = cur.files[p]
  return cur
}

const sha256 = b => crypto.createHash('sha256').update(b).digest('hex')

const anchorRemote = 'Z.commandLine.appendSwitch("remote-debugging-port","9229");'
const injectEarly =
  'try{Z.commandLine.appendSwitch("load-extension",' + JSON.stringify(EXT) + ')}catch(_rtlE){}'

const anchorReady = 'Z.whenReady().then(async()=>{'
const injectReady =
  'try{as.defaultSession.loadExtension(' + JSON.stringify(EXT) + ',{allowFileAccess:!0})}catch(_rtlE){}'

function freeNewlines(src, need) {
  const chars = [...src]
  let freed = 0
  for (let i = 0; i < chars.length && freed < need; i++) {
    if (chars[i] !== '\n') continue
    let p = i - 1
    while (p >= 0 && (chars[p] === ' ' || chars[p] === '\t' || chars[p] === '\r')) p--
    const prev = p >= 0 ? chars[p] : ''
    let n = i + 1
    while (n < chars.length && (chars[n] === ' ' || chars[n] === '\t' || chars[n] === '\r')) n++
    const next = n < chars.length ? chars[n] : ''
    const prevOk = prev === '' || prev === ';' || prev === '}' || prev === '{' || prev === ',' || prev === ':'
    if (prevOk && next !== '') {
      chars[i] = ''
      for (let j = i + 1; j < n; j++) {
        if (chars[j] === ' ' || chars[j] === '\t' || chars[j] === '\r') chars[j] = ''
        else break
      }
      freed++
    }
  }
  return { text: chars.join(''), freed }
}

function patchSource(src) {
  // clean ANY previous rtl injection (any extension path), then inject fresh —
  // makes install re-point the asar even if it was patched from another copy
  const cleaned = unpatchSource(src)
  let out = cleaned !== null ? cleaned : src
  if (!out.includes(anchorRemote)) throw new Error('anchor remote missing')
  if (!out.includes(anchorReady)) throw new Error('anchor whenReady missing')
  out = out.replace(anchorRemote, anchorRemote + injectEarly)
  out = out.replace(anchorReady, anchorReady + injectReady)
  return out
}

// Surgical removal of the injected snippets. Path-independent: matches any
// extension path, so uninstall works even if the patch was applied from a
// different copy of this repo.
function unpatchSource(src) {
  let out = src, hit = false
  const patterns = [
    /try\{Z\.commandLine\.appendSwitch\("load-extension",.*?\)\}catch\(_rtlE\)\{\}/g,
    /try\{as\.defaultSession\.loadExtension\(.*?\{allowFileAccess:!0\}\)\}catch\(_rtlE\)\{\}/g
  ]
  for (const re of patterns) {
    if (out.match(re)) {
      out = out.replace(re, '')
      hit = true
    }
  }
  return hit ? out : null
}

if (!fs.existsSync(ASAR)) {
  console.error('app.asar not found:', ASAR)
  console.error('If ZCode is elsewhere, set ZCODE_ASAR to the full path of app.asar')
  process.exit(1)
}
if (!fs.existsSync(path.join(EXT, 'manifest.json'))) {
  console.error('extension/manifest.json not found next to this package:', EXT)
  process.exit(1)
}

const fd = fs.openSync(ASAR, 'r')
const { header, headerBufLen, dataStart } = readHeaderMeta(fd)
const entry = findEntry(header, ['out', 'main', 'index.js'])
const size = entry.size
const offset = Number(entry.offset)
const fileAbs = dataStart + offset
const oldHash = entry.integrity?.hash
const original = Buffer.alloc(size)
fs.readSync(fd, original, 0, size, fileAbs)
fs.closeSync(fd)

console.log('ASAR', ASAR)
console.log('EXT ', EXT)
console.log('size', size, 'fileAbs', fileAbs, 'oldHash', String(oldHash).slice(0, 16))
const src = original.toString('utf8')

if (UNPATCH) {
  const out = unpatchSource(src)
  if (!out) {
    if (src.includes('_rtlE')) {
      // rtl snippet present but not recognized — let the uninstaller
      // restore the pristine backup instead of reporting success
      console.error('rtl snippet present but pattern not recognized')
      process.exit(1)
    }
    console.log('not patched — nothing to remove')
    process.exit(0)
  }
  let ubuf = Buffer.from(out, 'utf8')
  if (ubuf.length < size) ubuf = Buffer.concat([ubuf, Buffer.alloc(size - ubuf.length, 0x20)])
  const newHashU = sha256(ubuf)
  console.log('final', ubuf.length, 'newHash', newHashU.slice(0, 16))
  const wu = fs.openSync(ASAR, 'r+')
  try {
    fs.writeSync(wu, ubuf, 0, ubuf.length, fileAbs)
    if (oldHash && oldHash.length === newHashU.length) {
      const headerBuf = Buffer.alloc(headerBufLen)
      fs.readSync(wu, headerBuf, 0, headerBufLen, 8)
      const hashBuf = Buffer.from(oldHash, 'ascii')
      const idx = headerBuf.indexOf(hashBuf)
      if (idx < 0) throw new Error('old hash not in header')
      headerBuf.write(newHashU, idx, 'ascii')
      fs.writeSync(wu, headerBuf, 0, headerBufLen, 8)
      console.log('integrity updated @', idx)
    } else {
      throw new Error('hash length mismatch or missing')
    }
  } finally {
    fs.closeSync(wu)
  }
  console.log('UNPATCH DONE — RTL extension removed from ZCode')
  // readback + verify: no rtl snippet may remain
  const vfd = fs.openSync(ASAR, 'r')
  const rb = Buffer.alloc(size)
  fs.readSync(vfd, rb, 0, size, fileAbs)
  fs.closeSync(vfd)
  if (rb.toString('utf8').includes('_rtlE')) throw new Error('verification FAILED — snippets still present')
  console.log('verified: no rtl injection left in the asar')
  process.exit(0)
}

const wasPatched = unpatchSource(src) !== null
let patched = patchSource(src)
if (wasPatched) console.log('existing rtl patch found — replacing it (extension path refreshed)')
let buf = Buffer.from(patched, 'utf8')
console.log('after inject', buf.length, 'delta', buf.length - size)

if (buf.length > size) {
  // recover the trailing padding left behind by earlier --unpatch runs
  const trimmed = patched.replace(/\s+$/, '')
  if (trimmed.length < patched.length) {
    patched = trimmed
    buf = Buffer.from(patched, 'utf8')
    console.log('trimmed trailing padding ->', buf.length, 'delta', buf.length - size)
  }
}

if (buf.length > size) {
  const need = buf.length - size + 8
  const { text, freed } = freeNewlines(patched, need)
  buf = Buffer.from(text, 'utf8')
  console.log('freed newlines', freed, 'now', buf.length, 'delta', buf.length - size)
}

if (buf.length > size) {
  throw new Error('still too long: ' + buf.length +
    '\n  The extension path does not fit in the asar slack. Run the installer from the repo copy with the SHORT path (e.g. ~/rtl-zcode or D:\\rtl-chat-zcode), or move this folder closer to the drive root.')
}
if (buf.length < size) {
  buf = Buffer.concat([buf, Buffer.alloc(size - buf.length, 0x20)])
}
const newHash = sha256(buf)
console.log('final', buf.length, 'newHash', newHash.slice(0, 16))

const txt = buf.toString('utf8')
console.log('has load-extension', txt.includes('load-extension'))
console.log('has loadExtension', txt.includes('loadExtension'))
console.log('has whenReady', txt.includes('Z.whenReady'))
console.log('has appendSwitch remote', txt.includes('remote-debugging-port'))

fs.writeFileSync(ORIG_JS, original)
fs.writeFileSync(PATCHED_JS, buf)
console.log('wrote patched preview')

if (!APPLY) {
  console.log('DRY RUN — add --apply to write')
  process.exit(0)
}

if (!fs.existsSync(BACKUP)) {
  console.log('backup...')
  fs.copyFileSync(ASAR, BACKUP)
}

// pristine-state backup outside the repo (survives folder moves), taken only
// from an asar that had no rtl patch at all — never from an already-patched one
if (!wasPatched) {
  try {
    fs.mkdirSync(STABLE_DIR, { recursive: true })
    if (!fs.existsSync(STABLE_BACKUP)) {
      fs.copyFileSync(ASAR, STABLE_BACKUP)
      console.log('stable backup:', STABLE_BACKUP)
    }
  } catch (e) {
    console.warn('stable backup failed (non-fatal):', e.message)
  }
}

const wfd = fs.openSync(ASAR, 'r+')
try {
  fs.writeSync(wfd, buf, 0, buf.length, fileAbs)
  if (oldHash && newHash && oldHash.length === newHash.length) {
    const headerBuf = Buffer.alloc(headerBufLen)
    fs.readSync(wfd, headerBuf, 0, headerBufLen, 8)
    const hashBuf = Buffer.from(oldHash, 'ascii')
    const idx = headerBuf.indexOf(hashBuf)
    if (idx < 0) throw new Error('old hash not in header')
    headerBuf.write(newHash, idx, 'ascii')
    fs.writeSync(wfd, headerBuf, 0, headerBufLen, 8)
    console.log('integrity updated @', idx)
  } else {
    throw new Error('hash length mismatch or missing')
  }
} finally {
  fs.closeSync(wfd)
}

const vfd = fs.openSync(ASAR, 'r')
const rb = Buffer.alloc(size)
fs.readSync(vfd, rb, 0, size, fileAbs)
fs.closeSync(vfd)
console.log('readback', rb.equals(buf), sha256(rb).slice(0, 16))
console.log('APPLY DONE')
