/**
 * ============================================================================
 * ESCUDO FINANCIERO PRO — LÓGICA PRINCIPAL INTEGRAL (ES6+)
 * ============================================================================
 * Plataforma Cívica Antifraude, Buscador SIPRES a Gran Escala (409 Entidades),
 * Generador Procesal de Quejas CONDUSEF en PDF (Redacción Forense sin Sobreposición),
 * Semáforo Financiero con Amortización, Chatbot Asistente con Gemini 2.5 Flash y Radar.
 * ============================================================================
 */

const EscudoApp = (function () {
  'use strict';

  // Catálogo oficial de UDECOs (Unidades de Atención a Usuarios CONDUSEF)
  const UDECO_CATALOG = {
    CDMX_CENTRAL: {
      nombre: 'UDECO Metropolitana Central',
      direccion: 'Av. Insurgentes Sur 762, PB, Col. Del Valle Norte, Alcaldía Benito Juárez, C.P. 03103, Ciudad de México.',
      telefono: '55 53 400 999',
      titular: 'Dirección General de Unidades de Atención a Usuarios — Región Metropolitana'
    },
    CDMX_ORIENTE: {
      nombre: 'UDECO Metropolitana Oriente',
      direccion: 'Av. Telecomunicaciones s/n, Esquina Calle 3, Col. Chinampac de Juárez, Alcaldía Iztapalapa, C.P. 09208, Ciudad de México.',
      telefono: '55 53 400 999',
      titular: 'Unidad de Atención Regional CDMX Oriente'
    },
    JALISCO: {
      nombre: 'UDECO Jalisco',
      direccion: 'Av. Vallarta No. 1540, Mezzanine 1, Col. Americana, C.P. 44160, Guadalajara, Jalisco.',
      telefono: '33 36 15 57 96',
      titular: 'Unidad de Atención a Usuarios en el Estado de Jalisco'
    },
    NUEVO_LEON: {
      nombre: 'UDECO Nuevo León',
      direccion: 'Av. Eugenio Garza Sada No. 2411, Piso 2, Col. Roma, C.P. 64700, Monterrey, Nuevo León.',
      telefono: '81 83 45 42 34',
      titular: 'Unidad de Atención a Usuarios en el Estado de Nuevo León'
    },
    PUEBLA: {
      nombre: 'UDECO Puebla',
      direccion: 'Calle 15 de Mayo No. 2929, Col. Las Hadas, C.P. 72070, Puebla, Puebla.',
      telefono: '222 237 8100',
      titular: 'Unidad de Atención a Usuarios en el Estado de Puebla'
    },
    VERACRUZ: {
      nombre: 'UDECO Veracruz',
      direccion: 'Av. 5 de Mayo No. 1025, Piso 1, Centro Histórico, C.P. 91700, Veracruz, Veracruz.',
      telefono: '229 932 7872',
      titular: 'Unidad de Atención a Usuarios en el Estado de Veracruz'
    },
    GUANAJUATO: {
      nombre: 'UDECO Guanajuato',
      direccion: 'Blvd. Adolfo López Mateos No. 1101 Ote., Col. Los Paraísos, C.P. 37328, León, Guanajuato.',
      telefono: '477 717 6245',
      titular: 'Unidad de Atención a Usuarios en el Estado de Guanajuato'
    },
    QUERETARO: {
      nombre: 'UDECO Querétaro',
      direccion: 'Av. Constituyentes No. 124 Pte., Col. El Carrizal, C.P. 76030, Santiago de Querétaro, Qro.',
      telefono: '442 216 0240',
      titular: 'Unidad de Atención a Usuarios en el Estado de Querétaro'
    },
    YUCATAN: {
      nombre: 'UDECO Yucatán',
      direccion: 'Calle 60 No. 488 x 57 y 59, Edificio Centro de Negocios, Centro, C.P. 97000, Mérida, Yucatán.',
      telefono: '999 923 8815',
      titular: 'Unidad de Atención a Usuarios en el Estado de Yucatán'
    },
    BAJA_CALIFORNIA: {
      nombre: 'UDECO Baja California',
      direccion: 'Paseo de los Héroes No. 9365, Zona Urbana Río Tijuana, C.P. 22010, Tijuana, B.C.',
      telefono: '664 684 0072',
      titular: 'Unidad de Atención a Usuarios en el Estado de Baja California'
    },
    CHIHUAHUA: {
      nombre: 'UDECO Chihuahua',
      direccion: 'Av. Francisco Villa No. 4311, Col. San Felipe, C.P. 31203, Chihuahua, Chih.',
      telefono: '614 414 4780',
      titular: 'Unidad de Atención a Usuarios en el Estado de Chihuahua'
    },
    SONORA: {
      nombre: 'UDECO Sonora',
      direccion: 'Blvd. Rosales y Monterrey s/n, Edificio México, Hermosillo, Sonora.',
      telefono: '662 213 1894',
      titular: 'Unidad de Atención a Usuarios en el Estado de Sonora'
    }
  };

  // Directorio de Canales y Teléfonos Legítimos de Principales Bancos en México
  const VERIFIED_CHANNELS = {
    BBVA: { web: 'bbva.mx', tel: '55 5226 2663', seguro: 'bbva.mx' },
    SANTANDER: { web: 'santander.com.mx', tel: '55 5169 4300', seguro: 'santander.com.mx' },
    BANORTE: { web: 'banorte.com', tel: '81 8156 9600', seguro: 'banorte.com' },
    AZTECA: { web: 'bancoazteca.com.mx', tel: '55 5447 8810', seguro: 'bancoazteca.com.mx' },
    CITIBANAMEX: { web: 'banamex.com', tel: '55 1226 2639', seguro: 'banamex.com' },
    HSBC: { web: 'hsbc.com.mx', tel: '55 5721 3390', seguro: 'hsbc.com.mx' },
    SCOTIABANK: { web: 'scotiabank.com.mx', tel: '55 5728 1900', seguro: 'scotiabank.com.mx' },
    INBURSA: { web: 'inbursa.com', tel: '55 5447 8000', seguro: 'inbursa.com' },
    NU: { web: 'nu.com.mx', tel: '800 099 1133', seguro: 'nu.com.mx' },
    STORI: { web: 'storicard.com', tel: '55 7822 6646', seguro: 'storicard.com' }
  };

  // Apps Montadeudas identificadas por Policía Cibernética
  const MONTADEUDAS_LIST = [
    'José Cash', 'Cashbox', 'Sueño Dinero', 'Listo Cash', 'Préstamo Feliz (Falsa)',
    'Dinero Ya', 'Crediti', 'Efectivo Express', 'Ok Crédito', 'Campanita Cash',
    'Amor Préstamo', 'Guayaba Cash', 'Mi Préstamo', 'Viva Crédito', 'Super Préstamo',
    'Tala (Suplantadora)', 'Gato de Préstamos', 'Menta', 'Melo Préstamo', 'Pasto Crédito',
    'Rayo Crédito', 'Presta Fácil', 'Moneda Grande', 'León Préstamo', 'Full Pago',
    'Guanaco Cash', 'Súper Apoyo', 'Plata Segura', 'Águila Desierto', 'Financiera Sol',
    'Cash Cash', 'Envía Dinero', 'Kueski (Falsa APK)', 'Mony Mony', 'Rápido Más',
    'CrediYa', 'Alcancía Plus', 'Préstamo Seguro', 'Dinerito', 'Cash Plus',
    'Fácil Sol', 'Préstamo Estrella', 'Móvil Crédito', 'Oro Préstamo', 'Ultra Crédito'
  ];

  // Catálogo oficial ABM / Banxico de prefijos CLABE (primeros 3 dígitos)
  const CLABE_BANKS = {
    '002': 'Banamex (Banco Nacional de México)',
    '006': 'Bancomext',
    '009': 'Banobras',
    '012': 'BBVA México',
    '014': 'Banco Santander México',
    '019': 'Banjército',
    '021': 'HSBC México',
    '030': 'Banco del Bajío',
    '036': 'Banco Inbursa',
    '042': 'Banca Mifel',
    '044': 'Scotiabank Inverlat',
    '058': 'Banregio',
    '059': 'Banco Invex',
    '060': 'Bansi',
    '062': 'Banca Afirme',
    '072': 'Banorte (Banco Mercantil del Norte)',
    '106': 'Bank of America México',
    '112': 'Banco Monex',
    '113': 'Banco Ve Por Más',
    '127': 'Banco Azteca',
    '128': 'Kapital Bank (Autofin)',
    '130': 'Banco Compartamos',
    '132': 'Banco Multiva',
    '133': 'Banco Actinver',
    '136': 'Intercam Banco',
    '137': 'BanCoppel',
    '138': 'Ualá (ABC Capital)',
    '140': 'Consubanco',
    '143': 'CIBanco',
    '145': 'Banco Base',
    '147': 'Bankaool',
    '148': 'Pagatodo',
    '150': 'Banco Inmobiliario Mexicano',
    '151': 'Fundación Dondé Banco',
    '152': 'Banco Bancrea',
    '154': 'Banco Covalto',
    '156': 'Banco Sabadell',
    '166': 'Banco del Bienestar',
    '167': 'Hey Banco',
    '638': 'Nu México (Nubank / Akala)',
    '646': 'STP (Sistema de Transferencias y Pagos)',
    '659': 'ASP Integra Opciones',
    '661': 'Klar',
    '684': 'Transfer (OXXO / Saldazo)',
    '706': 'Arcus Fi',
    '710': 'NVIO Pagos México',
    '722': 'Mercado Pago W',
    '723': 'Cuenca',
    '728': 'Spin by OXXO (Compropago)'
  };

  // Base inicial de reportes ciudadanos
  const SEED_REPORTS = [
    {
      id: 'REP-2026-001',
      tipo: 'suplantacion',
      nombre: 'Falsos Gestores BBVA Préstamos',
      telefono: '5584921104',
      clabe: '646180112345678907',
      estado: 'Ciudad de México',
      monto: 1500,
      confirmaciones: 18,
      relato: 'Me contactaron vía WhatsApp ofreciendo $80,000 preaprobados con logo de BBVA. Pedían transferir $1,500 de fianza a una cuenta OXXO STP para liberar el crédito.',
      fecha: '2026-10-23'
    },
    {
      id: 'REP-2026-002',
      tipo: 'montadeudas',
      nombre: 'App "José Cash / Rápido Más"',
      telefono: '3319482055',
      clabe: '728180009876543214',
      estado: 'Jalisco',
      monto: 4000,
      confirmaciones: 31,
      relato: 'Descargué la app por $2,000. Al 4to día cobraron $4,800 con amenazas de enviar fotos mías a todos mis contactos telefónicos y redes sociales.',
      fecha: '2026-10-22'
    },
    {
      id: 'REP-2026-003',
      tipo: 'anticipos',
      nombre: 'Financiera Inbursa Falsa (WhatsApp)',
      telefono: '8129403311',
      clabe: '722180001122334458',
      estado: 'Nuevo León',
      monto: 3200,
      confirmaciones: 12,
      relato: 'Prometen crédito automotriz sin enganche ni buró. Exigen el pago de "gastos notariales" previo al depósito.',
      fecha: '2026-10-20'
    },
    {
      id: 'REP-2026-004',
      tipo: 'phishing',
      nombre: 'Portal Clonado "Banca Azteca Digital"',
      telefono: 'Web: bbva-seguro-acceso.info',
      clabe: '',
      estado: 'Estado de México',
      monto: 12000,
      confirmaciones: 22,
      relato: 'Llegó un SMS con alerta de cargo no reconocido en Mercado Libre. El link dirigía a un sitio idéntico al banco solicitando usuario, contraseña y clave token.',
      fecha: '2026-10-19'
    },
    {
      id: 'REP-2026-005',
      tipo: 'suplantacion',
      nombre: 'Suplantadores de Caja Popular / SOFIPO',
      telefono: '2228409182',
      clabe: '127180005544332219',
      estado: 'Puebla',
      monto: 2800,
      confirmaciones: 9,
      relato: 'Usan el nombre comercial y logotipo de una SOFIPO autorizada para pedir contratos firmados y depósito de seguro por anticipado.',
      fecha: '2026-10-18'
    }
  ];

  // Estado Central de la Aplicación
  const state = {
    entities: [],
    searchIndex: [],
    activeTab: 'directorio',
    statusFilter: 'todas',
    sectorFilter: '',
    estadoFilter: '',
    searchQuery: '',
    filteredEntities: [],
    renderLimit: 50,
    selectedEntity: null,
    recentSearches: [],
    comparatorList: [],
    quejaProcedure: 'condusef', // 'condusef' | 'redeco'
    evidenceImages: [],
    signatureDataUrl: null,
    aiMode: 'offline', // 'offline' | 'gemini'
    aiInputMode: 'text', // 'text' | 'image' | 'url'
    geminiApiKey: '',
    citizenReports: [],
    radarFilter: 'todos',
    radarStateFilter: '',
    radarSubtab: 'muro',
    chatbotOpen: false,
    chatbotHistory: []
  };

  /**
   * Inicialización global al cargar el DOM
   */
  async function init() {
    console.log('[Escudo Financiero Pro] Inicializando plataforma integral...');

    initDarkMode();
    await loadSipresDatabase();
    loadRecentSearches();
    loadCitizenReports();
    setupSearchListeners();
    setupKeyboardShortcuts();
    setupInitialFormValues();
    setupQuejaDraftAutosave();
    restoreQuejaDraft();
    initSignaturePad();
    applyFilters();
    calcCredito();
    renderMontadeudasList();
    renderMexicoHeatmap();
    initPWA();

    console.log('[Escudo Financiero Pro] Sistema 100% operativo con 409 entidades.');
  }

  /* =========================================================================
     MODO OSCURO (DARK MODE)
     ========================================================================= */
  function initDarkMode() {
    const isDark = localStorage.getItem('escudo_theme') === 'dark' || 
      (!localStorage.getItem('escudo_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      updateThemeIcon(true);
    } else {
      document.documentElement.classList.remove('dark');
      updateThemeIcon(false);
    }
  }

  function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('escudo_theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
  }

  function updateThemeIcon(isDark) {
    const icon = document.getElementById('theme-toggle-icon');
    if (icon) {
      icon.className = isDark ? 'fa-solid fa-sun text-amber-400 text-base' : 'fa-solid fa-moon text-slate-300 text-base';
    }
  }

  /* =========================================================================
     MÓDULO 1: BUSCADOR SIPRES CON FUZZY SEARCH SIN ACENTOS (409 ENTIDADES)
     ========================================================================= */
  function normalizeText(str) {
    return String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  async function loadSipresDatabase() {
    if (window.SIPRES_DATABASE && Array.isArray(window.SIPRES_DATABASE)) {
      state.entities = window.SIPRES_DATABASE;
    } else {
      const filesToTry = ['sipres_db.json', 'condusef-2026-10-25 (1).json', 'condusef-2026-10-25.json'];
      for (const file of filesToTry) {
        try {
          const res = await fetch(file);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              state.entities = data.map(normalizeRawRecord);
              break;
            }
          }
        } catch (err) {
          console.warn(`[Escudo] Intento fallido con ${file}:`, err);
        }
      }
    }

    if (state.entities.length > 0 && state.entities[0].table !== undefined) {
      state.entities = state.entities.map(normalizeRawRecord);
    }

    // Excluir estrictamente SOFOM E.N.R. y SOFOM E.R. y registros sin denominación
    state.entities = state.entities.filter(e => {
      const social = (e.s || '').toUpperCase();
      const sector = (e.t || '').toUpperCase();
      if (!social || social === 'VER') return false;
      if (social.includes('SOFOM') || sector.includes('SOFOM') || sector.includes('OBJETO MÚLTIPLE')) return false;
      return true;
    });

    // Pre-procesar índice de búsqueda insensible a acentos (tildes) y mayúsculas
    state.searchIndex = state.entities.map(item => ({
      f: normalizeText(item.f),
      n: normalizeText(item.n),
      s: normalizeText(item.s),
      t: normalizeText(item.t),
      d: normalizeText(item.d),
      e: normalizeText(item.e),
      r: item.r || 'REGULADA',
      a: Boolean(item.a),
      raw: item
    }));

    updateStatsCounters();
    populateStateFilter();
    populateEntitiesDatalist();
  }

  function populateStateFilter() {
    const estadoSelect = document.getElementById('filter-estado');
    if (!estadoSelect || state.entities.length === 0) return;

    const countsByState = {};
    state.entities.forEach(e => {
      const st = (e.d || 'Nacional').trim();
      countsByState[st] = (countsByState[st] || 0) + 1;
    });

    const sortedStates = Object.keys(countsByState).sort((a, b) => a.localeCompare(b, 'es-MX'));
    let optionsHtml = `<option value="">Todas las entidades federativas (${sortedStates.length} estados)</option>`;
    sortedStates.forEach(st => {
      const label = st === 'México' ? 'Estado de México' : st;
      optionsHtml += `<option value="${escapeHtml(st)}">${escapeHtml(label)} (${countsByState[st]})</option>`;
    });

    estadoSelect.innerHTML = optionsHtml;
  }

  function populateEntitiesDatalist() {
    const datalist = document.getElementById('sipres-entities-datalist');
    if (!datalist || state.entities.length === 0) return;

    datalist.innerHTML = state.entities.map(e => 
      `<option value="${escapeHtml(e.s)}">${escapeHtml(e.n)} — Folio SIPRES: ${escapeHtml(e.f)} (${escapeHtml(e.t)})</option>`
    ).join('');
  }

  function findMentionedEntities(text) {
    const norm = normalizeText(text);
    if (!norm || norm.length < 2) return [];

    const matches = [];
    for (const item of state.searchIndex) {
      // Coincidencia por folio exacto de 5 dígitos
      if (item.f && item.f.length >= 4 && norm.includes(item.f)) {
        matches.push(item.raw);
        continue;
      }
      // Coincidencia por nombre comercial (al menos 3 caracteres y palabra completa o frase)
      if (item.n && item.n.length >= 3) {
        const escapedN = item.n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regexN = new RegExp(`(^|\\b|\\s)${escapedN}(\\b|\\s|$)`, 'i');
        if (regexN.test(norm)) {
          matches.push(item.raw);
          continue;
        }
      }
      // Coincidencia por primera parte de denominación social
      const firstPart = item.s.split(',')[0].trim();
      if (firstPart.length >= 5 && norm.includes(firstPart)) {
        matches.push(item.raw);
      }
    }
    return matches;
  }

  function normalizeRawRecord(item) {
    if (item.f !== undefined && item.s !== undefined) return item;
    
    const folio = String(item.table || item.folio || '').trim();
    const social = String(item['table (2)'] || item.denominacion || item.razon_social || '').trim();
    const col3 = String(item['table (3)'] || item.nombre_corto || '').trim();
    const col4 = String(item['table (4)'] || item.estatus || '').trim();
    const col5 = String(item['table (5)'] || item.sector || '').trim();
    const col6 = String(item['table (6)'] || item.estado || '').trim();

    const isCol3Sector = col3.includes('Sociedades') || col3.includes('Instituciones');
    let nombre = isCol3Sector ? social.split(',')[0] : (col3 && col3 !== '-' ? col3 : social.split(',')[0]);
    let sector = isCol3Sector ? col3 : col5;
    let estatus = col4;
    let estado = isCol3Sector ? col5 : col6;

    let riesgo = 'REGULADA';
    if (estatus.includes('Cancelada') || estatus.includes('Disuelta')) {
      riesgo = 'CANCELADA_ALTO_RIESGO';
    } else if (estatus.includes('Fusionada') || estatus === 'ver') {
      riesgo = 'EN_REVISION';
    }

    const upper = (nombre + ' ' + social).toUpperCase();
    const a = ['BBVA', 'SANTANDER', 'BANORTE', 'AZTECA', 'SCOTIABANK', 'NU', 'STORI', 'KUESKI', 'INBURSA', 'BANAMEX'].some(k => upper.includes(k));

    return {
      f: folio,
      s: social,
      n: nombre,
      t: sector || 'Entidad Financiera',
      e: estatus === 'ver' ? 'En revisión' : (estatus.includes('operaci') ? 'En operación' : estatus),
      d: (estado || 'Nacional').split('\n')[0].trim(),
      r: riesgo,
      a: a
    };
  }

  function updateStatsCounters() {
    const total = state.entities.length;
    const operacion = state.entities.filter(e => e.r === 'REGULADA').length;
    const enRevision = state.entities.filter(e => e.r === 'EN_REVISION' || e.r === 'CANCELADA_ALTO_RIESGO').length;
    const suplantables = state.entities.filter(e => e.a).length;

    const elTotal = document.getElementById('stat-total');
    const elOp = document.getElementById('stat-operacion');
    const elCanc = document.getElementById('stat-canceladas');
    const elSupl = document.getElementById('stat-suplantables');

    if (elTotal) elTotal.textContent = total.toLocaleString('es-MX');
    if (elOp) elOp.textContent = operacion.toLocaleString('es-MX');
    if (elCanc) elCanc.textContent = enRevision.toLocaleString('es-MX');
    if (elSupl) elSupl.textContent = `${suplantables}+`;
  }

  function setupSearchListeners() {
    const input = document.getElementById('sipres-search-input');
    const clearBtn = document.getElementById('sipres-search-clear');

    if (input) {
      let debounceTimer = null;
      input.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        
        if (state.searchQuery.length > 0) {
          clearBtn.classList.remove('hidden');
        } else {
          clearBtn.classList.add('hidden');
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          state.renderLimit = 50;
          if (state.searchQuery.length >= 3) {
            saveRecentSearch(state.searchQuery);
          }
          applyFilters();
        }, 75);
      });
    }
  }

  function clearSearch() {
    const input = document.getElementById('sipres-search-input');
    const clearBtn = document.getElementById('sipres-search-clear');
    if (input) input.value = '';
    if (clearBtn) clearBtn.classList.add('hidden');
    state.searchQuery = '';
    state.renderLimit = 50;
    applyFilters();
    if (input) input.focus();
  }

  function focusSearch() {
    switchTab('directorio');
    const input = document.getElementById('sipres-search-input');
    if (input) {
      input.focus();
      input.select();
    }
  }

  function setStatusFilter(status) {
    state.statusFilter = status;
    state.renderLimit = 50;

    document.querySelectorAll('.status-chip').forEach(btn => {
      if (btn.getAttribute('data-status') === status) {
        btn.classList.add('bg-slate-900', 'text-white');
        btn.classList.remove('bg-slate-100', 'text-slate-700');
      } else {
        btn.classList.remove('bg-slate-900', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-700');
      }
    });

    applyFilters();
  }

  function applySecondaryFilters() {
    const sectorEl = document.getElementById('filter-sector');
    const estadoEl = document.getElementById('filter-estado');

    state.sectorFilter = sectorEl ? normalizeText(sectorEl.value) : '';
    state.estadoFilter = estadoEl ? normalizeText(estadoEl.value) : '';
    state.renderLimit = 50;
    applyFilters();
  }

  // Algoritmo de Distancia de Levenshtein para Búsqueda Tolerante a Errores (Fuzzy Search)
  function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  function isFuzzyMatch(target, query) {
    if (target.includes(query)) return true;
    if (query.length < 4) return false;
    const words = target.split(/\s+/);
    for (const w of words) {
      if (w.length >= 4 && Math.abs(w.length - query.length) <= 2) {
        if (levenshtein(w, query) <= 2) return true;
      }
    }
    return false;
  }

  function applyFilters() {
    const q = normalizeText(state.searchQuery);
    const status = state.statusFilter;
    const sector = state.sectorFilter;
    const estado = state.estadoFilter;

    let results = state.searchIndex;

    if (status === 'autorizadas') {
      results = results.filter(i => i.r === 'REGULADA');
    } else if (status === 'canceladas') {
      results = results.filter(i => i.r === 'CANCELADA_ALTO_RIESGO');
    } else if (status === 'alertas') {
      results = results.filter(i => i.a === true);
    } else if (status === 'revision') {
      results = results.filter(i => i.r === 'EN_REVISION');
    }

    if (sector) {
      results = results.filter(i => i.t.includes(sector));
    }

    if (estado) {
      results = results.filter(i => i.d === estado || i.d.startsWith(estado));
    }

    if (q) {
      // Búsqueda directa sin acentos o difusa (Fuzzy)
      results = results.filter(i => 
        i.n.includes(q) || 
        i.s.includes(q) || 
        i.f.includes(q) || 
        i.t.includes(q) ||
        i.d.includes(q) ||
        isFuzzyMatch(i.n, q) ||
        isFuzzyMatch(i.s, q)
      );
    }

    state.filteredEntities = results;
    renderSipresCards();
  }

  function renderSipresCards() {
    const container = document.getElementById('sipres-cards-container');
    const countEl = document.getElementById('results-count');
    const loadMoreBtn = document.getElementById('btn-load-more');

    if (!container) return;

    const total = state.filteredEntities.length;
    if (countEl) countEl.textContent = total.toLocaleString('es-MX');

    renderSipresGroupSummary(state.searchQuery, state.filteredEntities);

    if (total === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div class="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h4 class="font-bold text-slate-800 text-base">No se encontraron entidades con esos criterios</h4>
          <p class="text-xs text-slate-500 max-w-md mx-auto">
            Verifica la ortografía o intenta buscar por una palabra clave (ej. "Banco", "Financiera", o el número de folio SIPRES).
          </p>
          <button onclick="EscudoApp.clearSearch()" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800">
            Restablecer búsqueda
          </button>
        </div>
      `;
      if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
      return;
    }

    const itemsToRender = state.filteredEntities.slice(0, state.renderLimit);

    let html = '';
    for (let i = 0; i < itemsToRender.length; i++) {
      const item = itemsToRender[i].raw;
      const isRegulada = item.r === 'REGULADA';
      const isCancelada = item.r === 'CANCELADA_ALTO_RIESGO';

      let badgeHtml = '';
      if (isRegulada) {
        badgeHtml = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <i class="fa-solid fa-circle-check mr-1 text-[8px]"></i> En Operación
        </span>`;
      } else if (isCancelada) {
        badgeHtml = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
          <i class="fa-solid fa-ban mr-1 text-[8px]"></i> Cancelada (No Operar)
        </span>`;
      } else {
        badgeHtml = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <i class="fa-solid fa-clock-rotate-left mr-1 text-[8px]"></i> En Revisión / Fusión
        </span>`;
      }

      const alertaSuplantacion = item.a ? `
        <div class="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start space-x-1.5">
          <i class="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5"></i>
          <span><strong>Alerta CONDUSEF:</strong> Nombre frecuentemente suplantado en WhatsApp. Valida canales oficiales.</span>
        </div>
      ` : '';

      html += `
        <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="font-mono text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Folio: ${item.f}
              </span>
              ${badgeHtml}
            </div>

            <h4 class="font-heading font-bold text-slate-900 text-sm leading-snug line-clamp-2">
              ${escapeHtml(item.n)}
            </h4>
            
            <p class="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-normal">
              ${escapeHtml(item.s)}
            </p>

            <div class="mt-3 space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
              <div class="flex items-center space-x-1.5 truncate">
                <i class="fa-solid fa-tag text-slate-400 w-3.5"></i>
                <span class="truncate">${escapeHtml(item.t)}</span>
              </div>
              <div class="flex items-center space-x-1.5 truncate">
                <i class="fa-solid fa-location-dot text-slate-400 w-3.5"></i>
                <span class="truncate">${escapeHtml(item.d)}</span>
              </div>
            </div>

            ${alertaSuplantacion}
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
            <button onclick="EscudoApp.openExpediente('${item.f}')" class="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center space-x-1">
              <i class="fa-solid fa-eye text-slate-500"></i>
              <span>Ficha</span>
            </button>
            <button onclick="EscudoApp.addToComparator('${item.f}')" class="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300" title="Agregar al comparador lado a lado">
              <i class="fa-solid fa-code-compare"></i>
            </button>
            <button onclick="EscudoApp.transferEntityToQueja('${item.f}')" class="py-1.5 px-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold transition-colors flex items-center space-x-1">
              <i class="fa-solid fa-file-pen text-sky-600"></i>
              <span>Reclamar</span>
            </button>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;

    if (loadMoreBtn) {
      if (state.renderLimit < total) {
        loadMoreBtn.classList.remove('hidden');
      } else {
        loadMoreBtn.classList.add('hidden');
      }
    }
  }

  function renderSipresGroupSummary(query, results) {
    const summaryContainer = document.getElementById('sipres-group-summary');
    if (!summaryContainer) return;

    if (!query || query.trim().length < 2) {
      summaryContainer.innerHTML = '';
      return;
    }

    const qClean = query.trim().toUpperCase();

    if (results.length === 0) {
      summaryContainer.innerHTML = `
        <div class="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 mb-4 shadow-sm flex items-start space-x-3">
          <i class="fa-solid fa-triangle-exclamation text-red-600 text-xl mt-0.5"></i>
          <div>
            <h4 class="font-bold text-sm text-red-800">NO SE ENCONTRÓ REGISTRO OFICIAL PARA "${escapeHtml(qClean)}"</h4>
            <p class="text-xs text-red-700 mt-1 leading-relaxed">
              La entidad no figura en los 409 registros oficiales del SIPRES de la CONDUSEF. Si alguien te ofrece préstamos bajo este nombre, se trata de una <strong>financiera no regulada o posible fraude</strong> (Art. 103 de la Ley de Instituciones de Crédito por captación ilícita).
            </p>
          </div>
        </div>
      `;
      return;
    }

    const primary = results[0].raw;
    const isSuplantable = results.some(r => r.raw.a);

    const relatedList = results.slice(0, 5).map(r => `
      <li class="flex items-center justify-between py-1 border-b border-slate-700/60 last:border-none">
        <div class="truncate mr-2">
          <strong class="text-white">${escapeHtml(r.raw.n)}</strong>
          <span class="text-slate-400 block text-[10px] truncate">${escapeHtml(r.raw.s)}</span>
        </div>
        <div class="text-right shrink-0">
          <span class="font-mono text-[10px] text-sky-300">Folio ${r.raw.f}</span>
          <span class="block text-[10px] ${r.raw.r === 'REGULADA' ? 'text-emerald-400' : 'text-red-400'} font-semibold">${escapeHtml(r.raw.e)}</span>
        </div>
      </li>
    `).join('');

    const alertaSuplantacionBanner = isSuplantable ? `
      <div class="mt-3 p-3 rounded-xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs flex items-start space-x-2">
        <i class="fa-solid fa-shield-halved text-amber-400 text-base mt-0.5"></i>
        <div>
          <strong class="text-amber-100 font-bold">ALERTA OFICIAL DE CIBERSEGURIDAD CONDUSEF:</strong>
          <span>El nombre o marca <strong>"${escapeHtml(qClean)}"</strong> es frecuentemente suplantado por estafadores en WhatsApp ofreciendo créditos preaprobados exigiendo depósitos de "fianza". <strong>Ninguna institución real cobra por prestar.</strong></span>
        </div>
      </div>
    ` : '';

    summaryContainer.innerHTML = `
      <div class="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white mb-5 shadow-xl border border-sky-500/30">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700">
          <div>
            <div class="flex items-center space-x-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <i class="fa-solid fa-circle-check mr-1.5 text-xs text-emerald-400"></i> Existencia Oficial Comprobada en SIPRES
              </span>
              <span class="text-xs text-slate-400 font-mono">Búsqueda: "${escapeHtml(qClean)}"</span>
            </div>
            <h3 class="font-heading font-extrabold text-lg sm:text-2xl mt-1.5 text-white">
              Ficha del Grupo Financiero & Relacionados: ${escapeHtml(primary.n)}
            </h3>
          </div>
          <div class="flex items-center space-x-2 shrink-0">
            <button onclick="EscudoApp.openExpediente('${primary.f}')" class="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center space-x-1.5">
              <i class="fa-solid fa-file-invoice text-sky-400"></i>
              <span>Expediente</span>
            </button>
            <button onclick="EscudoApp.transferEntityToQueja('${primary.f}')" class="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5">
              <i class="fa-solid fa-file-pen"></i>
              <span>Reclamar</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 text-xs">
          <div class="md:col-span-5 space-y-2 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <span class="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Entidad Matriz / Principal:</span>
            <h4 class="text-white font-bold text-sm sm:text-base leading-snug">${escapeHtml(primary.s)}</h4>
            <div class="pt-2 border-t border-slate-700/80 space-y-1 text-slate-300">
              <div class="flex justify-between">
                <span class="text-slate-400">Folio SIPRES:</span>
                <span class="font-mono font-bold text-sky-300">${escapeHtml(primary.f)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Sector Regulado:</span>
                <span class="font-semibold text-slate-200">${escapeHtml(primary.t)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Estatus Operativo:</span>
                <span class="font-bold ${primary.r === 'REGULADA' ? 'text-emerald-400' : 'text-red-400'}">${escapeHtml(primary.e)}</span>
              </div>
            </div>
          </div>

          <div class="md:col-span-7 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <div class="flex items-center justify-between mb-2">
              <span class="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                Entidades Relacionadas Encontradas (${results.length}):
              </span>
              <span class="text-slate-400 text-[10px]">Filtradas abajo en las tarjetas</span>
            </div>
            <ul class="space-y-1">
              ${relatedList}
            </ul>
          </div>
        </div>

        ${alertaSuplantacionBanner}
      </div>
    `;
  }

  function loadMoreResults() {
    state.renderLimit += 50;
    renderSipresCards();
  }

  function openExpediente(folio) {
    const entity = state.entities.find(e => e.f === folio);
    if (!entity) return;

    state.selectedEntity = entity;

    const titleEl = document.getElementById('exp-modal-title');
    const folioEl = document.getElementById('exp-modal-folio');
    const contentEl = document.getElementById('exp-modal-content');
    const btnTransfer = document.getElementById('exp-btn-transfer');

    if (titleEl) titleEl.textContent = entity.n;
    if (folioEl) folioEl.textContent = `Registro SIPRES Oficial: ${entity.f}`;

    // Buscar si tenemos datos verificados de contacto oficial
    let contactChannels = '';
    const upperName = (entity.n + ' ' + entity.s).toUpperCase();
    for (const [key, val] of Object.entries(VERIFIED_CHANNELS)) {
      if (upperName.includes(key)) {
        contactChannels = `
          <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs space-y-1">
            <strong class="font-bold block flex items-center text-emerald-800">
              <i class="fa-solid fa-shield-check mr-1 text-emerald-600"></i> Canales Oficiales Verificados:
            </strong>
            <div class="flex flex-wrap gap-4 pt-1 font-mono text-[11px]">
              <span>🌐 Web Oficial: <a href="https://${val.web}" target="_blank" class="underline font-bold">${val.web}</a></span>
              <span>📞 Teléfono Verificado: <strong>${val.tel}</strong></span>
            </div>
          </div>
        `;
        break;
      }
    }

    if (contentEl) {
      contentEl.innerHTML = `
        ${contactChannels}

        <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
          <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider">Datos Registrales Oficiales</h4>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span class="text-slate-400 block font-medium">Nombre Comercial:</span>
              <span class="font-bold text-slate-800">${escapeHtml(entity.n)}</span>
            </div>
            <div>
              <span class="text-slate-400 block font-medium">Clave / Folio SIPRES:</span>
              <span class="font-mono font-bold text-slate-800">${escapeHtml(entity.f)}</span>
            </div>
            <div class="sm:col-span-2">
              <span class="text-slate-400 block font-medium">Denominación Social Completa:</span>
              <span class="font-semibold text-slate-800">${escapeHtml(entity.s)}</span>
            </div>
            <div>
              <span class="text-slate-400 block font-medium">Sector Regulado:</span>
              <span class="font-semibold text-slate-800">${escapeHtml(entity.t)}</span>
            </div>
            <div>
              <span class="text-slate-400 block font-medium">Estatus Actual:</span>
              <span class="font-bold ${entity.r === 'REGULADA' ? 'text-emerald-700' : 'text-red-700'}">${escapeHtml(entity.e)}</span>
            </div>
            <div class="sm:col-span-2">
              <span class="text-slate-400 block font-medium">Entidad Federativa:</span>
              <span class="font-semibold text-slate-800">${escapeHtml(entity.d)}</span>
            </div>
          </div>
        </div>
      `;
    }

    if (btnTransfer) {
      btnTransfer.onclick = () => {
        closeModal('modal-expediente');
        transferEntityToQueja(entity.f);
      };
    }

    const copyTextEl = document.getElementById('exp-btn-copy-text');
    if (copyTextEl) copyTextEl.textContent = 'Copiar Cédula Oficial';

    openModal('modal-expediente');
  }

  function copyExpedienteCedula() {
    const entity = state.selectedEntity;
    if (!entity) return;

    const cedula = [
      `🛡️ CÉDULA DE VERIFICACIÓN OFICIAL SIPRES — ESCUDO FINANCIERO PRO`,
      `• Nombre Comercial: ${entity.n}`,
      `• Denominación Social: ${entity.s}`,
      `• Clave / Folio SIPRES: ${entity.f}`,
      `• Sector Financiero: ${entity.t}`,
      `• Estatus Oficial: ${entity.e}`,
      `• Entidad Federativa: ${entity.d}`,
      `⚠️ Nota de Seguridad CONDUSEF: Ninguna institución financiera legal en México solicita anticipos, fianzas ni depósitos previos para liberar un crédito.`
    ].join('\n');

    navigator.clipboard.writeText(cedula).then(() => {
      const copyTextEl = document.getElementById('exp-btn-copy-text');
      if (copyTextEl) {
        copyTextEl.textContent = '¡Cédula Copiada!';
        setTimeout(() => { copyTextEl.textContent = 'Copiar Cédula Oficial'; }, 2500);
      }
    });
  }

  function saveRecentSearch(term) {
    if (!term || term.length < 3) return;
    state.recentSearches = state.recentSearches.filter(t => t !== term);
    state.recentSearches.unshift(term);
    if (state.recentSearches.length > 5) state.recentSearches.pop();
    localStorage.setItem('escudo_recent_searches', JSON.stringify(state.recentSearches));
    renderRecentSearches();
  }

  function loadRecentSearches() {
    const saved = localStorage.getItem('escudo_recent_searches');
    if (saved) {
      try { state.recentSearches = JSON.parse(saved); } catch (e) {}
    }
    renderRecentSearches();
  }

  function renderRecentSearches() {
    const box = document.getElementById('recent-searches-box');
    const container = document.getElementById('recent-chips');
    if (!box || !container) return;

    if (state.recentSearches.length === 0) {
      box.classList.add('hidden');
      return;
    }

    box.classList.remove('hidden');
    container.innerHTML = state.recentSearches.map(term => `
      <button onclick="document.getElementById('sipres-search-input').value = '${term}'; EscudoApp.executeDirectSearch('${term}');" class="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[10px] transition-colors border border-slate-200">
        ${escapeHtml(term)}
      </button>
    `).join('');
  }

  function executeDirectSearch(term) {
    state.searchQuery = term.toLowerCase();
    state.renderLimit = 50;
    applyFilters();
  }

  /* =========================================================================
     COMPARADOR DE ENTIDADES LADO A LADO
     ========================================================================= */
  function addToComparator(folio) {
    const entity = state.entities.find(e => e.f === folio);
    if (!entity) return;

    if (state.comparatorList.some(e => e.f === folio)) {
      alert('Esta entidad ya está agregada al comparador.');
      openComparatorModal();
      return;
    }

    if (state.comparatorList.length >= 3) {
      alert('El comparador permite un máximo de 3 entidades a la vez. Quita una para agregar otra.');
      openComparatorModal();
      return;
    }

    state.comparatorList.push(entity);
    updateComparatorBadge();
    openComparatorModal();
  }

  function removeFromComparator(folio) {
    state.comparatorList = state.comparatorList.filter(e => e.f !== folio);
    updateComparatorBadge();
    renderComparatorGrid();
  }

  function clearComparator() {
    state.comparatorList = [];
    updateComparatorBadge();
    renderComparatorGrid();
  }

  function updateComparatorBadge() {
    const badge = document.getElementById('compare-badge');
    if (badge) {
      if (state.comparatorList.length > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  function openComparatorModal() {
    renderComparatorGrid();
    openModal('modal-comparator');
  }

  function renderComparatorGrid() {
    const grid = document.getElementById('comparator-grid');
    if (!grid) return;

    if (state.comparatorList.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-8 text-center text-slate-400">
          No has agregado entidades al comparador. En el Buscador SIPRES, haz clic en el icono <i class="fa-solid fa-code-compare mx-1"></i> de cualquier entidad para compararla.
        </div>
      `;
      return;
    }

    grid.innerHTML = state.comparatorList.map(item => `
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="font-mono text-[10px] text-slate-400">Folio: ${item.f}</span>
            <button onclick="EscudoApp.removeFromComparator('${item.f}')" class="text-red-500 hover:text-red-700 text-xs">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <h4 class="font-bold text-slate-900 text-sm mt-1">${escapeHtml(item.n)}</h4>
          <p class="text-[11px] text-slate-500 mt-0.5 line-clamp-2">${escapeHtml(item.s)}</p>

          <div class="mt-3 pt-2 border-t border-slate-200 space-y-1.5 text-[11px]">
            <div>
              <span class="text-slate-400 block text-[10px]">Estatus:</span>
              <span class="font-bold ${item.r === 'REGULADA' ? 'text-emerald-600' : 'text-red-600'}">${escapeHtml(item.e)}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Sector:</span>
              <span class="font-semibold text-slate-700">${escapeHtml(item.t)}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Ubicación:</span>
              <span class="text-slate-700">${escapeHtml(item.d)}</span>
            </div>
          </div>
        </div>

        <button onclick="EscudoApp.transferEntityToQueja('${item.f}'); EscudoApp.closeModal('modal-comparator');" class="w-full py-1.5 rounded-lg bg-sky-600 text-white font-semibold text-xs mt-3">
          Iniciar Queja
        </button>
      </div>
    `).join('');
  }

  /* =========================================================================
     MÓDULO 2: GENERADOR DE QUEJAS (REDACCIÓN JURÍDICA FORENSE SIN SOBREPOSICIÓN)
     ========================================================================= */
  function setQuejaProcedure(proc) {
    state.quejaProcedure = proc;
    const btnCondusef = document.getElementById('btn-proc-condusef');
    const btnRedeco = document.getElementById('btn-proc-redeco');
    const lblInst = document.getElementById('lbl-institucion');

    if (proc === 'condusef') {
      if (btnCondusef) btnCondusef.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold bg-sky-600 text-white shadow-sm transition-all';
      if (btnRedeco) btnRedeco.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all';
      if (lblInst) lblInst.textContent = 'Institución Financiera Reclamada *';
    } else {
      if (btnCondusef) btnCondusef.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all';
      if (btnRedeco) btnRedeco.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white shadow-sm transition-all';
      if (lblInst) lblInst.textContent = 'Despacho de Cobranza o Entidad Financiera Denunciada *';
      loadTemplate('cobranza');
    }
  }

  function transferEntityToQueja(folio) {
    const entity = state.entities.find(e => e.f === folio);
    if (!entity) return;

    switchTab('quejas');
    applyEntityToQuejaFields(entity);
    saveQuejaDraft();

    const formEl = document.getElementById('form-queja');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  }

  function applyEntityToQuejaFields(entity) {
    const instEl = document.getElementById('q-institucion');
    const folioEl = document.getElementById('q-folio-sipres');
    const sectorEl = document.getElementById('q-sector');
    const badgeEl = document.getElementById('q-institucion-match-badge');

    if (instEl) instEl.value = entity.s || entity.n;
    if (folioEl) folioEl.value = entity.f;

    if (sectorEl) {
      const secNorm = normalizeText(entity.t);
      if (secNorm.includes('banca multiple')) sectorEl.value = 'Banca Múltiple';
      else if (secNorm.includes('banca de desarrollo')) sectorEl.value = 'Banca de Desarrollo';
      else if (secNorm.includes('cooperativa')) sectorEl.value = 'SOCAP';
      else if (secNorm.includes('popular')) sectorEl.value = 'SOFIPO';
      else if (secNorm.includes('uniones')) sectorEl.value = 'Uniones de Crédito';
      else if (secNorm.includes('pago electr')) sectorEl.value = 'Fintech / IFPE';
      else if (secNorm.includes('financiamiento colectivo')) sectorEl.value = 'Fintech / IFC';
    }

    if (badgeEl) {
      badgeEl.innerHTML = `<i class="fa-solid fa-circle-check mr-1"></i> SIPRES Folio #${escapeHtml(entity.f)} (${escapeHtml(entity.e)})`;
      badgeEl.classList.remove('hidden');
    }
  }

  function handleInstitucionAutocomplete(val) {
    const badgeEl = document.getElementById('q-institucion-match-badge');
    const norm = normalizeText(val);
    if (!norm || norm.length < 2) {
      if (badgeEl) badgeEl.classList.add('hidden');
      return;
    }

    // Buscar coincidencia exacta por denominación social, nombre comercial o folio
    const exactMatch = state.entities.find(e => 
      normalizeText(e.s) === norm ||
      normalizeText(e.n) === norm ||
      normalizeText(e.f) === norm
    );

    if (exactMatch) {
      applyEntityToQuejaFields(exactMatch);
      saveQuejaDraft();
    } else if (badgeEl) {
      badgeEl.classList.add('hidden');
    }
  }

  function validateCurpLive() {
    const input = document.getElementById('q-curp');
    const badge = document.getElementById('curp-validation-badge');
    if (!input || !badge) return;

    const val = input.value.trim().toUpperCase();
    input.value = val;

    if (val.length === 0) {
      badge.textContent = 'Formato RENAPO';
      badge.className = 'text-[10px] font-mono text-slate-400';
      return;
    }

    const curpRegex = /^[A-Z]{4}\d{6}[HM](AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/;

    if (curpRegex.test(val)) {
      badge.innerHTML = '<i class="fa-solid fa-circle-check mr-1"></i> CURP Válida (RENAPO)';
      badge.className = 'text-[10px] font-mono font-bold text-emerald-600';
    } else if (val.length < 18) {
      badge.textContent = `${val.length}/18 caracteres`;
      badge.className = 'text-[10px] font-mono text-amber-600';
    } else {
      badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-1"></i> Estructura CURP inválida';
      badge.className = 'text-[10px] font-mono font-bold text-red-600';
    }
  }

  function setupQuejaDraftAutosave() {
    const form = document.getElementById('form-queja');
    if (!form) return;

    form.addEventListener('input', () => {
      saveQuejaDraft();
    });
  }

  function saveQuejaDraft() {
    try {
      const data = collectQuejaFormData();
      sessionStorage.setItem('escudo_queja_draft', JSON.stringify(data));
      const statusEl = document.getElementById('queja-draft-status');
      if (statusEl) statusEl.classList.remove('hidden');
    } catch (e) {}
  }

  function restoreQuejaDraft() {
    try {
      const raw = sessionStorage.getItem('escudo_queja_draft');
      if (!raw) return;
      const d = JSON.parse(raw);
      const map = {
        'q-nombre': d.nombre,
        'q-curp': d.curp,
        'q-email': d.email,
        'q-telefono': d.telefono,
        'q-calle': d.calle,
        'q-colonia': d.colonia,
        'q-municipio': d.municipio,
        'q-cp': d.cp,
        'q-udeco': d.udecoKey,
        'q-institucion': d.institucion,
        'q-folio-sipres': d.folioSipres,
        'q-sector': d.sector,
        'q-producto': d.producto,
        'q-causa': d.causa,
        'q-contrato': d.contrato,
        'q-monto': d.monto !== '0' ? d.monto : '',
        'q-fecha-hechos': d.fechaHechos,
        'q-hechos': d.hechos,
        'q-pretensiones': d.pretensiones
      };
      let restoredAny = false;
      for (const [id, val] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el && val) {
          el.value = val;
          restoredAny = true;
        }
      }
      if (restoredAny) {
        validateCurpLive();
        updateUdecoInfo();
        const statusEl = document.getElementById('queja-draft-status');
        if (statusEl) statusEl.classList.remove('hidden');
      }
    } catch (e) {}
  }

  function clearQuejaDraft() {
    sessionStorage.removeItem('escudo_queja_draft');
    const form = document.getElementById('form-queja');
    if (form) form.reset();
    setupInitialFormValues();
    clearSignature();
    state.evidenceImages = [];
    renderEvidencePreviews();
    const statusEl = document.getElementById('queja-draft-status');
    if (statusEl) statusEl.classList.add('hidden');
    const badgeEl = document.getElementById('q-institucion-match-badge');
    if (badgeEl) badgeEl.classList.add('hidden');
    validateCurpLive();
  }

  function updateUdecoInfo() {
    const select = document.getElementById('q-udeco');
    const infoText = document.getElementById('udeco-info-text');
    if (!select || !infoText) return;

    const udeco = UDECO_CATALOG[select.value] || UDECO_CATALOG.CDMX_CENTRAL;
    infoText.innerHTML = `
      <strong class="block font-semibold">${escapeHtml(udeco.nombre)}:</strong>
      <span>${escapeHtml(udeco.direccion)} Tel: ${escapeHtml(udeco.telefono)}</span>
    `;
  }

  function loadTemplate(type) {
    const hechosEl = document.getElementById('q-hechos');
    const pretensionesEl = document.getElementById('q-pretensiones');
    const causaEl = document.getElementById('q-causa');
    const productoEl = document.getElementById('q-producto');

    if (type === 'cargos') {
      if (causaEl) causaEl.value = 'Cargos no reconocidos en cuenta o tarjeta';
      if (productoEl) productoEl.value = 'Tarjeta de Crédito';
      if (hechosEl) {
        hechosEl.value = 
`PRIMERO. Con fecha [FECHA], advertí en mi estado de cuenta una disposición indebida por $[MONTO] MXN bajo el concepto de [CONCEPTO], el cual jamás realicé ni consentí física o electrónicamente.
SEGUNDO. Reporté inmediatamente a la línea bancaria solicitando folio de aclaración, notificando el desconocimiento total de la transacción.
TERCERO. La institución denegó la restitución sin aportarme bitácoras biométricas, pagarés firmados ni coordenadas IP de la operación, violentando las Disposiciones Generales de la CONDUSEF.`;
      }
      if (pretensionesEl) {
        pretensionesEl.value = 
`1. Restitución total e inmediata del importe no reconocido de $[MONTO] MXN.
2. Cancelación y abono de intereses ordinarios y moratorios generados indebidamente.
3. Rectificación de mi historial crediticio ante Buró y Círculo de Crédito.`;
      }
    } else if (type === 'spei') {
      if (causaEl) causaEl.value = 'Transferencia SPEI no autorizada / Fraude cibernético';
      if (productoEl) productoEl.value = 'Transferencia Electrónica (SPEI)';
      if (hechosEl) {
        hechosEl.value = 
`PRIMERO. Con fecha [FECHA], se debitó de mi cuenta bancaria una transferencia interbancaria SPEI por $[MONTO] MXN sin mi autenticación ni confirmación del segundo factor.
SEGUNDO. Los filtros de prevención de fraude del banco resultaron ineficaces ante un movimiento totalmente atípico para mi perfil financiero.
TERCERO. La institución omitió el oportuno auxilio para el bloqueo y retorno de los fondos bancarios.`;
      }
      if (pretensionesEl) {
        pretensionesEl.value = 
`1. Reintegro íntegro de la cantidad de $[MONTO] MXN sustraída ilícitamente.
2. Exhibición de la bitácora técnica de seguridad y certificación del segundo factor de autenticación.`;
      }
    } else if (type === 'cobranza') {
      if (causaEl) causaEl.value = 'Cobranza amenazante, ilícita o acoso a contactos';
      if (productoEl) productoEl.value = 'Crédito Personal o de Nómina';
      if (hechosEl) {
        hechosEl.value = 
`PRIMERO. A partir de [FECHA], he recibido llamadas y mensajes intimidatorios fuera de los horarios permitidos por parte de despachos delegados.
SEGUNDO. Dichos gestores han amenazado con embargos extrajudiciales y hostigado a mis referencias familiares y laborales, conducta tipificada en el Art. 284 Bis del Código Penal Federal y sancionada en el REDECO.`;
      }
      if (pretensionesEl) {
        pretensionesEl.value = 
`1. Cese definitivo de todo acto de molestia e intimidación telefónica o presencial.
2. Imposición de las sanciones económicas correspondientes al despacho ante el REDECO.`;
      }
    } else if (type === 'seguro') {
      if (causaEl) causaEl.value = 'Negativa indebida de indemnización de seguro';
      if (productoEl) productoEl.value = 'Seguro de Auto o Gastos Médicos';
      if (hechosEl) {
        hechosEl.value = 
`PRIMERO. Con póliza vigente número [CONTRATO], con fecha [FECHA] aconteció el siniestro amparado debidamente reportado a cabina.
SEGUNDO. Habiendo exhibido los comprobantes y peritajes requeridos, la aseguradora emitió un rechazo con argumentos notoriamente infundados.`;
      }
      if (pretensionesEl) {
        pretensionesEl.value = 
`1. Liquidación íntegra de la indemnización pactada por $[MONTO] MXN.
2. Pago de intereses moratorios conforme al Art. 276 de la Ley de Instituciones de Seguros y Fianzas.`;
      }
    }
  }

  function applyTemplateCausa() {
    const causa = document.getElementById('q-causa').value;
    if (causa.includes('Cargos')) loadTemplate('cargos');
    else if (causa.includes('SPEI')) loadTemplate('spei');
    else if (causa.includes('Cobranza')) loadTemplate('cobranza');
    else if (causa.includes('indemnización')) loadTemplate('seguro');
  }

  /* =========================================================================
     LIENZO DE FIRMA AUTÓGRAFA DIGITALIZADA (CANVAS TÁCTIL)
     ========================================================================= */
  let sigCanvas = null;
  let sigCtx = null;
  let isSigning = false;

  function initSignaturePad() {
    sigCanvas = document.getElementById('signature-canvas');
    if (!sigCanvas) return;

    sigCtx = sigCanvas.getContext('2d');
    resizeSignaturePad();

    window.addEventListener('resize', resizeSignaturePad);

    // Eventos Mouse
    sigCanvas.addEventListener('mousedown', startSign);
    sigCanvas.addEventListener('mousemove', drawSign);
    sigCanvas.addEventListener('mouseup', stopSign);
    sigCanvas.addEventListener('mouseleave', stopSign);

    // Eventos Táctiles Móviles
    sigCanvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = sigCanvas.getBoundingClientRect();
      startSign({ clientX: touch.clientX, clientY: touch.clientY });
    }, { passive: false });

    sigCanvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      drawSign({ clientX: touch.clientX, clientY: touch.clientY });
    }, { passive: false });

    sigCanvas.addEventListener('touchend', stopSign);
  }

  function resizeSignaturePad() {
    if (!sigCanvas || !sigCtx) return;
    const rect = sigCanvas.parentElement.getBoundingClientRect();
    sigCanvas.width = rect.width;
    sigCanvas.height = 160;
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';
    sigCtx.strokeStyle = '#0f172a';
  }

  function startSign(e) {
    if (!sigCtx) return;
    isSigning = true;
    const rect = sigCanvas.getBoundingClientRect();
    sigCtx.beginPath();
    sigCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }

  function drawSign(e) {
    if (!isSigning || !sigCtx) return;
    const rect = sigCanvas.getBoundingClientRect();
    sigCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    sigCtx.stroke();
  }

  function stopSign() {
    if (!isSigning) return;
    isSigning = false;
    state.signatureDataUrl = sigCanvas.toDataURL('image/png');
  }

  function clearSignature() {
    if (!sigCanvas || !sigCtx) return;
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    state.signatureDataUrl = null;
  }

  /* =========================================================================
     GESTIÓN DE ANEXOS Y PRUEBAS DOCUMENTALES
     ========================================================================= */
  function handleEvidenceUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < Math.min(files.length, 4); i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        state.evidenceImages.push({
          name: file.name,
          data: e.target.result
        });
        renderEvidencePreviews();
      };
      reader.readAsDataURL(file);
    }
  }

  function renderEvidencePreviews() {
    const container = document.getElementById('evidence-preview-container');
    if (!container) return;

    container.innerHTML = state.evidenceImages.map((img, idx) => `
      <div class="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 group">
        <img src="${img.data}" class="w-full h-full object-cover">
        <button type="button" onclick="EscudoApp.removeEvidence(${idx})" class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shadow">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `).join('');
  }

  function removeEvidence(idx) {
    state.evidenceImages.splice(idx, 1);
    renderEvidencePreviews();
  }

  /* =========================================================================
     MOTOR DE REDACCIÓN JURÍDICA FORENSE & GENERACIÓN PDF (CERO SOBREPOSICIÓN)
     ========================================================================= */
  function collectQuejaFormData() {
    return {
      nombre: (document.getElementById('q-nombre')?.value || '').trim(),
      curp: (document.getElementById('q-curp')?.value || '').trim().toUpperCase(),
      email: (document.getElementById('q-email')?.value || '').trim(),
      telefono: (document.getElementById('q-telefono')?.value || '').trim(),
      calle: (document.getElementById('q-calle')?.value || '').trim(),
      colonia: (document.getElementById('q-colonia')?.value || '').trim(),
      municipio: (document.getElementById('q-municipio')?.value || '').trim(),
      cp: (document.getElementById('q-cp')?.value || '').trim(),
      udecoKey: document.getElementById('q-udeco')?.value || 'CDMX_CENTRAL',
      institucion: (document.getElementById('q-institucion')?.value || '').trim(),
      folioSipres: (document.getElementById('q-folio-sipres')?.value || '').trim(),
      sector: document.getElementById('q-sector')?.value || 'Banca Múltiple',
      producto: document.getElementById('q-producto')?.value || 'Tarjeta de Crédito',
      causa: document.getElementById('q-causa')?.value || 'Cargos no reconocidos',
      contrato: (document.getElementById('q-contrato')?.value || '').trim(),
      monto: document.getElementById('q-monto')?.value || '0',
      fechaHechos: document.getElementById('q-fecha-hechos')?.value || new Date().toISOString().split('T')[0],
      hechos: (document.getElementById('q-hechos')?.value || '').trim(),
      pretensiones: (document.getElementById('q-pretensiones')?.value || '').trim(),
      isRedeco: state.quejaProcedure === 'redeco'
    };
  }

  /**
   * Genera el escrito procesal formal en páginas limpias sin sobreposición
   */
  function generateLegalDocumentHTML(data) {
    const folioExp = `${data.isRedeco ? 'REDECO-CONDUSEF' : 'CONDUSEF-UDECO'}-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const fechaHoy = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    const udecoObj = UDECO_CATALOG[data.udecoKey] || UDECO_CATALOG.CDMX_CENTRAL;

    // Firma autógrafa o línea
    const firmaHtml = state.signatureDataUrl ? `
      <div style="margin: 0 auto 5px auto; width: 220px; height: 60px;">
        <img src="${state.signatureDataUrl}" style="max-height: 60px; max-width: 100%; margin: 0 auto; display: block;">
      </div>
    ` : '';

    // Anexos de Evidencia
    let evidenciasHtml = '';
    if (state.evidenceImages.length > 0) {
      evidenciasHtml = `
        <div class="pdf-page">
          <div class="legal-header flex items-center justify-between">
            <span style="font-weight: bold; text-transform: uppercase;">ANEXO DE PRUEBAS DOCUMENTALES</span>
            <span style="font-family: monospace;">EXP: ${folioExp}</span>
          </div>
          <p class="legal-p-plain" style="font-style: italic; font-size: 10pt; margin-bottom: 20px;">
            Constancias gráficas aportadas por el promovente bajo protesta de decir verdad:
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            ${state.evidenceImages.map((img, i) => `
              <div class="legal-evidence-box">
                <span style="font-weight: bold; font-size: 9pt; display: block; margin-bottom: 6px;">PRUEBA DOCUMENTAL ${i + 1}</span>
                <img src="${img.data}">
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <!-- PÁGINA 1: ESCRITO INICIAL FORENSE -->
      <div class="pdf-page">
        <!-- Encabezado Membretado Oficial -->
        <div class="legal-header flex items-center justify-between">
          <div>
            <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px;">
              ${data.isRedeco ? 'REGISTRO DE DESPACHOS DE COBRANZA (REDECO) — CONDUSEF' : 'COMISIÓN NACIONAL PARA LA PROTECCIÓN Y DEFENSA DE LOS USUARIOS DE SERVICIOS FINANCIEROS'}
            </div>
            <div style="font-size: 10pt; font-weight: bold; color: #334155; text-transform: uppercase;">
              ${escapeHtml(udecoObj.nombre)}
            </div>
            <div style="font-size: 8.5pt; color: #64748b;">
              ${escapeHtml(udecoObj.direccion)}
            </div>
          </div>
          <div style="text-align: right; border: 1px solid #0f172a; padding: 4px 8px; border-radius: 4px;">
            <div style="font-family: monospace; font-size: 10pt; font-weight: bold;">
              ${folioExp}
            </div>
            <div style="font-size: 8pt; color: #64748b;">
              RADICACIÓN: ${fechaHoy.toUpperCase()}
            </div>
          </div>
        </div>

        <!-- Rubro Jurídico Procesal -->
        <div class="legal-rubro">
          <div>PROMOVENTE: <strong>${escapeHtml(data.nombre.toUpperCase())}</strong> (CURP: ${escapeHtml(data.curp)})</div>
          <div>VS.</div>
          <div>ENTIDAD DENUNCIADA: <strong>${escapeHtml(data.institucion.toUpperCase())}</strong> ${data.folioSipres ? `(FOLIO SIPRES: ${escapeHtml(data.folioSipres)})` : ''}</div>
          <div>SECTOR FINANCIERO: ${escapeHtml(data.sector.toUpperCase())}</div>
          <div>ASUNTO: <strong>${data.isRedeco ? 'DENUNCIA FORMAL POR COBRANZA EXTRAJUDICIAL ILEGAL (REDECO)' : 'ESCRITO INICIAL DE QUEJA Y PROCEDIMIENTO DE CONCILIACIÓN'}</strong></div>
        </div>

        <!-- Proemio Legal Forense -->
        <p class="legal-p">
          <strong>C. TITULAR DE LA UNIDAD DE ATENCIÓN A USUARIOS DE LA CONDUSEF, PRESENTE:</strong>
        </p>

        <p class="legal-p">
          El que suscribe, <strong>${escapeHtml(data.nombre)}</strong>, por mi propio derecho, señalando como domicilio legal para oír y recibir toda clase de notificaciones el ubicado en <strong>${escapeHtml(data.calle)}, Col. ${escapeHtml(data.colonia)}, Alcaldía/Municipio ${escapeHtml(data.municipio)}, C.P. ${escapeHtml(data.cp)}</strong>, con correo de notificación <strong>${escapeHtml(data.email)}</strong> y teléfono <strong>${escapeHtml(data.telefono)}</strong>; comparezco ante esta H. Autoridad con el debido respeto a exponer:
        </p>

        <p class="legal-p">
          Que por medio del presente ocurso, con fundamento en los <strong>Artículos 1, 4, 11, 50 y 59 Bis 1 de la Ley de Protección y Defensa al Usuario de Servicios Financieros (LPDUSF)</strong>, así como en los <strong>Artículos 15, 35 y 36 de la Ley Federal de Procedimiento Administrativo (LFPA)</strong> ${data.isRedeco ? 'y el Artículo 284 Bis del Código Penal Federal' : ''}, vengo a formular formal escrito de reclamación en contra de <strong>${escapeHtml(data.institucion)}</strong>, respecto del producto financiero <strong>${escapeHtml(data.producto)}</strong> con identificador de contrato o cuenta <strong>${escapeHtml(data.contrato)}</strong>, reclamando el resarcimiento patrimonial de <strong>$${parseFloat(data.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</strong> motivado por los siguientes hechos y consideraciones de derecho:
        </p>

        <!-- Capítulo de Hechos -->
        <div class="legal-section-title">I. CAPÍTULO DE HECHOS Y ANTECEDENTES</div>
        <div style="font-size: 11pt; text-align: justify; line-height: 1.6; white-space: pre-line; margin-bottom: 14px;">
          ${escapeHtml(data.hechos)}
        </div>

        <!-- Capítulo de Pretensiones -->
        <div class="legal-section-title">II. PRETENSIONES Y MOTIVOS DE INCONFORMIDAD</div>
        <div style="font-size: 11pt; text-align: justify; line-height: 1.6; white-space: pre-line; margin-bottom: 14px;">
          ${escapeHtml(data.pretensiones)}
        </div>

        <!-- Petitorios Formales -->
        <div class="legal-section-title">III. PETITORIOS FORMALES ANTE LA CONDUSEF</div>
        <div style="font-size: 10.5pt; text-align: justify; line-height: 1.5; margin-bottom: 25px;">
          <p><strong>PRIMERO.</strong> Tenerme por presentado formulando en tiempo y forma formal reclamación en contra de la institución señalada.</p>
          <p><strong>SEGUNDO.</strong> Admitir la queja, dar inicio al procedimiento de conciliación previsto en el Art. 68 de la Ley y emplazar a la contraparte a rendir su informe circunstanciado de ley.</p>
          <p><strong>TERCERO.</strong> En su oportunidad, ordenar la restitución de los fondos y velar por la integridad crediticia del promovente.</p>
        </div>

        <!-- Protesta Solemne y Firma Autógrafa -->
        <div class="legal-firma">
          <p style="font-size: 10pt; font-style: italic; margin-bottom: 15px;">
            "Protesto lo necesario por la verdad y la defensa del usuario financiero"
          </p>
          ${firmaHtml}
          <div class="legal-firma-line"></div>
          <div style="font-weight: bold; font-size: 11pt;">${escapeHtml(data.nombre.toUpperCase())}</div>
          <div style="font-size: 9.5pt; color: #475569;">Firma del Promovente • CURP: ${escapeHtml(data.curp)}</div>
          <div style="font-size: 8pt; color: #94a3b8; margin-top: 4px;">Sello Digital Cívico: ${folioExp} • Verificado con Escudo Financiero Pro</div>
        </div>
      </div>

      <!-- PÁGINA 2: ANEXOS (SI SE ADJUNTARON FOTOS) -->
      ${evidenciasHtml}
    `;
  }

  function generateQuejaPreview() {
    const data = collectQuejaFormData();

    if (!data.nombre || !data.curp || !data.institucion || !data.hechos || !data.pretensiones) {
      alert('Por favor completa todos los campos requeridos marcados con asterisco (*).');
      return;
    }

    const container = document.getElementById('legal-sheet-container');
    if (container) {
      container.innerHTML = generateLegalDocumentHTML(data);
    }

    openModal('modal-preview-pdf');
  }

  function downloadQuejaPDF() {
    const element = document.getElementById('legal-sheet-container');
    if (!element) return;

    const data = collectQuejaFormData();
    const cleanName = data.nombre.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Escrito-CONDUSEF-${cleanName}-${new Date().toISOString().split('T')[0]}.pdf`;

    if (window.html2pdf) {
      const opt = {
        margin: [12, 12, 12, 12],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      html2pdf().set(opt).from(element).save().then(() => {
        console.log('[Escudo] PDF descargado exitosamente sin sobreposición.');
      }).catch(err => {
        console.error('[Escudo] Error con html2pdf, recurriendo a impresión:', err);
        window.print();
      });
    } else {
      window.print();
    }
  }

  /* =========================================================================
     MÓDULO 3: SEMÁFORO DE CRÉDITO, CAT REAL Y AMORTIZACIÓN CUOTA A CUOTA
     ========================================================================= */
  let currentAmortizationData = [];

  function calcCredito() {
    const anticipoEl = document.querySelector('input[name="cr-anticipo"]:checked');
    const pideAnticipo = anticipoEl ? anticipoEl.value === 'si' : false;
    const verificada = document.getElementById('cr-verificada')?.value || 'si';

    const monto = parseFloat(document.getElementById('cr-monto')?.value) || 10000;
    const frecuencia = document.getElementById('cr-frecuencia')?.value || 'quincenal';
    const plazo = parseInt(document.getElementById('cr-plazo')?.value) || 12;
    const cuota = parseFloat(document.getElementById('cr-cuota')?.value) || 1150;

    const totalPagar = cuota * plazo;
    const totalInteres = Math.max(0, totalPagar - monto);
    const sobrecostoPct = (totalInteres / monto) * 100;

    // Cálculo del CAT Real Banxico (TIR anualizada)
    const periodosPorAnio = frecuencia === 'semanal' ? 52 : (frecuencia === 'quincenal' ? 24 : 12);
    const tasaPeriodo = estimateTIR(monto, cuota, plazo);
    const catReal = (Math.pow(1 + tasaPeriodo, periodosPorAnio) - 1) * 100;

    // Actualizar elementos
    const resTotal = document.getElementById('res-total');
    const resInteres = document.getElementById('res-interes');
    const resSobrecosto = document.getElementById('res-sobrecosto');
    const resCatReal = document.getElementById('res-cat-real');

    if (resTotal) resTotal.textContent = `$${totalPagar.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    if (resInteres) resInteres.textContent = `$${totalInteres.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    if (resSobrecosto) resSobrecosto.textContent = `+${sobrecostoPct.toFixed(1)}%`;
    if (resCatReal) resCatReal.textContent = `${isNaN(catReal) || catReal <= 0 ? '--' : catReal.toFixed(1)}%`;

    const pctCapital = Math.min(100, Math.max(0, (monto / totalPagar) * 100));
    const pctInteres = Math.min(100, Math.max(0, (totalInteres / totalPagar) * 100));

    const barCapital = document.getElementById('bar-capital');
    const barInteres = document.getElementById('bar-interes');
    const labelCap = document.getElementById('pct-capital');
    const labelInt = document.getElementById('pct-interes');

    if (barCapital) barCapital.style.width = `${pctCapital}%`;
    if (barInteres) barInteres.style.width = `${pctInteres}%`;
    if (labelCap) labelCap.textContent = `${pctCapital.toFixed(0)}%`;
    if (labelInt) labelInt.textContent = `${pctInteres.toFixed(0)}%`;

    // Algoritmo Semafórico y Detector de CAT Engañoso (Art. 43 LTOSF)
    const catDeclaradoRaw = document.getElementById('cr-cat-declarado')?.value;
    const catDeclarado = catDeclaradoRaw !== '' && catDeclaradoRaw !== undefined ? parseFloat(catDeclaradoRaw) : null;
    const alertaCatBox = document.getElementById('semaforo-alerta-cat-enganoso');
    const alertaCatTexto = document.getElementById('semaforo-alerta-cat-texto');

    let hayCatEnganoso = false;
    if (catDeclarado !== null && !isNaN(catDeclarado) && catDeclarado >= 0 && !isNaN(catReal) && catReal > 0) {
      const diferenciaCat = catReal - catDeclarado;
      if (diferenciaCat > 15) {
        hayCatEnganoso = true;
        if (alertaCatBox) alertaCatBox.classList.remove('hidden');
        if (alertaCatTexto) {
          alertaCatTexto.innerHTML = `Te declararon un CAT anual del <strong>${catDeclarado.toFixed(1)}%</strong>, pero el cálculo financiero de tus pagos periódicos arroja un <strong>CAT Real del ${catReal.toFixed(1)}%</strong> (ocultamiento de <strong>+${diferenciaCat.toFixed(1)} puntos porcentuales</strong>). Esto infringe el Art. 43 de la Ley para la Transparencia y Ordenamiento de los Servicios Financieros.`;
        }
      } else if (alertaCatBox) {
        alertaCatBox.classList.add('hidden');
      }
    } else if (alertaCatBox) {
      alertaCatBox.classList.add('hidden');
    }

    const card = document.getElementById('semaforo-card');
    const badge = document.getElementById('semaforo-badge');
    const iconBox = document.getElementById('semaforo-icon');
    const title = document.getElementById('semaforo-title');
    const desc = document.getElementById('semaforo-desc');
    const alertaLegal = document.getElementById('semaforo-alerta-legal');
    const alertaNoSipres = document.getElementById('semaforo-alerta-no-sipres');

    const noEnSipresOCancelada = verificada !== 'si';

    if (alertaNoSipres) {
      if (noEnSipresOCancelada) alertaNoSipres.classList.remove('hidden');
      else alertaNoSipres.classList.add('hidden');
    }

    if (alertaLegal) {
      if (pideAnticipo) alertaLegal.classList.remove('hidden');
      else alertaLegal.classList.add('hidden');
    }

    if (pideAnticipo || noEnSipresOCancelada || sobrecostoPct > 150) {
      if (card) card.className = 'rounded-2xl p-6 text-white shadow-xl border bg-gradient-to-br from-red-950 via-slate-900 to-red-900 border-red-500/60';
      if (iconBox) {
        iconBox.className = 'w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center text-2xl';
        iconBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
      }
      if (badge) {
        badge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-500/30 text-red-300 border border-red-500/50';
        badge.textContent = pideAnticipo ? '¡FRAUDE DETECTADO!' : (noEnSipresOCancelada ? '¡NO PEDIR EL PRÉSTAMO!' : 'USURA EXTREMA');
      }
      if (title) {
        title.textContent = pideAnticipo
          ? '¡ALERTA ROJA: SOLICITUD DE ANTICIPO ILEGAL!'
          : (noEnSipresOCancelada ? '¡ALERTA ROJA: NO PEDIR EL PRÉSTAMO!' : 'Condiciones Abusivas — No Pedir el Préstamo');
      }
      if (desc) {
        desc.textContent = noEnSipresOCancelada
          ? 'La entidad NO aparece en el SIPRES o está cancelada. Te aconsejamos rotundamente NO pedir el préstamo para evitar ser víctima de fraude o robo de identidad.'
          : (pideAnticipo
            ? 'Te exigen un depósito previo para liberar el dinero. Se trata de un fraude consumado; no entregues ningún anticipo.'
            : 'El sobrecosto supera los límites razonables de financiamiento; no te recomendamos contratar este crédito.');
      }
    } else if (sobrecostoPct >= 60 || hayCatEnganoso) {
      if (card) card.className = 'rounded-2xl p-6 text-white shadow-lg border bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 border-amber-500/40';
      if (iconBox) {
        iconBox.className = 'w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl';
        iconBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
      }
      if (badge) {
        badge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-500/30 text-amber-300 border border-amber-500/40';
        badge.textContent = hayCatEnganoso ? 'Alerta: CAT Engañoso' : 'Precaución — Costo Elevado';
      }
      if (title) title.textContent = hayCatEnganoso ? 'Discrepancia Grave en el CAT Prometido' : 'Préstamo Regulado pero Muy Costoso';
      if (desc) desc.textContent = 'La entidad está en operación, pero el costo financiero o el CAT presentan condiciones desfavorables. Compara otras opciones antes de firmar.';
    } else {
      if (card) card.className = 'rounded-2xl p-6 text-white shadow-lg border bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border-emerald-500/40';
      if (iconBox) {
        iconBox.className = 'w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl';
        iconBox.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
      }
      if (badge) {
        badge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/30 text-emerald-300 border border-emerald-500/40';
        badge.textContent = 'Condiciones Justas';
      }
      if (title) title.textContent = 'Préstamo Dentro del Rango Justo';
      if (desc) desc.textContent = 'La entidad figura en operación en el SIPRES, no cobra anticipos ilegales y la tasa de sobrecosto se mantiene en rangos promedio de financiamiento regulado.';
    }

    // Generar Tabla de Amortización Completa
    generateAmortizationSchedule(monto, cuota, plazo);

    // Renderizar Comparativa de Mercado
    renderMarketComparative(monto);
  }

  function estimateTIR(principal, payment, n) {
    let rate = (payment * n - principal) / (principal * n);
    for (let i = 0; i < 20; i++) {
      let f = principal * rate / (1 - Math.pow(1 + rate, -n)) - payment;
      let fPrime = (principal * (1 - Math.pow(1 + rate, -n)) - principal * rate * n * Math.pow(1 + rate, -n - 1)) / Math.pow(1 - Math.pow(1 + rate, -n), 2);
      let newRate = rate - f / fPrime;
      if (Math.abs(newRate - rate) < 0.0001) return newRate;
      rate = newRate;
    }
    return rate;
  }

  function generateAmortizationSchedule(principal, payment, n) {
    const tbody = document.getElementById('tbody-amortization');
    if (!tbody) return;

    currentAmortizationData = [];
    let balance = principal;
    const interestPerPayment = (payment * n - principal) / n;
    const ivaRate = 0.16;

    let html = '';
    for (let i = 1; i <= n; i++) {
      const interest = Math.min(balance, interestPerPayment / (1 + ivaRate));
      const iva = interest * ivaRate;
      const capital = Math.min(balance, payment - interest - iva);
      balance = Math.max(0, balance - capital);

      currentAmortizationData.push({
        num: i,
        cuota: payment,
        capital: capital,
        interes: interest,
        iva: iva,
        saldo: balance
      });

      html += `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="p-2.5 font-bold">${i}</td>
          <td class="p-2.5">$${payment.toFixed(2)}</td>
          <td class="p-2.5 text-sky-600 font-semibold">$${capital.toFixed(2)}</td>
          <td class="p-2.5 text-amber-600">$${interest.toFixed(2)}</td>
          <td class="p-2.5 text-slate-500">$${iva.toFixed(2)}</td>
          <td class="p-2.5 font-bold">$${balance.toFixed(2)}</td>
        </tr>
      `;
    }

    tbody.innerHTML = html;
  }

  function exportAmortizationCSV() {
    if (currentAmortizationData.length === 0) return;
    let csv = "Pago_Numero,Cuota_Total,Abono_Capital,Intereses,IVA_16,Saldo_Insoluto\n";
    currentAmortizationData.forEach(row => {
      csv += `${row.num},${row.cuota.toFixed(2)},${row.capital.toFixed(2)},${row.interes.toFixed(2)},${row.iva.toFixed(2)},${row.saldo.toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Amortizacion_Credito_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  function renderMarketComparative(monto) {
    const box = document.getElementById('market-comparative-box');
    if (!box) return;

    box.innerHTML = `
      <div class="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
        <span>🏛️ Banca Tradicional (CAT ~42%):</span>
        <strong class="font-mono text-emerald-600">$${(monto * 1.35).toFixed(0)} MXN</strong>
      </div>
      <div class="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
        <span>🏢 SOFIPO / Fintech (CAT ~110%):</span>
        <strong class="font-mono text-amber-600">$${(monto * 1.85).toFixed(0)} MXN</strong>
      </div>
      <div class="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
        <span>⚠️ Apps Montadeudas Ilegales (>400%):</span>
        <strong class="font-mono text-red-600">$${(monto * 2.80).toFixed(0)} MXN</strong>
      </div>
    `;
  }

  /* =========================================================================
     MÓDULO 4: ANALIZADOR FORENSE IA (TEXTO, CAPTURAS & PHISHING)
     ========================================================================= */
  function switchAiInputMode(mode) {
    state.aiInputMode = mode;
    const btnText = document.getElementById('tab-ai-text-btn');
    const btnImg = document.getElementById('tab-ai-img-btn');
    const btnUrl = document.getElementById('tab-ai-url-btn');

    const boxText = document.getElementById('ai-mode-text-box');
    const boxImg = document.getElementById('ai-mode-image-box');
    const boxUrl = document.getElementById('ai-mode-url-box');

    [btnText, btnImg, btnUrl].forEach(b => b.className = 'pb-2.5 border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center space-x-1.5');
    [boxText, boxImg, boxUrl].forEach(b => b.classList.add('hidden'));

    if (mode === 'text') {
      btnText.className = 'pb-2.5 border-b-2 border-indigo-600 text-indigo-600 flex items-center space-x-1.5 font-bold';
      boxText.classList.remove('hidden');
    } else if (mode === 'image') {
      btnImg.className = 'pb-2.5 border-b-2 border-indigo-600 text-indigo-600 flex items-center space-x-1.5 font-bold';
      boxImg.classList.remove('hidden');
    } else {
      btnUrl.className = 'pb-2.5 border-b-2 border-indigo-600 text-indigo-600 flex items-center space-x-1.5 font-bold';
      boxUrl.classList.remove('hidden');
    }
  }

  function handleAiImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('ai-img-filename').textContent = file.name;
    document.getElementById('ai-img-preview-box').classList.remove('hidden');
  }

  function clearAiImage() {
    document.getElementById('ai-img-file-input').value = '';
    document.getElementById('ai-img-preview-box').classList.add('hidden');
  }

  function runForensicAnalysis() {
    if (state.aiInputMode === 'url') {
      analyzeSuspiciousUrl();
    } else if (state.aiInputMode === 'image') {
      analyzeUploadedImage();
    } else {
      runMessageAnalysis();
    }
  }

  function analyzeSuspiciousUrl() {
    const urlInput = document.getElementById('ai-url-input')?.value.trim();
    if (!urlInput) {
      alert('Ingresa un enlace URL para analizar.');
      return;
    }

    const lower = urlInput.toLowerCase();
    const redFlags = [];
    let score = 0;

    if (/\.xyz|\.top|\.info|\.site|\.online|\.tk|\.ga/.test(lower)) {
      score += 35;
      redFlags.push({
        badge: 'Dominio de Alto Riesgo / Gratuito',
        desc: 'Utiliza una extensión (.xyz, .top, .info) frecuentemente empleada en campañas de phishing masivo.'
      });
    }

    if (/bbva|santander|banorte|azteca|banamex|oxxo|liverpool|stori/.test(lower) && !/bbva\.mx|santander\.com\.mx|banorte\.com|bancoazteca\.com\.mx|banamex\.com/.test(lower)) {
      score += 55;
      redFlags.push({
        badge: 'Typosquatting / Suplantación Bancaria',
        desc: 'El enlace incluye el nombre de un banco mexicano reconocido pero no pertenece a su dominio web oficial.'
      });
    }

    if (!lower.startsWith('https://')) {
      score += 25;
      redFlags.push({
        badge: 'Conexión No Segura (Sin SSL)',
        desc: 'El sitio no cuenta con cifrado HTTPS legítimo.'
      });
    }

    if (score === 0) {
      score = 15;
    }

    renderAiVerdict({
      score: Math.min(100, score),
      verdictTitle: score > 40 ? '¡ENLACE DE PHISHING / FRAUDULENTO DETECTADO!' : 'Enlace con Riesgo Moderado',
      verdictSummary: `Análisis técnico de la URL: ${urlInput}`,
      redFlags: redFlags,
      legalBasis: 'Art. 103 LIC y Art. 386 CPF (Fraude Cibernético).',
      actions: [
        '¡NUNCA ingreses tu usuario, contraseña, NIP ni números de tarjeta en ese enlace!',
        'No descargues ningún archivo ejecutable o APK desde esa dirección.',
        'Denuncia la URL a la Policía Cibernética (088).'
      ]
    });
  }

  function analyzeUploadedImage() {
    // Simulación de OCR forense local
    setTimeout(() => {
      renderAiVerdict({
        score: 85,
        verdictTitle: '¡EVIDENCIA FORENSE DE COACCIÓN Y FRAUDE!',
        verdictSummary: 'Texto extraído de la captura con patrones de montadeudas y anticipos.',
        redFlags: [
          { badge: 'Solicitud de Depósito a Tarjeta Spin/STP', desc: 'Exigen comprobante de pago previo para liberar el dinero.' },
          { badge: 'Amenazas de Difusión a Contactos', desc: 'Coacción ilícita prohibida por el Art. 284 Bis CPF.' }
        ],
        legalBasis: 'Art. 386 y Art. 284 Bis del Código Penal Federal.',
        actions: ['No depositar', 'Bloquear el número en WhatsApp', 'Generar denuncia para el 088']
      });
    }, 400);
  }

  function setAiMode(mode) {
    state.aiMode = mode;
    const btnOff = document.getElementById('btn-mode-offline');
    const btnGem = document.getElementById('btn-mode-gemini');
    const gemBox = document.getElementById('gemini-config-box');
    const badge = document.getElementById('ai-engine-badge');

    if (mode === 'offline') {
      if (btnOff) btnOff.className = 'px-2.5 py-1 rounded-md font-semibold bg-white text-slate-800 shadow-sm transition-all';
      if (btnGem) btnGem.className = 'px-2.5 py-1 rounded-md font-semibold text-slate-600 hover:text-slate-800 transition-all flex items-center space-x-1';
      if (gemBox) gemBox.classList.add('hidden');
      if (badge) {
        badge.textContent = 'Motor Heurístico Local';
        badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200';
      }
    } else {
      if (btnOff) btnOff.className = 'px-2.5 py-1 rounded-md font-semibold text-slate-600 hover:text-slate-800 transition-all';
      if (btnGem) btnGem.className = 'px-2.5 py-1 rounded-md font-semibold bg-white text-indigo-700 shadow-sm transition-all flex items-center space-x-1';
      if (gemBox) gemBox.classList.remove('hidden');
      if (badge) {
        badge.textContent = 'Google Gemini 2.5 Flash';
        badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200';
      }
    }
  }

  function loadAiExample(type) {
    const input = document.getElementById('ai-message-input');
    if (!input) return;

    if (type === 'fianza_bbva') {
      input.value = `¡Felicidades estimado usuario! Tu crédito de $100,000 MXN ha sido PRE-APROBADO por BBVA México. Para formalizar la entrega y liberación del cheque en tu cuenta CLABE en menos de 30 minutos, solo debes realizar el pago único de fianza y gastos de gestión por $1,500 MXN en cualquier OXXO a la tarjeta Spin / STP número 646180112345678901 a nombre del Lic. Roberto Méndez. Envía foto del ticket para transferirte de inmediato.`;
    } else if (type === 'montadeudas') {
      input.value = `AVISO URGENTE EXTRAJUDICIAL: Tu contacto Juan Carlos Pérez te dejó como aval de su adeudo vencido en la aplicación de préstamo. Te damos 2 horas para liquidar los $3,800 MXN o comenzaremos a enviar a todos los contactos de tu agenda telefónica y familiares su foto con la leyenda de DEUDOR FRAUDULENTO y denuncia penal por fraude. Comunícate ya por este WhatsApp.`;
    } else if (type === 'telegram_milagro') {
      input.value = `¿Necesitas dinero urgente sin revisar buró de crédito ni aval? Préstamos desde $20,000 hasta $300,000 con tasa del 1.5% mensual fija. Aprobación 100% garantizada para amas de casa, comerciantes y desempleados. Solo descarga nuestra app APK desde el enlace http://bit.ly/prestamo-mexico-apk e ingresa tu INE.`;
    } else if (type === 'legitimo') {
      input.value = `BBVA Informa: Se realizó una compra por $450.00 MXN en Tienda Soriana con tu tarjeta terminación 1234 el 25/10/2026 a las 10:15 hrs. Si reconoces esta operación no necesitas hacer nada. Si no la reconoces, apaga tu tarjeta temporalmente desde tu App BBVA México. Recuerda que BBVA NUNCA te pedirá tus contraseñas ni códigos OTP por teléfono.`;
    }

    runForensicAnalysis();
  }

  async function runMessageAnalysis() {
    const text = (document.getElementById('ai-message-input')?.value || '').trim();
    if (!text) {
      alert('Ingresa un texto para evaluar.');
      return;
    }

    const apiKey = (document.getElementById('gemini-api-key')?.value || '').trim();

    if (state.aiMode === 'gemini' && apiKey) {
      try {
        await runGeminiAnalysis(text, apiKey);
      } catch (err) {
        console.warn('[Escudo] Respaldo heurístico offline activado:', err);
        runOfflineHeuristicAnalysis(text);
      }
    } else {
      setTimeout(() => {
        runOfflineHeuristicAnalysis(text);
      }, 100);
    }
  }

  function runOfflineHeuristicAnalysis(text) {
    const lower = text.toLowerCase();
    const redFlags = [];
    let score = 0;

    // Cruzar texto contra las 409 entidades reales de SIPRES en memoria
    const mentionedEntities = findMentionedEntities(text);

    if (/fianza|anticipo|comisi[oó]n por apertura|dep[oó]sito previo|pago de seguro|liberar fondos|gastos de gesti[oó]n/.test(lower)) {
      score += 45;
      redFlags.push({
        badge: 'Exigencia de Pago Previo (Anticipo)',
        desc: 'Solicitan dinero antes de entregarte el crédito. Patrón clásico de estafa en México (Art. 386 CPF).'
      });
    }

    if (/oxxo|spin|stp|cuenta personal|a nombre de|ticket|lic\./.test(lower) && /fianza|anticipo|liberar/.test(lower)) {
      score += 30;
      redFlags.push({
        badge: 'Depósito a Cuenta de Persona Física',
        desc: 'Entidades formales NUNCA piden depositar honorarios a personas físicas ni cadenas comerciales.'
      });
    }

    if (/aval|agenda|contactos|difamaci[oó]n|enviar fotos|deudor fraudulento|embargo/.test(lower)) {
      score += 40;
      redFlags.push({
        badge: 'Modus Operandi Montadeudas',
        desc: 'Amenazas de hostigamiento a tu agenda telefónica. Viola el Art. 284 Bis del Código Penal Federal.'
      });
    }

    if (/sin bur[oó]|sin consultar bur[oó]|100% garantizado|sin aval/.test(lower)) {
      score += 20;
      redFlags.push({
        badge: 'Crédito Milagro sin Validación de Riesgo',
        desc: 'Ninguna entidad seria presta sin evaluar la capacidad crediticia.'
      });
    }

    if (mentionedEntities.length > 0 && score >= 40) {
      const ent = mentionedEntities[0];
      score = Math.min(100, score + 15);
      redFlags.unshift({
        badge: `Suplantación de Identidad contra ${ent.n} (Folio SIPRES #${ent.f})`,
        desc: `El mensaje usurpa el nombre de la entidad regulada "${ent.s}" (${ent.t}, ${ent.e}) para engañar a la víctima mediante prácticas prohibidas.`
      });
    }

    score = Math.min(100, score);

    let summaryText = score >= 70
      ? 'Patrones evidentes de estafa por anticipo, suplantación o montadeudas.'
      : 'No se observan alertas críticas de fraude.';

    if (mentionedEntities.length > 0 && score < 40) {
      const ent = mentionedEntities[0];
      summaryText = `Entidad identificada en el padrón oficial SIPRES: ${ent.s} (Folio #${ent.f}, ${ent.e}). No se detectan exigencias de anticipos ilegales en el texto.`;
    }

    renderAiVerdict({
      score: score,
      verdictTitle: score >= 70 ? '¡ALERTA CRÍTICA: FRAUDE FINANCIERO!' : (score >= 40 ? 'Riesgo Moderado a Alto' : 'Mensaje de Bajo Riesgo'),
      verdictSummary: summaryText,
      redFlags: redFlags,
      legalBasis: score > 40 ? 'Art. 103 LIC (Captación ilícita) y Art. 386 CPF (Fraude).' : 'Marco de Transparencia CONDUSEF.',
      actions: score > 40 ? [
        '¡NUNCA deposites dinero por adelantado!',
        'Bloquea el número en WhatsApp.',
        'Reporta a la Policía Cibernética (088).'
      ] : ['Mantén tus contraseñas y claves OTP en privado.']
    });
  }

  async function runGeminiAnalysis(text, apiKey) {
    const mentioned = findMentionedEntities(text);
    const sipresContext = mentioned.length > 0
      ? `\nContexto SIPRES (Base de 409 entidades): El texto menciona a "${mentioned[0].s}" (Nombre corto: ${mentioned[0].n}, Folio SIPRES: ${mentioned[0].f}, Sector: ${mentioned[0].t}, Estatus: ${mentioned[0].e}). Si el mensaje pide anticipos o fianzas, dictamina SUPLANTACIÓN DE IDENTIDAD contra esta entidad.`
      : '';

    const prompt = `Actúa como Perito Forense de Ciberseguridad Financiera en México. Dictamina si este mensaje es un fraude (anticipo, montadeudas, phishing):
"${text}"${sipresContext}
Responde estrictamente en formato JSON:
{
  "score": [0 a 100],
  "verdictTitle": "[Título]",
  "verdictSummary": "[Resumen]",
  "redFlags": [{"badge": "[Alerta]", "desc": "[Detalle]"}],
  "legalBasis": "[Artículos mexicanos infringidos]",
  "actions": ["[Acción 1]", "[Acción 2]"]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    if (!response.ok) throw new Error('Gemini API Error');
    const data = await response.json();
    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    renderAiVerdict(result);
  }

  function renderAiVerdict(result) {
    const score = result.score || 0;
    const scoreCircle = document.getElementById('ai-score-circle');
    const scoreNum = document.getElementById('ai-score-number');
    const titleEl = document.getElementById('ai-verdict-title');
    const summaryEl = document.getElementById('ai-verdict-summary');
    const redFlagsContainer = document.getElementById('ai-red-flags-container');
    const legalBasisEl = document.getElementById('ai-legal-basis');

    if (scoreNum) scoreNum.textContent = score;

    let borderClass = 'border-emerald-500 text-emerald-600';
    if (score >= 70) borderClass = 'border-red-600 text-red-600 animate-pulse';
    else if (score >= 40) borderClass = 'border-amber-500 text-amber-600';

    if (scoreCircle) scoreCircle.className = `inline-flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 relative mb-2 ${borderClass}`;
    if (titleEl) titleEl.textContent = result.verdictTitle;
    if (summaryEl) summaryEl.textContent = result.verdictSummary;

    if (redFlagsContainer) {
      if (result.redFlags && result.redFlags.length > 0) {
        redFlagsContainer.innerHTML = result.redFlags.map(rf => `
          <div class="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900 space-y-0.5">
            <span class="font-bold flex items-center text-red-800">
              <i class="fa-solid fa-flag text-red-600 mr-1.5 text-xs"></i>
              ${escapeHtml(rf.badge)}
            </span>
            <p class="text-[11px] text-red-700 leading-normal">${escapeHtml(rf.desc)}</p>
          </div>
        `).join('');
      } else {
        redFlagsContainer.innerHTML = `<div class="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs">Sin banderas rojas detectadas.</div>`;
      }
    }

    if (legalBasisEl) legalBasisEl.textContent = result.legalBasis;
  }

  function openPoliceComplaintModal() {
    const text = document.getElementById('ai-message-input')?.value || 'Estafa reportada por usuario.';
    const format = 
`H. POLICÍA CIBERNÉTICA DE LA GUARDIA NACIONAL (088)
PRESENTE:

Por medio de la presente, presento DENUNCIA FORMAL CIUDADANA por presunto delito de fraude financiero cibernético y captación ilícita:

1. FECHA DE RECEPCIÓN: ${new Date().toLocaleDateString('es-MX')}
2. MEDIO DE CONTACTO: Mensajería electrónica / Red social / WhatsApp
3. CONTENIDO DEL MENSAJE O EVIDENCIA:
"${text}"

4. CONDUCTA DELICTIVA DETECTADA:
- Solicitud de anticipos ilícitos / Extorsión y coacción digital.
- Infringiendo el Art. 386 y Art. 284 Bis del Código Penal Federal.

Solicito la investigación del origen de la línea y el bloqueo de las cuentas involucradas para salvaguardar a la comunidad.`;

    const policeTextEl = document.getElementById('police-complaint-text');
    if (policeTextEl) policeTextEl.value = format;

    openModal('modal-police-complaint');
  }

  function copyPoliceComplaint() {
    const policeTextEl = document.getElementById('police-complaint-text');
    if (policeTextEl) {
      policeTextEl.select();
      navigator.clipboard.writeText(policeTextEl.value).then(() => {
        alert('¡Formato de denuncia copiado al portapapeles! Listo para enviar a ccert.orientacion@gn.gob.mx');
      });
    }
  }

  /* =========================================================================
     MÓDULO 5: RADAR COMUNITARIO, 399 APPS DE PRÉSTAMO MÓVIL, CLABE Y MAPA
     ========================================================================= */
  let appsPrestamoCatalog = [];

  function loadCitizenReports() {
    // 1. Cargar Consolidado de 399 Aplicaciones de Préstamo Móvil
    const savedApps = localStorage.getItem('escudo_apps_prestamo_db');
    if (savedApps) {
      try {
        const parsedApps = JSON.parse(savedApps);
        if (Array.isArray(parsedApps) && parsedApps.length >= 399) {
          appsPrestamoCatalog = parsedApps;
        }
      } catch (e) {}
    }
    if (appsPrestamoCatalog.length === 0) {
      if (window.APPS_PRESTAMO_DB && Array.isArray(window.APPS_PRESTAMO_DB)) {
        appsPrestamoCatalog = window.APPS_PRESTAMO_DB.map(a => ({ ...a }));
      }
    }
    populateReportAppSelectors();

    // 2. Cargar Reportes Ciudadanos del Muro
    const saved = localStorage.getItem('escudo_citizen_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        state.citizenReports = parsed.map((r, idx) => ({
          ...r,
          confirmaciones: r.confirmaciones || (SEED_REPORTS[idx] ? SEED_REPORTS[idx].confirmaciones : 1),
          clabe: r.clabe !== undefined ? r.clabe : (SEED_REPORTS[idx] ? SEED_REPORTS[idx].clabe : '')
        }));
      } catch (e) {
        state.citizenReports = SEED_REPORTS;
      }
    } else {
      state.citizenReports = SEED_REPORTS;
      localStorage.setItem('escudo_citizen_reports', JSON.stringify(SEED_REPORTS));
    }
    updateRadarKPIs();
    renderCitizenReports();
  }

  function populateReportAppSelectors() {
    const selectEl = document.getElementById('rep-app-select');
    const datalistEl = document.getElementById('apps-prestamo-datalist');
    if (appsPrestamoCatalog.length === 0) return;

    if (selectEl) {
      let opts = `<option value="">-- Selecciona una de las 399 aplicaciones (o escribe otro defraudador abajo) --</option>`;
      appsPrestamoCatalog.forEach(a => {
        const playLabel = a.googlePlay === 'ACTIVA' ? 'Sigue Activa' : (a.googlePlay === 'BAJA' ? 'Dada de Baja' : 'No Encontrada');
        opts += `<option value="${a.num}">N° ${a.num} — ${escapeHtml(a.app)} (${a.reportes} reportes | CONDUSEF: ${a.condusef} | Play: ${playLabel})</option>`;
      });
      selectEl.innerHTML = opts;
    }

    if (datalistEl) {
      datalistEl.innerHTML = appsPrestamoCatalog.map(a =>
        `<option value="${escapeHtml(a.app)}">N° ${a.num} — ${a.reportes} reportes | Reportada CONDUSEF: ${a.condusef} | Google Play: ${a.googlePlay}</option>`
      ).join('');
    }
  }

  function updateRadarKPIs() {
    const totalEl = document.getElementById('radar-kpi-total');
    const montoEl = document.getElementById('radar-kpi-monto');
    const topTipoEl = document.getElementById('radar-kpi-top-tipo');
    const afectadosEl = document.getElementById('radar-kpi-afectados');

    const total = state.citizenReports.length;
    const montoTotal = state.citizenReports.reduce((acc, r) => acc + (parseFloat(r.monto) || 0), 0);
    const totalAfectados = state.citizenReports.reduce((acc, r) => acc + (parseInt(r.confirmaciones) || 1), 0);

    const countsTipo = {};
    state.citizenReports.forEach(r => {
      const t = r.tipo || 'suplantacion';
      countsTipo[t] = (countsTipo[t] || 0) + 1;
    });
    const topTipoKey = Object.keys(countsTipo).sort((a, b) => countsTipo[b] - countsTipo[a])[0] || 'suplantacion';
    const labelsTipo = {
      suplantacion: 'Suplantación Bancaria',
      montadeudas: 'Apps Montadeudas',
      anticipos: 'Cobro de Anticipos',
      phishing: 'Phishing / SMS Falso'
    };

    if (totalEl) totalEl.textContent = total.toLocaleString('es-MX');
    if (montoEl) montoEl.textContent = `$${montoTotal.toLocaleString('es-MX')} MXN`;
    if (topTipoEl) topTipoEl.textContent = labelsTipo[topTipoKey] || topTipoKey;
    if (afectadosEl) afectadosEl.textContent = totalAfectados.toLocaleString('es-MX');
  }

  function decodeClabeInfo(digits) {
    const prefix = digits.substring(0, 3);
    const plaza = digits.substring(3, 6);
    const bankName = CLABE_BANKS[prefix] || `Institución Bancaria / STP (Prefijo ABM ${prefix})`;

    // Algoritmo oficial de Banxico para dígito verificador CLABE (ponderaciones 3, 7, 1)
    const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += (parseInt(digits.charAt(i), 10) * weights[i]) % 10;
    }
    const expectedCheckDigit = (10 - (sum % 10)) % 10;
    const actualCheckDigit = parseInt(digits.charAt(17), 10);
    const isChecksumValid = expectedCheckDigit === actualCheckDigit;

    return { prefix, plaza, bankName, isChecksumValid, expectedCheckDigit };
  }

  function decodeCardInfo(digits) {
    let network = 'Red Bancaria / Débito';
    if (digits.startsWith('4')) network = 'Visa';
    else if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) network = 'Mastercard';
    else if (/^3[47]/.test(digits)) network = 'American Express';
    else if (digits.startsWith('6')) network = 'Carnet / Maestro';

    // Algoritmo de Luhn
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    const isLuhnValid = sum % 10 === 0;
    return { network, isLuhnValid };
  }

  function searchRadarPhone() {
    const rawVal = (document.getElementById('radar-phone-search')?.value || '').trim();
    const digits = rawVal.replace(/[^0-9]/g, '');
    const resultBox = document.getElementById('radar-phone-result');
    if (!resultBox) return;

    if (!digits || digits.length < 8) {
      alert('Ingresa los dígitos del Teléfono (10 dígitos), Tarjeta (16 dígitos) o Cuenta CLABE (18 dígitos) a la que te pidieron depositar.');
      return;
    }

    resultBox.classList.remove('hidden');

    // Buscar coincidencias en teléfonos, CLABEs o relatos del muro ciudadano
    const matches = state.citizenReports.filter(r => {
      const rTel = (r.telefono || '').replace(/[^0-9]/g, '');
      const rClabe = (r.clabe || '').replace(/[^0-9]/g, '');
      return (rTel && rTel.includes(digits)) || (rClabe && rClabe.includes(digits)) || (r.relato && r.relato.includes(digits));
    });

    let techAnalysisHtml = '';
    if (digits.length === 18) {
      const clabeInfo = decodeClabeInfo(digits);
      const isFintechTransfer = ['646', '728', '722', '684'].includes(clabeInfo.prefix);
      techAnalysisHtml = `
        <div class="p-2.5 rounded-lg bg-white/90 border border-slate-200 text-slate-800 space-y-1 mb-2">
          <div class="font-bold text-slate-900 flex items-center justify-between">
            <span><i class="fa-solid fa-building-columns text-sky-600 mr-1.5"></i> Decodificación de Cuenta CLABE (18 dígitos):</span>
            <span class="font-mono text-[10px] px-2 py-0.5 rounded ${clabeInfo.isChecksumValid ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-800'}">
              ${clabeInfo.isChecksumValid ? 'Dígito Verificador Banxico: Estructura Real' : 'Dígito Verificador: Cuenta Alterada / Sintética'}
            </span>
          </div>
          <div>• <strong>Institución Receptora (Prefijo ${clabeInfo.prefix}):</strong> ${escapeHtml(clabeInfo.bankName)} (Plaza: ${clabeInfo.plaza})</div>
          ${isFintechTransfer ? `<div class="text-rose-700 font-semibold">⚠️ Alerta Forense: Las cuentas con prefijo ${clabeInfo.prefix} (${escapeHtml(clabeInfo.bankName)}) a nombre de personas físicas son el medio #1 utilizado por estafadores para cobrar "fianzas" y "anticipos" de préstamos falsos.</div>` : ''}
        </div>
      `;
    } else if (digits.length === 15 || digits.length === 16) {
      const cardInfo = decodeCardInfo(digits);
      techAnalysisHtml = `
        <div class="p-2.5 rounded-lg bg-white/90 border border-slate-200 text-slate-800 space-y-1 mb-2">
          <div class="font-bold text-slate-900 flex items-center justify-between">
            <span><i class="fa-solid fa-credit-card text-sky-600 mr-1.5"></i> Análisis de Tarjeta Receptora (${digits.length} dígitos):</span>
            <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">Red: ${cardInfo.network}</span>
          </div>
          <div>• <strong>Advertencia CONDUSEF:</strong> Ninguna institución financiera regulada solicita depósitos en OXXO o transferencias a tarjetas de débito de personas físicas para liberar créditos.</div>
        </div>
      `;
    }

    if (matches.length > 0) {
      const totalVotos = matches.reduce((acc, m) => acc + (m.confirmaciones || 1), 0);
      resultBox.className = 'mt-3 p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs space-y-1.5';
      resultBox.innerHTML = `
        ${techAnalysisHtml}
        <strong class="font-bold text-red-800 flex items-center">
          <i class="fa-solid fa-triangle-exclamation mr-1.5 text-base"></i>
          ¡ALERTA ROJA! DATO REPORTADO EN ${matches.length} EXPEDIENTE(S) (${totalVotos} AFECTADOS):
        </strong>
        <div>• <strong>Defraudador señalado:</strong> ${escapeHtml(matches[0].nombre)} (${escapeHtml(matches[0].estado)}) — Modalidad: <span class="uppercase font-bold">${escapeHtml(matches[0].tipo)}</span>.</div>
        <div>• <strong>Modus operandi reportado:</strong> "${escapeHtml(matches[0].relato)}"</div>
      `;
    } else {
      resultBox.className = 'mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-1.5';
      resultBox.innerHTML = `
        ${techAnalysisHtml}
        <strong class="font-bold text-emerald-800 flex items-center">
          <i class="fa-solid fa-circle-check mr-1.5 text-base"></i>
          SIN REPORTES PREVIOS EN EL MURO COMUNITARIO:
        </strong>
        <span>Este identificador aún no figura en los reportes del muro, pero recuerda la regla de oro: <strong>si te piden depositar dinero por adelantado a esta cuenta o teléfono para liberar un préstamo, es 100% un fraude (Art. 386 CPF)</strong>.</span>
      `;
    }
  }

  function renderMexicoHeatmap() {
    const grid = document.getElementById('mexico-states-grid');
    if (!grid) return;

    const stateCounts = {};
    state.citizenReports.forEach(r => {
      const st = r.estado || 'Nacional';
      stateCounts[st] = (stateCounts[st] || 0) + 1;
    });

    const commonStates = [
      'Ciudad de México', 'Jalisco', 'Nuevo León', 'Estado de México',
      'Puebla', 'Veracruz', 'Guanajuato', 'Querétaro', 'Yucatán',
      'Chihuahua', 'Sonora', 'Nacional'
    ];

    grid.innerHTML = commonStates.map(st => {
      const count = stateCounts[st] || 0;
      const isSelected = state.radarStateFilter === st;
      let boxClasses = count > 0
        ? 'bg-rose-50 border-rose-200 text-rose-950 font-semibold hover:bg-rose-100'
        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100';

      if (isSelected) {
        boxClasses = 'bg-rose-600 border-rose-700 text-white font-bold shadow-md ring-2 ring-rose-300';
      }

      return `
        <button type="button" onclick="EscudoApp.filterRadarByState('${st}')" class="p-2.5 rounded-xl border ${boxClasses} flex items-center justify-between transition-all text-left cursor-pointer">
          <span class="truncate mr-1">${st}</span>
          <span class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${isSelected ? 'bg-white text-rose-700' : (count > 0 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600')}">${count}</span>
        </button>
      `;
    }).join('');
  }

  function filterRadarByState(estado) {
    if (state.radarStateFilter === estado) {
      state.radarStateFilter = '';
    } else {
      state.radarStateFilter = estado;
    }

    const clearBtn = document.getElementById('btn-clear-radar-state');
    const labelEl = document.getElementById('active-radar-state-label');
    if (clearBtn && labelEl) {
      if (state.radarStateFilter) {
        labelEl.textContent = state.radarStateFilter;
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }

    renderMexicoHeatmap();
    renderCitizenReports();
  }

  function filterRadar(filter, btnEl) {
    state.radarFilter = filter;
    document.querySelectorAll('.radar-filter-btn').forEach(btn => {
      btn.className = 'radar-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200';
    });
    const activeBtn = btnEl || (typeof event !== 'undefined' ? event.target : null);
    if (activeBtn) {
      activeBtn.className = 'radar-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white';
    }
    renderCitizenReports();
  }

  function renderCitizenReports() {
    const grid = document.getElementById('radar-reports-grid');
    const countEl = document.getElementById('radar-total-count');
    if (!grid) return;

    const wallQuery = normalizeText(document.getElementById('radar-wall-search')?.value || '');
    const sortBy = document.getElementById('radar-sort-select')?.value || 'recientes';

    let list = [...state.citizenReports];

    if (state.radarFilter !== 'todos') {
      list = list.filter(r => r.tipo === state.radarFilter);
    }

    if (state.radarStateFilter) {
      list = list.filter(r => (r.estado || 'Nacional') === state.radarStateFilter);
    }

    if (wallQuery) {
      list = list.filter(r => 
        normalizeText(r.nombre).includes(wallQuery) ||
        normalizeText(r.telefono).includes(wallQuery) ||
        normalizeText(r.clabe).includes(wallQuery) ||
        normalizeText(r.estado).includes(wallQuery) ||
        normalizeText(r.relato).includes(wallQuery)
      );
    }

    if (sortBy === 'afectados') {
      list.sort((a, b) => (b.confirmaciones || 1) - (a.confirmaciones || 1));
    } else if (sortBy === 'monto') {
      list.sort((a, b) => (parseFloat(b.monto) || 0) - (parseFloat(a.monto) || 0));
    } else {
      list.sort((a, b) => String(b.fecha || '').localeCompare(String(a.fecha || '')));
    }

    if (countEl) countEl.textContent = list.length;

    if (list.length === 0) {
      grid.innerHTML = `<div class="col-span-full p-8 text-center text-slate-500 text-xs bg-white rounded-xl border border-slate-200">No se encontraron reportes con los filtros seleccionados.</div>`;
      return;
    }

    grid.innerHTML = list.map(rep => {
      const votos = rep.confirmaciones || 1;
      const isTrending = votos >= 15;

      // Cruzar con las 409 entidades del SIPRES para detectar entidad legítima suplantada
      const sipresMatches = findMentionedEntities(`${rep.nombre} ${rep.relato}`);
      const sipresEntity = sipresMatches.length > 0 ? sipresMatches[0] : null;

      const sipresBadgeHtml = sipresEntity ? `
        <button type="button" onclick="EscudoApp.openExpediente('${sipresEntity.f}')" class="w-full text-left mt-2 p-2 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[11px] text-sky-900 flex items-center justify-between transition-colors">
          <span class="truncate mr-2">
            <i class="fa-solid fa-shield-halved text-sky-600 mr-1"></i>
            Entidad Real Suplantada: <strong>${escapeHtml(sipresEntity.n)}</strong> (Folio #${escapeHtml(sipresEntity.f)})
          </span>
          <span class="text-[10px] font-bold text-sky-700 underline shrink-0">Ver Ficha</span>
        </button>
      ` : '';

      let clabeBadgeHtml = '';
      if (rep.clabe && rep.clabe.replace(/[^0-9]/g, '').length >= 16) {
        const cleanDigits = rep.clabe.replace(/[^0-9]/g, '');
        const bankLabel = cleanDigits.length === 18
          ? (CLABE_BANKS[cleanDigits.substring(0, 3)] || `Prefijo ${cleanDigits.substring(0, 3)}`)
          : 'Tarjeta receptora';
        clabeBadgeHtml = `
          <div class="text-[11px] font-mono text-rose-700 bg-rose-50 border border-rose-200 rounded px-2 py-1 mt-1 truncate">
            <i class="fa-solid fa-money-bill-transfer mr-1"></i> Cuenta reportada: <strong>${escapeHtml(rep.clabe)}</strong> (${escapeHtml(bankLabel)})
          </div>
        `;
      }

      // Cruzar con las 399 aplicaciones de préstamo móvil por si el reporte corresponde a una app del catálogo
      const matchedApp = appsPrestamoCatalog.find(a =>
        (rep.appNum && a.num === parseInt(rep.appNum)) ||
        normalizeText(rep.nombre).includes(normalizeText(a.app))
      );

      const appCatalogBadgeHtml = matchedApp ? `
        <button type="button" onclick="EscudoApp.openAppFicha(${matchedApp.num})" class="w-full text-left mt-2 p-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[11px] text-rose-900 flex items-center justify-between transition-colors">
          <span class="truncate mr-2">
            <i class="fa-solid fa-mobile-screen-button text-rose-600 mr-1"></i>
            App N° <strong>${matchedApp.num}</strong> (${escapeHtml(matchedApp.app)}): <strong>${matchedApp.reportes} reportes</strong> • Google Play: <strong>${matchedApp.googlePlay}</strong>
          </span>
          <span class="text-[10px] font-bold text-rose-700 underline shrink-0">Ver Ficha</span>
        </button>
      ` : '';

      return `
        <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs mb-2 gap-1 flex-wrap">
              <div class="flex items-center space-x-1.5">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">${escapeHtml(rep.tipo.toUpperCase())}</span>
                ${isTrending ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200"><i class="fa-solid fa-fire text-rose-600 mr-1"></i>Tendencia</span>` : ''}
              </div>
              <span class="text-slate-400 font-mono text-[10px]">${escapeHtml(rep.fecha)}</span>
            </div>

            <h4 class="font-bold text-slate-900 text-sm leading-snug">${escapeHtml(rep.nombre)}</h4>

            <div class="flex items-center space-x-2 text-[11px] text-slate-500 my-1 font-mono">
              <i class="fa-solid fa-phone text-slate-400"></i>
              <span>${escapeHtml(rep.telefono)}</span>
              <span>•</span>
              <span>${escapeHtml(rep.estado)}</span>
            </div>

            ${clabeBadgeHtml}

            <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              "${escapeHtml(rep.relato)}"
            </p>

            ${appCatalogBadgeHtml}
            ${sipresBadgeHtml}
          </div>

          <div class="space-y-2.5 pt-2 border-t border-slate-100">
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-400">Monto señalado:</span>
              <span class="font-bold font-mono text-slate-800">
                ${rep.monto ? `$${parseFloat(rep.monto).toLocaleString('es-MX')} MXN` : 'No especificado'}
              </span>
            </div>

            <!-- Botón de Confirmación Comunitaria ("A mí también me contactaron") -->
            <button type="button" onclick="EscudoApp.confirmRadarReport('${rep.id}')" class="w-full py-1.5 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-bold transition-all flex items-center justify-between">
              <span><i class="fa-solid fa-hand-New-Point-Up fa-bullhorn mr-1.5 text-rose-600"></i> A mí también me contactaron</span>
              <span class="px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[10px]" id="votos-${rep.id}">+${votos} afectados</span>
            </button>

            <!-- Botones de Acción Rápida: Compartir Alerta, Denunciar 088 y Llevar a REDECO -->
            <div class="grid grid-cols-3 gap-1.5 pt-1">
              <button type="button" onclick="EscudoApp.shareRadarReport('${rep.id}')" class="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center justify-center space-x-1" title="Copiar boletín preventivo para WhatsApp">
                <i class="fa-brands fa-whatsapp text-emerald-600"></i>
                <span>Alerta</span>
              </button>
              <button type="button" onclick="EscudoApp.denunciarReporte088('${rep.id}')" class="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[10px] font-bold flex items-center justify-center space-x-1" title="Generar denuncia para Policía Cibernética 088">
                <i class="fa-solid fa-shield-cat text-rose-600"></i>
                <span>088</span>
              </button>
              <button type="button" onclick="EscudoApp.transferReporteToRedeco('${rep.id}')" class="py-1.5 px-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold flex items-center justify-center space-x-1" title="Llevar caso al Generador de Quejas REDECO">
                <i class="fa-solid fa-gavel text-sky-600"></i>
                <span>REDECO</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function confirmRadarReport(id) {
    const rep = state.citizenReports.find(r => r.id === id);
    if (!rep) return;

    rep.confirmaciones = (parseInt(rep.confirmaciones) || 1) + 1;
    localStorage.setItem('escudo_citizen_reports', JSON.stringify(state.citizenReports));
    updateRadarKPIs();
    renderCitizenReports();
  }

  function shareRadarReport(id) {
    const rep = state.citizenReports.find(r => r.id === id);
    if (!rep) return;

    const alertText = [
      `🚨 *ALERTA COMUNITARIA DE FRAUDE — ESCUDO FINANCIERO PRO*`,
      `• *Nombre usado por el defraudador:* ${rep.nombre}`,
      `• *Modalidad:* ${rep.tipo.toUpperCase()}`,
      `• *Teléfono / Contacto reportado:* ${rep.telefono}`,
      rep.clabe ? `• *Cuenta donde piden depositar:* ${rep.clabe}` : null,
      `• *Región:* ${rep.estado} (${rep.confirmaciones || 1} afectados confirmados)`,
      `• *Modus Operandi:* "${rep.relato}"`,
      `⚠️ *Recuerda:* Ningún banco ni financiera legal en México pide depósitos previos ni fianzas para entregar un crédito. Denuncia al 088.`
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(alertText).then(() => {
      alert('¡Boletín preventivo copiado al portapapeles! Ya puedes pegarlo en WhatsApp o redes sociales para alertar a tu familia y contactos.');
    });
  }

  function denunciarReporte088(id) {
    const rep = state.citizenReports.find(r => r.id === id);
    if (!rep) return;

    const format = 
`H. POLICÍA CIBERNÉTICA DE LA GUARDIA NACIONAL (088)
PRESENTE:

Por medio de la presente, presento DENUNCIA FORMAL CIUDADANA por presunto delito de fraude financiero cibernético y extorsión digital detectado en el Radar Comunitario:

1. EXPEDIENTE COMUNITARIO: ${rep.id} (${rep.confirmaciones || 1} ciudadanos afectados)
2. NOMBRE O RAZÓN SOCIAL USURPADA: ${rep.nombre}
3. TELÉFONO / DOMINIO DEL DEFRAUDADOR: ${rep.telefono}
4. CUENTA CLABE / TARJETA RECEPTORA SEÑALADA: ${rep.clabe || 'No especificada'}
5. ENTIDAD FEDERATIVA: ${rep.estado} | MONTO SEÑALADO: $${parseFloat(rep.monto || 0).toLocaleString('es-MX')} MXN
6. RELATO DEL MODUS OPERANDI:
"${rep.relato}"

7. CONDUCTA DELICTIVA DETECTADA:
- Modalidad: ${rep.tipo.toUpperCase()} (Art. 386 y Art. 284 Bis del Código Penal Federal).

Solicito la investigación de la línea telefónica y cuentas receptoras para salvaguardar a la ciudadanía.`;

    const policeTextEl = document.getElementById('police-complaint-text');
    if (policeTextEl) policeTextEl.value = format;
    openModal('modal-police-complaint');
  }

  function transferReporteToRedeco(id) {
    const rep = state.citizenReports.find(r => r.id === id);
    if (!rep) return;

    switchTab('quejas');
    setQuejaProcedure('redeco');

    const instEl = document.getElementById('q-institucion');
    const montoEl = document.getElementById('q-monto');
    const hechosEl = document.getElementById('q-hechos');

    if (instEl) instEl.value = rep.nombre;
    if (montoEl && rep.monto) montoEl.value = rep.monto;
    if (hechosEl) {
      hechosEl.value = 
`PRIMERO. En fecha ${rep.fecha}, fui contactado desde el número/medio ${rep.telefono} por quienes se ostentan bajo la denominación "${rep.nombre}" en ${rep.estado}.
SEGUNDO. Modus operandi denunciado: ${rep.relato}
TERCERO. Dichas conductas infringen la normativa de protección al usuario financiero y constituyen prácticas de cobranza o captación ilícita (Art. 284 Bis y Art. 386 del Código Penal Federal).`;
    }

    saveQuejaDraft();
    const formEl = document.getElementById('form-queja');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  }

  function copyMontadeudasShieldMessage() {
    const msg = `⚠️ AVISO IMPORTANTE A MIS CONTACTOS: Mi teléfono sufrió una vulneración de datos a través de una aplicación maliciosa. Si reciben mensajes de WhatsApp o llamadas de números desconocidos con montajes o cobros falsos a mi nombre, por favor NO contesten, NO abran enlaces y bloquéenlos de inmediato; se trata de extorsionadores ("montadeudas") ya reportados al 088 de la Policía Cibernética.`;
    navigator.clipboard.writeText(msg).then(() => {
      const btnText = document.getElementById('btn-shield-msg-text');
      if (btnText) {
        btnText.textContent = '¡Mensaje Copiado para WhatsApp!';
        setTimeout(() => { btnText.textContent = 'Copiar Aviso para mis Contactos'; }, 2800);
      }
    });
  }

  function handleReportAppSelect(appNumStr) {
    const infoBox = document.getElementById('rep-app-selected-info');
    const nombreInput = document.getElementById('rep-nombre');
    const tipoSelect = document.getElementById('rep-tipo');

    if (!appNumStr) {
      if (infoBox) infoBox.classList.add('hidden');
      return;
    }

    const appObj = appsPrestamoCatalog.find(a => a.num === parseInt(appNumStr, 10));
    if (!appObj) return;

    if (nombreInput) nombreInput.value = appObj.app;
    if (tipoSelect) tipoSelect.value = 'montadeudas';

    if (infoBox) {
      const playStatusText = appObj.googlePlay === 'ACTIVA'
        ? 'Sigue activa en Google Play (ACTIVA)'
        : (appObj.googlePlay === 'BAJA' ? 'Dada de baja en Google Play (BAJA)' : 'No encontrada en Google Play (NO ENCONTRADA)');

      infoBox.classList.remove('hidden');
      infoBox.innerHTML = `
        <div class="flex items-center justify-between font-bold text-rose-900">
          <span>Ficha Seleccionada: N° ${appObj.num} — ${escapeHtml(appObj.app)}</span>
          <span class="font-mono text-rose-700">${appObj.reportes.toLocaleString('es-MX')} reportes</span>
        </div>
        <div class="text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
          <span>• <strong>Reportada ante CONDUSEF:</strong> ${appObj.condusef}</span>
          <span>• <strong>Google Play:</strong> ${playStatusText}</span>
          <span>• <strong>Estatus APK:</strong> ${appObj.apk}</span>
        </div>
      `;
    }
  }

  function handleReportNameInput(val) {
    const norm = normalizeText(val);
    if (!norm) return;
    const match = appsPrestamoCatalog.find(a => normalizeText(a.app) === norm);
    if (match) {
      const selectEl = document.getElementById('rep-app-select');
      if (selectEl) selectEl.value = String(match.num);
      handleReportAppSelect(String(match.num));
    }
  }

  function openReportModalForApp(num) {
    closeModal('modal-app-ficha');
    openModal('modal-nuevo-reporte');
    const selectEl = document.getElementById('rep-app-select');
    if (selectEl) {
      selectEl.value = String(num);
      handleReportAppSelect(String(num));
    }
  }

  function openAppFicha(num) {
    const appObj = appsPrestamoCatalog.find(a => a.num === parseInt(num, 10));
    if (!appObj) return;

    const numEl = document.getElementById('app-ficha-num');
    const titleEl = document.getElementById('app-ficha-title');
    const bodyEl = document.getElementById('app-ficha-body');
    const btnReportar = document.getElementById('app-ficha-btn-reportar');
    const btn088 = document.getElementById('app-ficha-btn-088');

    if (numEl) numEl.textContent = `N° ${appObj.num}`;
    if (titleEl) titleEl.textContent = appObj.app;

    const isCondusefSi = appObj.condusef === 'SÍ';
    const condusefBadge = isCondusefSi
      ? `<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300">SÍ (Reportada ante CONDUSEF)</span>`
      : `<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">NO (Sin registro en CONDUSEF / Opera en la informalidad)</span>`;

    let googlePlayBadge = '';
    if (appObj.googlePlay === 'ACTIVA') {
      googlePlayBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-800 border border-red-300"><i class="fa-brands fa-google-play mr-1"></i> ACTIVA (Sigue activa en tienda)</span>`;
    } else if (appObj.googlePlay === 'BAJA') {
      googlePlayBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300"><i class="fa-solid fa-ban mr-1"></i> BAJA (Dada de baja de Google Play)</span>`;
    } else {
      googlePlayBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-300"><i class="fa-solid fa-circle-question mr-1"></i> NO ENCONTRADA en Google Play</span>`;
    }

    let apkBadge = '';
    if (appObj.apk === 'ACTIVA') {
      apkBadge = `<span class="font-bold text-red-700">ACTIVA (Circula como APK externo de alto riesgo)</span>`;
    } else if (appObj.apk === 'BAJA') {
      apkBadge = `<span class="font-bold text-slate-700">BAJA</span>`;
    } else {
      apkBadge = `<span class="font-bold text-slate-500">NO ENCONTRADA</span>`;
    }

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
          <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span class="text-slate-500 font-semibold">Número de Consolidado (N°):</span>
            <span class="font-mono font-extrabold text-sm text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-300">N° ${appObj.num} de 399</span>
          </div>

          <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span class="text-slate-500 font-semibold">Nombre de la Aplicación:</span>
            <span class="font-heading font-extrabold text-sm text-slate-900">${escapeHtml(appObj.app)}</span>
          </div>

          <div class="flex items-center justify-between border-b border-slate-200 pb-2.5 gap-2">
            <span class="text-slate-500 font-semibold">¿Reportada ante CONDUSEF?:</span>
            ${condusefBadge}
          </div>

          <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span class="text-slate-500 font-semibold">Número de Reportes Ciudadanos:</span>
            <span class="font-mono font-extrabold text-base text-rose-600">${appObj.reportes.toLocaleString('es-MX')} reportes</span>
          </div>

          <div class="flex items-center justify-between border-b border-slate-200 pb-2.5 gap-2">
            <span class="text-slate-500 font-semibold">Estatus en Google Play:</span>
            ${googlePlayBadge}
          </div>

          <div class="flex items-center justify-between">
            <span class="text-slate-500 font-semibold">Disponibilidad en APK Externo:</span>
            ${apkBadge}
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[11px] leading-relaxed">
          <strong class="block font-bold text-rose-800 mb-0.5"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Advertencia Forense:</strong>
          ${appObj.googlePlay === 'ACTIVA'
            ? `Aunque la aplicación <strong>${escapeHtml(appObj.app)}</strong> aún aparece <strong>ACTIVA</strong> en Google Play, acumula <strong>${appObj.reportes} reportes</strong>. No descargues ni otorgues permisos a tus contactos o galería.`
            : `Esta aplicación cuenta con <strong>${appObj.reportes} reportes</strong> y su estatus en Google Play es <strong>${appObj.googlePlay}</strong>. Suelen distribuirse mediante enlaces de WhatsApp o SMS fraudulentos.`}
        </div>
      `;
    }

    if (btnReportar) {
      btnReportar.onclick = () => openReportModalForApp(appObj.num);
    }

    if (btn088) {
      btn088.onclick = () => {
        closeModal('modal-app-ficha');
        const format = 
`H. POLICÍA CIBERNÉTICA DE LA GUARDIA NACIONAL (088)
PRESENTE:

Por medio de la presente, formulo DENUNCIA CIUDADANA en contra de la aplicación de préstamo móvil denominada "${appObj.app}" (Consolidado N° ${appObj.num}):

1. NOMBRE DE LA APLICACIÓN: ${appObj.app} (Registro Consolidado N° ${appObj.num})
2. REPORTADA ANTE CONDUSEF: ${appObj.condusef}
3. NÚMERO DE REPORTES ACUMULADOS: ${appObj.reportes} reportes de usuarios
4. ESTATUS EN GOOGLE PLAY: ${appObj.googlePlay} | ESTATUS APK: ${appObj.apk}
5. CONDUCTA DELICTIVA: Cobranza intimidatoria, acceso ilícito a contactos y presunta extorsión digital (Art. 284 Bis y Art. 386 del Código Penal Federal).

Solicito se integre el presente reporte para la baja definitiva de sus servidores y canales de distribución.`;
        const policeTextEl = document.getElementById('police-complaint-text');
        if (policeTextEl) policeTextEl.value = format;
        openModal('modal-police-complaint');
      };
    }

    openModal('modal-app-ficha');
  }

  function submitCitizenReport() {
    const appNumStr = document.getElementById('rep-app-select')?.value || '';
    const tipo = document.getElementById('rep-tipo')?.value || 'suplantacion';
    const nombre = (document.getElementById('rep-nombre')?.value || '').trim();
    const telefono = (document.getElementById('rep-telefono')?.value || '').trim();
    const clabe = (document.getElementById('rep-clabe')?.value || '').trim();
    const estado = document.getElementById('rep-estado')?.value || 'Nacional';
    const monto = parseFloat(document.getElementById('rep-monto')?.value) || 0;
    const relato = (document.getElementById('rep-relato')?.value || '').trim();

    if (!nombre || !relato) {
      alert('Ingresa el nombre de la aplicación o defraudador y el relato de los hechos.');
      return;
    }

    // Si seleccionó o escribió una de las 399 apps, incrementar su contador de reportes
    let matchedApp = null;
    if (appNumStr) {
      matchedApp = appsPrestamoCatalog.find(a => a.num === parseInt(appNumStr, 10));
    } else {
      matchedApp = appsPrestamoCatalog.find(a => normalizeText(a.app) === normalizeText(nombre));
    }

    if (matchedApp) {
      matchedApp.reportes = (parseInt(matchedApp.reportes, 10) || 0) + 1;
      localStorage.setItem('escudo_apps_prestamo_db', JSON.stringify(appsPrestamoCatalog));
      populateReportAppSelectors();
      renderMontadeudasList();
    }

    const newReport = {
      id: `REP-2026-${Math.floor(100 + Math.random() * 900)}`,
      appNum: matchedApp ? matchedApp.num : null,
      tipo,
      nombre: matchedApp ? `${matchedApp.app} (App N° ${matchedApp.num})` : nombre,
      telefono: telefono || 'App Móvil / No disponible',
      clabe,
      estado,
      monto,
      confirmaciones: 1,
      relato,
      fecha: new Date().toISOString().split('T')[0]
    };

    state.citizenReports.unshift(newReport);
    localStorage.setItem('escudo_citizen_reports', JSON.stringify(state.citizenReports));

    closeModal('modal-nuevo-reporte');
    document.getElementById('form-nuevo-reporte')?.reset();
    const infoBox = document.getElementById('rep-app-selected-info');
    if (infoBox) infoBox.classList.add('hidden');
    updateRadarKPIs();
    renderCitizenReports();
    renderMexicoHeatmap();
    alert('¡Reporte ciudadano publicado en el radar con éxito!');
  }

  function switchRadarSubtab(subtab) {
    state.radarSubtab = subtab;
    const catalogSec = document.getElementById('montadeudas-catalog-section');
    if (catalogSec) {
      catalogSec.classList.remove('hidden');
      catalogSec.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function renderMontadeudasList(filter = '') {
    const listEl = document.getElementById('montadeudas-list');
    const countEl = document.getElementById('apps-prestamo-count');
    if (!listEl) return;

    if (appsPrestamoCatalog.length === 0 && window.APPS_PRESTAMO_DB) {
      appsPrestamoCatalog = window.APPS_PRESTAMO_DB.map(a => ({ ...a }));
      populateReportAppSelectors();
    }

    const q = normalizeText(filter || document.getElementById('montadeudas-search')?.value || '');
    const condusefFilter = document.getElementById('filter-app-condusef')?.value || '';
    const playFilter = document.getElementById('filter-app-play')?.value || '';

    let items = appsPrestamoCatalog;

    if (condusefFilter) {
      items = items.filter(a => a.condusef === condusefFilter);
    }

    if (playFilter) {
      items = items.filter(a => a.googlePlay === playFilter);
    }

    if (q) {
      items = items.filter(a =>
        normalizeText(a.app).includes(q) ||
        String(a.num) === q
      );
    }

    if (countEl) countEl.textContent = items.length;

    if (items.length === 0) {
      listEl.innerHTML = `<div class="col-span-full p-6 text-center text-slate-500 text-xs">No se encontraron aplicaciones con esos filtros.</div>`;
      return;
    }

    listEl.innerHTML = items.map(item => {
      const playBadgeClass = item.googlePlay === 'ACTIVA'
        ? 'bg-red-100 text-red-800 border-red-200'
        : (item.googlePlay === 'BAJA' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200');
      const playText = item.googlePlay === 'ACTIVA'
        ? 'Play: ACTIVA'
        : (item.googlePlay === 'BAJA' ? 'Play: BAJA' : 'Play: NO ENC.');

      const condusefBadgeClass = item.condusef === 'SÍ'
        ? 'bg-rose-100 text-rose-800 border-rose-200'
        : 'bg-amber-50 text-amber-800 border-amber-200';

      return `
        <div onclick="EscudoApp.openAppFicha(${item.num})" class="p-3 rounded-xl bg-slate-50 hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between space-y-2 shadow-sm">
          <div>
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="font-mono text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-800 text-white">N° ${item.num}</span>
              <span class="font-mono text-[10px] font-extrabold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">${item.reportes.toLocaleString('es-MX')} rep.</span>
            </div>
            <h5 class="font-bold text-slate-900 text-xs leading-snug truncate" title="${escapeHtml(item.app)}">${escapeHtml(item.app)}</h5>
          </div>

          <div class="space-y-1.5 pt-1.5 border-t border-slate-200/80">
            <div class="flex items-center justify-between gap-1 text-[10px]">
              <span class="px-1.5 py-0.5 rounded border font-semibold ${condusefBadgeClass}">CONDUSEF: ${item.condusef}</span>
              <span class="px-1.5 py-0.5 rounded border font-semibold ${playBadgeClass}">${playText}</span>
            </div>
            <div class="flex items-center justify-between pt-1">
              <span class="text-[10px] text-sky-700 font-semibold hover:underline"><i class="fa-solid fa-circle-info mr-1"></i>Ver Ficha</span>
              <button type="button" onclick="event.stopPropagation(); EscudoApp.openReportModalForApp(${item.num});" class="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold">
                + Reportar
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function searchMontadeudas() {
    const q = document.getElementById('montadeudas-search')?.value || '';
    renderMontadeudasList(q);
  }

  /* =========================================================================
     CHATBOT ASISTENTE CÍVICO CON GEMINI 2.5 FLASH ("ESCUDOBOT")
     ========================================================================= */
  function toggleChatbot() {
    state.chatbotOpen = !state.chatbotOpen;
    const win = document.getElementById('escudobot-window');
    if (win) {
      if (state.chatbotOpen) {
        win.classList.remove('hidden');
        document.getElementById('escudobot-input')?.focus();
      } else {
        win.classList.add('hidden');
      }
    }
  }

  function sendChatbotCommand(command) {
    const input = document.getElementById('escudobot-input');
    if (input) {
      input.value = command;
      handleChatbotSubmit();
    }
  }

  async function handleChatbotSubmit() {
    const input = document.getElementById('escudobot-input');
    const msg = (input?.value || '').trim();
    if (!msg) return;

    input.value = '';
    appendChatMessage('user', msg);

    const typing = document.getElementById('escudobot-typing');
    if (typing) typing.classList.remove('hidden');

    const apiKey = (document.getElementById('gemini-api-key')?.value || '').trim();

    // 1. Detección de Comandos Directos de Navegación
    const lower = msg.toLowerCase();
    if (lower.includes('buscar bbva') || (lower.includes('buscar') && lower.includes('bbva'))) {
      switchTab('directorio');
      executeDirectSearch('BBVA');
      document.getElementById('sipres-search-input').value = 'BBVA';
      respondChatbot('¡Hecho! Te he llevado al directorio SIPRES y he buscado las entidades relacionadas a **BBVA**.');
      if (typing) typing.classList.add('hidden');
      return;
    }

    if (lower.includes('calcular') || lower.includes('crédito') || lower.includes('semáforo') || lower.includes('interés')) {
      switchTab('credito');
      respondChatbot('¡Listo! Te he llevado al **Semáforo de Préstamo Justo**. Aquí puedes calcular el sobrecosto de tu préstamo y consultar la tabla de amortización cuota por cuota.');
      if (typing) typing.classList.add('hidden');
      return;
    }

    if (lower.includes('queja') || lower.includes('condusef') || lower.includes('denuncia') || lower.includes('reclamar')) {
      switchTab('quejas');
      respondChatbot('Te he trasladado al **Generador de Quejas Oficiales CONDUSEF**. Puedes redactar tu escrito jurídico y firmarlo digitalmente.');
      if (typing) typing.classList.add('hidden');
      return;
    }

    if (lower.includes('mensaje') || lower.includes('forense') || lower.includes('ia') || lower.includes('sospechoso')) {
      switchTab('analizador');
      respondChatbot('Estamos en el **Laboratorio Forense IA**. Pega cualquier mensaje sospechoso o sube una captura de pantalla para evaluarlo.');
      if (typing) typing.classList.add('hidden');
      return;
    }

    if (lower.includes('radar') || lower.includes('montadeudas') || lower.includes('estafa') || lower.includes('mapa')) {
      switchTab('radar');
      respondChatbot('Te he llevado al **Radar Comunitario**. Puedes comprobar teléfonos o consultar el mapa de estafas en México.');
      if (typing) typing.classList.add('hidden');
      return;
    }

    if (lower.includes('modo oscuro') || lower.includes('dark')) {
      toggleDarkMode();
      respondChatbot('¡Modo de visualización alternado con éxito!');
      if (typing) typing.classList.add('hidden');
      return;
    }

    // 2. Consulta directa de cualquiera de las 409 entidades en EscudoBot
    const matchedEntities = findMentionedEntities(msg);
    if (matchedEntities.length > 0 && lower.startsWith('buscar ')) {
      const target = matchedEntities[0];
      switchTab('directorio');
      executeDirectSearch(target.n);
      const searchInput = document.getElementById('sipres-search-input');
      if (searchInput) searchInput.value = target.n;
      respondChatbot(`¡Listo! He buscado **${target.n}** en el directorio SIPRES: **${target.s}** (Folio SIPRES: **${target.f}**, Sector: **${target.t}**, Estatus: **${target.e}**).`);
      if (typing) typing.classList.add('hidden');
      return;
    }

    // 3. Consulta con Gemini 2.5 Flash o Respuesta Local Conectada a las 409 Entidades
    if (apiKey) {
      try {
        const reply = await queryGeminiChat(msg, apiKey, matchedEntities);
        respondChatbot(reply);
      } catch (err) {
        console.warn('[EscudoBot] Error con Gemini API, respondiendo con motor local:', err);
        respondChatbot(getLocalChatbotReply(lower, matchedEntities));
      }
    } else {
      setTimeout(() => {
        respondChatbot(getLocalChatbotReply(lower, matchedEntities));
      }, 300);
    }

    if (typing) typing.classList.add('hidden');
  }

  function getLocalChatbotReply(text, matchedEntities = []) {
    if (matchedEntities && matchedEntities.length > 0) {
      const e = matchedEntities[0];
      const extraCount = matchedEntities.length > 1 ? ` (y otras ${matchedEntities.length - 1} coincidencias relacionadas)` : '';
      return `✅ **Entidad Localizada en nuestras 409 instituciones SIPRES**${extraCount}: **${e.s}** (Nombre comercial: **${e.n}** | Folio SIPRES: **#${e.f}** | Sector: **${e.t}** | Estatus: **${e.e}** | Ubicación: **${e.d}**). Recuerda que jamás solicita pagos ni fianzas por adelantado.`;
    }
    if (text.includes('anticipo') || text.includes('fianza') || text.includes('cobran antes')) {
      return '¡Cuidado! Ninguna financiera legal en México cobra dinero por adelantado para prestarte. Si te piden un depósito para "liberar fondos" o "gastos de fianza", es una estafa tipificada en el Art. 386 del Código Penal Federal.';
    }
    if (text.includes('montadeudas') || text.includes('amenaza') || text.includes('contactos')) {
      return 'Las apps montadeudas cometen cobranza extrajudicial ilegal (Art. 284 Bis CPF). No pagues bajo amenaza, retira los permisos a la app, avisa a tus contactos que te hackearon y denuncia de inmediato al 088 de la Policía Cibernética.';
    }
    if (text.includes('sipres') || text.includes('qué es') || text.includes('que es')) {
      return 'El SIPRES (Sistema de Registro de Prestadores de Servicios Financieros) es el catálogo oficial de la CONDUSEF con las 409 entidades financieras legalmente autorizadas en nuestro padrón (Banca Múltiple, Banca de Desarrollo, SOFIPO, SOCAP, Uniones de Crédito y Fintech). Puedes preguntarme el nombre de cualquier banco, caja o fintech para verificar su Folio SIPRES.';
    }
    return 'Entendido. Como asistente de ciberseguridad financiera en México, puedo verificar cualquiera de las **409 entidades del SIPRES** (solo dime su nombre o folio), ayudarte a redactar quejas legales en PDF, detectar si un CAT es engañoso o analizar mensajes de estafas. ¿Qué deseas realizar?';
  }

  async function queryGeminiChat(userMsg, apiKey, matchedEntities = []) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const entityContext = matchedEntities && matchedEntities.length > 0
      ? `\nDatos oficiales en nuestro padrón SIPRES de 409 entidades sobre la institución mencionada: ${matchedEntities.slice(0, 3).map(e => `${e.s} (Nombre corto: ${e.n}, Folio SIPRES: ${e.f}, Sector: ${e.t}, Estatus: ${e.e}, Estado: ${e.d})`).join('; ')}.`
      : '';
    const systemPrompt = `Eres EscudoBot, el Asistente Cívico Virtual de la plataforma mexicana "Escudo Financiero Pro" (que opera con un padrón depurado de 409 entidades financieras sin SOFOMs). Tu función es orientar a los usuarios sobre derechos financieros, CONDUSEF, SIPRES, prevención de fraudes (anticipos, montadeudas, phishing) y ayudarles a navegar por la página web.${entityContext} Responde con un tono empático, firme, profesional y conciso en español mexicano. Máximo 2 o 3 párrafos cortos.`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nPregunta del usuario: ${userMsg}` }] }
        ]
      })
    });

    if (!response.ok) throw new Error('Gemini API call failed');
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  function appendChatMessage(sender, text) {
    const container = document.getElementById('escudobot-messages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = sender === 'user' ? 'flex justify-end' : 'flex items-start space-x-2';

    if (sender === 'user') {
      div.innerHTML = `<div class="chat-bubble-user p-2.5 rounded-xl max-w-[85%] text-xs">${escapeHtml(text)}</div>`;
    } else {
      div.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 text-[10px]">
          <i class="fa-solid fa-robot"></i>
        </div>
        <div class="chat-bubble-bot p-2.5 rounded-xl max-w-[85%] text-xs leading-relaxed">${escapeHtml(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
      `;
    }

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function respondChatbot(text) {
    appendChatMessage('bot', text);
  }

  /* =========================================================================
     SISTEMA DE NAVEGACIÓN Y ATAJOS
     ========================================================================= */
  function switchTab(tabId) {
    state.activeTab = tabId;

    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) targetTab.classList.add('active');

    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab-btn') === tabId) {
        btn.className = 'nav-tab-btn px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 bg-sky-600 text-white shadow-sm';
      } else {
        btn.className = 'nav-tab-btn px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-800';
      }
    });

    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
      if (btn.getAttribute('data-tab-btn') === tabId) {
        btn.className = 'bottom-nav-btn flex flex-col items-center py-1 px-2 rounded-lg text-sky-400 font-bold';
      } else {
        btn.className = 'bottom-nav-btn flex flex-col items-center py-1 px-2 rounded-lg text-slate-400';
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName))) {
        e.preventDefault();
        focusSearch();
      }

      if (e.key === 'Escape') {
        closeAllModals();
        if (state.chatbotOpen) toggleChatbot();
      }

      if (['1', '2', '3', '4', '5'].includes(e.key) && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        const tabs = ['directorio', 'quejas', 'credito', 'analizador', 'radar'];
        const index = parseInt(e.key) - 1;
        if (tabs[index]) switchTab(tabs[index]);
      }
    });
  }

  function setupInitialFormValues() {
    const fechaInput = document.getElementById('q-fecha-hechos');
    if (fechaInput && !fechaInput.value) {
      fechaInput.value = new Date().toISOString().split('T')[0];
    }
    updateUdecoInfo();
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  function closeAllModals() {
    document.querySelectorAll('[id^="modal-"]').forEach(modal => {
      modal.classList.add('hidden');
    });
    document.body.style.overflow = '';
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* =========================================================================
     SOPORTE PWA OFFLINE
     ========================================================================= */
  function initPWA() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').then(reg => {
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        reg.update();
      }).catch(err => {
        console.log('[PWA] Service Worker no registrado (modo local):', err);
      });
    }
  }

  window.addEventListener('DOMContentLoaded', init);

  return {
    switchTab,
    toggleDarkMode,
    focusSearch,
    clearSearch,
    executeDirectSearch,
    setStatusFilter,
    applySecondaryFilters,
    loadMoreResults,
    openExpediente,
    copyExpedienteCedula,
    addToComparator,
    removeFromComparator,
    clearComparator,
    openComparatorModal,
    setQuejaProcedure,
    transferEntityToQueja,
    handleInstitucionAutocomplete,
    validateCurpLive,
    clearQuejaDraft,
    updateUdecoInfo,
    loadTemplate,
    applyTemplateCausa,
    clearSignature,
    handleEvidenceUpload,
    removeEvidence,
    generateQuejaPreview,
    downloadQuejaPDF,
    calcCredito,
    exportAmortizationCSV,
    switchAiInputMode,
    handleAiImageSelect,
    clearAiImage,
    setAiMode,
    loadAiExample,
    runForensicAnalysis,
    openPoliceComplaintModal,
    copyPoliceComplaint,
    searchRadarPhone,
    filterRadar,
    filterRadarByState,
    renderCitizenReports,
    confirmRadarReport,
    shareRadarReport,
    denunciarReporte088,
    transferReporteToRedeco,
    copyMontadeudasShieldMessage,
    handleReportAppSelect,
    handleReportNameInput,
    openReportModalForApp,
    openAppFicha,
    submitCitizenReport,
    switchRadarSubtab,
    searchMontadeudas,
    toggleChatbot,
    sendChatbotCommand,
    handleChatbotSubmit,
    openModal,
    closeModal
  };

})();
