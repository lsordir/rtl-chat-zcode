(() => {
  const VERSION = '0.3.3'
  const STYLE_ID = 'rtl-chat-style'
  const CHROME_STYLE_ID = 'rtl-chat-chrome'
  const TOGGLE_ID = 'rtl-chat-toggle'
  const MODE_KEY = 'rtlChat:mode'
  const SCOPES_KEY = 'rtlChat:extraScopes'
  const VIA = 'ext'

  // '' in source — tools/build.mjs embeds the Vazirmatn data-URI @font-face rules here
  const FONT_FACE_CSS = /*@FONT_FACE_START@*/''/*@FONT_FACE_END@*/

  // No container-level rtl: scrollbars stay right, ZCode chrome (headers,
  // reasoning UI, actions) keeps its own LTR layout. Direction is decided per
  // text block by JS (any-rtl) — only produced text flips.
  const CSS = `
/* RTL Chat v0.3.3 — any-rtl: direction decided per text block by RTL-character
   presence (not first word). Containers stay LTR. */

[data-trajectory-message-role],
[data-trajectory-message-content],
[data-trajectory-expanded-content-shell],
[data-trajectory-user-content-card],
[data-v4-user-input-bubble],
[data-v4-user-input-attachments],
[data-v4-user-input-media-attachments],
[data-v4-user-input-epilogue],
[data-v4-user-input-collapsible-content],
[data-reasoning-content],
[data-trajectory-role-label],
[data-trajectory-message-actions],
[data-trajectory-call-metadata] {
  text-align: start;
}

/* Radius flip only when that user message is actually RTL */
[data-v4-user-input-bubble][dir="rtl"] {
  border-top-left-radius: 0.125rem !important;
  border-top-right-radius: 0.75rem !important;
}

/* Editor: dir set live by JS from typed text — no blanket rtl */
[data-lexical-editor="true"] p,
[data-testid="chat-input"] p {
  text-align: start;
}

/* Placeholder pinned right only while editor itself is rtl */
[data-v4-composer-dock] [data-lexical-editor="true"][dir="rtl"] ~ .pointer-events-none,
[data-v4-composer-dock] [data-testid="chat-input"][dir="rtl"] ~ .pointer-events-none {
  left: auto !important;
  right: 0 !important;
}

[data-streamdown="code-block"],
[data-streamdown="code-block-body"],
[data-streamdown="code-block-header"],
[data-streamdown="code-block-actions"],
[data-streamdown="inline-code"],
[data-streamdown="table"],
[data-streamdown="table-wrapper"],
[data-streamdown="table-header"],
[data-streamdown="table-body"],
[data-streamdown="table-row"],
[data-streamdown="table-cell"],
[data-streamdown="table-header-cell"],
[data-streamdown="mermaid"],
[data-streamdown="mermaid-block"],
pre,
code,
kbd,
samp,
.katex,
[data-inline-diff-preview],
[data-diff-viewer],
[data-diff-span],
[data-tool-name] {
  direction: ltr !important;
  text-align: left !important;
  unicode-bidi: isolate !important;
}

/* Flip Tailwind text-left only inside an RTL block */
[dir="rtl"] [class~="text-left"],
[class~="text-left"][dir="rtl"] {
  text-align: right !important;
}

/* Vazirmatn for RTL-directed chat text; mono areas keep ZCode's own font */
[dir="rtl"] {
  font-family: 'Vazirmatn', 'Vazir', ui-sans-serif, system-ui, 'Segoe UI', sans-serif;
}

[dir="rtl"] pre,
[dir="rtl"] code,
[dir="rtl"] kbd,
[dir="rtl"] samp,
[dir="rtl"] [data-streamdown="inline-code"] {
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace);
}
`

  // Toggle chrome — injected ALWAYS (on and off), independent of the behavior
  // style above so the button never loses its styling when RTL is off.
  const CHROME_CSS = `
#rtl-chat-toggle svg { display: block; }
#rtl-chat-toggle.rtl-chat-fallback:hover { opacity: 1 !important; }
#rtl-chat-toggle:active { transform: scale(0.94); }
`

  // Inline fallback geometry — survives even total stylesheet loss
  const FALLBACK_CSS_TEXT = [
    'position:fixed',
    'bottom:84px',
    'right:16px',
    'z-index:2147483647',
    'width:32px',
    'height:32px',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'padding:0',
    'margin:0',
    'background:rgba(24,24,28,0.9)',
    'color:#e5e5e5',
    'border:1px solid rgba(255,255,255,0.14)',
    'border-radius:8px',
    'cursor:pointer',
    'box-shadow:0 1px 4px rgba(0,0,0,0.3)',
    'opacity:0.85',
    'transition:opacity 0.15s'
  ].join(';')

  // Only elements that carry produced text — never whole-message wrappers,
  // so ZCode chrome (headers, reasoning UI, actions) keeps its own direction.
  const DIR_SELECTORS = [
    '[data-trajectory-user-content-card]',
    '[data-v4-user-input-bubble]',
    '[data-lexical-editor="true"]',
    '[data-lexical-editor="true"] p',
    '[data-testid="chat-input"]',
    '[data-testid="chat-input"] p'
  ]

  // Any-RTL (port of obsidian-any-rtl): one RTL-script character anywhere in the
  // text → rtl, otherwise ltr. The old first-word rule returned null for text
  // starting with digits/punctuation/markdown and those inherited rtl from the
  // shell — that was GitHub issue #1 (English and code going right-to-left).
  const RTL_RE = /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0800-\u083F\u0840-\u085F\u0870-\u089F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

  function detectDir(text) {
    const t = String(text || '')
    if (!t.trim()) return null
    return RTL_RE.test(t) ? 'rtl' : 'ltr'
  }

  function getMode() {
    try { return localStorage.getItem(MODE_KEY) === 'off' ? 'off' : 'any-rtl' } catch (_) { return 'any-rtl' }
  }

  // Extra areas (tasks panel, etc.) to any-rtl beyond the chat timeline.
  // Comma-separated CSS selectors in localStorage — empty by default, zero risk.
  function extraScopes() {
    try {
      return (localStorage.getItem(SCOPES_KEY) || '').split(',').map(s => s.trim()).filter(Boolean)
    } catch (_) { return [] }
  }

  function setMode(m) {
    try { localStorage.setItem(MODE_KEY, m) } catch (_) {}
    document.documentElement.setAttribute('data-rtl-chat', m === 'off' ? 'off' : 'on')
    if (m === 'off') cleanup()
    else { ensureStyle(); applyDirs() }
    updateToggle()
    debugInfo()
  }

  function via() {
    window.__RTL_CHAT_VIAS = window.__RTL_CHAT_VIAS || []
    if (!window.__RTL_CHAT_VIAS.includes(VIA)) window.__RTL_CHAT_VIAS.push(VIA)
    return window.__RTL_CHAT_VIAS.join('+')
  }

  function ensureStyle() {
    let style = document.getElementById(STYLE_ID)
    if (!style) {
      style = document.createElement('style')
      style.id = STYLE_ID
      ;(document.head || document.documentElement).appendChild(style)
    }
    const css = FONT_FACE_CSS + CSS
    if (style.textContent !== css) style.textContent = css
  }

  function ensureChromeStyle() {
    let style = document.getElementById(CHROME_STYLE_ID)
    if (!style) {
      style = document.createElement('style')
      style.id = CHROME_STYLE_ID
      ;(document.head || document.documentElement).appendChild(style)
    }
    if (style.textContent !== CHROME_CSS) style.textContent = CHROME_CSS
  }

  function cleanup() {
    const style = document.getElementById(STYLE_ID)
    if (style) style.remove()
    const sel = '[data-v4-timeline-scroll], [data-v4-composer-dock], [data-trajectory-timeline]'
    const rooted = document.querySelectorAll(sel)
    for (const root of rooted) {
      for (const el of root.querySelectorAll('[dir]')) el.removeAttribute('dir')
      if (root.hasAttribute && root.hasAttribute('dir')) root.removeAttribute('dir')
    }
    for (const scope of extraScopes()) {
      let roots = []
      try { roots = document.querySelectorAll(scope) } catch (_) { continue }
      for (const root of roots) {
        for (const el of root.querySelectorAll('[dir]')) el.removeAttribute('dir')
        if (root.hasAttribute && root.hasAttribute('dir')) root.removeAttribute('dir')
      }
    }
  }

  function applyDir(el, emptyDefault) {
    if (!el || getMode() === 'off') return
    // textContent — no forced layout, much cheaper than innerText on every scan
    const text = el.textContent || ''
    let d = detectDir(text)
    if (!d && !text.trim() && emptyDefault) d = emptyDefault
    if (!d) return
    if (el.dir !== d) el.dir = d
  }

  // Inline/leaf labels only — never a block that wraps whole messages
  function isLeafish(el) {
    const blockish = /^(P|DIV|SECTION|ARTICLE|UL|OL|LI|H[1-6]|TABLE|TR|FORM)$/
    if (blockish.test(el.tagName)) return false
    for (const c of el.children) {
      if (blockish.test(c.tagName)) return false
    }
    return true
  }

  // Per-text-block direction inside one root: p/li/headings decide by their own
  // content; leaf labels follow their own text only when no ancestor directed them.
  function scanBlocks(root, seen) {
    const sel = 'p, li, h1, h2, h3, h4, button[data-testid^="chat-assistant-history-trigger"]'
    for (const el of root.querySelectorAll(sel)) {
      if (seen.has(el)) continue
      if (el.closest('[data-v4-composer-dock]')) continue
      seen.add(el)
      applyDir(el, null)
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let node
    const leafSeen = new Set()
    while ((node = walker.nextNode())) {
      const text = (node.nodeValue || '').trim()
      if (text.length < 3) continue
      let el = node.parentElement
      if (!el || leafSeen.has(el) || seen.has(el)) continue
      if (el.closest('[data-v4-composer-dock]')) continue
      if (el.closest('[dir]')) continue
      if (!isLeafish(el)) continue
      leafSeen.add(el)
      seen.add(el)
      applyDir(el, null)
    }
  }

  function applyDirs() {
    if (getMode() === 'off') return
    const seen = new Set()

    for (const sel of DIR_SELECTORS) {
      let nodes = []
      try { nodes = document.querySelectorAll(sel) } catch (_) { continue }
      for (const el of nodes) {
        if (seen.has(el)) continue
        seen.add(el)
        const isEditor = el.matches('[data-lexical-editor="true"], [data-testid="chat-input"]')
        const isEditorP = el.matches('p') && !!el.closest('[data-lexical-editor="true"], [data-testid="chat-input"]')
        applyDir(el, isEditor || isEditorP ? 'rtl' : null)
      }
    }

    const timeline = document.querySelector('[data-v4-timeline-scroll]')
    if (timeline) scanBlocks(timeline, seen)

    for (const scope of extraScopes()) {
      let roots = []
      try { roots = document.querySelectorAll(scope) } catch (_) { continue }
      for (const root of roots) {
        if (seen.has(root)) continue
        seen.add(root)
        scanBlocks(root, seen)
      }
    }

    const ed = document.querySelector('[data-lexical-editor="true"], [data-testid="chat-input"]')
    if (ed && !ed.__rtlChatHooked) {
      ed.__rtlChatHooked = true
      const update = () => {
        if (getMode() === 'off') return
        applyDir(ed, 'rtl')
        ed.querySelectorAll('p').forEach(p => applyDir(p, 'rtl'))
      }
      ed.addEventListener('input', update)
      ed.addEventListener('keyup', update)
    }
  }

  // "Fa" language chip. On: filled chip at full strength; off: dimmed, flat.
  function toggleFace(on) {
    const chip = on
      ? 'background:rgba(127,127,140,0.28)'
      : 'background:transparent;opacity:0.5'
    return '<span style="display:flex;align-items:center;justify-content:center;width:100%;height:100%">' +
      '<span style="font:800 11px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.03em;' +
      'padding:3px 6px;border-radius:6px;' + chip + '">Fa</span></span>'
  }

  function firstVisibleButton(root) {
    for (const b of root.querySelectorAll('button')) {
      const r = b.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) return b
    }
    return null
  }

  // Composer toolbar to host the toggle. Prefer a tools group WITHOUT the send
  // button (left side); fall back to any toolbar with a visible button.
  function toolbarFor() {
    const sels = [
      'form [class*="group/toolbar"]',
      '[class*="group/toolbar"]',
      'form [class*="toolbar"]',
      '[class*="toolbar"]'
    ]
    const hasSend = t => !!t.querySelector(
      'button[type="submit"], button[aria-label*="send" i], button[data-testid*="send" i]')
    const candidates = []
    for (const dock of document.querySelectorAll('[data-v4-composer-dock]')) {
      for (const sel of sels) {
        let found = false
        try {
          for (const tb of dock.querySelectorAll(sel)) {
            if (firstVisibleButton(tb)) { candidates.push(tb); found = true }
          }
        } catch (_) { continue }
        if (found) break // stop at the first (most specific) selector level that matches
      }
    }
    return candidates.find(t => !hasSend(t)) || candidates[0] || null
  }

  // Boot grace: the composer mounts late in React — until the toolbar shows up
  // (or the grace expires) keep NO button instead of flashing the floating one.
  let firstMiss = 0
  const FLOAT_GRACE_MS = 5000

  function ensureButton() {
    const tb = toolbarFor()
    let btn = document.getElementById(TOGGLE_ID)
    if (tb) {
      firstMiss = 0
      if (btn && btn.isConnected && btn.dataset.rtlChatHost === 'bar' && btn.parentElement === tb) {
        updateToggle()
        return
      }
      if (btn) btn.remove()
      btn = document.createElement('button')
      btn.id = TOGGLE_ID
      btn.type = 'button'
      btn.draggable = false
      // borrow a visible sibling button's classes so the toggle blends into ZCode's toolbar
      const sibling = firstVisibleButton(tb)
      if (sibling) btn.className = sibling.className
      btn.classList.add('rtl-chat-inbar')
      btn.innerHTML = toggleFace(getMode() !== 'off')
      btn.__face = btn.innerHTML
      btn.style.marginRight = '4px'
      btn.addEventListener('mousedown', e => e.preventDefault())
      btn.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        setMode(getMode() === 'off' ? 'any-rtl' : 'off')
      })
      tb.insertBefore(btn, tb.firstChild) // left end of the toolbar
      // cloned classes must not hide the toggle — if they do, go floating instead
      const r = btn.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) {
        btn.dataset.rtlChatHost = 'bar'
        updateToggle()
        return
      }
      btn.remove()
    } else if (!firstMiss) {
      firstMiss = Date.now()
    }
    // floating fallback with inline geometry — can never lose visibility
    if (btn && btn.isConnected && btn.dataset.rtlChatHost === 'float') {
      updateToggle()
      return
    }
    if (btn) btn.remove()
    if (Date.now() - (firstMiss || 0) < FLOAT_GRACE_MS) return // stay hidden during boot
    btn = document.createElement('button')
    btn.id = TOGGLE_ID
    btn.type = 'button'
    btn.draggable = false
    btn.className = 'rtl-chat-fallback'
    btn.style.cssText = FALLBACK_CSS_TEXT
    btn.innerHTML = toggleFace(getMode() !== 'off')
    btn.__face = btn.innerHTML
    btn.addEventListener('mousedown', e => e.preventDefault())
    btn.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      setMode(getMode() === 'off' ? 'any-rtl' : 'off')
    })
    if (!document.body) return
    document.body.appendChild(btn)
    btn.dataset.rtlChatHost = 'float'
    updateToggle()
  }

  function updateToggle() {
    const btn = document.getElementById(TOGGLE_ID)
    if (!btn) return
    const on = getMode() !== 'off'
    btn.setAttribute('aria-pressed', on ? 'true' : 'false')
    btn.title = on ? 'راست‌چین: روشن (any-rtl)' : 'راست‌چین: خاموش'
    const face = toggleFace(on)
    if (btn.__face !== face) {
      btn.innerHTML = face
      btn.__face = face
    }
    // inline opacity — independent of any stylesheet
    btn.style.opacity = btn.dataset.rtlChatHost === 'float' ? '0.85' : '1'
  }

  function debugInfo() {
    window.__RTL_CHAT = {
      version: VERSION,
      via: via(),
      mode: getMode(),
      style: !!document.getElementById(STYLE_ID),
      toggle: !!document.getElementById(TOGGLE_ID),
      toggleHost: (document.getElementById(TOGGLE_ID) || {}).dataset?.rtlChatHost || null,
      scopes: extraScopes().length,
      ready: document.readyState
    }
  }

  function tick() {
    via()
    try { ensureChromeStyle() } catch (_) {}
    try { ensureButton() } catch (_) {}
    if (getMode() !== 'off') {
      ensureStyle()
      applyDirs()
    }
    debugInfo()
  }

  function boot() {
    window.__RTL_CHAT_BOOTED = true
    document.documentElement.setAttribute('data-rtl-chat', getMode() === 'off' ? 'off' : 'on')
    via()
    tick()
    if (window.__RTL_CHAT_TIMER) clearInterval(window.__RTL_CHAT_TIMER)
    window.__RTL_CHAT_TIMER = setInterval(tick, 2000)

    // live re-direction while streaming (2s interval stays as a safety net).
    // THROTTLE, not debounce: a debounce resets on every mutation batch and
    // starves during heavy re-renders (task switches) — the pending run here
    // always fires ≤120ms after the first change, no matter how long the
    // mutation storm lasts.
    if (!window.__RTL_CHAT_MO && (document.body || document.documentElement)) {
      let timer = null
      const mo = new MutationObserver(() => {
        if (timer) return
        timer = setTimeout(() => { timer = null; try { tick() } catch (_) {} }, 120)
      })
      mo.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true
      })
      window.__RTL_CHAT_MO = mo
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true })
  } else {
    boot()
  }
})()
