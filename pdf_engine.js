/**
 * Escudo Financiero Pro — Motor de documentos PDF vectoriales
 * -----------------------------------------------------------------------------
 * Un único cálculo de maquetación (renglones, saltos de página y posiciones
 * exactas en puntos tipográficos) alimenta tres salidas idénticas:
 *
 *   1. PDF vectorial descargable (pdf-lib): texto nítido, seleccionable y ligero.
 *   2. Vista previa en SVG: misma geometría que el PDF, funciona en cualquier
 *      navegador y en móviles (que no muestran PDF dentro de un iframe).
 *   3. Impresión nativa en un iframe aislado: no imprime la interfaz de la app.
 *
 * pdf-lib se carga bajo demanda (pdf-lib.min.js, local) la primera vez que se
 * genera un documento, para no penalizar la carga inicial de la página.
 */
(function (global) {
  'use strict';

  const PAGE_W = 612; // Hoja Carta: 8.5 in × 72 pt
  const PAGE_H = 792; // 11 in × 72 pt

  // Ruta de pdf-lib relativa a este archivo (funciona también en subcarpetas de GitHub Pages)
  const SCRIPT_BASE = (document.currentScript && document.currentScript.src)
    ? document.currentScript.src.replace(/[^/]*$/, '')
    : '';
  const LIB_SRC = SCRIPT_BASE + 'pdf-lib.min.js';

  // Fuentes estándar PDF (no requieren descarga ni incrustación de archivos)
  const FONT_FILES = {
    'helvetica.regular': 'Helvetica',
    'helvetica.bold': 'HelveticaBold',
    'helvetica.italic': 'HelveticaOblique',
    'helvetica.boldItalic': 'HelveticaBoldOblique',
    'times.regular': 'TimesRoman',
    'times.bold': 'TimesRomanBold',
    'times.italic': 'TimesRomanItalic',
    'times.boldItalic': 'TimesRomanBoldItalic',
    'courier.regular': 'Courier',
    'courier.bold': 'CourierBold'
  };

  // Equivalentes métricos para la vista previa SVG
  const SVG_FONT = {
    helvetica: "Helvetica, Arial, 'Liberation Sans', 'Nimbus Sans', sans-serif",
    times: "'Times New Roman', Times, 'Liberation Serif', 'Nimbus Roman', serif",
    courier: "'Courier New', Courier, 'Liberation Mono', 'Nimbus Mono PS', monospace"
  };

  const SVG_STYLE =
    '.epdf-t{font-kerning:none;font-variant-ligatures:none;letter-spacing:0;word-spacing:0;white-space:pre;text-rendering:geometricPrecision}' +
    `.epdf-helvetica{font-family:${SVG_FONT.helvetica}}` +
    `.epdf-times{font-family:${SVG_FONT.times}}` +
    `.epdf-courier{font-family:${SVG_FONT.courier}}`;

  let libPromise = null;
  let readyPromise = null;
  let measureFonts = null; // Fuentes incrustadas en un documento auxiliar, solo para medir

  /* ---------------------------------------------------------------------------
     CARGA DE LA LIBRERÍA
     --------------------------------------------------------------------------- */
  function isAvailable() {
    return !!(global.PDFLib && global.PDFLib.PDFDocument);
  }

  function loadLibrary() {
    if (isAvailable()) return Promise.resolve();
    if (!libPromise) {
      libPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = LIB_SRC;
        s.async = true;
        s.onload = () => (isAvailable() ? resolve() : reject(new Error('pdf-lib se cargó pero no expuso PDFLib.')));
        s.onerror = () => reject(new Error('No se pudo cargar el motor PDF (pdf-lib.min.js). Revisa tu conexión.'));
        document.head.appendChild(s);
      }).catch((err) => {
        libPromise = null;
        throw err;
      });
    }
    return libPromise;
  }

  function ready() {
    if (measureFonts) return Promise.resolve();
    if (!readyPromise) {
      readyPromise = (async () => {
        await loadLibrary();
        const { PDFDocument, StandardFonts } = global.PDFLib;
        const scratch = await PDFDocument.create();
        const fonts = {};
        for (const [key, name] of Object.entries(FONT_FILES)) {
          fonts[key] = await scratch.embedFont(StandardFonts[name]);
        }
        measureFonts = fonts;
      })().catch((err) => {
        readyPromise = null;
        throw err;
      });
    }
    return readyPromise;
  }

  /* ---------------------------------------------------------------------------
     SANEAMIENTO DE TEXTO (codificación WinAnsi de las fuentes estándar PDF)
     Acentos, ñ, ¿, ¡, comillas tipográficas, — y • se conservan. Los emojis se
     eliminan y los símbolos sin equivalente se sustituyen para no romper el PDF.
     --------------------------------------------------------------------------- */
  const CHAR_MAP = {
    '\u00A0': ' ', '\u2002': ' ', '\u2003': ' ', '\u2007': ' ', '\u2009': ' ', '\u200A': ' ', '\u202F': ' ',
    '\u2010': '-', '\u2011': '-', '\u2012': '-', '\u2015': '\u2014', '\u2212': '-',
    '\u2192': '->', '\u2190': '<-', '\u21D2': '=>', '\u2264': '<=', '\u2265': '>=', '\u2260': '!=',
    '\u2713': 'v', '\u2714': 'v', '\u2717': 'x', '\u2718': 'x', '\u2605': '*', '\u2606': '*',
    '\u25CF': '\u2022', '\u25AA': '\u2022', '\u25A0': '\u2022', '\u2023': '\u2022', '\u2043': '-',
    '\u2116': 'No.', '\u2691': '', '\u2690': ''
  };
  const charCache = new Map();

  function sanitize(input) {
    const src = String(input == null ? '' : input)
      .normalize('NFC')
      .replace(/\r\n?/g, '\n')
      .replace(/\t/g, '    ');
    if (!measureFonts) return src;
    const probe = measureFonts['helvetica.regular'];
    let out = '';
    for (const ch of src) {
      if (ch === '\n') {
        out += ch;
        continue;
      }
      let rep = charCache.get(ch);
      if (rep === undefined) {
        if (/[\u0000-\u001F\u007F\u200B-\u200D\u2060\uFE00-\uFE0F]/.test(ch)) {
          rep = '';
        } else if (Object.prototype.hasOwnProperty.call(CHAR_MAP, ch)) {
          rep = CHAR_MAP[ch];
        } else {
          try {
            probe.widthOfTextAtSize(ch, 10);
            rep = ch;
          } catch (e) {
            rep = /\p{Extended_Pictographic}|\p{Emoji_Modifier}|\p{Regional_Indicator}/u.test(ch) ? '' : '?';
          }
        }
        charCache.set(ch, rep);
      }
      out += rep;
    }
    return out;
  }

  function widthOf(text, key, size) {
    return text ? measureFonts[key].widthOfTextAtSize(text, size) : 0;
  }

  function hexToRgb01(hex) {
    const h = String(hex || '#000000').replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0');
    const n = parseInt(full.slice(0, 6), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  /* ---------------------------------------------------------------------------
     PREPARACIÓN DE IMÁGENES
     - pdf-lib solo admite PNG y JPEG: otros formatos (WEBP, GIF…) se convierten.
     - Los JPEG se re-codifican para aplicar la orientación EXIF (fotos de celular
       que, si no, aparecerían giradas dentro del PDF).
     - Se reduce la resolución de fotos enormes para que el PDF no pese decenas de MB.
     - trim: recorta el área vacía de la firma dibujada en el lienzo.
     --------------------------------------------------------------------------- */
  const imageCache = new Map();
  let imageSeq = 0;

  function prepareImage(dataUrl, opts = {}) {
    if (!dataUrl || typeof dataUrl !== 'string') return Promise.resolve(null);
    const keepAlpha = !!opts.keepAlpha;
    const trim = !!opts.trim;
    const maxDim = opts.maxDim || 1600;
    const cacheKey = `${keepAlpha ? 'a' : 'o'}${trim ? 't' : ''}${maxDim}:${dataUrl}`;
    if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);

    const promise = new Promise((resolve) => {
      const im = new Image();
      im.onload = () => {
        try {
          let sx = 0;
          let sy = 0;
          let sw = im.naturalWidth;
          let sh = im.naturalHeight;
          if (!sw || !sh) return resolve(null);

          const mimeMatch = /^data:(image\/[a-z0-9+.-]+)/i.exec(dataUrl);
          const mime = mimeMatch ? mimeMatch[1].toLowerCase() : '';

          if (trim) {
            const probe = document.createElement('canvas');
            probe.width = sw;
            probe.height = sh;
            const pctx = probe.getContext('2d');
            pctx.drawImage(im, 0, 0);
            const px = pctx.getImageData(0, 0, sw, sh).data;
            let minX = sw, minY = sh, maxX = -1, maxY = -1;
            for (let y = 0; y < sh; y++) {
              for (let x = 0; x < sw; x++) {
                if (px[(y * sw + x) * 4 + 3] > 12) {
                  if (x < minX) minX = x;
                  if (x > maxX) maxX = x;
                  if (y < minY) minY = y;
                  if (y > maxY) maxY = y;
                }
              }
            }
            if (maxX < 0) return resolve(null); // Lienzo vacío
            const pad = 6;
            sx = Math.max(0, minX - pad);
            sy = Math.max(0, minY - pad);
            sw = Math.min(im.naturalWidth, maxX + pad + 1) - sx;
            sh = Math.min(im.naturalHeight, maxY + pad + 1) - sy;
          }

          const scale = Math.min(1, maxDim / Math.max(sw, sh));
          const needsCanvas = trim || scale < 1 || mime !== 'image/png' || !keepAlpha;
          if (!needsCanvas) {
            return resolve({ id: `img${++imageSeq}`, dataUrl, kind: 'png', w: sw, h: sh });
          }

          const outW = Math.max(1, Math.round(sw * scale));
          const outH = Math.max(1, Math.round(sh * scale));
          const canvas = document.createElement('canvas');
          canvas.width = outW;
          canvas.height = outH;
          const ctx = canvas.getContext('2d');
          const asPng = keepAlpha;
          if (!asPng) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, outW, outH);
          }
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(im, sx, sy, sw, sh, 0, 0, outW, outH);
          const out = asPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.88);
          resolve({ id: `img${++imageSeq}`, dataUrl: out, kind: asPng ? 'png' : 'jpg', w: outW, h: outH });
        } catch (err) {
          console.warn('[EscudoPDF] No se pudo preparar una imagen:', err);
          resolve(null);
        }
      };
      im.onerror = () => resolve(null);
      im.src = dataUrl;
    });

    imageCache.set(cacheKey, promise);
    if (imageCache.size > 24) imageCache.delete(imageCache.keys().next().value);
    return promise;
  }

  /* ---------------------------------------------------------------------------
     MAQUETADOR (coordenadas en puntos, origen arriba-izquierda)
     --------------------------------------------------------------------------- */
  class LayoutDoc {
    constructor(o) {
      const m = Object.assign({ top: 56, right: 60, bottom: 64, left: 60 }, o.margins || {});
      this.family = o.family || 'helvetica';
      this.size = o.size || 10.5;
      this.lineHeight = o.lineHeight || 1.45;
      this.color = o.color || '#0f172a';
      this.onPageStart = typeof o.onPageStart === 'function' ? o.onPageStart : null;
      this.margins = m;
      this.left = m.left;
      this.right = PAGE_W - m.right;
      this.top = m.top;
      this.bottom = PAGE_H - m.bottom;
      this.contentWidth = this.right - this.left;
      this.pages = [];
      this.images = new Map();
      this.page = null;
      this.pageIndex = -1;
      this.pageContentTop = this.top;
      this.y = this.top;
      this.newPage();
    }

    fontKey(style) {
      if (style === 'mono') return 'courier.regular';
      if (style === 'monoBold') return 'courier.bold';
      return `${this.family}.${style || 'regular'}`;
    }

    measure(text, style, size) {
      return widthOf(sanitize(text).replace(/\n/g, ' '), this.fontKey(style), size || this.size);
    }

    newPage() {
      this.page = { ops: [] };
      this.pages.push(this.page);
      this.pageIndex = this.pages.length - 1;
      this.y = this.top;
      if (this.onPageStart) this.onPageStart(this, this.pageIndex);
      this.pageContentTop = this.y;
    }

    atPageTop() {
      return this.y <= this.pageContentTop + 0.5;
    }

    ensureSpace(h) {
      if (this.y + h > this.bottom + 0.01 && !this.atPageTop()) this.newPage();
    }

    space(h) {
      if (!this.atPageTop()) this.y += h;
    }

    /* ---- Primitivas absolutas ---- */
    textAt(x, baseline, text, opts = {}) {
      const size = opts.size || this.size;
      const key = this.fontKey(opts.style);
      let str = sanitize(text).replace(/\n/g, ' ');
      if (opts.maxWidth && widthOf(str, key, size) > opts.maxWidth) {
        while (str.length > 1 && widthOf(str + '…', key, size) > opts.maxWidth) str = str.slice(0, -1);
        str += '…';
      }
      const w = widthOf(str, key, size);
      let x0 = x;
      if (opts.align === 'right') x0 = x - w;
      else if (opts.align === 'center') x0 = x - w / 2;
      if (str) this.page.ops.push({ t: 'text', x: x0, y: baseline, size, key, color: opts.color || this.color, str, w });
      return w;
    }

    lineAt(x1, y1, x2, y2, opts = {}) {
      this.page.ops.push({ t: 'line', x1, y1, x2, y2, w: opts.width || 0.75, color: opts.color || this.color, dash: opts.dash || null });
    }

    rectAt(x, y, w, h, opts = {}) {
      this.page.ops.push({ t: 'rect', x, y, w, h, fill: opts.fill || null, stroke: opts.stroke || null, lw: opts.lineWidth || 0.75, dash: opts.dash || null });
    }

    imageAt(img, x, y, w, h) {
      if (!img) return;
      this.images.set(img.id, img);
      this.page.ops.push({ t: 'img', id: img.id, x, y, w, h });
    }

    rule(opts = {}) {
      const th = opts.width || 0.75;
      this.lineAt(opts.x1 != null ? opts.x1 : this.left, this.y + th / 2, opts.x2 != null ? opts.x2 : this.right, this.y + th / 2, { width: th, color: opts.color });
      this.y += th + (opts.spaceAfter || 0);
    }

    /* ---- Texto con ajuste de línea, justificado y paginación ---- */
    _tokenize(segments, defStyle, defColor) {
      const tokens = [];
      let cur = null;
      const flush = () => {
        if (cur) {
          tokens.push(cur);
          cur = null;
        }
      };
      for (const seg of segments) {
        if (seg == null || seg === false || seg === '') continue;
        const s = typeof seg === 'object'
          ? { text: seg.text, style: seg.style || defStyle, color: seg.color || defColor }
          : { text: seg, style: defStyle, color: defColor };
        const text = sanitize(s.text);
        let buf = '';
        const pushBuf = () => {
          if (!buf) return;
          if (!cur) cur = { k: 'w', runs: [] };
          const last = cur.runs[cur.runs.length - 1];
          if (last && last.style === s.style && last.color === s.color) last.text += buf;
          else cur.runs.push({ text: buf, style: s.style, color: s.color });
          buf = '';
        };
        for (const ch of text) {
          if (ch === '\n') {
            pushBuf();
            flush();
            tokens.push({ k: 'n' });
          } else if (ch === ' ') {
            pushBuf();
            flush();
            const prev = tokens[tokens.length - 1];
            if (prev && prev.k === 'w') tokens.push({ k: 's' });
          } else {
            buf += ch;
          }
        }
        pushBuf();
      }
      flush();
      return tokens;
    }

    _measureWord(tok, size) {
      let w = 0;
      const runs = tok.runs.map((r) => {
        const key = this.fontKey(r.style);
        const rw = widthOf(r.text, key, size);
        w += rw;
        return { text: r.text, key, color: r.color, w: rw };
      });
      return { runs, w };
    }

    // Parte palabras más largas que el renglón (URL, correos, CLABE) carácter por carácter
    _splitWord(word, maxW, size) {
      const chunks = [];
      let cur = { runs: [], w: 0 };
      for (const r of word.runs) {
        let part = '';
        let partW = 0;
        for (const ch of r.text) {
          const cw = widthOf(ch, r.key, size);
          if (cur.w + partW + cw > maxW && (cur.w + partW) > 0) {
            if (part) cur.runs.push({ text: part, key: r.key, color: r.color, w: partW });
            cur.w += partW;
            chunks.push(cur);
            cur = { runs: [], w: 0 };
            part = '';
            partW = 0;
          }
          part += ch;
          partW += cw;
        }
        if (part) {
          cur.runs.push({ text: part, key: r.key, color: r.color, w: partW });
          cur.w += partW;
        }
      }
      if (cur.runs.length) chunks.push(cur);
      return chunks;
    }

    _breakLines(tokens, width, size, indent) {
      const lines = [];
      const spaceW = widthOf(' ', this.fontKey('regular'), size);
      const mk = (ind) => ({ items: [], width: 0, gaps: 0, hard: false, indent: ind });
      let line = mk(indent);
      let pendingSpace = false;
      const avail = () => width - line.indent;

      for (const tok of tokens) {
        if (tok.k === 'n') {
          line.hard = true;
          lines.push(line);
          line = mk(0);
          pendingSpace = false;
          continue;
        }
        if (tok.k === 's') {
          pendingSpace = line.items.length > 0;
          continue;
        }
        let word = this._measureWord(tok, size);
        let sp = pendingSpace ? spaceW : 0;
        if (line.items.length && line.width + sp + word.w > avail()) {
          lines.push(line);
          line = mk(0);
          sp = 0;
        }
        if (word.w > avail()) {
          if (line.items.length) {
            lines.push(line);
            line = mk(0);
            sp = 0;
          }
          const chunks = this._splitWord(word, avail(), size);
          for (let c = 0; c < chunks.length - 1; c++) {
            line.items.push({ word: chunks[c], space: false });
            line.width = chunks[c].w;
            lines.push(line);
            line = mk(0);
          }
          word = chunks[chunks.length - 1];
        }
        line.items.push({ word, space: sp > 0 });
        line.width += sp + word.w;
        if (sp > 0) line.gaps++;
        pendingSpace = false;
      }
      line.hard = true;
      if (line.items.length || !lines.length) lines.push(line);
      return lines;
    }

    _emitLine(line, x, width, size, lh, align) {
      const baseline = this.y + (lh - size) / 2 + size * 0.8;
      const avail = width - line.indent;
      const spaceW = widthOf(' ', this.fontKey('regular'), size);
      let extra = 0;
      if (align === 'justify' && !line.hard && line.gaps > 0) {
        extra = (avail - line.width) / line.gaps;
        if (extra > size * 1.2 || extra < 0) extra = 0; // Evita "ríos" exagerados
      }
      let cx = x + line.indent;
      if (align === 'center') cx += (avail - line.width) / 2;
      else if (align === 'right') cx += avail - line.width;

      let pending = null; // Une palabras consecutivas del mismo estilo en un solo trazo
      const flush = () => {
        if (pending) {
          this.page.ops.push(pending);
          pending = null;
        }
      };
      for (const it of line.items) {
        if (it.space) {
          if (extra === 0 && pending) {
            pending.str += ' ';
            pending.w += spaceW;
          } else {
            flush();
          }
          cx += spaceW + extra;
        }
        for (const r of it.word.runs) {
          if (!r.text) continue;
          if (pending && pending.key === r.key && pending.color === r.color && Math.abs(pending.x + pending.w - cx) < 0.01) {
            pending.str += r.text;
            pending.w += r.w;
          } else {
            flush();
            pending = { t: 'text', x: cx, y: baseline, size, key: r.key, color: r.color, str: r.text, w: r.w };
          }
          cx += r.w;
        }
      }
      flush();
    }

    _prepareLines(segments, opts) {
      const size = opts.size || this.size;
      const x = opts.x != null ? opts.x : this.left;
      const width = opts.width != null ? opts.width : this.right - x;
      const segs = Array.isArray(segments) ? segments : [segments];
      const tokens = this._tokenize(segs, opts.style || 'regular', opts.color || this.color);
      if (!tokens.some((t) => t.k === 'w')) return null;
      const lines = this._breakLines(tokens, width, size, opts.indent || 0);
      const lh = size * (opts.lineHeight || this.lineHeight);
      return { lines, lh, size, x, width };
    }

    heightOf(segments, opts = {}) {
      const p = this._prepareLines(segments, opts);
      return p ? p.lines.length * p.lh : 0;
    }

    /**
     * Párrafo con ajuste de línea y paginación profesional:
     * - Nunca corta un renglón entre páginas (cada renglón es indivisible).
     * - Control de huérfanas y viudas (no deja un renglón solo).
     * - keepTogether: mueve el bloque completo a la siguiente página si no cabe.
     * - keepWithNext: reserva espacio para que un título no quede solo al pie.
     */
    paragraph(segments, opts = {}) {
      const p = this._prepareLines(segments, opts);
      if (!p) return 0;
      const { lines, lh, size, x, width } = p;
      const align = opts.align || 'left';

      if (opts.spaceBefore) this.space(opts.spaceBefore);
      const total = lines.length * lh;
      const reserve = opts.keepWithNext || 0;
      const pageCap = this.bottom - this.pageContentTop;
      if ((opts.keepTogether || reserve) && total + reserve <= pageCap) this.ensureSpace(total + reserve);

      let i = 0;
      while (i < lines.length) {
        let fit = Math.floor((this.bottom - this.y + 0.01) / lh);
        const remaining = lines.length - i;
        if (fit <= 0) {
          this.newPage();
          continue;
        }
        if (fit < remaining) {
          if (i === 0 && fit === 1 && lines.length > 1 && !this.atPageTop()) {
            this.newPage(); // Evita renglón huérfano al pie
            continue;
          }
          if (remaining - fit === 1 && fit >= 2) fit -= 1; // Evita renglón viudo arriba
        }
        const n = Math.min(fit, remaining);
        for (let k = 0; k < n; k++) {
          this._emitLine(lines[i + k], x, width, size, lh, align);
          this.y += lh;
        }
        i += n;
        if (i < lines.length) this.newPage();
      }
      this.y += opts.spaceAfter || 0;
      return total;
    }

    /**
     * Recuadro alrededor de un bloque (fondo, borde o barra lateral).
     * estimate: alto aproximado para moverlo completo a otra página si no cabe.
     */
    box(fn, opts = {}) {
      const pad = opts.padding != null ? opts.padding : 8;
      const inset = opts.inset != null ? opts.inset : pad;
      if (opts.estimate) this.ensureSpace(opts.estimate + pad * 2);
      const startPage = this.page;
      const idx = startPage.ops.length;
      const y0 = this.y;
      this.y += pad;
      fn({ x: this.left + inset, width: this.contentWidth - inset - (opts.insetRight != null ? opts.insetRight : pad) });
      this.y += pad;
      if (this.page === startPage) {
        const extra = [];
        if (opts.fill || opts.stroke) {
          extra.push({ t: 'rect', x: this.left, y: y0, w: this.contentWidth, h: this.y - y0, fill: opts.fill || null, stroke: opts.stroke || null, lw: opts.lineWidth || 0.75, dash: null });
        }
        if (opts.leftBar) {
          const bw = opts.leftBar.width || 2.5;
          extra.push({ t: 'line', x1: this.left + bw / 2, y1: y0, x2: this.left + bw / 2, y2: this.y, w: bw, color: opts.leftBar.color || this.color, dash: null });
        }
        startPage.ops.splice(idx, 0, ...extra);
      }
    }

    finish(opts = {}) {
      const total = this.pages.length;
      if (typeof opts.footer === 'function') {
        const prev = this.page;
        this.pages.forEach((p, i) => {
          this.page = p;
          opts.footer(this, i, total);
        });
        this.page = prev;
      }
      return { pages: this.pages.map((p) => p.ops), images: this.images, width: PAGE_W, height: PAGE_H };
    }
  }

  function createDocument(options = {}) {
    if (!measureFonts) throw new Error('Llama a EscudoPDF.ready() antes de maquetar.');
    return new LayoutDoc(options);
  }

  /* ---------------------------------------------------------------------------
     SALIDA 1: PDF VECTORIAL (pdf-lib)
     --------------------------------------------------------------------------- */
  async function toPdfBytes(layout, meta = {}) {
    await ready();
    const { PDFDocument, StandardFonts, rgb } = global.PDFLib;
    const pdf = await PDFDocument.create();
    const now = new Date();
    if (meta.title) pdf.setTitle(sanitize(meta.title), { showInWindowTitleBar: true });
    if (meta.subject) pdf.setSubject(sanitize(meta.subject));
    if (meta.keywords) pdf.setKeywords(meta.keywords.map(sanitize));
    pdf.setAuthor('Escudo Financiero Pro'); // Sin datos personales en los metadatos
    pdf.setCreator('Escudo Financiero Pro');
    pdf.setProducer('Escudo Financiero Pro (pdf-lib)');
    pdf.setLanguage('es-MX');
    pdf.setCreationDate(now);
    pdf.setModificationDate(now);

    const colorOf = (hex) => {
      const c = hexToRgb01(hex);
      return rgb(c[0], c[1], c[2]);
    };

    const fonts = {};
    for (const ops of layout.pages) {
      for (const op of ops) {
        if (op.t === 'text' && !fonts[op.key]) fonts[op.key] = await pdf.embedFont(StandardFonts[FONT_FILES[op.key]]);
      }
    }
    const imgs = {};
    for (const [id, img] of layout.images) {
      imgs[id] = img.kind === 'png' ? await pdf.embedPng(img.dataUrl) : await pdf.embedJpg(img.dataUrl);
    }

    for (const ops of layout.pages) {
      const page = pdf.addPage([PAGE_W, PAGE_H]);
      for (const op of ops) {
        if (op.t === 'text') {
          page.drawText(op.str, { x: op.x, y: PAGE_H - op.y, size: op.size, font: fonts[op.key], color: colorOf(op.color) });
        } else if (op.t === 'line') {
          page.drawLine({
            start: { x: op.x1, y: PAGE_H - op.y1 },
            end: { x: op.x2, y: PAGE_H - op.y2 },
            thickness: op.w,
            color: colorOf(op.color),
            dashArray: op.dash || undefined
          });
        } else if (op.t === 'rect') {
          page.drawRectangle({
            x: op.x,
            y: PAGE_H - op.y - op.h,
            width: op.w,
            height: op.h,
            color: op.fill ? colorOf(op.fill) : undefined,
            borderColor: op.stroke ? colorOf(op.stroke) : undefined,
            borderWidth: op.stroke ? op.lw : 0,
            borderDashArray: op.stroke && op.dash ? op.dash : undefined
          });
        } else if (op.t === 'img' && imgs[op.id]) {
          page.drawImage(imgs[op.id], { x: op.x, y: PAGE_H - op.y - op.h, width: op.w, height: op.h });
        }
      }
    }
    return pdf.save();
  }

  async function toPdfBlob(layout, meta) {
    const bytes = await toPdfBytes(layout, meta);
    return new Blob([bytes], { type: 'application/pdf' });
  }

  /* ---------------------------------------------------------------------------
     SALIDA 2: VISTA PREVIA SVG (misma geometría que el PDF)
     textLength fuerza el ancho exacto de cada trazo, de modo que la vista previa
     coincide con el PDF aunque la fuente local tenga métricas ligeramente distintas.
     --------------------------------------------------------------------------- */
  const r2 = (v) => Math.round(v * 100) / 100;
  const escXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function toSvgPages(layout) {
    const total = layout.pages.length;
    return layout.pages.map((ops, i) => {
      let body = '';
      for (const op of ops) {
        if (op.t === 'text') {
          const dot = op.key.indexOf('.');
          const fam = op.key.slice(0, dot);
          const sty = op.key.slice(dot + 1);
          const weight = /bold/i.test(sty) ? ' font-weight="bold"' : '';
          const italic = /italic/i.test(sty) ? ' font-style="italic"' : '';
          const tl = op.w > 0 ? ` textLength="${r2(op.w)}" lengthAdjust="spacing"` : '';
          body += `<text class="epdf-t epdf-${fam}" x="${r2(op.x)}" y="${r2(op.y)}" font-size="${op.size}"${weight}${italic} fill="${op.color}"${tl}>${escXml(op.str)}</text>`;
        } else if (op.t === 'line') {
          const dash = op.dash ? ` stroke-dasharray="${op.dash.join(' ')}"` : '';
          body += `<line x1="${r2(op.x1)}" y1="${r2(op.y1)}" x2="${r2(op.x2)}" y2="${r2(op.y2)}" stroke="${op.color}" stroke-width="${op.w}"${dash}/>`;
        } else if (op.t === 'rect') {
          const dash = op.dash ? ` stroke-dasharray="${op.dash.join(' ')}"` : '';
          body += `<rect x="${r2(op.x)}" y="${r2(op.y)}" width="${r2(op.w)}" height="${r2(op.h)}" fill="${op.fill || 'none'}" stroke="${op.stroke || 'none'}" stroke-width="${op.stroke ? op.lw : 0}"${dash}/>`;
        } else if (op.t === 'img') {
          const img = layout.images.get(op.id);
          if (img) body += `<image x="${r2(op.x)}" y="${r2(op.y)}" width="${r2(op.w)}" height="${r2(op.h)}" preserveAspectRatio="none" href="${img.dataUrl}" xlink:href="${img.dataUrl}"/>`;
        }
      }
      return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 ${PAGE_W} ${PAGE_H}" width="${PAGE_W}" height="${PAGE_H}" class="escudo-pdf-page" role="img" aria-label="Página ${i + 1} de ${total}"><style>${SVG_STYLE}</style><rect width="${PAGE_W}" height="${PAGE_H}" fill="#ffffff"/>${body}</svg>`;
    });
  }

  /* ---------------------------------------------------------------------------
     SALIDA 3: IMPRESIÓN NATIVA EN IFRAME AISLADO
     --------------------------------------------------------------------------- */
  function isIOS() {
    return /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function printLayout(layout, title) {
    const pages = toSvgPages(layout);
    const old = document.getElementById('escudo-print-frame');
    if (old) old.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'escudo-print-frame';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    const html =
      '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">' +
      `<title>${escXml(title || 'Documento')}</title>` +
      '<style>@page{size:letter portrait;margin:0}html,body{margin:0;padding:0;background:#fff}' +
      'svg.escudo-pdf-page{display:block;width:8.5in;height:10.98in;page-break-after:always;break-after:page}' +
      'svg.escudo-pdf-page:last-child{page-break-after:auto;break-after:auto}</style></head>' +
      `<body>${pages.join('')}</body></html>`;

    iframe.onload = () => {
      const w = iframe.contentWindow;
      if (!w) return;
      w.addEventListener('afterprint', () => setTimeout(() => iframe.remove(), 1000));
      setTimeout(() => {
        try {
          w.focus();
          w.print();
        } catch (err) {
          console.error('[EscudoPDF] No se pudo abrir el diálogo de impresión:', err);
        }
      }, 300);
      setTimeout(() => { if (iframe.isConnected) iframe.remove(); }, 120000);
    };
    iframe.srcdoc = html;
    document.body.appendChild(iframe);
  }

  /* ---------------------------------------------------------------------------
     DESCARGA Y COMPARTIR (escritorio, Android e iOS)
     --------------------------------------------------------------------------- */
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    if ('download' in a) {
      a.href = url;
      a.download = filename;
      a.rel = 'noopener';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      const win = window.open(url, '_blank');
      if (!win) window.location.href = url;
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  function canShareFiles() {
    try {
      if (!navigator.canShare || !navigator.share || typeof File === 'undefined') return false;
      const probe = new File([new Blob(['%PDF-1.7'], { type: 'application/pdf' })], 'prueba.pdf', { type: 'application/pdf' });
      return navigator.canShare({ files: [probe] });
    } catch (e) {
      return false;
    }
  }

  function shareBlob(blob, filename, title) {
    const file = new File([blob], filename, { type: 'application/pdf' });
    return navigator.share({ files: [file], title: title || filename });
  }

  global.EscudoPDF = {
    PAGE_W,
    PAGE_H,
    ready,
    loadLibrary,
    isAvailable,
    sanitize,
    prepareImage,
    createDocument,
    toPdfBytes,
    toPdfBlob,
    toSvgPages,
    printLayout,
    downloadBlob,
    canShareFiles,
    shareBlob,
    isIOS,
    B: (text) => ({ text, style: 'bold' }),
    I: (text) => ({ text, style: 'italic' }),
    BI: (text) => ({ text, style: 'boldItalic' }),
    M: (text) => ({ text, style: 'mono' }),
    C: (text, color, style) => ({ text, color, style })
  };
})(window);
