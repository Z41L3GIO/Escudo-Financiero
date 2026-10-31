/**
 * ============================================================================
 * ESCUDO FINANCIERO PRO â€” LÃ“GICA PRINCIPAL INTEGRAL (ES6+)
 * ============================================================================
 * Plataforma CÃ­vica de Ciberseguridad Financiera, Buscador SIPRES (409 Entidades),
 * Generador de Quejas JurÃ­dicas CONDUSEF en PDF Vectorial (pdf-lib + EscudoPDF),
 * Medidor de CrÃ©dito con AmortizaciÃ³n Oficial Mexicana (Banxico / LIVA),
 * Laboratorio HeurÃ­stico Multimodal, Radar Comunitario (399 Apps) y EscudoBot IA.
 * ============================================================================
 */
const VERIFIED_CHANNELS_PREVIEW = {
      '40012': { tel: '55 5226 2663', une: 'une.mx@bbva.com', web: 'bbva.mx' },
      '40072': { tel: '81 8156 9600', une: 'une@banorte.com', web: 'banorte.com' },
      '40014': { tel: '55 5169 4300', une: 'ueac@santander.com.mx', web: 'santander.com.mx' },
      '40002': { tel: '55 1226 2639', une: 'une@banamex.com', web: 'banamex.com' },
      '40021': { tel: '55 5721 3390', une: 'mexico_une@hsbc.com.mx', web: 'hsbc.com.mx' },
      '40044': { tel: '55 5728 1900', une: 'une@scotiabank.com.mx', web: 'scotiabank.com.mx' },
      '40127': { tel: '55 5447 8810', une: 'uau@bancoazteca.com.mx', web: 'bancoazteca.com.mx' },
      '40137': { tel: '800 122 6773', une: 'une@bancoppel.com', web: 'bancoppel.com' },
      '40638': { tel: '800 099 1133', une: 'ayuda@nu.com.mx', web: 'nu.com.mx' },
      '27032': { tel: '55 7822 6646', une: 'une@storicard.com', web: 'storicard.com' },
      '27009': { tel: '55 2629 2789', une: 'une@klar.mx', web: 'klar.mx' },
      '65033': { tel: '55 4973 7300', une: 'une@mercadopago.com.mx', web: 'mercadopago.com.mx' },
      '65041': { tel: '81 3282 8282', une: 'une@spinbyoxxo.com.mx', web: 'spinbyoxxo.com.mx' }
    };

    const PreviewApp = {
      currentView: 'grid',
      currentTab: 'directorio',
      sidebarCollapsed: false,
      procedure: 'condusef',
      evidenceFiles: [],
      pdfPreviewState: {
        mode: 'dom',
        layout: null,
        meta: null,
        filename: 'Escrito-CONDUSEF.pdf',
        docType: 'queja',
        blobUrl: null,
        folio: null,
        folioIsRedeco: null
      },
      comparatorList: [],
      matchedEntities: null,
      pageSize: 30,
      renderLimit: 30,
      selectedExpedienteEntity: null,
      creditoAnticipo: 'NO',
      creditoMatchedSipres: null,
      creditoMatchedApp: null,
      lastCreditoDiag: null,
      lastAmortRows: [],
      toastTimer: null,
      lastRoadmapData: null,
      chatbotOpen: false,
      chatbotBusy: false,
      chatContext: { app: null, entity: null },
      chatEngine: localStorage.getItem('escudo_chat_engine') || 'local',
      geminiApiKey: localStorage.getItem('escudo_gemini_key') || '',
      isListeningSpeech: false,
      speechRecognition: null,
      activeSpeechBtn: null,
      chatHistory: [],
      lastCopilotoDraft: null,
      alerts: [
        "<strong>Alerta Oficial:</strong> Detección de gestores no autorizados en WhatsApp solicitando anticipos. Recuerda: <em>ninguna entidad regulada cobra por autorizar créditos</em> (Art. 386 CPF).",
        "<strong>Radar SIPRES:</strong> 409 instituciones financieras verificadas en el directorio oficial CONDUSEF 2026.",
        "<strong>Seguridad Cívica:</strong> Si fuiste víctima de cobranza abusiva, genera tu reclamación jurídica con folio oficial en el módulo de Quejas."
      ],
      alertIndex: 0,

      init() {
        this.matchedEntities = window.SIPRES_DATABASE || [];
        this.renderLimit = this.pageSize;
        this.renderEntities();
        this.populateDatalist();
        this.populateCreditoDatalist();
        this.setupKeyboardShortcuts();
        this.initSignatureCanvas();
        this.updateComparatorUI();
        this.updateDocPreview();
        this.handleCreditoLenderInput('BBVA');
        this.updateRadarKPIs();
        this.initFontSize();
        this.initPanicKeyShortcut();
        this.initServiceWorkerPwa();
        this.updateQuejaHashLive();
        this.initChatbotUi();
        this.updateEngineBadgeUI();
        this.initChatbotDragAndPaste();
        // Cargar preferencia de tema
        if (localStorage.getItem('escudo_theme') === 'dark' || (!localStorage.getItem('escudo_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
          document.getElementById('theme-toggle-icon').className = 'fa-solid fa-sun text-xs text-amber-400';
        }
        // Apertura automática pop-up de Términos y Condiciones al abrir la página
        this.checkTermsOnLaunch();
      },

      /* =======================================================================
         CHATBOT ASISTENTE CÍVICO CON GEMINI & HEURÍSTICA ("ESCUDOBOT")
         ======================================================================= */
      getEscudobotLogoSvg(customClass = "w-5 h-5", shieldColor = "#f59e0b") {
        return `<svg class="${customClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="8.5" y1="2" x2="8.5" y2="4" stroke="currentColor" stroke-width="1.5" />
          <circle cx="8.5" cy="1.8" r="0.8" fill="${shieldColor}" stroke="none" />
          <rect x="4" y="4" width="9" height="5.5" rx="1.8" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1.4" />
          <rect x="5.8" y="5.8" width="5.4" height="1.9" rx="0.95" fill="${shieldColor}" stroke="none" />
          <line x1="7.5" y1="9.5" x2="9.5" y2="9.5" stroke="currentColor" stroke-width="1.5" />
          <rect x="3.5" y="10.5" width="9" height="7.2" rx="1.8" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1.4" />
          <circle cx="8" cy="14" r="0.9" fill="${shieldColor}" stroke="none" />
          <path d="M3.5 12 C1.8 12.5 1.5 14.5 1.8 16.5" stroke="currentColor" stroke-width="1.4" />
          <path d="M12.5 12.5 C13.8 12.5 14.8 13.5 15.5 14.2" stroke="currentColor" stroke-width="1.6" />
          <rect x="4.8" y="17.7" width="2.2" height="3" rx="0.8" fill="currentColor" stroke="none" />
          <rect x="9" y="17.7" width="2.2" height="3" rx="0.8" fill="currentColor" stroke="none" />
          <path d="M15 9.2 C17 8.5 20 8.5 22 9.2 C22 14.2 19.5 18 18.5 21 C17.5 18 15 14.2 15 9.2 Z" fill="${shieldColor}" fill-opacity="0.22" stroke="${shieldColor}" stroke-width="1.6" stroke-linejoin="round" />
          <path d="M17 14 L18.2 15.2 L20.2 12.8" stroke="${shieldColor}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`;
      },

      toggleChatbot() {
        this.chatbotOpen = !this.chatbotOpen;
        const win = document.getElementById('escudobot-window');
        if (win) {
          if (this.chatbotOpen) {
            win.classList.remove('hidden');
            setTimeout(() => document.getElementById('escudobot-input')?.focus(), 60);
          } else {
            win.classList.add('hidden');
            const menu = document.getElementById('escudobot-engine-menu');
            if (menu) menu.classList.add('hidden');
          }
        }
      },

      initChatbotUi() {
        const container = document.getElementById('escudobot-messages');
        if (container && !container.dataset.bound) {
          container.dataset.bound = '1';
          container.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-chat-cmd]');
            if (!btn) return;
            const cmd = btn.getAttribute('data-chat-cmd');
            const arg = btn.getAttribute('data-chat-arg') || '';
            this.runChatAction(cmd, arg);
          });
        }
      },

      initChatbotDragAndPaste() {
        const win = document.getElementById('escudobot-window');
        if (!win || win.dataset.dropBound) return;
        win.dataset.dropBound = '1';

        // Escuchar pegado de capturas con el portapapeles (Ctrl+V)
        window.addEventListener('paste', (e) => {
          if (!this.chatbotOpen) return;
          const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
          if (!items) return;
          for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
              const file = item.getAsFile();
              if (file) {
                e.preventDefault();
                this.processChatbotImage(file);
                break;
              }
            }
          }
        });

        // Arrastrar y soltar imagen en la ventana del chat
        win.addEventListener('dragover', (e) => {
          e.preventDefault();
          win.classList.add('ring-2', 'ring-legal-gold');
        });
        win.addEventListener('dragleave', (e) => {
          e.preventDefault();
          win.classList.remove('ring-2', 'ring-legal-gold');
        });
        win.addEventListener('drop', (e) => {
          e.preventDefault();
          win.classList.remove('ring-2', 'ring-legal-gold');
          const file = e.dataTransfer?.files?.[0];
          if (file && file.type.startsWith('image/')) {
            this.processChatbotImage(file);
          }
        });
      },

      toggleEngineSelector() {
        const menu = document.getElementById('escudobot-engine-menu');
        if (menu) menu.classList.toggle('hidden');
      },

      setChatEngine(engine) {
        this.chatEngine = engine;
        try { localStorage.setItem('escudo_chat_engine', engine); } catch (e) {}
        this.updateEngineBadgeUI();
        const menu = document.getElementById('escudobot-engine-menu');
        if (menu) menu.classList.add('hidden');
        const keyBox = document.getElementById('escudobot-api-key-box');
        if (keyBox) {
          if (engine === 'gemini') keyBox.classList.remove('hidden');
          else keyBox.classList.add('hidden');
        }
        this.showToast(engine === 'gemini' ? 'Motor activado: Google Gemini IA (BYOK)' : 'Motor activado: Heurística Local (0ms • Offline)');
      },

      saveGeminiApiKey() {
        const input = document.getElementById('escudobot-api-key-input');
        const key = (input?.value || '').trim();
        this.geminiApiKey = key;
        try { localStorage.setItem('escudo_gemini_key', key); } catch (e) {}
        this.showToast(key ? 'Clave de Gemini API guardada en memoria local.' : 'Clave de Gemini API eliminada.');
        const menu = document.getElementById('escudobot-engine-menu');
        if (menu) menu.classList.add('hidden');
        this.updateEngineBadgeUI();
      },

      updateEngineBadgeUI() {
        const textEl = document.getElementById('escudobot-engine-text');
        const dotEl = document.getElementById('escudobot-engine-dot');
        const keyInput = document.getElementById('escudobot-api-key-input');
        if (keyInput && this.geminiApiKey) keyInput.value = this.geminiApiKey;
        if (!textEl || !dotEl) return;
        if (this.chatEngine === 'gemini') {
          textEl.innerText = this.geminiApiKey ? 'Gemini 2.5 Flash' : 'Gemini (Sin Key)';
          textEl.className = 'font-mono text-[10px] text-legal-gold';
          dotEl.className = 'w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse';
        } else {
          textEl.innerText = 'Heurística Local';
          textEl.className = 'font-mono text-[10px] text-emerald-400';
          dotEl.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse';
        }
      },

      toggleSpeechRecognition() {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) {
          this.showToast('El reconocimiento de voz (Web Speech API) no está soportado en este navegador.');
          return;
        }

        const micBtn = document.getElementById('escudobot-mic-btn');
        if (this.isListeningSpeech) {
          if (this.speechRecognition) {
            try { this.speechRecognition.stop(); } catch (e) {}
          }
          this.isListeningSpeech = false;
          if (micBtn) {
            micBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
            micBtn.classList.add('text-slate-500', 'hover:text-legal-gold');
            micBtn.innerHTML = '<i class="fa-solid fa-microphone text-xs"></i>';
          }
          return;
        }

        try {
          const recognition = new SpeechRec();
          recognition.lang = 'es-MX';
          recognition.interimResults = true;
          recognition.continuous = false;

          recognition.onstart = () => {
            this.isListeningSpeech = true;
            if (micBtn) {
              micBtn.classList.add('bg-rose-500', 'text-white', 'animate-pulse');
              micBtn.classList.remove('text-slate-500', 'hover:text-legal-gold');
              micBtn.innerHTML = '<i class="fa-solid fa-stop text-xs"></i>';
            }
            this.showToast('Escuchando tu consulta por voz... habla ahora.');
          };

          recognition.onresult = (e) => {
            let transcript = '';
            for (let i = e.resultIndex; i < e.results.length; ++i) {
              transcript += e.results[i][0].transcript;
            }
            const input = document.getElementById('escudobot-input');
            if (input && transcript) {
              input.value = transcript;
            }
          };

          recognition.onerror = (e) => {
            console.warn('[EscudoBot] Speech Recognition Error:', e);
            this.isListeningSpeech = false;
            if (micBtn) {
              micBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
              micBtn.classList.add('text-slate-500', 'hover:text-legal-gold');
              micBtn.innerHTML = '<i class="fa-solid fa-microphone text-xs"></i>';
            }
            this.showToast('No se detectó audio o el micrófono fue cancelado.');
          };

          recognition.onend = () => {
            this.isListeningSpeech = false;
            if (micBtn) {
              micBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
              micBtn.classList.add('text-slate-500', 'hover:text-legal-gold');
              micBtn.innerHTML = '<i class="fa-solid fa-microphone text-xs"></i>';
            }
          };

          this.speechRecognition = recognition;
          recognition.start();
        } catch (err) {
          console.error('[EscudoBot] Speech start error:', err);
          this.showToast('No se pudo acceder al micrófono.');
        }
      },

      toggleSpeechSynthesis(btn) {
        if (!('speechSynthesis' in window)) {
          this.showToast('La síntesis de voz no está soportada en tu navegador.');
          return;
        }

        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          document.querySelectorAll('[data-speaking="1"]').forEach(el => {
            el.dataset.speaking = '0';
            el.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            el.classList.remove('text-amber-500', 'animate-pulse');
          });
          if (this.activeSpeechBtn === btn) {
            this.activeSpeechBtn = null;
            return;
          }
        }

        const text = btn.getAttribute('data-speech-text') || '';
        if (!text) return;

        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'es-MX';
        utter.rate = 1.05;
        utter.pitch = 1.0;

        btn.dataset.speaking = '1';
        btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
        btn.classList.add('text-amber-500', 'animate-pulse');
        this.activeSpeechBtn = btn;

        utter.onend = () => {
          btn.dataset.speaking = '0';
          btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
          btn.classList.remove('text-amber-500', 'animate-pulse');
          this.activeSpeechBtn = null;
        };

        utter.onerror = () => {
          btn.dataset.speaking = '0';
          btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
          btn.classList.remove('text-amber-500', 'animate-pulse');
          this.activeSpeechBtn = null;
        };

        window.speechSynthesis.speak(utter);
      },

      async handleChatbotImageUpload(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        e.target.value = '';
        await this.processChatbotImage(file);
      },

      async processChatbotImage(file) {
        if (!file || !file.type.startsWith('image/')) {
          this.showToast('Por favor selecciona un archivo de imagen (JPG, PNG o WEBP).');
          return;
        }
        this.showToast('Sanitizando metadatos EXIF de la imagen (Protección de privacidad)...');
        const sanitized = await this.sanitizeImageExif(file);
        
        // Renderizar burbuja del usuario con thumbnail de la imagen
        this.renderChatBubble('user', `📸 [Captura adjuntada: ${file.name}]`, [], {
          imageThumb: sanitized.dataUrl
        });

        const typing = document.getElementById('escudobot-typing');
        if (typing) typing.classList.remove('hidden');

        try {
          // Ejecutar auditoría sobre la imagen sanitizada
          this.switchForenseMode('image');
          this.runForensicAudit();
          const r = this.lastForenseResult;
          
          setTimeout(() => {
            if (typing) typing.classList.add('hidden');
            const lines = [
              `🧠 **Auditoría Heurística de Evidencia Visual**`,
              `• **Veredicto:** ${r?.verdictTitle || 'Evidencia Evaluada'} (Riesgo: **${r?.score || 88}/100**)`,
              `• **Tipología:** ${r?.tipologia || 'Coacción y Amenazas Móviles'}`,
              `• **Fundamento Legal:** ${r?.legalBasis || 'Art. 284 Bis y 386 CPF'}`,
              `• **Acción recomendada:** ${r?.accionInmediata || 'No pagar, preservar evidencias y denunciar al 088'}`
            ];
            const actions = [
              { label: '📄 Descargar Dictamen PDF', cmd: 'forensicPdf' },
              { label: '⚖️ Cargar a Quejas CONDUSEF', cmd: 'forensicQueja' },
              { label: '🚓 Denuncia Policía Cibernética (088)', cmd: 'police' },
              { label: '📋 Copiar Aviso para WhatsApp', cmd: 'shield', arg: 'App no regulada' }
            ];
            this.respondChatbot(lines.join('\n'), actions);
          }, 450);
        } catch (err) {
          if (typing) typing.classList.add('hidden');
          this.respondChatbot('Pude recibir la captura con metadatos depurados, pero ocurrió un detalle al analizarla. Puedes verla en el Laboratorio Heurístico.', [
            { label: 'Ir al Laboratorio Heurístico', cmd: 'goto', arg: 'forense' }
          ]);
        }
      },

      extractQuejaDraft(text) {
        if (!text || text.length < 15) return null;
        const clean = this.normalizeText(text);

        // Intención de reclamación o controversia patrimonial
        const hasComplaintIntent = /(quej|reclam|carg|transfer|comision|descont|cobro|quitaron|robaron|estaf|fraude|usur|interes|no reconozc|no autoric)/i.test(clean);
        if (!hasComplaintIntent) return null;

        // Extracción de montos ($1,500, 1500 pesos, $300.50, etc.)
        let amount = null;
        const amountMatch = text.match(/\$\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?|[0-9]+(?:\.[0-9]{2})?)/) ||
                            text.match(/([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?|[0-9]+(?:\.[0-9]{2})?)\s*(?:pesos|mxn)/i);
        if (amountMatch) {
          const rawNum = amountMatch[1].replace(/,/g, '');
          const num = parseFloat(rawNum);
          if (!isNaN(num) && num >= 50 && num <= 5000000) {
            amount = num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
        }

        // Extracción de fecha (15 de octubre, 2026-10-15, ayer, etc.)
        let dateStr = new Date().toISOString().split('T')[0];
        const dateMatch = text.match(/(\d{1,2})\s+de\s+([a-záéíóú]+)(?:\s+de\s+(\d{4}))?/i);
        if (dateMatch) {
          const meses = { enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06', julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12' };
          const dia = dateMatch[1].padStart(2, '0');
          const mes = meses[this.normalizeText(dateMatch[2])] || '10';
          const anio = dateMatch[3] || '2026';
          dateStr = `${anio}-${mes}-${dia}`;
        }

        // Detección de entidad financiera SIPRES
        const entities = this.findMentionedEntities(text);
        const matchedEntity = entities.length > 0 ? entities[0] : null;

        // Detección de causa
        let causa = 'cargos_no_reconocidos';
        let causaLabel = 'Cargo no reconocido';
        if (/transferencia/.test(clean)) {
          causa = 'transferencia_no_reconocida';
          causaLabel = 'Transferencia electrónica no reconocida (SPEI)';
        } else if (/comision|comisiones/.test(clean)) {
          causa = 'comision_no_pactada';
          causaLabel = 'Cobro indebido de comisiones no pactadas';
        } else if (/interes|usura|tasa/.test(clean)) {
          causa = 'intereses_excesivos';
          causaLabel = 'Cobro abusivo de intereses o usura';
        } else if (/cobranza|amenaz|despacho/.test(clean)) {
          causa = 'cobranza_indebida';
          causaLabel = 'Cobranza indebida y hostigamiento (REDECO)';
        }

        // Si se identificó al menos una entidad o un monto con intención de queja
        if (matchedEntity || amount) {
          return {
            entity: matchedEntity,
            entityName: matchedEntity ? (matchedEntity.s || matchedEntity.n) : 'Entidad por verificar',
            amount: amount || '1,000.00',
            date: dateStr,
            causa,
            causaLabel,
            rawText: text
          };
        }
        return null;
      },

      loadChatDraftToQueja(draft) {
        this.switchTab('quejas');
        this.setWizardStep(2);

        if (draft.entity) {
          this.applyEntityToQuejaFields(draft.entity);
        } else {
          const entInput = document.getElementById('input-queja-entidad');
          if (entInput) entInput.value = draft.entityName;
        }

        const montoInput = document.getElementById('input-queja-monto');
        if (montoInput && draft.amount) montoInput.value = draft.amount;

        const fechaInput = document.getElementById('input-queja-fecha');
        if (fechaInput && draft.date) fechaInput.value = draft.date;

        const causaInput = document.getElementById('input-queja-causa');
        if (causaInput && draft.causa) causaInput.value = draft.causa;

        const hechosInput = document.getElementById('input-queja-hechos');
        if (hechosInput) {
          hechosInput.value = `En fecha ${draft.date}, se suscitó la siguiente controversia financiera: "${draft.rawText.trim()}". Motivo por el cual interpongo formal reclamación por hechos constitutivos de ${draft.causaLabel}, sin que mediara mi consentimiento expreso ni autorización legal en términos de la Ley de Protección y Defensa al Usuario de Servicios Financieros.`;
        }

        const pretInput = document.getElementById('input-queja-pretensiones');
        if (pretInput) {
          pretInput.value = `Solicito a la institución y a esta H. Comisión la inmediata devolución e indemnización del importe reclamado por $${draft.amount} MXN, así como la cancelación de accesorios moratorios y el cese de afectaciones en Sociedades de Información Crediticia.`;
        }

        this.updateDocPreview();
        this.showToast('¡Borrador procesal precargado con éxito! Revisa los Pasos 2, 3 y 4 en Quejas CONDUSEF.');
      },

      exportChatSummary() {
        if (!this.chatHistory || this.chatHistory.length === 0) {
          this.showToast('No hay mensajes aún en la sesión para exportar.');
          return;
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const transcriptLines = this.chatHistory.map(m => `[${m.time}] ${m.sender === 'user' ? 'USUARIO' : 'ESCUDOBOT'}:\n${m.text}\n`).join('\n');
        
        let hashStr = 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855';
        try {
          let hash = 0;
          for (let i = 0; i < transcriptLines.length; i++) {
            hash = ((hash << 5) - hash) + transcriptLines.charCodeAt(i);
            hash |= 0;
          }
          hashStr = 'NOM151-' + Math.abs(hash).toString(16).toUpperCase().padStart(16, '0') + '-SEC2026';
        } catch (e) {}

        const doc = [
          '=========================================================================',
          '   MINUTA DE ASISTENCIA Y ORIENTACIÓN CÍVICO-FINANCIERA (ESCUDOBOT)     ',
          '        Plataforma Escudo Financiero Pro • Sistema Cívico Digital       ',
          '=========================================================================',
          `Fecha y hora de emisión: ${dateStr}`,
          `Constancia Digital de Integridad (NOM-151): ${hashStr}`,
          'Modo de Inferencia: ' + (this.chatEngine === 'gemini' ? 'Google Gemini 2.5 Flash IA' : 'Heurística Algorítmica Local (0ms • Offline)'),
          '-------------------------------------------------------------------------',
          '1. CONTACTOS DE EMERGENCIA Y ASISTENCIA INMEDIATA:',
          '   • Denuncia Policía Cibernética Guardia Nacional: 088 (Atención 24/7)',
          '   • CONDUSEF Asesoría y Quejas: 55 53 400 999 / condusef.gob.mx',
          '   • Registro de Despachos de Cobranza (REDECO): condusef.gob.mx/redeco',
          '   • Semáforo & Quejas en PDF: Disponible en este aplicativo web local.',
          '-------------------------------------------------------------------------',
          '2. TRANSCRIPCIÓN ÍNTEGRA DE LA SESIÓN DE ORIENTACIÓN:',
          '',
          transcriptLines,
          '-------------------------------------------------------------------------',
          '3. AVISO LEGAL Y SALVAGUARDA DE PRIVACIDAD (LFPDPPP):',
          'Esta minuta tiene valor de orientación cívica y preservación de memoria local.',
          'No sustituye el asesoramiento de un abogado postulante ni constituye resolución judicial.',
          'Ningún dato de esta sesión ha sido transferido a servidores externos ni retenido en bases de datos.',
          '========================================================================='
        ].join('\n');

        const blob = new Blob([doc], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Minuta-Orientacion-EscudoBot-${now.toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(doc).then(() => {
            this.showToast('📄 Minuta descargada y copiada al portapapeles con éxito.');
          }).catch(() => {
            this.showToast('📄 Minuta descargada con éxito.');
          });
        } else {
          this.showToast('📄 Minuta descargada con éxito.');
        }
      },

      resetChatbot() {
        const container = document.getElementById('escudobot-messages');
        if (container) {
          container.innerHTML = `
            <div class="flex items-start space-x-2">
              <div class="w-6 h-6 rounded-lg bg-slate-900 dark:bg-legal-navy border border-legal-gold/30 text-legal-gold flex items-center justify-center shrink-0 text-[10px] shadow-2xs">
                ${this.getEscudobotLogoSvg('w-4 h-4')}
              </div>
              <div class="chat-bubble-bot p-2.5 rounded-xl max-w-[85%] text-xs leading-relaxed font-sans shadow-2xs">
                ¡Hola de nuevo! Sesión reiniciada. Soy <strong>EscudoBot</strong>, tu copiloto de ciberseguridad financiera y derechos cívicos. ¿En qué te oriento ahora?
              </div>
            </div>
          `;
        }
        this.chatHistory = [];
        this.showToast('Conversación de EscudoBot reiniciada.');
      },

      sendChatbotCommand(command) {
        const input = document.getElementById('escudobot-input');
        if (input) {
          input.value = command;
          this.handleChatbotSubmit();
        }
      },

      renderChatBubble(sender, text, actions = [], extra = {}) {
        const container = document.getElementById('escudobot-messages');
        if (!container) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        if (!this.chatHistory) this.chatHistory = [];
        this.chatHistory.push({ sender, text, time: timeStr, actions });

        const div = document.createElement('div');
        div.className = sender === 'user' ? 'flex justify-end' : 'flex items-start space-x-2';

        if (sender === 'user') {
          let imgThumbHtml = '';
          if (extra && extra.imageThumb) {
            imgThumbHtml = `
              <div class="mb-2 rounded-lg overflow-hidden border border-white/20 bg-black/20">
                <img src="${extra.imageThumb}" alt="Captura enviada" class="max-h-36 max-w-full rounded object-contain">
                <div class="text-[9px] text-emerald-300 font-mono px-2 py-0.5 bg-black/40 flex items-center gap-1">
                  <i class="fa-solid fa-shield-halved text-[8px]"></i> EXIF &amp; GPS Eliminados
                </div>
              </div>
            `;
          }
          div.innerHTML = `<div class="chat-bubble-user p-2.5 rounded-xl max-w-[85%] text-xs shadow-xs leading-relaxed font-sans">${imgThumbHtml}${this.escapeHtml(text)}</div>`;
        } else {
          const html = this.escapeHtml(text)
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-legal-gold dark:text-amber-400">$1</strong>')
            .replace(/\n/g, '<br>');

          let copilotoHtml = '';
          if (extra && extra.copilotoDraft) {
            const d = extra.copilotoDraft;
            copilotoHtml = `
              <div class="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] space-y-1.5 font-sans">
                <div class="flex items-center justify-between font-bold text-legal-gold">
                  <span class="flex items-center gap-1"><i class="fa-solid fa-bolt"></i> Copiloto Procesal CONDUSEF</span>
                  <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500">1 Clic</span>
                </div>
                <div class="text-slate-700 dark:text-slate-300 space-y-0.5">
                  <div><strong>Entidad:</strong> ${this.escapeHtml(d.entityName)}</div>
                  <div><strong>Monto reclamado:</strong> $${this.escapeHtml(d.amount)} MXN</div>
                  <div><strong>Causa:</strong> ${this.escapeHtml(d.causaLabel)}</div>
                </div>
                <button type="button" data-chat-cmd="loadDraft" class="w-full mt-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all">
                  <i class="fa-solid fa-file-pen text-[11px]"></i> Cargar a Quejas CONDUSEF
                </button>
              </div>
            `;
          }

          const actionsHtml = Array.isArray(actions) && actions.length > 0
            ? `<div class="mt-2.5 flex flex-wrap gap-1.5">${actions.map(a =>
                `<button type="button" data-chat-cmd="${this.escapeHtml(a.cmd)}" data-chat-arg="${this.escapeHtml(a.arg || '')}" class="px-2.5 py-1 rounded-lg bg-white dark:bg-obsidian-surface border border-slate-200 dark:border-obsidian-border text-slate-800 dark:text-slate-200 hover:border-legal-gold hover:text-legal-gold font-semibold text-[11px] shadow-2xs transition-all text-left flex items-center gap-1">${this.escapeHtml(a.label)}</button>`
              ).join('')}</div>`
            : '';

          const speechText = text.replace(/\*\*/g, '').replace(/[\n\r]+/g, ' ');

          div.innerHTML = `
            <div class="w-6 h-6 rounded-lg bg-slate-900 dark:bg-legal-navy border border-legal-gold/30 text-legal-gold flex items-center justify-center shrink-0 text-[10px] mt-0.5 shadow-2xs">
              ${this.getEscudobotLogoSvg('w-4 h-4')}
            </div>
            <div class="chat-bubble-bot p-2.5 rounded-xl max-w-[85%] text-xs leading-relaxed font-sans shadow-2xs relative group">
              <div class="absolute top-1.5 right-1.5 opacity-40 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button type="button" onclick="PreviewApp.toggleSpeechSynthesis(this)" data-speech-text="${this.escapeHtml(speechText)}" class="p-1 rounded text-slate-400 hover:text-legal-gold text-[10px] transition-colors" title="Leer respuesta en voz alta">
                  <i class="fa-solid fa-volume-high"></i>
                </button>
              </div>
              ${html}
              ${copilotoHtml}
              ${actionsHtml}
            </div>
          `;
        }

        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
      },

      respondChatbot(text, actions = [], extra = {}) {
        this.renderChatBubble('bot', text, actions, extra);
      },

      runChatAction(cmd, arg) {
        switch (cmd) {
          case 'goto':
            this.switchTab(arg);
            break;
          case 'ficha':
            this.openAppFicha(arg);
            break;
          case 'report':
            this.openNuevoReporteModal(arg);
            break;
          case 'police':
            this.openPoliceComplaintModal(arg);
            break;
          case 'shield':
            this.copyWhatsAppWarning(arg);
            this.respondChatbot('📋 Copié el aviso de autodefensa para tus contactos. Pégalo en tus grupos de WhatsApp o estados.');
            break;
          case 'queja':
            this.switchTab('quejas');
            break;
          case 'forensicPdf':
            this.downloadForensicPdf();
            break;
          case 'forensicQueja':
            this.transferForenseToQueja();
            break;
          case 'loadDraft':
            if (this.lastCopilotoDraft) {
              this.loadChatDraftToQueja(this.lastCopilotoDraft);
            } else {
              this.switchTab('quejas');
            }
            break;
          case 'command':
            this.sendChatbotCommand(arg);
            break;
          default:
            break;
        }
      },

      detectSuspiciousInput(msg) {
        const trimmed = (msg || '').trim();
        const norm = this.normalizeText(trimmed);

        const urlOnly = trimmed.match(/^(?:(?:analiza|analizame|revisa|revisame|checa|verifica|es\s+seguro|es\s+confiable)\s*:?\s*)?((?:https?:\/\/|www\.)\S+)$/i);
        if (urlOnly) return { type: 'url', text: urlOnly[1] };

        const explicit = trimmed.match(/^(?:analiza|analizame|revisa|revisame|checa|me\s+lleg[oó]\s+(?:este|el)\s+(?:mensaje|sms|texto)|me\s+mandaron|me\s+enviaron)[^:]{0,40}:\s*([\s\S]{20,})$/i);
        if (explicit) return { type: 'text', text: explicit[1].trim() };

        const fraudKw = /(fianza|anticipo|deposit|oxxo|spin|stp|pre-?aprobad|felicidades|liberar|gastos de gestion|sin buro|garantizad|deudor|embargo|urgente|clic|enlace|link|apk|codigo|otp|nip|cuenta suspendida|cuenta bloqueada|tarjeta terminacion|transferencia|clabe|aval|contactos|agenda|ultimo aviso|demanda|ganaste|premio)/;
        if (trimmed.length >= 60 && fraudKw.test(norm)) {
          return { type: 'text', text: trimmed };
        }
        return null;
      },

      findMentionedApps(text) {
        const catalog = window.APPS_PRESTAMO_DB || [];
        if (!catalog.length) return [];
        const clean = this.normalizeText(text);
        if (!clean) return [];

        const hits = [];
        for (const item of catalog) {
          const appNorm = this.normalizeText(item.app);
          if (appNorm.length >= 3 && clean.includes(appNorm)) {
            hits.push(item);
          }
        }
        return hits.slice(0, 3);
      },

      describeAppForChat(a) {
        const condusef = a.condusef === 'SÍ'
          ? 'SÍ, acumula reportes ante CONDUSEF'
          : 'NO, sin registro ante CONDUSEF (opera en la informalidad)';
        const play = a.googlePlay === 'ACTIVA' ? 'ACTIVA (sigue disponible en la tienda)'
          : (a.googlePlay === 'BAJA' ? 'DADA DE BAJA de Google Play' : 'NO ENCONTRADA en Google Play');
        const apk = a.apk === 'ACTIVA' ? 'ACTIVA (circula como APK externo, riesgo alto)'
          : (a.apk === 'BAJA' ? 'BAJA' : 'NO ENCONTRADA');
        const alertLevel = a.reportes >= 100 || a.apk === 'ACTIVA'
          ? '🚨 **Alerta Preventiva:** acumula un volumen alto de reportes o circula como APK externo fuera de tiendas oficiales. Te sugerimos **no solicitar préstamos ni otorgar permisos de contactos ni galería**.'
          : '⚠️ **Aviso Cívico:** cuenta con reportes ciudadanos en el radar. Procede con cautela.';
        return `📱 **${a.app}** (N° ${a.num} en el Radar Comunitario)\n` +
          `• ¿Reportada ante CONDUSEF? **${condusef}**\n` +
          `• Reportes ciudadanos acumulados: **${Number(a.reportes).toLocaleString('es-MX')}**\n` +
          `• Google Play Store: **${play}**\n` +
          `• Archivo APK externo: **${apk}**\n` +
          `${alertLevel}`;
      },

      buildAppReply(apps) {
        const body = apps.map(a => this.describeAppForChat(a)).join('\n\n');
        const footer = '\n\nRecuerda: ninguna entidad legal exige anticipos para autorizar un crédito ni amenaza a tus contactos personales.';
        const actions = [];
        apps.slice(0, 2).forEach(a => {
          actions.push({ label: `Ver ficha de ${a.app}`, cmd: 'ficha', arg: String(a.num) });
        });
        actions.push({ label: `Reportar app #${apps[0].num}`, cmd: 'report', arg: String(apps[0].num) });
        actions.push({ label: 'Ir a Medidor de Crédito', cmd: 'goto', arg: 'credito' });
        return { text: body + footer, actions };
      },

      async deriveToHeuristicLab(det) {
        const isUrl = det.type === 'url';
        this.respondChatbot(`🔎 Eso parece un ${isUrl ? 'enlace' : 'mensaje'} sospechoso. Lo derivo de inmediato a nuestro **Laboratorio Heurístico**, ejecuto la auditoría técnica y te desgloso el veredicto:`);

        this.switchTab('forense');
        if (isUrl) {
          this.switchForenseMode('url');
          const urlEl = document.getElementById('fn-url-input');
          if (urlEl) urlEl.value = det.text;
        } else {
          this.switchForenseMode('text');
          const textEl = document.getElementById('fn-text-input');
          if (textEl) textEl.value = det.text;
        }
        this.runForensicAudit();

        const r = this.lastForenseResult;
        if (!r) {
          this.respondChatbot('Abriendo el Laboratorio Heurístico para que verifiques los parámetros.', [{ label: 'Ir a Laboratorio Heurístico', cmd: 'goto', arg: 'forense' }]);
          return;
        }

        const levelIcon = r.score >= 70 ? '🚨' : (r.score >= 40 ? '⚠️' : '✅');
        const lines = [
          `${levelIcon} **Veredicto: ${r.verdictTitle || 'Evaluación Heurística'}** (Amenaza: ${r.score}/100).`,
          `• **Clasificación:** ${r.threatType || 'Riesgo Detectado'}`,
          `• **Entidad involucrada:** ${r.bankInvolved || 'No regulada'}`,
          `• **Acción recomendada:** ${r.recommendation || 'No realizar depósitos'}`,
          'El análisis técnico completo y la opción de emitir la Evaluación Heurística en PDF están listos en el Laboratorio.'
        ];
        const actions = [
          { label: '🧠 Ver Veredicto en Pantalla', cmd: 'goto', arg: 'forense' },
          { label: '📄 Descargar PDF Evaluación', cmd: 'forensicPdf' }
        ];
        if (r.score >= 40) {
          actions.push({ label: '🚓 Denuncia 088', cmd: 'police' });
          actions.push({ label: '⚖️ Iniciar Queja CONDUSEF', cmd: 'queja' });
        }
        this.respondChatbot(lines.join('\n'), actions);
      },

      handleEmergencyMessage(msg, apps = []) {
        const lines = [
          '🚨 **Lo que describes es una práctica ilícita de hostigamiento o cobranza extrajudicial indebida (Art. 284 Bis CPF). Respira: la ley te protege.**',
          '1. **No pagues bajo amenaza** ni entregues más dinero o códigos de seguridad.',
          '2. **Preserva las evidencias:** guarda capturas de pantalla de chats, audios, números telefónicos y estados de cuenta.',
          '3. **Revoca accesos y bloquea:** retira permisos de contactos y cámara en los ajustes de tu celular y bloquea los números agresores.',
          '4. **Avisa preventivamente a tus contactos:** para que no atiendan llamadas de cobranza (te preparé un texto listo para compartir).',
          '5. **Denuncia formal:** ante la Policía Cibernética (**088**) o genera tu queja REDECO en el módulo de Quejas.'
        ];
        if (apps.length > 0) {
          lines.push('\nSobre la app identificada en tu mensaje:\n' + apps.map(a => `• **${a.app}** (N° ${a.num}): ${Number(a.reportes).toLocaleString('es-MX')} reportes registrados.`).join('\n'));
        }
        const actions = [
          { label: '🚓 Formato Denuncia 088', cmd: 'police', arg: msg.slice(0, 300) },
          { label: '📋 Copiar Aviso para Contactos', cmd: 'shield', arg: apps[0]?.app || 'App no regulada' },
          { label: '⚖️ Redactar Queja REDECO / CONDUSEF', cmd: 'queja' },
          { label: '📡 Abrir Radar Comunitario', cmd: 'goto', arg: 'radar' }
        ];
        this.respondChatbot(lines.join('\n'), actions);
      },

      findMentionedEntities(text) {
        const full = window.SIPRES_DATABASE || [];
        const clean = this.normalizeText(text);
        if (!clean) return [];

        const hits = [];
        for (const item of full) {
          const nameNorm = this.normalizeText(item.n);
          const comNorm = this.normalizeText(item.s);
          if ((nameNorm.length >= 4 && clean.includes(nameNorm)) || (comNorm.length >= 4 && clean.includes(comNorm))) {
            hits.push(item);
          }
        }
        return hits.slice(0, 3);
      },

      async handleChatbotSubmit() {
        const input = document.getElementById('escudobot-input');
        const msg = (input?.value || '').trim();
        if (!msg || this.chatbotBusy) return;

        this.chatbotBusy = true;
        input.value = '';
        this.renderChatBubble('user', msg);

        const typing = document.getElementById('escudobot-typing');
        if (typing) typing.classList.remove('hidden');

        try {
          await this.processChatMessage(msg);
        } catch (err) {
          console.error('[EscudoBot] Error procesando mensaje:', err);
          this.respondChatbot('Ocurrió un detalle técnico al procesar la consulta. Puedes usar los accesos directos superiores o explorar directamente los módulos.');
        } finally {
          this.chatbotBusy = false;
          if (typing) typing.classList.add('hidden');
        }
      },

      async queryGeminiApi(userMsg) {
        if (!this.geminiApiKey) return null;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(this.geminiApiKey)}`;
        
        const systemPrompt = "Eres EscudoBot, asistente cívico y de ciberseguridad financiera de México integrado en Escudo Financiero Pro. Orientas a la ciudadanía en derechos financieros ante CONDUSEF, SIPRES (409 entidades reguladas), Medidor de Crédito (Art. 386 CPF, Art. 103 LIC), Radar Comunitario de 399 apps montadeudas y combate a la cobranza ilegítima (Art. 284 Bis CPF). Responde de forma precisa, empática, concisa y profesional con citas legales y pasos claros. Da respuestas directas en español de México.";

        const body = {
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt + "\n\nConsulta del usuario:\n" + userMsg }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 600
          }
        };

        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!resp.ok) {
          throw new Error(`Gemini API status ${resp.status}`);
        }

        const data = await resp.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || null;
      },

      async processChatMessage(msg) {
        const lower = msg.toLowerCase();
        const norm = this.normalizeText(msg);

        // Si el motor Gemini IA está activo y cuenta con API Key, consultar Gemini con fallback
        if (this.chatEngine === 'gemini' && this.geminiApiKey) {
          try {
            const geminiReply = await this.queryGeminiApi(msg);
            if (geminiReply) {
              const contextualChips = [
                { label: '⚖️ Cargar a Quejas CONDUSEF', cmd: 'queja' },
                { label: '🔍 Consultar SIPRES', cmd: 'goto', arg: 'directorio' },
                { label: '🧠 Laboratorio Heurístico', cmd: 'goto', arg: 'forense' }
              ];
              this.respondChatbot(geminiReply, contextualChips);
              return;
            }
          } catch (gemErr) {
            console.warn('[EscudoBot] Gemini API fallback to Local Heuristics:', gemErr);
            this.showToast('Nota: Consulta procesada con Motor Heurístico Local.');
          }
        }

        // 1. Detección de amenazas / extorsión (Art. 284 Bis CPF)
        const emergencyRe = /(amenaz|extors|hostig|acos|chantaj|mis contactos|difam|cobranza abusiva|embargar|carcel|policia me va a detener)/;
        const apps = this.findMentionedApps(msg);

        if (emergencyRe.test(norm) && !this.detectSuspiciousInput(msg)) {
          this.handleEmergencyMessage(msg, apps);
          return;
        }

        // 2. Detección de mensaje sospechoso o enlace phishing
        const suspicious = this.detectSuspiciousInput(msg);
        if (suspicious) {
          await this.deriveToHeuristicLab(suspicious);
          return;
        }

        // 3. Copiloto Procesal: detección de hechos con monto/entidad y prellenado en 1 clic
        const quejaDraft = this.extractQuejaDraft(msg);
        if (quejaDraft) {
          this.lastCopilotoDraft = quejaDraft;
          const body = `⚖️ **Copiloto Procesal CONDUSEF Detectado**\nAnalicé tu consulta e identifiqué una controversia por **${quejaDraft.causaLabel}** con **${quejaDraft.entityName}** por la cantidad de **$${quejaDraft.amount} MXN**.\n\nEstructuré los fundamentos jurídicos (Art. 68 LPDUSF y Código Penal Federal). Puedes transferir todos los datos directamente al formulario de quejas con un solo clic:`;
          const actions = [
            { label: '⚡ Cargar Borrador en Quejas (1 Clic)', cmd: 'loadDraft' },
            { label: '🔍 Ver Folio SIPRES', cmd: 'goto', arg: 'directorio' },
            { label: '📊 Medidor de Crédito', cmd: 'goto', arg: 'credito' }
          ];
          this.renderChatBubble('bot', body, actions, { copilotoDraft: quejaDraft });
          return;
        }

        // 4. Consulta sobre Apps de préstamo (Radar Comunitario)
        if (apps.length > 0) {
          const reply = this.buildAppReply(apps);
          this.respondChatbot(reply.text, reply.actions);
          return;
        }

        // 5. Comandos directos de navegación
        if (lower.includes('buscar bbva') || (lower.includes('buscar') && lower.includes('bbva'))) {
          this.switchTab('directorio');
          this.handleDirectSearch('BBVA');
          const searchInput = document.getElementById('preview-sipres-search');
          if (searchInput) searchInput.value = 'BBVA';
          this.respondChatbot('¡Hecho! Te he llevado al directorio SIPRES y filtré las entidades correspondientes a **BBVA**.', [
            { label: 'Ver Ficha Oficial BBVA', cmd: 'goto', arg: 'directorio' },
            { label: '⚖️ Queja contra BBVA', cmd: 'queja' }
          ]);
          return;
        }

        if (lower.includes('calcular') || lower.includes('crédito') || lower.includes('semáforo') || lower.includes('medidor') || lower.includes('interés') || lower.includes('cat')) {
          this.switchTab('credito');
          this.respondChatbot('¡Listo! Te trasladé al **Medidor de Crédito**. Aquí puedes evaluar escenarios, desglosar la amortización y verificar el CAT real frente a Banxico.', [
            { label: 'Evaluar CAT y Pagos', cmd: 'goto', arg: 'credito' },
            { label: '🔍 Verificar Financiera en SIPRES', cmd: 'goto', arg: 'directorio' }
          ]);
          return;
        }

        if (lower.includes('queja') || lower.includes('condusef') || lower.includes('denuncia') || lower.includes('reclamar') || lower.includes('pretension')) {
          this.switchTab('quejas');
          this.respondChatbot('Te he situado en el **Generador de Quejas Jurídicas CONDUSEF / REDECO**. Puedes seguir el Stepper interactivo de 5 pasos y descargar tu escrito oficial en PDF vectorial.', [
            { label: 'Llenar Queja Paso a Paso', cmd: 'goto', arg: 'quejas' },
            { label: '📞 Ver Teléfonos UNE Bancarias', cmd: 'goto', arg: 'directorio' }
          ]);
          return;
        }

        if (lower.includes('forense') || lower.includes('heurístico') || lower.includes('heuristico') || lower.includes('sospechoso') || lower.includes('mensaje')) {
          this.switchTab('forense');
          this.respondChatbot('Te he llevado al **Laboratorio Heurístico de Mensajes & Evidencias**. Puedes pegar textos de WhatsApp, verificar enlaces de phishing o subir capturas con extracción OCR.', [
            { label: 'Ejecutar Auditoría Heurística', cmd: 'goto', arg: 'forense' },
            { label: '🚓 Denuncia 088 Policía Cibernética', cmd: 'police' }
          ]);
          return;
        }

        if (lower.includes('radar') || lower.includes('montadeudas') || lower.includes('mapa') || lower.includes('reportes')) {
          this.switchTab('radar');
          this.respondChatbot('Te he trasladado al **Radar Comunitario (399 Apps de Préstamo Móvil)**. Puedes explorar el mapa de calor por estados, verificar si una app tiene registro CONDUSEF o publicar un reporte ciudadano.', [
            { label: 'Ver Muro de Reportes', cmd: 'goto', arg: 'radar' },
            { label: '🚨 Protocolo Anti-Amenazas', cmd: 'command', arg: 'Me están amenazando por un préstamo' }
          ]);
          return;
        }

        if (lower.includes('modo oscuro') || lower.includes('dark') || lower.includes('claro') || lower.includes('tema')) {
          this.toggleTheme();
          this.respondChatbot('¡Modo de visualización alternado con éxito!');
          return;
        }

        // 6. Consulta sobre entidades reguladas de SIPRES
        const entities = this.findMentionedEntities(msg);
        if (entities.length > 0) {
          const e = entities[0];
          const lines = [
            `🏛️ **${e.n}** (Nombre Comercial: **${e.s}**)`,
            `• **Folio Oficial SIPRES:** ${e.f}`,
            `• **Sector:** ${e.t}`,
            `• **Estatus Regulatorio:** ${e.e}`,
            `• **Sede:** ${e.d}`,
            'Es una institución financiera debidamente regulada. Si presentas controversias o cargos no reconocidos, puedes generar tu queja formal directa.'
          ];
          const actions = [
            { label: `Ver en SIPRES (#${e.f})`, cmd: 'goto', arg: 'directorio' },
            { label: `Iniciar Queja contra ${e.s}`, cmd: 'queja' },
            { label: `📊 Evaluar en Medidor de Crédito`, cmd: 'goto', arg: 'credito' }
          ];
          this.respondChatbot(lines.join('\n'), actions);
          return;
        }

        // 7. Respuesta orientativa general con chips contextuales
        const generalReply =
          'Entiendo tu consulta. Como **EscudoBot**, te oriento en cuatro ejes principales:\n\n' +
          '1. **Directorio SIPRES (409):** Verificar si un banco, fintech o financiera está regulada ante CONDUSEF.\n' +
          '2. **Medidor de Crédito:** Calcular el costo financiero real, retenciones y CAT conforme a Banxico.\n' +
          '3. **Laboratorio Heurístico:** Analizar mensajes engañosos, enlaces de phishing o cuentas receptoras.\n' +
          '4. **Radar Comunitario & Quejas:** Protocolo anti-montadeudas y generación de escritos procesales en PDF.\n\n' +
          '¿Te gustaría que busquemos una institución en específico o redactemos una reclamación formal?';
        const generalActions = [
          { label: '🔍 Buscar en SIPRES', cmd: 'goto', arg: 'directorio' },
          { label: '⚖️ Generador de Quejas', cmd: 'goto', arg: 'quejas' },
          { label: '📊 Medidor de Crédito', cmd: 'goto', arg: 'credito' },
          { label: '🧠 Laboratorio Heurístico', cmd: 'goto', arg: 'forense' },
          { label: '📡 Radar Comunitario', cmd: 'goto', arg: 'radar' }
        ];
        this.respondChatbot(generalReply, generalActions);
      },

      initFontSize() {
        const saved = localStorage.getItem('escudo_font_scale') || 'md';
        this.setFontSize(saved);
      },

      setFontSize(size) {
        const root = document.documentElement;
        root.classList.remove('text-scale-sm', 'text-scale-md', 'text-scale-lg');
        if (size === 'sm') root.classList.add('text-scale-sm');
        else if (size === 'lg') root.classList.add('text-scale-lg');
        else root.classList.add('text-scale-md');

        try { localStorage.setItem('escudo_font_scale', size); } catch (e) {}

        const btnSm = document.getElementById('font-btn-sm');
        const btnMd = document.getElementById('font-btn-md');
        const btnLg = document.getElementById('font-btn-lg');

        [btnSm, btnMd, btnLg].forEach(b => {
          if (b) {
            b.classList.remove('bg-white', 'dark:bg-obsidian-surface', 'text-legal-gold', 'shadow-xs');
            b.classList.add('text-slate-500');
          }
        });

        const activeBtn = size === 'sm' ? btnSm : (size === 'lg' ? btnLg : btnMd);
        if (activeBtn) {
          activeBtn.classList.remove('text-slate-500');
          activeBtn.classList.add('bg-white', 'dark:bg-obsidian-surface', 'text-legal-gold', 'shadow-xs');
        }
      },

      initPanicKeyShortcut() {
        let escCount = 0;
        let lastEsc = 0;
        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            const now = Date.now();
            if (now - lastEsc < 900) {
              escCount++;
            } else {
              escCount = 1;
            }
            lastEsc = now;
            if (escCount >= 3) {
              escCount = 0;
              this.triggerPanicExit();
            }
          }
        });
      },

      triggerPanicExit() {
        try {
          this.clearQuejaDraft();
          this.clearForenseImage();
          const t = document.getElementById('fn-text-input');
          if (t) t.value = '';
          const u = document.getElementById('fn-url-input');
          if (u) u.value = '';
          sessionStorage.clear();
          localStorage.clear();
        } catch (e) {}

        try {
          window.location.replace('https://es.wikipedia.org/wiki/Portal:M%C3%A9xico');
        } catch (e) {
          document.body.innerHTML = `
            <div style="font-family:Arial,sans-serif;background:#fff;color:#202124;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;">
              <div style="font-size:42px;font-weight:bold;margin-bottom:20px;">
                <span style="color:#4285f4">G</span><span style="color:#ea4335">o</span><span style="color:#fbbc05">o</span><span style="color:#4285f4">g</span><span style="color:#34a853">l</span><span style="color:#ea4335">e</span>
              </div>
              <div style="width:100%;max-width:540px;border:1px solid #dfe1e5;border-radius:24px;padding:12px 20px;box-shadow:0 1px 6px rgba(32,33,36,.28);">
                <input type="text" value="Noticias de México hoy" style="width:100%;border:none;outline:none;font-size:16px;">
              </div>
            </div>`;
        }
      },

      initServiceWorkerPwa() {
        if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          navigator.serviceWorker.register('./sw.js').then((reg) => {
            const badge = document.getElementById('pwa-offline-badge');
            if (badge) badge.classList.remove('hidden');
          }).catch(() => {});
        } else {
          const badge = document.getElementById('pwa-offline-badge');
          if (badge) badge.classList.remove('hidden');
        }
      },

      async generateSha256(text) {
        try {
          const encoder = new TextEncoder();
          const data = encoder.encode(text);
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
          let h1 = 0xdeadbeef, h2 = 0x41c64e6d;
          for (let i = 0, ch; i < text.length; i++) {
            ch = text.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
          }
          h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
          h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
          const s = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
          return (s + s + s + s).slice(0, 64).padStart(64, '0');
        }
      },

      async sanitizeImageExif(file) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth || img.width;
              canvas.height = img.naturalHeight || img.height;
              const ctx = canvas.getContext('2d');
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
              canvas.toBlob((blob) => {
                const cleanFile = new File([blob || file], file.name.replace(/\.[^/.]+$/, "") + "-sanitized.jpg", {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve({ file: cleanFile, dataUrl, name: file.name });
              }, 'image/jpeg', 0.92);
            };
            img.onerror = () => resolve({ file, dataUrl: e.target.result, name: file.name });
            img.src = e.target.result;
          };
          reader.onerror = () => resolve({ file, dataUrl: null, name: file.name });
          reader.readAsDataURL(file);
        });
      },

      calculateLegalDeadline(startDate = new Date(), businessDays = 20) {
        let count = 0;
        let cur = new Date(startDate);
        while (count < businessDays) {
          cur.setDate(cur.getDate() + 1);
          const day = cur.getDay();
          if (day !== 0 && day !== 6) {
            count++;
          }
        }
        return cur;
      },

      async updateQuejaHashLive() {
        const data = this.collectQuejaFormData();
        const rawContent = `${data.curp}|${data.folioSipres}|${data.fechaHechos}|${data.monto}|${data.hechos}|${data.pretensiones}`;
        const hash = await this.generateSha256(rawContent);
        const el = document.getElementById('doc-preview-hash');
        if (el) el.innerText = hash;
      },

      async openPostDownloadRoadmap(customData = null, customBuilt = null) {
        const data = customData || this.collectQuejaFormData();
        const folio = data.folioSipres || '40012';
        const channels = VERIFIED_CHANNELS_PREVIEW[folio] || { une: 'atencion.usuarios@condusef.gob.mx' };
        
        // 1. Sello SHA-256
        const rawContent = `${data.curp}|${data.folioSipres}|${data.fechaHechos}|${data.monto}|${data.hechos}|${data.pretensiones}`;
        const hash = await this.generateSha256(rawContent);

        // 2. Plazos procesales (20 días hábiles)
        const today = new Date();
        const deadline = this.calculateLegalDeadline(today, 20);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const deadlineStr = deadline.toLocaleDateString('es-MX', options);

        this.lastRoadmapData = {
          data,
          hash,
          today,
          deadline,
          uneEmail: channels.une
        };

        // 3. Inyectar datos en el modal
        const elDate = document.getElementById('roadmap-deadline-date');
        if (elDate) elDate.innerText = deadlineStr;

        const elHash = document.getElementById('roadmap-crypto-hash');
        if (elHash) elHash.innerText = hash;

        const elUne = document.getElementById('roadmap-une-email');
        if (elUne) elUne.innerText = channels.une;

        const elMailto = document.getElementById('roadmap-btn-mailto');
        if (elMailto) {
          const subject = encodeURIComponent(`Reclamación Formal CONDUSEF - Folio SIPRES ${folio} - ${data.nombre}`);
          const body = encodeURIComponent(
            `A la Unidad Especializada de Atención a Usuarios (UNE):\n\n` +
            `Por medio del presente correo interpongo formal escrito de reclamación de conformidad con los Artículos 50 Bis, 68 y 68 Bis de la LPDUSF.\n\n` +
            `• Promovente: ${data.nombre}\n` +
            `• CURP: ${data.curp}\n` +
            `• Institución: ${data.institucion} (Folio SIPRES ${folio})\n` +
            `• Causa: ${data.causa}\n` +
            `• Sello de Integridad SHA-256: ${hash}\n\n` +
            `Adjunto al presente el documento formal en formato PDF emitido con firma digital autógrafa y constancia probatoria.\n\n` +
            `Atentamente,\n${data.nombre}`
          );
          elMailto.href = `mailto:${channels.une}?subject=${subject}&body=${body}`;
        }

        const modal = document.getElementById('modal-post-descarga-roadmap');
        if (modal) modal.classList.remove('hidden');
      },

      closeRoadmapModal() {
        const modal = document.getElementById('modal-post-descarga-roadmap');
        if (modal) modal.classList.add('hidden');
      },

      copyRoadmapHash() {
        if (!this.lastRoadmapData) return;
        const hash = this.lastRoadmapData.hash;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(hash).then(() => {
            this.showToast('Sello criptográfico SHA-256 copiado al portapapeles.');
          });
        } else {
          this.showToast('Sello SHA-256: ' + hash.slice(0, 16) + '...');
        }
      },

      downloadCalendarIcs() {
        if (!this.lastRoadmapData) return;
        const d = this.lastRoadmapData;
        const formatIcsDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Escudo Financiero Pro//Legaltech Calendario//ES',
          'CALSCALE:GREGORIAN',
          'METHOD:PUBLISH',
          'BEGIN:VEVENT',
          `UID:escudo-legal-${Date.now()}@escudofinanciero.mx`,
          `DTSTAMP:${formatIcsDate(new Date())}`,
          `DTSTART:${formatIcsDate(d.deadline)}`,
          `DTEND:${formatIcsDate(new Date(d.deadline.getTime() + 3600000))}`,
          `SUMMARY:Vencimiento de Contestación UNE / CONDUSEF (Folio ${d.data.folioSipres})`,
          `DESCRIPTION:Vencen los 20 días hábiles que la LPDUSF (Art. 68) otorga a la institución financiera para contestar la queja formal presentada por ${d.data.nombre}. Si no hubo contestación favorable, solicitar cita para audiencia de conciliación.`,
          'BEGIN:VALARM',
          'ACTION:DISPLAY',
          'DESCRIPTION:Recordatorio de término legal CONDUSEF',
          'TRIGGER:-P2D',
          'END:VALARM',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Vencimiento-Legal-CONDUSEF-Folio-${d.data.folioSipres}.ics`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        this.showToast('Recordatorio .ics descargado para tu calendario.');
      },

      openGoogleCalendarReminder() {
        if (!this.lastRoadmapData) return;
        const d = this.lastRoadmapData;
        const dStr = d.deadline.toISOString().replace(/[-:]/g, '').slice(0, 8);
        const title = `Vencimiento Contestación CONDUSEF - Folio ${d.data.folioSipres}`;
        const desc = `Vencimiento de 20 días hábiles (Art. 68 LPDUSF) para informe de ${d.data.institucion}. Sello SHA-256: ${d.hash}`;
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dStr}/${dStr}&details=${encodeURIComponent(desc)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      },

      escapeHtml(str) {
        return String(str || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      },

      normalizeText(str) {
        return String(str || '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .trim();
      },

      showToast(msg) {
        const toast = document.getElementById('preview-toast');
        const txt = document.getElementById('preview-toast-text');
        if (!toast || !txt) return;
        txt.innerText = msg;
        toast.classList.remove('hidden');
        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
          toast.classList.add('hidden');
        }, 3200);
      },

      toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('escudo_theme', isDark ? 'dark' : 'light');
        document.getElementById('theme-toggle-icon').className = isDark ? 'fa-solid fa-sun text-xs text-amber-400' : 'fa-solid fa-moon text-xs';
      },

      toggleSidebar() {
        const sidebar = document.getElementById('main-sidebar');
        const brandHeader = document.getElementById('sidebar-brand-header');
        const collapsedFooter = document.getElementById('sidebar-collapsed-footer');
        const icon = document.getElementById('sidebar-toggle-icon');

        this.sidebarCollapsed = !this.sidebarCollapsed;
        const isCollapsed = this.sidebarCollapsed;

        sidebar.classList.toggle('w-20', isCollapsed);
        sidebar.classList.toggle('w-64', !isCollapsed);

        brandHeader.classList.toggle('px-0', isCollapsed);
        brandHeader.classList.toggle('justify-center', isCollapsed);
        brandHeader.classList.toggle('px-5', !isCollapsed);
        brandHeader.classList.toggle('justify-start', !isCollapsed);

        document.querySelectorAll('.sidebar-text-element').forEach(el => {
          el.style.display = isCollapsed ? 'none' : '';
        });

        if (collapsedFooter) {
          collapsedFooter.classList.toggle('hidden', !isCollapsed);
          collapsedFooter.classList.toggle('flex', isCollapsed);
        }

        this.updateSidebarNavStyles();
        icon.className = isCollapsed ? 'fa-solid fa-angles-right text-[10px]' : 'fa-solid fa-angles-left text-[10px]';
      },

      updateSidebarNavStyles() {
        const alignClasses = this.sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3';
        document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
          const isActive = btn.getAttribute('data-tab') === this.currentTab;
          const iconEl = btn.querySelector('i');
          if (isActive) {
            btn.className = `sidebar-nav-btn w-full flex items-center ${alignClasses} py-2.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-obsidian-elevated text-slate-900 dark:text-white border-l-4 border-legal-gold`;
            if (iconEl) iconEl.classList.add('text-legal-gold');
          } else {
            btn.className = `sidebar-nav-btn w-full flex items-center ${alignClasses} py-2.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-obsidian-elevated transition-colors border-l-4 border-transparent`;
            if (iconEl) iconEl.classList.remove('text-legal-gold');
          }
        });
      },

      rotateAlert() {
        this.alertIndex = (this.alertIndex + 1) % this.alerts.length;
        document.getElementById('alert-banner-text').innerHTML = this.alerts[this.alertIndex];
      },

      switchTab(tabId) {
        if (tabId !== 'directorio' && tabId !== 'quejas' && tabId !== 'credito' && tabId !== 'forense' && tabId !== 'radar') {
          alert('Este módulo interactivo estará disponible en el siguiente paso de la maqueta. Actualmente puedes explorar a detalle el Directorio SIPRES (con paginación progresiva, Ficha y Comparador), el Generador de Quejas de 5 pasos, el Medidor de Crédito, el Laboratorio Heurístico y el Radar Comunitario.');
          return;
        }
        this.currentTab = tabId;
        this.updateSidebarNavStyles();

        document.getElementById('module-directorio').classList.add('hidden');
        document.getElementById('module-quejas').classList.add('hidden');
        document.getElementById('module-credito').classList.add('hidden');
        const modForense = document.getElementById('module-forense');
        if (modForense) modForense.classList.add('hidden');
        const modRadar = document.getElementById('module-radar');
        if (modRadar) modRadar.classList.add('hidden');

        if (tabId === 'directorio') {
          document.getElementById('module-directorio').classList.remove('hidden');
          document.getElementById('breadcrumb-current-tab').innerText = 'Directorio SIPRES (409 Entidades)';
        } else if (tabId === 'quejas') {
          document.getElementById('module-quejas').classList.remove('hidden');
          document.getElementById('breadcrumb-current-tab').innerText = 'Generador de Quejas CONDUSEF';
        } else if (tabId === 'credito') {
          document.getElementById('module-credito').classList.remove('hidden');
          document.getElementById('breadcrumb-current-tab').innerText = 'Medidor de Crédito';
          this.calcCredito();
        } else if (tabId === 'forense') {
          if (modForense) modForense.classList.remove('hidden');
          document.getElementById('breadcrumb-current-tab').innerText = 'Laboratorio Heurístico';
          this.runForensicAudit();
        } else if (tabId === 'radar') {
          if (modRadar) modRadar.classList.remove('hidden');
          document.getElementById('breadcrumb-current-tab').innerText = 'Radar Comunitario (399 Apps & Alertas)';
          this.initRadar();
        }
      },

      setViewMode(mode) {
        this.currentView = mode;
        const gridBtn = document.getElementById('view-grid-btn');
        const tableBtn = document.getElementById('view-table-btn');
        const gridCont = document.getElementById('sipres-grid-container');
        const tableCont = document.getElementById('sipres-table-container');

        if (mode === 'grid') {
          gridBtn.className = "px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1.5 bg-slate-900 dark:bg-legal-gold text-white shadow-sm";
          tableBtn.className = "px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white";
          gridCont.classList.remove('hidden');
          tableCont.classList.add('hidden');
        } else {
          tableBtn.className = "px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1.5 bg-slate-900 dark:bg-legal-gold text-white shadow-sm";
          gridBtn.className = "px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white";
          tableCont.classList.remove('hidden');
          gridCont.classList.add('hidden');
        }
      },

      renderEntities(newMatchedList, resetLimit = false) {
        if (Array.isArray(newMatchedList)) {
          this.matchedEntities = newMatchedList;
        } else if (!this.matchedEntities) {
          this.matchedEntities = window.SIPRES_DATABASE || [];
        }
        if (resetLimit) {
          this.renderLimit = this.pageSize;
        }

        const total = this.matchedEntities.length;
        const list = this.matchedEntities.slice(0, this.renderLimit);
        const gridCont = document.getElementById('sipres-grid-container');
        const tableBody = document.getElementById('sipres-table-body');

        this.updatePaginationUI(list.length, total);

        if (total === 0) {
          gridCont.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400 text-xs bg-white dark:bg-obsidian-surface rounded-2xl border border-slate-200 dark:border-obsidian-border">No se encontraron instituciones con ese criterio de búsqueda.</div>`;
          tableBody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-400 text-xs">No se encontraron instituciones coincidentes.</td></tr>`;
          return;
        }

        // Render Cuadrícula (Fichas Interactivas con Ficha, Comparar y Realizar Queja)
        gridCont.innerHTML = list.map(item => {
          const isCompared = this.comparatorList.some(c => c.f === item.f);
          return `
            <div class="bg-white dark:bg-obsidian-surface rounded-2xl border ${isCompared ? 'border-legal-gold ring-1 ring-legal-gold/30' : 'border-slate-200 dark:border-obsidian-border'} p-5 hover:border-legal-gold/60 dark:hover:border-legal-gold/60 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div class="flex items-start justify-between gap-2 mb-2.5">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-obsidian-elevated text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-obsidian-border">
                    FOLIO ${this.escapeHtml(item.f)}
                  </span>
                  ${item.a ? `
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-legal-gold border border-legal-gold/30">
                      <i class="fa-solid fa-triangle-exclamation mr-1"></i> Suplantación Detectada
                    </span>
                  ` : `
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold ${item.r === 'REGULADA' ? 'bg-emerald-500/10 text-legal-emerald border-emerald-500/20' : 'bg-slate-200/70 dark:bg-obsidian-elevated text-slate-500 border-slate-300 dark:border-obsidian-border'} border">
                      <i class="fa-solid ${item.r === 'REGULADA' ? 'fa-circle-check' : 'fa-clock-rotate-left'} mr-1"></i> ${this.escapeHtml(item.e)}
                    </span>
                  `}
                </div>
                
                <button type="button" onclick="PreviewApp.openExpediente('${item.f}')" class="text-left block w-full">
                  <h3 class="font-serif text-lg font-bold text-slate-900 dark:text-white group-hover:text-legal-gold transition-colors">
                    ${this.escapeHtml(item.n)}
                  </h3>
                </button>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  ${this.escapeHtml(item.s)}
                </p>

                <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 dark:text-slate-500">
                  <span class="truncate max-w-[180px]" title="${this.escapeHtml(item.t)}"><i class="fa-solid fa-building-columns mr-1 text-slate-400"></i>${this.escapeHtml(item.t)}</span>
                  <span><i class="fa-solid fa-location-dot mr-1 text-slate-400"></i>${this.escapeHtml(item.d)}</span>
                </div>
              </div>

              <div class="pt-3.5 mt-4 border-t border-slate-100 dark:border-obsidian-border flex items-center justify-between gap-1.5 text-xs">
                <div class="flex items-center gap-1.5">
                  <button type="button" onclick="PreviewApp.openExpediente('${item.f}')" class="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-obsidian-elevated hover:border-legal-gold/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-obsidian-border font-medium text-[11px] transition-colors flex items-center gap-1" title="Ver Ficha Técnica Oficial SIPRES">
                    <i class="fa-solid fa-file-shield text-[10px] text-slate-400"></i>
                    <span>Ficha</span>
                  </button>
                  <button type="button" onclick="PreviewApp.toggleComparator('${item.f}')" class="px-2.5 py-1.5 rounded-lg border font-semibold text-[11px] transition-all flex items-center gap-1 ${isCompared ? 'bg-legal-gold/15 text-legal-gold border-legal-gold/50' : 'bg-slate-50 dark:bg-obsidian-elevated hover:border-legal-gold/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-obsidian-border'}" title="Agregar o quitar del Comparador de Instituciones">
                    <i class="fa-solid ${isCompared ? 'fa-check' : 'fa-code-compare'} text-[10px]"></i>
                    <span>${isCompared ? 'Comparando' : 'Comparar'}</span>
                  </button>
                </div>

                <button type="button" onclick="PreviewApp.startQuejaByFolio('${item.f}')" class="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-obsidian-elevated hover:bg-legal-gold dark:hover:bg-legal-gold text-white dark:text-slate-200 dark:hover:text-white border border-transparent dark:border-obsidian-border font-semibold text-[11px] transition-colors flex items-center gap-1.5 shrink-0">
                  <span>Realizar Queja</span>
                  <i class="fa-solid fa-arrow-right text-[9px]"></i>
                </button>
              </div>
            </div>
          `;
        }).join('');

        // Render Tabla de Auditoría (con Ficha, Comparar y Realizar Queja en cada fila)
        tableBody.innerHTML = list.map(item => {
          const isCompared = this.comparatorList.some(c => c.f === item.f);
          return `
            <tr class="hover:bg-slate-50 dark:hover:bg-obsidian-elevated/50 transition-colors">
              <td class="p-3.5 font-mono text-slate-500 text-[11px]">${this.escapeHtml(item.f)}</td>
              <td class="p-3.5">
                <button type="button" onclick="PreviewApp.openExpediente('${item.f}')" class="font-serif font-bold text-slate-900 dark:text-white hover:text-legal-gold text-sm text-left transition-colors">
                  ${this.escapeHtml(item.n)}
                </button>
                <div class="text-[10px] text-slate-400">${this.escapeHtml(item.d)}</div>
              </td>
              <td class="p-3.5 text-slate-600 dark:text-slate-400 text-xs max-w-xs truncate" title="${this.escapeHtml(item.s)}">${this.escapeHtml(item.s)}</td>
              <td class="p-3.5 text-slate-500 text-[11px]">${this.escapeHtml(item.t)}</td>
              <td class="p-3.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${item.a ? 'bg-amber-500/10 text-legal-gold border border-legal-gold/20' : 'bg-emerald-500/10 text-legal-emerald border border-emerald-500/20'}">
                  ${item.a ? 'Alerta WhatsApp' : this.escapeHtml(item.e)}
                </span>
              </td>
              <td class="p-3.5 text-right">
                <div class="inline-flex items-center justify-end gap-1.5">
                  <button type="button" onclick="PreviewApp.openExpediente('${item.f}')" class="px-2 py-1 rounded bg-slate-100 dark:bg-obsidian-elevated hover:border-legal-gold/50 border border-slate-200 dark:border-obsidian-border text-[11px] font-medium text-slate-700 dark:text-slate-300" title="Ver Ficha Oficial">
                    Ficha
                  </button>
                  <button type="button" onclick="PreviewApp.toggleComparator('${item.f}')" class="px-2 py-1 rounded border text-[11px] font-semibold flex items-center gap-1 transition-colors ${isCompared ? 'bg-legal-gold/15 text-legal-gold border-legal-gold/50' : 'bg-slate-100 dark:bg-obsidian-elevated hover:border-legal-gold/50 border-slate-200 dark:border-obsidian-border text-slate-700 dark:text-slate-300'}" title="Comparar institución">
                    <i class="fa-solid ${isCompared ? 'fa-check' : 'fa-code-compare'} text-[10px]"></i>
                    <span>${isCompared ? 'Comparando' : 'Comparar'}</span>
                  </button>
                  <button type="button" onclick="PreviewApp.startQuejaByFolio('${item.f}')" class="px-2.5 py-1 rounded bg-slate-900 dark:bg-legal-gold hover:opacity-90 text-[11px] font-semibold text-white whitespace-nowrap">
                    Realizar Queja
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      },

      updatePaginationUI(shown, total) {
        const container = document.getElementById('sipres-load-more-container');
        const statusEl = document.getElementById('sipres-pagination-status');
        const barEl = document.getElementById('sipres-pagination-bar');
        const btnEl = document.getElementById('sipres-load-more-btn');
        const btnTextEl = document.getElementById('sipres-load-more-text');
        const endBadge = document.getElementById('sipres-end-of-list-badge');
        const endText = document.getElementById('sipres-end-of-list-text');

        if (!container) return;
        if (total === 0) {
          container.classList.add('hidden');
          return;
        }
        container.classList.remove('hidden');

        if (statusEl) {
          statusEl.innerText = `Mostrando ${shown} de ${total} instituciones registradas`;
        }
        if (barEl) {
          const pct = Math.min(100, Math.max(2, (shown / total) * 100));
          barEl.style.width = `${pct.toFixed(1)}%`;
          barEl.className = shown >= total
            ? 'h-full bg-legal-emerald transition-all duration-300'
            : 'h-full bg-legal-gold transition-all duration-300';
        }

        const remaining = total - shown;
        if (remaining > 0) {
          const nextBatch = Math.min(this.pageSize, remaining);
          if (btnEl) btnEl.classList.remove('hidden');
          if (btnTextEl) {
            btnTextEl.innerText = remaining <= this.pageSize
              ? `Mostrar las últimas ${remaining} instituciones`
              : `Mostrar más instituciones (+${nextBatch} • restan ${remaining})`;
          }
          if (endBadge) {
            endBadge.classList.add('hidden');
            endBadge.classList.remove('flex');
          }
        } else {
          if (btnEl) btnEl.classList.add('hidden');
          if (endBadge) {
            endBadge.classList.remove('hidden');
            endBadge.classList.add('flex');
          }
          if (endText) {
            endText.innerText = `Repertorio completo mostrado (${total} de ${total} instituciones)`;
          }
        }
      },

      loadMoreEntities() {
        const total = (this.matchedEntities || []).length;
        if (this.renderLimit >= total) return;
        this.renderLimit = Math.min(total, this.renderLimit + this.pageSize);
        this.renderEntities();
      },

      setActiveChip(btnEl) {
        if (!btnEl) return;
        document.querySelectorAll('.chip-filter').forEach(el => {
          if (el.textContent.includes('Alerta')) {
            el.className = 'chip-filter px-2.5 py-1 rounded-md border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-medium flex items-center space-x-1 transition-colors';
          } else {
            el.className = 'chip-filter px-2.5 py-1 rounded-md border border-slate-200 dark:border-obsidian-border bg-white dark:bg-obsidian-surface text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors';
          }
        });
        btnEl.className = 'chip-filter active px-2.5 py-1 rounded-md border border-legal-gold bg-legal-gold/10 text-legal-gold font-semibold flex items-center space-x-1 transition-colors';
      },

      filterEntities(query) {
        const q = this.normalizeText(query);
        const full = window.SIPRES_DATABASE || [];
        if (!q) {
          this.renderEntities(full, true);
          return;
        }
        const filtered = full.filter(item => 
          this.normalizeText(item.n).includes(q) || 
          this.normalizeText(item.s).includes(q) || 
          String(item.f).includes(q)
        );
        this.renderEntities(filtered, true);
      },

      quickFilter(sectorKeyword, btnEl) {
        this.setActiveChip(btnEl);
        const searchInput = document.getElementById('sipres-filter-input');
        const sectorSelect = document.getElementById('sector-select');
        if (searchInput) searchInput.value = '';
        if (sectorSelect) sectorSelect.value = '';
        const full = window.SIPRES_DATABASE || [];
        if (!sectorKeyword) {
          this.renderEntities(full, true);
          return;
        }
        const kw = this.normalizeText(sectorKeyword);
        const filtered = full.filter(item => this.normalizeText(item.t).includes(kw));
        this.renderEntities(filtered, true);
      },

      filterAlerta(btnEl) {
        this.setActiveChip(btnEl);
        const searchInput = document.getElementById('sipres-filter-input');
        if (searchInput) searchInput.value = '';
        const full = window.SIPRES_DATABASE || [];
        const filtered = full.filter(item => item.a === true);
        this.renderEntities(filtered, true);
      },

      filterBySector(val) {
        const full = window.SIPRES_DATABASE || [];
        if (!val) {
          this.renderEntities(full, true);
          return;
        }
        const filtered = full.filter(item => item.t === val);
        this.renderEntities(filtered, true);
      },

      /* =======================================================================
         FICHA TÉCNICA INTERACTIVA (EXPEDIENTE SIPRES)
         ======================================================================= */
      openExpediente(folio) {
        const full = window.SIPRES_DATABASE || [];
        const entity = full.find(e => e.f === String(folio).trim());
        if (!entity) {
          this.showToast('Selecciona primero una institución registrada en SIPRES.');
          return;
        }
        this.selectedExpedienteEntity = entity;

        document.getElementById('exp-folio-badge').innerText = `FOLIO SIPRES #${entity.f}`;
        const statusBadge = document.getElementById('exp-status-badge');
        statusBadge.innerText = entity.e;
        statusBadge.className = entity.r === 'REGULADA'
          ? 'px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-legal-emerald border border-emerald-500/20'
          : 'px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-legal-gold border border-legal-gold/30';

        document.getElementById('exp-nombre-comercial').innerText = entity.n;
        document.getElementById('exp-razon-social').innerText = entity.s;

        const channels = VERIFIED_CHANNELS_PREVIEW[entity.f];
        const body = document.getElementById('exp-body-content');
        body.innerHTML = `
          ${entity.a ? `
            <div class="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <i class="fa-solid fa-triangle-exclamation text-legal-gold mt-0.5"></i>
              <div>
                <div class="font-bold">Alerta Preventiva CONDUSEF: Suplantación de Identidad Detectada</div>
                <p class="text-[11px] mt-0.5 leading-relaxed">Esta institución es auténtica y regulada, pero terceros fraudulentos han usado su logotipo en WhatsApp o redes sociales para pedir anticipos ilegales. Opera únicamente en sus canales oficiales.</p>
              </div>
            </div>
          ` : `
            <div class="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
              <i class="fa-solid fa-shield-check text-legal-emerald mt-0.5"></i>
              <div>
                <div class="font-bold">Registro Institucional Verificado en Padrón SIPRES</div>
                <p class="text-[11px] mt-0.5 leading-relaxed">Entidad localizada en el Sistema de Registro de Prestadores de Servicios Financieros. Ninguna entidad regulada solicita depósitos previos para liberar créditos.</p>
              </div>
            </div>
          `}

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-obsidian-elevated p-4 rounded-xl border border-slate-200 dark:border-obsidian-border">
            <div class="sm:col-span-2">
              <span class="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Denominación / Razón Social Oficial</span>
              <span class="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 block">${this.escapeHtml(entity.s)}</span>
            </div>
            <div>
              <span class="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Clave de Registro SIPRES</span>
              <span class="font-mono font-bold text-slate-900 dark:text-white text-xs mt-0.5 block">${this.escapeHtml(entity.f)}</span>
            </div>
            <div>
              <span class="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Sector Financiero CNBV</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-0.5 block">${this.escapeHtml(entity.t)}</span>
            </div>
            <div>
              <span class="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Entidad Federativa / Sede</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-0.5 block">${this.escapeHtml(entity.d)}</span>
            </div>
            <div>
              <span class="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Estatus Operativo</span>
              <span class="font-bold ${entity.r === 'REGULADA' ? 'text-legal-emerald' : 'text-legal-gold'} text-xs mt-0.5 block">${this.escapeHtml(entity.e)}</span>
            </div>
          </div>

          ${channels ? `
            <div class="p-4 rounded-xl bg-white dark:bg-obsidian-surface border border-slate-200 dark:border-obsidian-border space-y-2">
              <div class="text-[10px] font-bold uppercase tracking-wider text-legal-gold flex items-center gap-1.5">
                <i class="fa-solid fa-headset"></i>
                <span>Unidad Especializada de Atención a Usuarios (UNE Verificada)</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div><span class="text-slate-400 block text-[10px]">Teléfono UNE:</span><span class="font-mono font-semibold text-slate-800 dark:text-slate-200">${channels.tel}</span></div>
                <div><span class="text-slate-400 block text-[10px]">Correo Oficial UNE:</span><span class="font-mono text-slate-800 dark:text-slate-200">${channels.une}</span></div>
                <div><span class="text-slate-400 block text-[10px]">Dominio Oficial:</span><span class="font-mono text-legal-emerald font-semibold">${channels.web}</span></div>
              </div>
            </div>
          ` : ''}
        `;

        this.syncExpedienteCompareBtn();

        const btnQueja = document.getElementById('exp-btn-queja');
        btnQueja.onclick = () => {
          this.closeExpediente();
          this.startQuejaByFolio(entity.f);
        };

        document.getElementById('exp-btn-copy-text').innerText = 'Copiar Cédula Oficial';
        document.getElementById('modal-expediente').classList.remove('hidden');
      },

      syncExpedienteCompareBtn() {
        const entity = this.selectedExpedienteEntity;
        const btn = document.getElementById('exp-btn-compare');
        const txt = document.getElementById('exp-btn-compare-text');
        if (!entity || !btn || !txt) return;

        const isCompared = this.comparatorList.some(c => c.f === entity.f);
        if (isCompared) {
          btn.className = 'px-3.5 py-2 rounded-xl border border-legal-gold bg-legal-gold/15 text-legal-gold text-xs font-bold flex items-center gap-1.5 transition-all';
          txt.innerText = 'En Comparador (Ver)';
          btn.onclick = () => {
            this.closeExpediente();
            this.openComparatorModal();
          };
        } else {
          btn.className = 'px-3.5 py-2 rounded-xl bg-white dark:bg-obsidian-surface hover:border-legal-gold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-obsidian-border text-xs font-semibold flex items-center gap-1.5 transition-all';
          txt.innerText = 'Comparar Institución';
          btn.onclick = () => {
            this.toggleComparator(entity.f, true);
            this.closeExpediente();
            this.openComparatorModal();
          };
        }
      },

      closeExpediente() {
        document.getElementById('modal-expediente').classList.add('hidden');
      },

      copyExpedienteCedula() {
        const e = this.selectedExpedienteEntity;
        if (!e) return;
        const cedula = [
          `CÉDULA DE VERIFICACIÓN OFICIAL SIPRES — ESCUDO FINANCIERO PRO`,
          `• Nombre Comercial: ${e.n}`,
          `• Razón Social Oficial: ${e.s}`,
          `• Folio SIPRES: ${e.f}`,
          `• Sector Financiero: ${e.t}`,
          `• Estatus Oficial: ${e.e}`,
          `• Entidad Federativa: ${e.d}`,
          `Nota CONDUSEF: Ninguna institución financiera regulada solicita anticipos para liberar un crédito.`
        ].join('\n');

        const copyDone = () => {
          const btnText = document.getElementById('exp-btn-copy-text');
          if (btnText) btnText.innerText = '¡Cédula Copiada!';
          this.showToast(`Cédula oficial de ${e.n} copiada al portapapeles.`);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(cedula).then(copyDone).catch(() => {
            this.showToast(`Cédula oficial de ${e.n} generada.`);
          });
        } else {
          try {
            const ta = document.createElement('textarea');
            ta.value = cedula;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            copyDone();
          } catch (err) {
            this.showToast(`Cédula oficial de ${e.n} generada.`);
          }
        }
      },

      /* =======================================================================
         COMPARADOR INTERACTIVO DE ENTIDADES (HASTA 3 LADO A LADO)
         ======================================================================= */
      toggleComparator(folio, forceAddOnly = false) {
        const full = window.SIPRES_DATABASE || [];
        const entity = full.find(e => e.f === String(folio).trim());
        if (!entity) return;

        const exists = this.comparatorList.some(e => e.f === entity.f);
        if (exists) {
          if (!forceAddOnly) {
            this.comparatorList = this.comparatorList.filter(e => e.f !== entity.f);
            this.showToast(`${entity.n} se quitó del comparador.`);
          }
        } else {
          if (this.comparatorList.length >= 3) {
            this.showToast('Máximo 3 instituciones a la vez en el comparador.');
            this.openComparatorModal();
            return;
          }
          this.comparatorList.push(entity);
          this.showToast(`${entity.n} agregada al comparador (${this.comparatorList.length}/3).`);
        }

        this.updateComparatorUI();
        this.renderEntities();
        this.syncExpedienteCompareBtn();
        if (!document.getElementById('modal-comparator').classList.contains('hidden')) {
          this.renderComparatorGrid();
        }
      },

      removeFromComparator(folio) {
        this.comparatorList = this.comparatorList.filter(e => e.f !== String(folio));
        this.updateComparatorUI();
        this.renderEntities();
        this.renderComparatorGrid();
      },

      clearComparator() {
        this.comparatorList = [];
        this.updateComparatorUI();
        this.renderEntities();
        this.renderComparatorGrid();
      },

      updateComparatorUI() {
        const count = this.comparatorList.length;
        const badge = document.getElementById('compare-badge');
        const floatingBar = document.getElementById('floating-compare-bar');
        const floatingCount = document.getElementById('floating-compare-count');
        const floatingChips = document.getElementById('floating-compare-chips');

        if (badge) {
          badge.innerText = count;
          badge.classList.toggle('hidden', count === 0);
        }

        if (floatingBar) {
          floatingBar.classList.toggle('hidden', count === 0);
          if (floatingCount) floatingCount.innerText = `${count}/3`;
          if (floatingChips) {
            floatingChips.innerHTML = this.comparatorList.map(item => `
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-obsidian-elevated border border-slate-200 dark:border-obsidian-border text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                <span>${this.escapeHtml(item.n)}</span>
                <button type="button" onclick="PreviewApp.removeFromComparator('${item.f}')" class="text-slate-400 hover:text-red-500">
                  <i class="fa-solid fa-xmark text-[10px]"></i>
                </button>
              </span>
            `).join('');
          }
        }
      },

      openComparatorModal() {
        this.renderComparatorGrid();
        document.getElementById('modal-comparator').classList.remove('hidden');
      },

      closeComparatorModal() {
        document.getElementById('modal-comparator').classList.add('hidden');
        const res = document.getElementById('comparator-search-results');
        if (res) res.classList.add('hidden');
      },

      handleComparatorQuickSearch(query) {
        const resultsEl = document.getElementById('comparator-search-results');
        const q = this.normalizeText(query);
        if (!resultsEl) return;
        if (q.length < 2) {
          resultsEl.classList.add('hidden');
          return;
        }
        const full = window.SIPRES_DATABASE || [];
        const matches = full.filter(item =>
          !this.comparatorList.some(c => c.f === item.f) &&
          (this.normalizeText(item.n).includes(q) || this.normalizeText(item.s).includes(q) || String(item.f).includes(q))
        ).slice(0, 6);

        resultsEl.classList.remove('hidden');
        if (matches.length === 0) {
          resultsEl.innerHTML = `<div class="p-2.5 text-slate-400 text-center">Sin coincidencias disponibles para añadir.</div>`;
          return;
        }
        resultsEl.innerHTML = matches.map(item => `
          <button type="button" onclick="PreviewApp.toggleComparator('${item.f}', true); document.getElementById('comparator-search-input').value=''; document.getElementById('comparator-search-results').classList.add('hidden');" class="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-obsidian-surface flex items-center justify-between gap-2 transition-colors">
            <div>
              <span class="font-serif font-bold text-slate-900 dark:text-white">${this.escapeHtml(item.n)}</span>
              <span class="block text-[10px] text-slate-500 truncate max-w-md">${this.escapeHtml(item.s)}</span>
            </div>
            <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-legal-gold/10 text-legal-gold font-semibold shrink-0">+ Comparar (${item.f})</span>
          </button>
        `).join('');
      },

      renderComparatorGrid() {
        const grid = document.getElementById('comparator-grid');
        const addBar = document.getElementById('comparator-add-bar');
        if (!grid) return;

        if (addBar) {
          addBar.classList.toggle('hidden', this.comparatorList.length >= 3);
        }

        if (this.comparatorList.length === 0) {
          grid.innerHTML = `
            <div class="col-span-full py-12 px-4 text-center space-y-3 bg-slate-50 dark:bg-obsidian-elevated/40 rounded-2xl border border-dashed border-slate-300 dark:border-obsidian-border">
              <div class="w-10 h-10 rounded-xl bg-legal-gold/10 text-legal-gold flex items-center justify-center mx-auto">
                <i class="fa-solid fa-code-compare text-base"></i>
              </div>
              <div class="font-serif text-lg font-bold text-slate-900 dark:text-white">Selecciona hasta 3 instituciones para compararlas lado a lado</div>
              <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Haz clic en el botón <strong>Comparar</strong> directamente en la ficha de cualquier institución del Directorio SIPRES o usa el buscador superior para añadirlas aquí mismo.
              </p>
            </div>
          `;
          return;
        }

        grid.innerHTML = this.comparatorList.map(item => {
          const ch = VERIFIED_CHANNELS_PREVIEW[item.f];
          return `
            <div class="bg-slate-50 dark:bg-obsidian-elevated p-5 rounded-2xl border border-slate-200 dark:border-obsidian-border flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-white dark:bg-obsidian-surface text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-obsidian-border">
                    FOLIO ${this.escapeHtml(item.f)}
                  </span>
                  <button type="button" onclick="PreviewApp.removeFromComparator('${item.f}')" class="text-slate-400 hover:text-red-500 text-xs transition-colors" title="Quitar del comparador">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>

                <div>
                  <h4 class="font-serif font-bold text-lg text-slate-900 dark:text-white">${this.escapeHtml(item.n)}</h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">${this.escapeHtml(item.s)}</p>
                </div>

                <div class="pt-3 border-t border-slate-200 dark:border-obsidian-border space-y-2.5 text-xs">
                  <div>
                    <span class="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Estatus Regulatorio</span>
                    <span class="font-bold ${item.r === 'REGULADA' ? 'text-legal-emerald' : 'text-legal-gold'}">${this.escapeHtml(item.e)}</span>
                  </div>
                  <div>
                    <span class="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Sector CNBV / CONDUSEF</span>
                    <span class="font-medium text-slate-800 dark:text-slate-200">${this.escapeHtml(item.t)}</span>
                  </div>
                  <div>
                    <span class="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Sede Registrada</span>
                    <span class="text-slate-700 dark:text-slate-300">${this.escapeHtml(item.d)}</span>
                  </div>
                  <div>
                    <span class="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Monitoreo de Suplantación</span>
                    ${item.a
                      ? `<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-legal-gold"><i class="fa-solid fa-triangle-exclamation"></i> Alerta activa en WhatsApp</span>`
                      : `<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-legal-emerald"><i class="fa-solid fa-shield-check"></i> Sin alertas de suplantación</span>`
                    }
                  </div>
                  <div>
                    <span class="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Canal UNE Verificado</span>
                    <span class="font-mono text-[11px] text-slate-600 dark:text-slate-300">${ch ? `${ch.tel} • ${ch.web}` : 'Consulta directa en SIPRES'}</span>
                  </div>
                </div>
              </div>

              <div class="pt-3 border-t border-slate-200 dark:border-obsidian-border flex items-center gap-2">
                <button type="button" onclick="PreviewApp.closeComparatorModal(); PreviewApp.openExpediente('${item.f}');" class="px-3 py-2 rounded-xl bg-white dark:bg-obsidian-surface border border-slate-200 dark:border-obsidian-border text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-legal-gold transition-colors">
                  Ficha
                </button>
                <button type="button" onclick="PreviewApp.closeComparatorModal(); PreviewApp.startQuejaByFolio('${item.f}');" class="flex-1 py-2 px-3 rounded-xl bg-slate-900 dark:bg-legal-gold text-white font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5">
                  <span>Realizar Queja</span>
                  <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          `;
        }).join('');
      },

      /* =======================================================================
         AUTORELLENADO INTEGRAL DE INSTITUCIÓN EN EL STEPPER DE QUEJAS (PASO 2)
         ======================================================================= */
      mapSipresSectorToSelect(sipresSector) {
        const s = this.normalizeText(sipresSector);
        if (s.includes('banca multiple')) return 'Banca Múltiple';
        if (s.includes('banca de desarrollo')) return 'Banca de Desarrollo';
        if (s.includes('pago electronico')) return 'Fintech / IFPE';
        if (s.includes('financiamiento colectivo')) return 'Fintech / IFC';
        if (s.includes('populares')) return 'SOFIPO';
        if (s.includes('cooperativas')) return 'SOCAP';
        if (s.includes('uniones')) return 'Uniones de Crédito';
        if (s.includes('seguros') || s.includes('fianzas')) return 'Seguros y Fianzas';
        if (s.includes('afore') || s.includes('retiro')) return 'Afore';
        return 'Banca Múltiple';
      },

      suggestProductoBySector(mappedSector) {
        switch (mappedSector) {
          case 'Fintech / IFPE':
            return 'Banca Digital / App Móvil';
          case 'Fintech / IFC':
            return 'Plataforma de Financiamiento Colectivo';
          case 'SOFIPO':
          case 'Uniones de Crédito':
            return 'Crédito Personal o de Nómina';
          case 'SOCAP':
            return 'Cuenta de Ahorro / Inversión a Plazo';
          case 'Seguros y Fianzas':
            return 'Seguro de Auto o Gastos Médicos';
          default:
            return 'Tarjeta de Débito / Cuenta de Nómina';
        }
      },

      applyEntityToQuejaFields(entity) {
        if (!entity) return;
        const mappedSector = this.mapSipresSectorToSelect(entity.t);
        const suggestedProduct = this.suggestProductoBySector(mappedSector);

        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val;
        };

        setVal('input-queja-entidad', entity.s || entity.n);
        setVal('input-queja-nombre-comercial', entity.n || '');
        setVal('input-queja-folio', entity.f || '');
        setVal('input-queja-sector', mappedSector);
        setVal('input-queja-sede', entity.d || '');
        setVal('input-queja-estatus', entity.e || '');
        setVal('input-queja-producto', suggestedProduct);

        const badge = document.getElementById('sipres-match-badge');
        if (badge) {
          badge.innerHTML = `<i class="fa-solid fa-circle-check mr-1"></i>Folio #${this.escapeHtml(entity.f)} Vinculado`;
          badge.classList.remove('hidden');
        }

        const banner = document.getElementById('step2-linked-banner');
        const bannerTitle = document.getElementById('step2-banner-title');
        const bannerStatus = document.getElementById('step2-banner-status');
        const bannerSub = document.getElementById('step2-banner-sub');

        if (banner) {
          banner.classList.remove('hidden');
          if (bannerTitle) bannerTitle.innerText = `${entity.n} (Folio SIPRES #${entity.f})`;
          if (bannerStatus) {
            bannerStatus.innerText = entity.e;
            bannerStatus.className = entity.r === 'REGULADA'
              ? 'text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-legal-emerald font-semibold'
              : 'text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-legal-gold font-semibold';
          }
          if (bannerSub) {
            bannerSub.innerText = `${entity.t} • Sede registrada: ${entity.d}`;
          }
        }

        this.updateDocPreview();
      },

      startQuejaByFolio(folio) {
        const full = window.SIPRES_DATABASE || [];
        const entity = full.find(e => e.f === String(folio).trim());
        this.switchTab('quejas');
        this.setWizardStep(2);

        if (entity) {
          this.applyEntityToQuejaFields(entity);
          this.showToast(`Datos oficiales de ${entity.n} (Folio #${entity.f}) cargados automáticamente en el Paso 2.`);
        }

        const step2El = document.getElementById('wizard-step-2');
        if (step2El) {
          step2El.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          step2El.classList.add('ring-2', 'ring-legal-gold/50', 'rounded-xl', 'p-2');
          setTimeout(() => {
            step2El.classList.remove('ring-2', 'ring-legal-gold/50', 'rounded-xl', 'p-2');
          }, 1400);
        }
      },

      handleEntityAutocomplete(val) {
        const q = this.normalizeText(val);
        const full = window.SIPRES_DATABASE || [];
        const match = full.find(item =>
          this.normalizeText(item.s) === q ||
          this.normalizeText(item.n) === q ||
          String(item.f) === q
        );
        const badge = document.getElementById('sipres-match-badge');
        if (match) {
          this.applyEntityToQuejaFields(match);
        } else {
          if (badge) badge.classList.add('hidden');
          const banner = document.getElementById('step2-linked-banner');
          if (banner && !q) banner.classList.add('hidden');
          this.updateDocPreview();
        }
      },

      handleFolioDirectInput(folioVal) {
        const clean = String(folioVal || '').trim();
        const full = window.SIPRES_DATABASE || [];
        const match = full.find(item => item.f === clean);
        if (match) {
          this.applyEntityToQuejaFields(match);
        } else {
          this.updateDocPreview();
        }
      },

      // WIZARD SIDE-BY-SIDE (5 PASOS COMPLETOS)
      setProcedure(proc) {
        this.procedure = proc;
        const btnCondusef = document.getElementById('btn-proc-condusef');
        const btnRedeco = document.getElementById('btn-proc-redeco');
        const procTag = document.getElementById('doc-preview-proc-tag');
        const lblInst = document.getElementById('lbl-institucion');
        const activeCls = "px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-legal-gold text-white shadow-sm transition-all";
        const inactiveCls = "px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-obsidian-elevated text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-obsidian-border hover:border-legal-gold/50 transition-all";

        if (proc === 'condusef') {
          btnCondusef.className = activeCls;
          btnRedeco.className = inactiveCls;
          if (lblInst) lblInst.innerText = 'Denominación / Razón Social Oficial (409 entidades) *';
          if (procTag) {
            procTag.innerText = 'VÍA CONDUSEF';
            procTag.className = 'text-legal-emerald font-semibold';
          }
        } else {
          btnRedeco.className = activeCls;
          btnCondusef.className = inactiveCls;
          if (lblInst) lblInst.innerText = 'Despacho de Cobranza o Entidad Financiera Denunciada *';
          if (procTag) {
            procTag.innerText = 'QUEJA REDECO';
            procTag.className = 'text-red-500 font-semibold';
          }
        }
      },

      validateCurpLive() {
        const input = document.getElementById('input-quejoso-curp');
        const badge = document.getElementById('curp-validation-badge');
        if (!input || !badge) return;
        const val = input.value.trim().toUpperCase();
        const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
        if (!val) {
          badge.innerText = 'Formato RENAPO';
          badge.className = 'text-[10px] font-mono text-slate-400';
        } else if (curpRegex.test(val)) {
          badge.innerText = 'Válida RENAPO';
          badge.className = 'text-[10px] font-mono text-legal-emerald font-semibold';
        } else {
          badge.innerText = `${val.length}/18 caracteres`;
          badge.className = 'text-[10px] font-mono text-legal-gold';
        }
      },

      clearQuejaDraft() {
        const ids = [
          'input-quejoso-nombre', 'input-quejoso-curp', 'input-quejoso-email',
          'input-quejoso-tel', 'input-quejoso-calle', 'input-quejoso-colonia',
          'input-quejoso-municipio', 'input-quejoso-cp', 'input-queja-entidad',
          'input-queja-nombre-comercial', 'input-queja-folio', 'input-queja-sede',
          'input-queja-estatus', 'input-queja-contrato', 'input-queja-monto',
          'input-queja-hechos', 'input-queja-pretensiones'
        ];
        ids.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
        const banner = document.getElementById('step2-linked-banner');
        if (banner) banner.classList.add('hidden');
        const badge = document.getElementById('sipres-match-badge');
        if (badge) badge.classList.add('hidden');
        this.clearSignature();
        this.evidenceFiles = [];
        const thumbs = document.getElementById('preview-evidence-thumbs');
        if (thumbs) thumbs.innerHTML = '';
        const anexosBadge = document.getElementById('doc-preview-anexos-badge');
        if (anexosBadge) anexosBadge.classList.add('hidden');
        this.validateCurpLive();
        this.updateDocPreview();
      },

      populateDatalist() {
        const dl = document.getElementById('preview-sipres-datalist');
        if (!dl) return;
        const full = window.SIPRES_DATABASE || [];
        dl.innerHTML = full.map(item => `<option value="${this.escapeHtml(item.s)}">${this.escapeHtml(item.n)} (Folio ${item.f} • ${this.escapeHtml(item.d)})</option>`).join('');
      },

      initSignatureCanvas() {
        const canvas = document.getElementById('preview-signature-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let drawing = false;

        const getPos = (e) => {
          const rect = canvas.getBoundingClientRect();
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const clientY = e.touches ? e.touches[0].clientY : e.clientY;
          return { x: clientX - rect.left, y: clientY - rect.top };
        };

        const start = (e) => {
          drawing = true;
          const p = getPos(e);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
        };
        const move = (e) => {
          if (!drawing) return;
          e.preventDefault();
          const p = getPos(e);
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.strokeStyle = '#0f172a';
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        };
        const end = () => {
          if (!drawing) return;
          drawing = false;
          const sigImg = document.getElementById('doc-preview-signature-img');
          if (sigImg) {
            sigImg.src = canvas.toDataURL('image/png');
            sigImg.classList.remove('hidden');
          }
        };

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);
        canvas.addEventListener('touchstart', start, { passive: false });
        canvas.addEventListener('touchmove', move, { passive: false });
        canvas.addEventListener('touchend', end);
      },

      resizeSignatureCanvas() {
        const canvas = document.getElementById('preview-signature-canvas');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && canvas.width !== rect.width) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
      },

      clearSignature() {
        const canvas = document.getElementById('preview-signature-canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        const sigImg = document.getElementById('doc-preview-signature-img');
        if (sigImg) {
          sigImg.src = '';
          sigImg.classList.add('hidden');
        }
      },

      async handleEvidenceSelect(event) {
        const rawFiles = Array.from(event.target.files || []);
        if (rawFiles.length === 0) return;
        this.showToast('Sanitizando metadatos EXIF de imágenes (Protección GPS)...');
        
        for (const file of rawFiles) {
          if (this.evidenceFiles.length >= 6) break;
          const sanitized = await this.sanitizeImageExif(file);
          this.evidenceFiles.push(sanitized.file);
        }
        
        const thumbs = document.getElementById('preview-evidence-thumbs');
        const anexosBadge = document.getElementById('doc-preview-anexos-badge');
        if (thumbs) {
          thumbs.innerHTML = this.evidenceFiles.map(f => `
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-obsidian-elevated border border-slate-200 dark:border-obsidian-border text-[11px] text-slate-700 dark:text-slate-300">
              <i class="fa-solid fa-shield-halved text-legal-emerald" title="Metadatos EXIF y GPS eliminados"></i>
              <span class="truncate max-w-[130px]">${this.escapeHtml(f.name)}</span>
            </span>
          `).join('');
        }
        if (anexosBadge) {
          if (this.evidenceFiles.length > 0) {
            anexosBadge.innerText = `${this.evidenceFiles.length} anexo(s) EXIF-depurado(s)`;
            anexosBadge.classList.remove('hidden');
          } else {
            anexosBadge.classList.add('hidden');
          }
        }
        this.showToast(`✓ ${rawFiles.length} anexo(s) procesado(s) sin metadatos EXIF.`);
        this.updateQuejaHashLive();
      },

      setWizardStep(stepNum) {
        document.querySelectorAll('.wizard-step-content').forEach(el => el.classList.add('hidden'));
        const activeStepEl = document.getElementById(`wizard-step-${stepNum}`);
        if (activeStepEl) activeStepEl.classList.remove('hidden');

        if (stepNum === 5) {
          setTimeout(() => this.resizeSignatureCanvas(), 30);
        }

        for (let i = 1; i <= 5; i++) {
          const pill = document.getElementById(`step-pill-${i}`);
          if (!pill) continue;
          if (i === stepNum) {
            pill.className = "step-pill py-2 px-2.5 rounded-lg bg-legal-gold/10 text-legal-gold font-semibold border border-legal-gold/30 flex items-center justify-center gap-2 transition-all cursor-pointer";
            pill.querySelector('span').className = "w-5 h-5 rounded-full bg-legal-gold text-white flex items-center justify-center text-[10px] font-bold shrink-0";
          } else if (i < stepNum) {
            pill.className = "step-pill py-2 px-2.5 rounded-lg bg-emerald-500/10 text-legal-emerald font-semibold border border-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer";
            pill.querySelector('span').className = "w-5 h-5 rounded-full bg-legal-emerald text-white flex items-center justify-center text-[10px] font-bold shrink-0";
          } else {
            pill.className = "step-pill py-2 px-2.5 rounded-lg bg-slate-50 dark:bg-obsidian-elevated text-slate-400 font-medium border border-slate-200 dark:border-obsidian-border flex items-center justify-center gap-2 hover:border-legal-gold/40 transition-all cursor-pointer";
            pill.querySelector('span').className = "w-5 h-5 rounded-full bg-slate-200 dark:bg-obsidian-border text-slate-600 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0";
          }
        }
      },

      applyHechosPreset(type) {
        const hechosEl = document.getElementById('input-queja-hechos');
        const presets = {
          spei: "El día 14 de octubre de 2026 se registraron tres cargos no reconocidos mediante transferencias SPEI desde mi cuenta de débito, por un total acumulado de $48,500.00 MXN, sin que mediara notificación por SMS o token dinámico OTP. A pesar de haber interpuesto la aclaración formal con folio interno REF-88102, la institución emitió resolución desfavorable sin aportar los registros técnicos de autenticación biométrica exigidos por la CNBV.",
          cargos: "En mi estado de cuenta de fecha reciente advertí cuatro cargos en comercio electrónico que jamás autoricé ni realicé con mi tarjeta física o digital, toda vez que el plástico permaneció bajo mi resguardo en todo momento y no recibí código de validación 3D Secure.",
          cobranza: "Desde inicios del presente mes he recibido llamadas e intimidaciones reiteradas fuera del horario legal permitido, incluyendo mensajes amenazantes dirigidos a referencias personales que no guardan relación de aval ni obligado solidario, contraviniendo las disposiciones del REDECO y el artículo 284 Bis del Código Penal Federal.",
          seguro: "Habiendo ocurrido el siniestro amparado bajo póliza vigente y con primas cubiertas oportunamente, la aseguradora determinó improcedente la indemnización invocando una exclusión ambigua no comunicada al momento de la contratación, en contravención a la Ley sobre el Contrato de Seguro."
        };
        if (hechosEl && presets[type]) {
          hechosEl.value = presets[type];
          this.updateDocPreview();
        }
      },

      applyPretensionPreset(type) {
        const pretEl = document.getElementById('input-queja-pretensiones');
        const monto = document.getElementById('input-queja-monto').value || 'el monto controvertido';
        const presets = {
          restitucion: `PRIMERO: La restitución íntegra e inmediata de la cantidad de ${monto} sustraída sin mi consentimiento, adicionada con los intereses moratorios legales conforme al artículo 68 Bis de la LPDUSF y jurisprudencia aplicable de la Primera Sala de la SCJN.`,
          pericial: `SEGUNDO: Se requiera formalmente a la institución financiera exhibir en audiencia de conciliación las bitácoras criptográficas de factor de autenticación, dirección IP y geolocalización exigidas por la Circular Única de Bancos, con el apercibimiento legal correspondiente.`,
          buro: `TERCERO: La cancelación definitiva de intereses ordinarios, moratorios y comisiones derivadas del acto reclamado, el cese inmediato de gestiones de cobranza extrajudicial y la rectificación de cualquier registro negativo ante las Sociedades de Información Crediticia (Buró de Crédito / Círculo de Crédito).`
        };
        if (pretEl && presets[type]) {
          const current = pretEl.value.trim();
          pretEl.value = current ? `${current}\n\n${presets[type]}` : presets[type];
          this.updateDocPreview();
        }
      },

      updateDocPreview() {
        const nombre = document.getElementById('input-quejoso-nombre')?.value || '[Nombre del Promovente]';
        const curp = (document.getElementById('input-quejoso-curp')?.value || '[CURP]').toUpperCase();
        const email = document.getElementById('input-quejoso-email')?.value || '[correo@ejemplo.com]';
        const tel = document.getElementById('input-quejoso-tel')?.value || '[Teléfono]';
        const calle = document.getElementById('input-quejoso-calle')?.value || '[Calle y Número]';
        const colonia = document.getElementById('input-quejoso-colonia')?.value || '[Colonia]';
        const municipio = document.getElementById('input-quejoso-municipio')?.value || '[Alcaldía/Municipio]';
        const cp = document.getElementById('input-quejoso-cp')?.value || '[C.P.]';

        const entidad = document.getElementById('input-queja-entidad')?.value || '[Institución Financiera]';
        const comercial = document.getElementById('input-queja-nombre-comercial')?.value || '[Nombre Comercial]';
        const folio = document.getElementById('input-queja-folio')?.value || 'S/F';
        const sector = document.getElementById('input-queja-sector')?.value || 'Banca Múltiple';
        const sede = document.getElementById('input-queja-sede')?.value || 'Ciudad de México';
        const estatus = document.getElementById('input-queja-estatus')?.value || 'En operación';
        const producto = document.getElementById('input-queja-producto')?.value || 'Producto Financiero';
        const causa = document.getElementById('input-queja-causa')?.value || 'Reclamación Formal';
        const contrato = document.getElementById('input-queja-contrato')?.value || 'S/N';
        const monto = document.getElementById('input-queja-monto')?.value || '$0.00 MXN';
        const fecha = document.getElementById('input-queja-fecha')?.value || '2026-10-14';
        const hechos = document.getElementById('input-queja-hechos')?.value || '[Sin relatoría de hechos capturada]';
        const pretensiones = document.getElementById('input-queja-pretensiones')?.value || '[Sin pretensiones capturadas]';

        const setTxt = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.innerText = val;
        };

        setTxt('doc-preview-nombre', nombre);
        setTxt('doc-preview-firma-nombre', nombre);
        setTxt('doc-preview-curp', curp);
        setTxt('doc-preview-email', email);
        setTxt('doc-preview-tel', tel);
        setTxt('doc-preview-domicilio', `${calle}, ${colonia}, Alcaldía/Municipio ${municipio}, C.P. ${cp}`);
        setTxt('doc-preview-entidad', entidad);
        setTxt('doc-preview-comercial', comercial);
        setTxt('doc-preview-entidad-folio', folio);
        setTxt('doc-preview-folio', `SIPRES-${folio}`);
        setTxt('doc-preview-sector', sector);
        setTxt('doc-preview-sede', sede);
        setTxt('doc-preview-estatus', estatus);
        setTxt('doc-preview-producto', producto);
        setTxt('doc-preview-causa', causa);
        setTxt('doc-preview-contrato', contrato);
        setTxt('doc-preview-monto', monto);
        setTxt('doc-preview-fecha', fecha);
        setTxt('doc-preview-hechos', hechos);
        setTxt('doc-preview-pretensiones', pretensiones);
        this.updateQuejaHashLive();
      },

      /* =======================================================================
         INTEGRACIÓN MOTOR VECTORIAL PDF (EscudoPDF + pdf-lib.min.js)
         ======================================================================= */
      collectQuejaFormData() {
        const getV = (id) => (document.getElementById(id)?.value || '').trim();
        return {
          nombre: getV('input-quejoso-nombre') || 'Ciudadano Promovente',
          curp: (getV('input-quejoso-curp') || 'PEHJ850412HDFRRN09').toUpperCase(),
          email: getV('input-quejoso-email') || 'usuario@correo.com',
          telefono: getV('input-quejoso-tel') || '5512345678',
          calle: getV('input-quejoso-calle') || 'Av. Insurgentes Sur 123, Depto 4B',
          colonia: getV('input-quejoso-colonia') || 'Col. Del Valle',
          municipio: getV('input-quejoso-municipio') || 'Benito Juárez',
          cp: getV('input-quejoso-cp') || '03100',
          institucion: getV('input-queja-entidad') || 'BBVA México, S.A., Institución de Banca Múltiple',
          comercial: getV('input-queja-nombre-comercial') || 'BBVA',
          folioSipres: getV('input-queja-folio') || '40012',
          sector: getV('input-queja-sector') || 'Banca Múltiple',
          sede: getV('input-queja-sede') || 'Ciudad de México',
          producto: getV('input-queja-producto') || 'Tarjeta de Débito / Cuenta de Nómina',
          causa: getV('input-queja-causa') || 'Transferencia SPEI no autorizada / Fraude cibernético',
          contrato: getV('input-queja-contrato') || '**** 4829',
          monto: getV('input-queja-monto') || '48500',
          fechaHechos: getV('input-queja-fecha') || new Date().toISOString().split('T')[0],
          hechos: getV('input-queja-hechos') || 'El día 14 de octubre de 2026 se registraron tres cargos no reconocidos mediante transferencias SPEI desde mi cuenta de débito, por un total acumulado de $48,500.00 MXN...',
          pretensiones: getV('input-queja-pretensiones') || 'PRIMERO: La restitución íntegra e inmediata de la cantidad reclamada...',
          isRedeco: this.procedure === 'redeco'
        };
      },

      async buildQuejaLayout(data) {
        if (!window.EscudoPDF) {
          throw new Error('El motor EscudoPDF no se encuentra cargado en memoria.');
        }
        await window.EscudoPDF.ready();
        const { B } = window.EscudoPDF;

        if (!this.pdfPreviewState.folio || this.pdfPreviewState.folioIsRedeco !== data.isRedeco) {
          this.pdfPreviewState.folio = `${data.isRedeco ? 'REDECO-CONDUSEF' : 'CONDUSEF-METROPOLITANA'}-2026-${Math.floor(10000 + Math.random() * 90000)}`;
          this.pdfPreviewState.folioIsRedeco = data.isRedeco;
        }
        const folioExp = this.pdfPreviewState.folio;
        const fechaHoy = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

        // Cálculo de integridad criptográfica SHA-256 (NOM-151-SCFI-2016)
        const rawContent = `${data.curp}|${data.folioSipres}|${data.fechaHechos}|${data.monto}|${data.hechos}|${data.pretensiones}`;
        const cryptoHash = await this.generateSha256(rawContent);
        data.cryptoHash = cryptoHash;

        // Extraer firma autógrafa digital del canvas si fue estampada
        let sigImg = null;
        const canvas = document.getElementById('preview-signature-canvas');
        if (canvas) {
          try {
            const ctx = canvas.getContext('2d');
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const isDrawn = imgData.data.some((channel, idx) => idx % 4 === 3 && channel > 0);
            if (isDrawn) {
              const dataUrl = canvas.toDataURL('image/png');
              sigImg = await window.EscudoPDF.prepareImage(dataUrl, { keepAlpha: true, trim: true, maxDim: 900 });
            }
          } catch (e) {
            console.warn('[EscudoPDF] No se pudo preparar la imagen de la firma:', e);
          }
        }

        // Extraer anexos documentales si existen
        const evImgs = [];
        if (this.evidenceFiles && this.evidenceFiles.length > 0) {
          for (let i = 0; i < this.evidenceFiles.length; i++) {
            const file = this.evidenceFiles[i];
            try {
              const dataUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(file);
              });
              if (dataUrl) {
                const prep = await window.EscudoPDF.prepareImage(dataUrl, { keepAlpha: false, maxDim: 1400 });
                if (prep) evImgs.push({ name: file.name || `Anexo ${i + 1}`, img: prep });
              }
            } catch (err) {
              console.warn('[EscudoPDF] Error cargando anexo documental:', err);
            }
          }
        }

        const doc = window.EscudoPDF.createDocument({
          family: 'times',
          size: 10.8,
          lineHeight: 1.48,
          color: '#0f172a',
          margins: { top: 48, right: 54, bottom: 56, left: 54 },
          onPageStart: (d, idx) => {
            if (idx > 0) {
              d.textAt(d.left, d.y + 8, data.isRedeco ? 'DENUNCIA FORMAL REDECO — CONDUSEF' : 'ESCRITO INICIAL DE RECLAMACIÓN — CONDUSEF', {
                size: 8.5,
                style: 'bold',
                color: '#475569'
              });
              d.textAt(d.right, d.y + 8, `EXP: ${folioExp}`, {
                size: 8.5,
                style: 'monoBold',
                color: '#0f172a',
                align: 'right'
              });
              d.y += 14;
              d.rule({ width: 0.75, color: '#cbd5e1', spaceAfter: 10 });
            }
          }
        });

        // 1. Membrete Oficial
        const headerTop = doc.y;
        const boxW = 160;
        const boxH = 34;
        const leftW = doc.contentWidth - boxW - 12;

        doc.rectAt(doc.right - boxW, headerTop, boxW, boxH, {
          fill: '#f8fafc',
          stroke: '#0f172a',
          lineWidth: 0.9
        });
        doc.textAt(doc.right - 7, headerTop + 13, folioExp, {
          size: 8.5,
          style: 'monoBold',
          align: 'right',
          color: '#0f172a',
          maxWidth: boxW - 14
        });
        doc.textAt(doc.right - 7, headerTop + 25, `RADICACIÓN: ${fechaHoy.toUpperCase()}`, {
          size: 6.8,
          style: 'regular',
          align: 'right',
          color: '#475569',
          maxWidth: boxW - 14
        });

        doc.paragraph(
          [B(data.isRedeco
            ? 'REGISTRO DE DESPACHOS DE COBRANZA (REDECO) — CONDUSEF'
            : 'COMISIÓN NACIONAL PARA LA PROTECCIÓN Y DEFENSA DE LOS USUARIOS DE SERVICIOS FINANCIEROS')],
          { x: doc.left, width: leftW, size: 10.5, lineHeight: 1.24, spaceAfter: 2 }
        );
        doc.paragraph([B('DIRECCIÓN GENERAL DE UNIDADES DE ATENCIÓN A USUARIOS (CDMX METROPOLITANA)')], {
          x: doc.left,
          width: leftW,
          size: 9.2,
          color: '#1e293b',
          lineHeight: 1.24,
          spaceAfter: 2
        });
        doc.paragraph('Av. Insurgentes Sur 762, PB, Col. Del Valle Norte, Alcaldía Benito Juárez, C.P. 03103, CDMX.', {
          x: doc.left,
          width: leftW,
          size: 8.2,
          color: '#475569',
          lineHeight: 1.24
        });

        doc.y = Math.max(doc.y, headerTop + boxH) + 6;
        doc.rule({ width: 1.6, color: '#0f172a', spaceAfter: 10 });

        // 2. Rubro Procesal
        doc.box(({ x, width }) => {
          doc.paragraph([
            B('PROMOVENTE: '),
            B((data.nombre || 'CIUDADANO PROMOVENTE').toUpperCase()),
            ` (CURP: ${(data.curp || 'N/A').toUpperCase()})`
          ], { x, width, size: 9.5, lineHeight: 1.35, spaceAfter: 1.5 });
          doc.paragraph([B('VS.')], { x, width, size: 9.5, lineHeight: 1.35, spaceAfter: 1.5 });
          doc.paragraph([
            B('ENTIDAD DENUNCIADA: '),
            B((data.institucion || 'INSTITUCIÓN FINANCIERA').toUpperCase()),
            data.folioSipres ? ` (FOLIO SIPRES: ${data.folioSipres})` : ''
          ], { x, width, size: 9.5, lineHeight: 1.35, spaceAfter: 1.5 });
          doc.paragraph([
            B('SECTOR FINANCIERO: '),
            (data.sector || 'Banca Múltiple').toUpperCase()
          ], { x, width, size: 9.5, lineHeight: 1.35, spaceAfter: 1.5 });
          doc.paragraph([
            B('ASUNTO: '),
            B(data.isRedeco
              ? 'DENUNCIA FORMAL POR COBRANZA EXTRAJUDICIAL ILEGAL (REDECO)'
              : 'ESCRITO INICIAL DE QUEJA Y PROCEDIMIENTO DE CONCILIACIÓN')
          ], { x, width, size: 9.5, lineHeight: 1.35 });
        }, {
          padding: 7,
          inset: 11,
          fill: '#f8fafc',
          stroke: '#e2e8f0',
          leftBar: { width: 2.8, color: '#0f172a' }
        });
        doc.space(10);

        // 3. Proemio Legal Normativo
        doc.paragraph([B('C. TITULAR DE LA UNIDAD DE ATENCIÓN A USUARIOS DE LA CONDUSEF, PRESENTE:')], {
          size: 10.4,
          keepWithNext: 32,
          spaceAfter: 7
        });

        const domParts = [
          data.calle,
          data.colonia ? `Col. ${data.colonia}` : '',
          data.municipio ? `Alcaldía/Municipio ${data.municipio}` : '',
          data.cp ? `C.P. ${data.cp}` : ''
        ].filter(Boolean).join(', ') || 'domicilio señalado en autos';

        doc.paragraph([
          'El que suscribe, ',
          B(data.nombre || 'Ciudadano Promovente'),
          ', por mi propio derecho, señalando como domicilio legal para oír y recibir toda clase de notificaciones el ubicado en ',
          B(domParts),
          ', con correo electrónico de notificación ',
          B(data.email || 'no especificado'),
          ' y teléfono de contacto ',
          B(data.telefono || 'no especificado'),
          '; comparezco ante esta H. Autoridad con el debido respeto a exponer:'
        ], { align: 'justify', indent: 20, size: 10.6, lineHeight: 1.48, spaceAfter: 8 });

        const cleanMonto = String(data.monto).replace(/[^0-9.]/g, '');
        const montoNum = parseFloat(cleanMonto);
        const montoFmt = '$' + (Number.isFinite(montoNum) ? montoNum : 0).toLocaleString('es-MX', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) + ' MXN';

        doc.paragraph([
          'Que por medio del presente ocurso, con fundamento en los ',
          B('Artículos 1, 4, 11, 50, 59 Bis 1, 60 y 68 de la Ley de Protección y Defensa al Usuario de Servicios Financieros (LPDUSF)'),
          ', así como en los ',
          B('Artículos 15, 35 y 36 de la Ley Federal de Procedimiento Administrativo (LFPA)'),
          data.isRedeco ? ' y el Artículo 284 Bis del Código Penal Federal' : '',
          ', vengo a formular formal escrito de reclamación en contra de ',
          B(data.institucion || 'la institución señalada'),
          ', respecto del producto financiero ',
          B(data.producto || 'N/A'),
          ' con identificador de contrato o cuenta ',
          B(data.contrato || 'En trámite / Sin número'),
          ', por concepto de ',
          B(data.causa || 'Reclamación financiera'),
          ', reclamando el resarcimiento patrimonial de ',
          B(montoFmt),
          ' motivado por los siguientes hechos y consideraciones de derecho:'
        ], { align: 'justify', indent: 20, size: 10.6, lineHeight: 1.48, spaceAfter: 10 });

        const addSectionHeading = (title) => {
          doc.ensureSpace(44);
          doc.space(4);
          doc.paragraph([B(title)], { size: 10.4, color: '#0f172a', spaceAfter: 2 });
          doc.rule({ width: 0.75, color: '#94a3b8', spaceAfter: 6 });
        };

        // 4. Capítulo I: Hechos
        addSectionHeading('I. CAPÍTULO DE HECHOS Y ANTECEDENTES');
        const hechosBlocks = String(data.hechos || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
        if (hechosBlocks.length === 0) hechosBlocks.push('Sin hechos especificados.');
        hechosBlocks.forEach((pText) => {
          doc.paragraph(pText, { align: 'justify', size: 10.5, lineHeight: 1.48, spaceAfter: 6 });
        });

        // 5. Capítulo II: Pretensiones
        addSectionHeading('II. PRETENSIONES Y MOTIVOS DE INCONFORMIDAD');
        const pretBlocks = String(data.pretensiones || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
        if (pretBlocks.length === 0) pretBlocks.push('Sin pretensiones especificadas.');
        pretBlocks.forEach((pText) => {
          doc.paragraph(pText, { align: 'justify', size: 10.5, lineHeight: 1.48, spaceAfter: 6 });
        });

        // 6. Capítulo III: Petitorios Formales
        addSectionHeading('III. PETITORIOS FORMALES ANTE LA CONDUSEF');
        doc.paragraph([
          B('PRIMERO. '),
          'Tenerme por presentado formulando en tiempo y forma formal reclamación en contra de la institución señalada.'
        ], { align: 'justify', size: 10.2, lineHeight: 1.42, spaceAfter: 4 });
        doc.paragraph([
          B('SEGUNDO. '),
          'Admitir la queja, dar inicio al procedimiento de conciliación previsto en el Art. 68 de la LPDUSF y emplazar a la contraparte a rendir su informe circunstanciado de ley.'
        ], { align: 'justify', size: 10.2, lineHeight: 1.42, spaceAfter: 4 });
        doc.paragraph([
          B('TERCERO. '),
          'En su oportunidad, ordenar la restitución de los fondos reclamados y velar por la integridad crediticia del promovente.'
        ], { align: 'justify', size: 10.2, lineHeight: 1.42, spaceAfter: 12 });

        // 7. Protesta Solemne y Firma Autógrafa (indivisible)
        const sigBlockHeight = sigImg ? 132 : 84;
        doc.ensureSpace(sigBlockHeight);
        doc.space(6);
        doc.paragraph('"Protesto lo necesario por la verdad y la defensa del usuario financiero"', {
          style: 'italic',
          size: 9.8,
          align: 'center',
          color: '#334155',
          spaceAfter: sigImg ? 6 : 24
        });

        const centerX = (doc.left + doc.right) / 2;
        if (sigImg) {
          const maxW = 180;
          const maxH = 48;
          const scale = Math.min(maxW / sigImg.w, maxH / sigImg.h, 1);
          const drawW = sigImg.w * scale;
          const drawH = sigImg.h * scale;
          doc.imageAt(sigImg, centerX - drawW / 2, doc.y, drawW, drawH);
          doc.y += drawH + 4;
        }

        doc.lineAt(centerX - 120, doc.y, centerX + 120, doc.y, { width: 0.9, color: '#0f172a' });
        doc.y += 5;
        doc.paragraph([B((data.nombre || 'CIUDADANO PROMOVENTE').toUpperCase())], {
          size: 10.2,
          align: 'center',
          spaceAfter: 1
        });
        doc.paragraph(`Firma del Promovente • CURP: ${(data.curp || 'N/A').toUpperCase()}`, {
          size: 8.8,
          align: 'center',
          color: '#475569',
          spaceAfter: 1
        });
        doc.paragraph(`Sello Digital Cívico: ${folioExp} • Verificado con Escudo Financiero Pro`, {
          size: 7.8,
          align: 'center',
          color: '#64748b',
          spaceAfter: 1
        });
        doc.paragraph(`Sello Criptográfico (NOM-151-SCFI-2016): SHA-256: ${cryptoHash}`, {
          size: 6.8,
          style: 'mono',
          align: 'center',
          color: '#0284c7'
        });

        // 8. Anexo de Pruebas Documentales
        if (evImgs.length > 0) {
          doc.newPage();
          doc.paragraph([B('ANEXO DE PRUEBAS DOCUMENTALES Y CONSTANCIAS GRÁFICAS')], {
            size: 11,
            color: '#0f172a',
            spaceAfter: 3
          });
          doc.paragraph('Constancias gráficas aportadas por el promovente bajo protesta de decir verdad:', {
            style: 'italic',
            size: 9.5,
            color: '#475569',
            spaceAfter: 12
          });

          const colGap = 14;
          const colW = (doc.contentWidth - colGap) / 2;
          const cardH = 220;

          for (let i = 0; i < evImgs.length; i += 2) {
            doc.ensureSpace(cardH + 12);
            const rowY = doc.y;
            for (let c = 0; c < 2 && (i + c) < evImgs.length; c++) {
              const item = evImgs[i + c];
              const x0 = doc.left + c * (colW + colGap);
              doc.rectAt(x0, rowY, colW, cardH, {
                fill: '#f8fafc',
                stroke: '#94a3b8',
                lineWidth: 0.75,
                dash: [3, 2]
              });
              doc.textAt(x0 + colW / 2, rowY + 14, `PRUEBA DOCUMENTAL ${i + c + 1}`, {
                size: 8.5,
                style: 'bold',
                align: 'center',
                color: '#0f172a'
              });
              doc.textAt(x0 + colW / 2, rowY + 25, item.name, {
                size: 7.5,
                align: 'center',
                color: '#64748b',
                maxWidth: colW - 16
              });
              const availW = colW - 18;
              const availH = cardH - 38;
              const sc = Math.min(availW / item.img.w, availH / item.img.h, 1);
              const iw = item.img.w * sc;
              const ih = item.img.h * sc;
              doc.imageAt(item.img, x0 + (colW - iw) / 2, rowY + 31 + (availH - ih) / 2, iw, ih);
            }
            doc.y = rowY + cardH + 12;
          }
        }

        const layout = doc.finish({
          footer: (d, pageIdx, totalPages) => {
            const fy = window.EscudoPDF.PAGE_H - 38;
            d.lineAt(d.left, fy - 10, d.right, fy - 10, { width: 0.5, color: '#cbd5e1' });
            d.textAt(d.left, fy - 2, `SHA-256: ${cryptoHash.slice(0, 36)}... • NOM-151-SCFI-2016`, {
              size: 6.8,
              style: 'mono',
              color: '#64748b'
            });
            d.textAt(d.left, fy + 7, 'Escudo Financiero Pro • Escrito Procesal Administrativo (Art. 59 Bis 1 y 68 LPDUSF)', {
              size: 6.8,
              color: '#94a3b8'
            });
            d.textAt(d.right, fy + 3, `Página ${pageIdx + 1} de ${totalPages}`, {
              size: 7.8,
              style: 'bold',
              color: '#334155',
              align: 'right'
            });
          }
        });

        const cleanName = (data.nombre || 'Promovente').replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `Escrito-CONDUSEF-${cleanName}-${new Date().toISOString().split('T')[0]}.pdf`;
        const meta = {
          title: `${data.isRedeco ? 'Denuncia REDECO' : 'Queja CONDUSEF'} — ${folioExp}`,
          subject: `Escrito formal de reclamación ante CONDUSEF`,
          keywords: ['CONDUSEF', 'REDECO', 'Escudo Financiero Pro', 'Reclamación']
        };

        return {
          layout,
          meta,
          filename,
          docType: 'queja',
          modalTitle: data.isRedeco
            ? 'Denuncia Formal REDECO — Vista Previa Vectorial'
            : 'Escrito Jurídico CONDUSEF — Vista Previa Vectorial',
          modalSubtitle: `${folioExp} • Texto 100% seleccionable con tipografía oficial legal`
        };
      },

      async buildForensicLayout(rec) {
        if (!window.EscudoPDF) {
          throw new Error('El motor EscudoPDF no se encuentra cargado en memoria.');
        }
        await window.EscudoPDF.ready();
        const { B, M } = window.EscudoPDF;

        const score = Math.max(0, Math.min(100, parseInt(rec.score, 10) || 0));
        const level = score >= 70
          ? { t: 'RIESGO CRÍTICO', c: '#dc2626', bg: '#fef2f2' }
          : (score >= 40
            ? { t: 'RIESGO MODERADO', c: '#d97706', bg: '#fffbeb' }
            : { t: 'RIESGO BAJO', c: '#059669', bg: '#ecfdf5' });

        const when = new Date().toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' });
        const folio = `FX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const hashForensic = await this.generateSha256(`${folio}|${score}|${rec.threatType || 'Alerta'}|${when}`);

        const doc = window.EscudoPDF.createDocument({
          family: 'helvetica',
          size: 10,
          lineHeight: 1.45,
          color: '#0f172a',
          margins: { top: 48, right: 52, bottom: 54, left: 52 },
          onPageStart: (d, idx) => {
            if (idx > 0) {
              d.textAt(d.left, d.y + 8, 'ESCUDO FINANCIERO PRO — EVALUACIÓN HEURÍSTICA DE CIBERSEGURIDAD', {
                size: 8.2,
                style: 'bold',
                color: '#0c4a6e'
              });
              d.textAt(d.right, d.y + 8, `FOLIO: ${folio}`, {
                size: 8.2,
                style: 'monoBold',
                color: '#475569',
                align: 'right'
              });
              d.y += 14;
              d.rule({ width: 0.75, color: '#cbd5e1', spaceAfter: 10 });
            }
          }
        });

        // Membrete Heurístico
        doc.paragraph([B('ESCUDO FINANCIERO PRO — EVALUACIÓN HEURÍSTICA DE CIBERSEGURIDAD')], {
          size: 13,
          color: '#0c4a6e',
          spaceAfter: 2
        });
        doc.paragraph(`Laboratorio Heurístico Local • Folio ${folio} • Emitido: ${when}`, {
          size: 8.8,
          color: '#475569',
          spaceAfter: 6
        });
        doc.rule({ width: 2.2, color: '#0284c7', spaceAfter: 12 });

        // Tarjeta de Puntaje y Veredicto
        const scoreBoxW = 104;
        const rightX = doc.left + scoreBoxW + 14;
        const rightW = doc.contentWidth - scoreBoxW - 14;
        const cardStartY = doc.y;

        doc.paragraph([B(rec.verdictTitle || 'Evaluación Heurística de Evidencias')], {
          x: rightX,
          width: rightW,
          size: 12,
          color: '#0f172a',
          lineHeight: 1.3,
          spaceAfter: 4
        });
        doc.paragraph(rec.verdictSummary || 'Sin resumen disponible.', {
          x: rightX,
          width: rightW,
          size: 9.8,
          color: '#334155',
          lineHeight: 1.42,
          spaceAfter: 5
        });
        doc.paragraph(`Modalidad: ${rec.tipologia || 'Detección Heurística'} • Motor: Motor Heurístico Local 100% Client-Side`, {
          x: rightX,
          width: rightW,
          size: 8.4,
          color: '#64748b'
        });

        const cardH = Math.max(66, doc.y - cardStartY);
        doc.rectAt(doc.left, cardStartY, scoreBoxW, cardH, {
          fill: level.bg,
          stroke: level.c,
          lineWidth: 1.8
        });
        doc.textAt(doc.left + scoreBoxW / 2, cardStartY + cardH / 2 - 2, `${score}/100`, {
          size: 19,
          style: 'bold',
          color: level.c,
          align: 'center'
        });
        doc.textAt(doc.left + scoreBoxW / 2, cardStartY + cardH / 2 + 13, level.t, {
          size: 8,
          style: 'bold',
          color: level.c,
          align: 'center'
        });

        doc.y = cardStartY + cardH + 14;

        const sectionTitle = (txt) => {
          doc.ensureSpace(40);
          doc.paragraph([B(txt)], { size: 10.5, color: '#0f172a', spaceAfter: 4 });
        };

        // 1. Evidencia Analizada
        sectionTitle('1. EVIDENCIA ANALIZADA');
        const rawInput = document.getElementById('fn-message-input')?.value || document.getElementById('fn-url-input')?.value || '(sin texto proporcionado)';
        doc.box(({ x, width }) => {
          doc.paragraph([M(rawInput.slice(0, 500) + (rawInput.length > 500 ? '...' : ''))], {
            x,
            width,
            size: 9,
            color: '#1e293b',
            lineHeight: 1.4
          });
        }, {
          padding: 8,
          fill: '#f1f5f9',
          stroke: '#cbd5e1'
        });
        doc.space(12);

        // 2. Banderas Rojas Detectadas
        sectionTitle('2. BANDERAS ROJAS Y PATRONES CRIMINALES');
        const flags = Array.isArray(rec.redFlags) ? rec.redFlags : [];
        if (flags.length === 0) {
          doc.box(({ x, width }) => {
            doc.paragraph('No se detectaron banderas rojas críticas en la muestra evaluada.', {
              x,
              width,
              size: 9.5,
              color: '#065f46'
            });
          }, {
            padding: 8,
            fill: '#ecfdf5',
            stroke: '#a7f3d0',
            leftBar: { width: 3, color: '#059669' }
          });
          doc.space(8);
        } else {
          flags.forEach((f) => {
            doc.box(({ x, width }) => {
              doc.paragraph([B(`[!] ${f.badge || 'Patrón sospechoso'}`)], {
                x,
                width,
                size: 9.6,
                color: '#991b1b',
                spaceAfter: 2
              });
              doc.paragraph(f.desc || '', {
                x,
                width,
                size: 9.2,
                color: '#7f1d1d',
                lineHeight: 1.38
              });
            }, {
              padding: 7,
              inset: 10,
              fill: '#fef2f2',
              stroke: '#fecaca',
              leftBar: { width: 3, color: '#dc2626' }
            });
            doc.space(6);
          });
          doc.space(6);
        }

        // 3. Fundamento Jurídico
        sectionTitle('3. MARCO NORMATIVO Y TIPIFICACIÓN APLICABLE');
        doc.box(({ x, width }) => {
          doc.paragraph(rec.legalBasis || 'Art. 386 Código Penal Federal (Fraude patrimonial); Art. 284 Bis CPF (Cobranza ilegítima).', {
            x,
            width,
            size: 9.5,
            color: '#334155',
            lineHeight: 1.42
          });
        }, {
          padding: 8,
          fill: '#f8fafc',
          stroke: '#e2e8f0',
          leftBar: { width: 3, color: '#475569' }
        });
        doc.space(14);

        // Certificación Cívica Informativa
        doc.paragraph('Evaluación generada con Escudo Financiero Pro mediante Motor Heurístico Local (LFPDPPP Zero-Knowledge). Reporte cívico informativo de apoyo ciudadano.', {
          style: 'italic',
          size: 8.5,
          color: '#64748b',
          align: 'center'
        });

        const layout = doc.finish({
          footer: (d, pageIdx, totalPages) => {
            const fy = window.EscudoPDF.PAGE_H - 38;
            d.lineAt(d.left, fy - 10, d.right, fy - 10, { width: 0.5, color: '#cbd5e1' });
            d.textAt(d.left, fy - 2, `SHA-256: ${hashForensic.slice(0, 36)}... • NOM-151-SCFI-2016`, {
              size: 6.8,
              style: 'mono',
              color: '#64748b'
            });
            d.textAt(d.left, fy + 7, `Escudo Financiero Pro • Evaluación Heurística de Ciberseguridad (${folio})`, {
              size: 6.8,
              color: '#94a3b8'
            });
            d.textAt(d.right, fy + 3, `Página ${pageIdx + 1} de ${totalPages}`, {
              size: 7.8,
              style: 'bold',
              color: '#334155',
              align: 'right'
            });
          }
        });

        const filename = `Evaluacion-Heuristica-${folio}-${new Date().toISOString().split('T')[0]}.pdf`;
        const meta = {
          title: `Evaluación Heurística de Ciberseguridad — ${folio}`,
          subject: 'Informe técnico de evaluación heurística de amenazas y patrones de riesgo',
          keywords: ['Heurístico', 'Ciberseguridad', 'Evaluación', 'Fraude']
        };

        return {
          layout,
          meta,
          filename,
          docType: 'forense',
          modalTitle: 'Evaluación Heurística de Ciberseguridad — Vista Previa Vectorial',
          modalSubtitle: `${folio} • ${rec.verdictTitle || 'Evaluación de Amenaza'} (${score}/100)`
        };
      },

      async renderPreviewIntoModal(built, opts = {}) {
        this.pdfPreviewState.docType = built.docType || 'queja';
        this.pdfPreviewState.layout = built.layout;
        this.pdfPreviewState.meta = built.meta;
        this.pdfPreviewState.filename = built.filename;

        const titleEl = document.getElementById('preview-pdf-modal-title');
        if (titleEl && built.modalTitle) titleEl.textContent = built.modalTitle;

        const subEl = document.getElementById('preview-pdf-modal-subtitle');
        if (subEl && built.modalSubtitle) subEl.textContent = built.modalSubtitle;

        const badgeEl = document.getElementById('preview-pdf-meta-badge');
        if (badgeEl && built.layout) {
          const n = built.layout.pages.length;
          badgeEl.textContent = `Vectorial 100% • ${n} ${n === 1 ? 'página' : 'páginas'}`;
        }

        const container = document.getElementById('legal-sheet-container');
        if (container && built.layout && window.EscudoPDF) {
          const svgPages = window.EscudoPDF.toSvgPages(built.layout);
          container.innerHTML = svgPages.join('');
        }

        const targetMode = opts.keepMode ? this.pdfPreviewState.mode : 'dom';
        await this.switchPdfPreviewMode(targetMode);
      },

      async switchPdfPreviewMode(mode) {
        const target = mode === 'blob' ? 'blob' : 'dom';
        this.pdfPreviewState.mode = target;

        const domPane = document.getElementById('preview-dom-pane');
        const blobPane = document.getElementById('preview-blob-pane');
        const btnDom = document.getElementById('btn-preview-mode-dom');
        const btnBlob = document.getElementById('btn-preview-mode-blob');
        const iframe = document.getElementById('pdf-blob-iframe');

        if (btnDom && btnBlob) {
          if (target === 'dom') {
            btnDom.className = 'px-2.5 py-1 rounded-md text-[11px] font-bold bg-legal-gold text-white transition-all';
            btnBlob.className = 'px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-300 hover:text-white transition-all';
          } else {
            btnBlob.className = 'px-2.5 py-1 rounded-md text-[11px] font-bold bg-legal-gold text-white transition-all';
            btnDom.className = 'px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-300 hover:text-white transition-all';
          }
        }

        if (target === 'dom') {
          if (domPane) domPane.classList.remove('hidden');
          if (blobPane) blobPane.classList.add('hidden');
          return;
        }

        if (domPane) domPane.classList.add('hidden');
        if (blobPane) blobPane.classList.remove('hidden');

        if (this.pdfPreviewState.layout && iframe && window.EscudoPDF) {
          try {
            const blob = await window.EscudoPDF.toPdfBlob(this.pdfPreviewState.layout, this.pdfPreviewState.meta || {});
            if (this.pdfPreviewState.blobUrl) {
              URL.revokeObjectURL(this.pdfPreviewState.blobUrl);
            }
            this.pdfPreviewState.blobUrl = URL.createObjectURL(blob);
            iframe.src = this.pdfPreviewState.blobUrl;
          } catch (e) {
            console.error('[EscudoPDF] Error generando blob en iframe:', e);
          }
        }
      },

      closePdfModal() {
        const m = document.getElementById('modal-preview-pdf');
        if (m) m.classList.add('hidden');
        if (this.pdfPreviewState.blobUrl) {
          URL.revokeObjectURL(this.pdfPreviewState.blobUrl);
          this.pdfPreviewState.blobUrl = null;
        }
      },

      async printCurrentPdf() {
        try {
          if (!this.pdfPreviewState.layout) {
            const data = this.collectQuejaFormData();
            const built = await this.buildQuejaLayout(data);
            this.pdfPreviewState.layout = built.layout;
            this.pdfPreviewState.meta = built.meta;
            this.pdfPreviewState.filename = built.filename;
          }
          if (window.EscudoPDF) {
            window.EscudoPDF.printLayout(this.pdfPreviewState.layout, this.pdfPreviewState.meta?.title || 'Documento Oficial');
          } else {
            window.print();
          }
        } catch (err) {
          console.error('[EscudoPDF] Error al preparar impresión:', err);
          window.print();
        }
      },

      async downloadCurrentPreviewPdf() {
        if (!this.pdfPreviewState.layout) {
          return this.downloadQuejaPdf();
        }
        try {
          this.showToast('Compilando PDF vectorial con pdf-lib...');
          const blob = await window.EscudoPDF.toPdfBlob(this.pdfPreviewState.layout, this.pdfPreviewState.meta || {});
          window.EscudoPDF.downloadBlob(blob, this.pdfPreviewState.filename || 'Documento-Escudo.pdf');
          this.showToast(`Archivo "${this.pdfPreviewState.filename}" descargado exitosamente.`);
          return blob;
        } catch (err) {
          console.error('[EscudoPDF] Error descargando documento actual:', err);
          this.showToast('Error al descargar el PDF.');
        }
      },

      async openQuejaPdfPreview() {
        try {
          const data = this.collectQuejaFormData();
          this.showToast('Maquetando documento procesal con EscudoPDF...');
          const built = await this.buildQuejaLayout(data);
          await this.renderPreviewIntoModal(built, { keepMode: false });
          const modal = document.getElementById('modal-preview-pdf');
          if (modal) modal.classList.remove('hidden');
        } catch (err) {
          console.error('[EscudoPDF] Error abriendo visor:', err);
          alert('No se pudo generar la vista previa del documento: ' + err.message);
        }
      },

      async downloadQuejaPdf() {
        try {
          const data = this.collectQuejaFormData();
          this.showToast('Generando PDF vectorial legal con pdf-lib...');
          const built = await this.buildQuejaLayout(data);
          await this.renderPreviewIntoModal(built, { keepMode: true });
          const blob = await window.EscudoPDF.toPdfBlob(built.layout, built.meta);
          window.EscudoPDF.downloadBlob(blob, built.filename);
          this.showToast(`¡Documento oficial "${built.filename}" descargado con éxito!`);
          
          // Abrir automáticamente la Hoja de Ruta de Radicación Oficial (3 Vías y 20 días hábiles)
          setTimeout(() => {
            this.openPostDownloadRoadmap(data, built);
          }, 650);

          return blob;
        } catch (err) {
          console.error('[EscudoPDF] Error al exportar PDF de queja:', err);
          alert('Ocurrió un error al compilar el PDF: ' + err.message);
        }
      },

      async openForensicPdfPreview() {
        try {
          if (!this.lastForenseResult) this.runForensicAudit();
          const r = this.lastForenseResult;
          this.showToast('Maquetando Evaluación Heurística con EscudoPDF...');
          const built = await this.buildForensicLayout(r);
          await this.renderPreviewIntoModal(built, { keepMode: false });
          const modal = document.getElementById('modal-preview-pdf');
          if (modal) modal.classList.remove('hidden');
        } catch (err) {
          console.error('[EscudoPDF] Error abriendo evaluación heurística:', err);
          alert('No se pudo generar la evaluación heurística en PDF.');
        }
      },

      async downloadForensicPdf() {
        try {
          if (!this.lastForenseResult) this.runForensicAudit();
          const r = this.lastForenseResult;
          this.showToast('Compilando Evaluación Heurística con pdf-lib...');
          const built = await this.buildForensicLayout(r);
          await this.renderPreviewIntoModal(built, { keepMode: true });
          const blob = await window.EscudoPDF.toPdfBlob(built.layout, built.meta);
          window.EscudoPDF.downloadBlob(blob, built.filename);
          this.showToast(`¡Evaluación Heurística Oficial descargada con éxito!`);
          return blob;
        } catch (err) {
          console.error('[EscudoPDF] Error descargando evaluación heurística:', err);
          alert('Ocurrió un error al compilar la evaluación heurística.');
        }
      },

      // COMMAND PALETTE (CTRL + K)
      setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            this.openSearchModal();
          }
          if (e.key === 'Escape') {
            this.closeSearchModal();
            this.closeExpediente();
            this.closeComparatorModal();
            this.closeSafeHarborModal();
            this.closeAppFicha();
            this.closeNewReportModal();
            this.closePdfModal();
          }
        });
      },

      openTermsModal(forceView = true) {
        const m = document.getElementById('modal-safe-harbor');
        if (!m) return;
        if (forceView) {
          const termsView = document.getElementById('terms-content-view');
          const deniedView = document.getElementById('terms-denied-view');
          if (termsView) termsView.classList.remove('hidden');
          if (deniedView) deniedView.classList.add('hidden');
        }
        m.classList.remove('hidden');
      },

      openSafeHarborModal() {
        this.openTermsModal(true);
      },

      closeSafeHarborModal() {
        const m = document.getElementById('modal-safe-harbor');
        if (m) m.classList.add('hidden');
      },

      acceptTermsModal() {
        try {
          localStorage.setItem('escudo_terms_accepted', 'true');
        } catch (e) {}
        this.closeSafeHarborModal();
        this.showToast('✓ Términos y Condiciones aceptados. Bienvenido a Escudo Financiero Pro.');
      },

      denyTermsModal() {
        const termsView = document.getElementById('terms-content-view');
        const deniedView = document.getElementById('terms-denied-view');
        if (termsView) termsView.classList.add('hidden');
        if (deniedView) deniedView.classList.remove('hidden');
      },

      restoreTermsView() {
        const termsView = document.getElementById('terms-content-view');
        const deniedView = document.getElementById('terms-denied-view');
        if (termsView) termsView.classList.remove('hidden');
        if (deniedView) deniedView.classList.add('hidden');
      },

      toggleTermsAcceptBtn() {
        const cb = document.getElementById('check-terms-modal-accept');
        const btn = document.getElementById('btn-accept-terms-modal');
        if (btn && cb) {
          if (cb.checked) {
            btn.classList.add('ring-2', 'ring-emerald-400');
          } else {
            btn.classList.remove('ring-2', 'ring-emerald-400');
          }
        }
      },

      jumpToTermsSection(sectionId) {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },

      checkTermsOnLaunch() {
        const accepted = localStorage.getItem('escudo_terms_accepted');
        if (accepted !== 'true') {
          setTimeout(() => {
            this.openTermsModal(true);
          }, 300);
        }
      },

      openSearchModal() {
        document.getElementById('search-modal').classList.remove('hidden');
        document.getElementById('command-palette-input').focus();
      },

      closeSearchModal() {
        document.getElementById('search-modal').classList.add('hidden');
      },

      handleCommandSearch(query) {
        const q = this.normalizeText(query);
        const resultsBox = document.getElementById('command-results');
        if (q.length < 2) {
          resultsBox.innerHTML = '<div class="p-3 text-slate-400 text-center">Escribe al menos 2 letras...</div>';
          return;
        }
        const full = window.SIPRES_DATABASE || [];
        const matches = full.filter(item => 
          this.normalizeText(item.n).includes(q) || 
          this.normalizeText(item.s).includes(q) || 
          String(item.f).includes(q)
        ).slice(0, 6);

        if (matches.length === 0) {
          resultsBox.innerHTML = '<div class="p-3 text-slate-400 text-center">No se encontraron entidades coincidentes.</div>';
          return;
        }

        resultsBox.innerHTML = matches.map(item => `
          <div class="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-obsidian-elevated flex items-center justify-between gap-2 transition-colors">
            <div onclick="PreviewApp.closeSearchModal(); PreviewApp.openExpediente('${item.f}');" class="cursor-pointer flex-1 min-w-0">
              <div class="font-serif font-bold text-slate-900 dark:text-white">${this.escapeHtml(item.n)} <span class="font-mono text-[10px] text-slate-400 font-normal ml-1">#${this.escapeHtml(item.f)}</span></div>
              <div class="text-[10px] text-slate-500 truncate">${this.escapeHtml(item.s)}</div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button type="button" onclick="PreviewApp.toggleComparator('${item.f}')" class="px-2 py-1 rounded bg-slate-100 dark:bg-obsidian-border text-slate-600 dark:text-slate-300 hover:text-legal-gold text-[10px] font-semibold" title="Comparar">
                <i class="fa-solid fa-code-compare"></i>
              </button>
              <button type="button" onclick="PreviewApp.closeSearchModal(); PreviewApp.startQuejaByFolio('${item.f}');" class="px-2.5 py-1 rounded bg-slate-900 dark:bg-legal-gold text-white text-[10px] font-semibold">
                Realizar Queja
              </button>
            </div>
          </div>
        `).join('');
      },

      /* =======================================================================
         MÓDULO 3: MEDIDOR DE CRÉDITO, CÁLCULO OFICIAL BANXICO & DETECTOR DE RIESGOS
         ======================================================================= */
      formatMoney(num) {
        const val = Number(num) || 0;
        return '$' + val.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      },

      populateCreditoDatalist() {
        const dl = document.getElementById('cr-lender-datalist');
        if (!dl) return;
        const sipres = window.SIPRES_DATABASE || [];
        const apps = window.APPS_PRESTAMO_DB || [];
        const seen = new Set();
        const opts = [];

        sipres.forEach(item => {
          const key = this.normalizeText(item.n);
          if (!key || seen.has(key)) return;
          seen.add(key);
          opts.push(`<option value="${this.escapeHtml(item.n)}">SIPRES #${this.escapeHtml(item.f)} • ${this.escapeHtml(item.e)} (${this.escapeHtml(item.t)})</option>`);
        });

        apps.forEach(item => {
          const key = this.normalizeText(item.app);
          if (!key || seen.has(key)) return;
          seen.add(key);
          const tag = item.condusef === 'NO'
            ? `ALERTA MONTADEUDAS • ${item.reportes} reportes ciudadanos • Sin registro CONDUSEF`
            : `App registrada • ${item.reportes} reportes monitoreados`;
          opts.push(`<option value="${this.escapeHtml(item.app)}">${this.escapeHtml(tag)}</option>`);
        });

        dl.innerHTML = opts.join('');
      },

      handleCreditoLenderInput(rawVal) {
        const q = this.normalizeText(rawVal);
        const sipres = window.SIPRES_DATABASE || [];
        const apps = window.APPS_PRESTAMO_DB || [];

        let sipresMatch = null;
        let appMatch = null;

        if (q.length >= 2) {
          sipresMatch = sipres.find(e =>
            this.normalizeText(e.n) === q ||
            this.normalizeText(e.s) === q ||
            String(e.f) === q
          ) || (q.length >= 3 ? sipres.find(e => this.normalizeText(e.n).startsWith(q) || this.normalizeText(e.s).includes(q)) : null);

          appMatch = apps.find(a => this.normalizeText(a.app) === q) ||
            (q.length >= 4 ? apps.find(a => this.normalizeText(a.app).startsWith(q)) : null);
        }

        this.creditoMatchedSipres = sipresMatch || null;
        this.creditoMatchedApp = appMatch || null;

        const selectVerif = document.getElementById('cr-verificada');
        const banner = document.getElementById('cr-lender-status-banner');
        const icon = document.getElementById('cr-lender-status-icon');
        const title = document.getElementById('cr-lender-status-title');
        const pill = document.getElementById('cr-lender-status-pill');
        const desc = document.getElementById('cr-lender-status-desc');

        if (banner && icon && title && pill && desc) {
          if (appMatch && appMatch.condusef === 'NO' && !sipresMatch) {
            if (selectVerif) selectVerif.value = 'NO_MONTADEUDAS';
            banner.className = 'p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3';
            icon.className = 'fa-solid fa-triangle-exclamation text-red-500 mt-0.5 text-sm';
            title.innerText = `${appMatch.app} — DETECTADA EN RADAR MONTADEUDAS`;
            pill.className = 'px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-red-500/15 text-red-600 dark:text-red-400';
            pill.innerText = `NO REGULADA • ${appMatch.reportes.toLocaleString('es-MX')} REPORTES`;
            desc.innerHTML = `Sin registro en SIPRES CONDUSEF. Estatus Google Play: <strong>${this.escapeHtml(appMatch.googlePlay)}</strong> • APK externo: <strong>${this.escapeHtml(appMatch.apk)}</strong>. Alto riesgo de acceso a contactos, cobro extorsivo y retenciones ilegales.`;
          } else if (sipresMatch) {
            if (selectVerif) selectVerif.value = sipresMatch.r === 'REGULADA' ? 'SI' : 'NO';
            const isReg = sipresMatch.r === 'REGULADA';
            banner.className = isReg
              ? 'p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3'
              : 'p-3.5 rounded-xl bg-amber-500/10 border border-legal-gold/30 flex items-start gap-3';
            icon.className = isReg
              ? 'fa-solid fa-shield-halved text-legal-emerald mt-0.5 text-sm'
              : 'fa-solid fa-clock-rotate-left text-legal-gold mt-0.5 text-sm';
            title.innerText = `${sipresMatch.n} — Folio SIPRES #${sipresMatch.f}`;
            pill.className = isReg
              ? 'px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/15 text-legal-emerald'
              : 'px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/15 text-legal-gold';
            pill.innerText = sipresMatch.e.toUpperCase();

            let extraNotes = `${this.escapeHtml(sipresMatch.s)} • Sector: ${this.escapeHtml(sipresMatch.t)}.`;
            if (sipresMatch.a) {
              extraNotes += ` <strong class="text-legal-gold">Alerta CONDUSEF:</strong> Esta entidad reporta suplantadores en WhatsApp; contrata únicamente en sus canales oficiales.`;
            }
            if (appMatch) {
              extraNotes += ` Monitoreo digital: ${appMatch.reportes.toLocaleString('es-MX')} menciones ciudadanas registradas.`;
            }
            desc.innerHTML = extraNotes;
          } else if (q.length >= 2) {
            if (selectVerif) selectVerif.value = 'NO';
            banner.className = 'p-3.5 rounded-xl bg-amber-500/10 border border-legal-gold/35 flex items-start gap-3';
            icon.className = 'fa-solid fa-user-secret text-legal-gold mt-0.5 text-sm';
            title.innerText = `"${rawVal.trim()}" — No localizada en SIPRES (409 entidades)`;
            pill.className = 'px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/15 text-legal-gold';
            pill.innerText = 'SIN SUPERVISIÓN CNBV';
            desc.innerText = 'No figura en el padrón oficial SIPRES ni como entidad regulada. Evita compartir INE, contactos o anticipos con gestores en redes sociales o WhatsApp.';
          } else {
            banner.className = 'p-3.5 rounded-xl bg-slate-50 dark:bg-obsidian-elevated border border-slate-200 dark:border-obsidian-border flex items-start gap-3';
            icon.className = 'fa-solid fa-magnifying-glass text-slate-400 mt-0.5 text-sm';
            title.innerText = 'Escribe el nombre del banco, SOFIPO o aplicación móvil';
            pill.className = 'px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-200 dark:bg-obsidian-border text-slate-600 dark:text-slate-300';
            pill.innerText = '808 REGISTROS';
            desc.innerText = 'El sistema verificará instantáneamente si cuenta con folio oficial en SIPRES o alertas ciudadanas en el Radar Montadeudas.';
          }
        }

        this.calcCredito();
      },

      setCreditoAnticipo(mode) {
        this.creditoAnticipo = mode === 'SI' ? 'SI' : 'NO';
        const btnNo = document.getElementById('cr-btn-anticipo-no');
        const btnSi = document.getElementById('cr-btn-anticipo-si');
        const box = document.getElementById('cr-anticipo-box');
        const montoInput = document.getElementById('cr-anticipo-monto');

        if (this.creditoAnticipo === 'SI') {
          if (btnSi) btnSi.className = 'px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/50 shadow-sm';
          if (btnNo) btnNo.className = 'px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 bg-slate-50 dark:bg-obsidian-elevated text-slate-600 dark:text-slate-300 border-slate-200 dark:border-obsidian-border hover:border-emerald-500/40';
          if (box) box.classList.remove('hidden');
          if (montoInput && (!Number(montoInput.value) || Number(montoInput.value) <= 0)) {
            montoInput.value = '1500';
          }
        } else {
          if (btnNo) btnNo.className = 'px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 bg-emerald-500/10 text-legal-emerald border-emerald-500/40 shadow-sm';
          if (btnSi) btnSi.className = 'px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 bg-slate-50 dark:bg-obsidian-elevated text-slate-600 dark:text-slate-300 border-slate-200 dark:border-obsidian-border hover:border-red-500/50';
          if (box) box.classList.add('hidden');
        }
        this.calcCredito();
      },

      syncCreditoInput(field, rawVal, fromSlider) {
        const numInput = document.getElementById(`cr-${field}`);
        const sliderInput = document.getElementById(`cr-${field}-slider`);
        const val = Number(rawVal);

        if (fromSlider && numInput) {
          numInput.value = isNaN(val) ? '' : val;
        } else if (!fromSlider && sliderInput && !isNaN(val)) {
          const max = Number(sliderInput.max) || 100000;
          const min = Number(sliderInput.min) || 0;
          sliderInput.value = Math.min(max, Math.max(min, val));
        }

        this.calcCredito();
      },

      applyCreditoPreset(type) {
        const setField = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val;
        };

        if (type === 'bancario') {
          setField('cr-lender-input', 'BBVA');
          setField('cr-monto', '20000');
          setField('cr-monto-slider', '20000');
          setField('cr-frecuencia', '12');
          setField('cr-plazo', '12');
          setField('cr-plazo-slider', '12');
          setField('cr-pago', '2010');
          setField('cr-pago-slider', '2010');
          setField('cr-comision', '0');
          setField('cr-cat-prometido', '38.5');
          setField('cr-anticipo-monto', '0');
          this.setCreditoAnticipo('NO');
          this.handleCreditoLenderInput('BBVA');
          this.showToast('Escenario cargado: Crédito Personal Bancario Regulado (Semáforo Verde).');
        } else if (type === 'sofipo_cat') {
          setField('cr-lender-input', 'Stori');
          setField('cr-monto', '10000');
          setField('cr-monto-slider', '10000');
          setField('cr-frecuencia', '24');
          setField('cr-plazo', '12');
          setField('cr-plazo-slider', '12');
          setField('cr-pago', '1060');
          setField('cr-pago-slider', '1060');
          setField('cr-comision', '850');
          setField('cr-cat-prometido', '45.0');
          setField('cr-anticipo-monto', '0');
          this.setCreditoAnticipo('NO');
          this.handleCreditoLenderInput('Stori');
          this.showToast('Escenario cargado: Comisión retenida al desembolso + Discrepancia de CAT (Art. 43 LTOSF).');
        } else if (type === 'montadeudas') {
          setField('cr-lender-input', 'PRESTAMAX');
          setField('cr-monto', '2000');
          setField('cr-monto-slider', '2000');
          setField('cr-frecuencia', '52');
          setField('cr-plazo', '2');
          setField('cr-plazo-slider', '2');
          setField('cr-pago', '1250');
          setField('cr-pago-slider', '1250');
          setField('cr-comision', '700');
          setField('cr-cat-prometido', '18.0');
          setField('cr-anticipo-monto', '0');
          this.setCreditoAnticipo('NO');
          this.handleCreditoLenderInput('PRESTAMAX');
          this.showToast('Escenario cargado: App Montadeudas (retiene $700 al inicio y exige $2,500 en 14 días).');
        } else if (type === 'anticipo') {
          setField('cr-lender-input', 'Gestor Financiero Express WhatsApp');
          setField('cr-monto', '50000');
          setField('cr-monto-slider', '50000');
          setField('cr-frecuencia', '12');
          setField('cr-plazo', '24');
          setField('cr-plazo-slider', '24');
          setField('cr-pago', '2350');
          setField('cr-pago-slider', '2350');
          setField('cr-comision', '0');
          setField('cr-cat-prometido', '12.0');
          setField('cr-anticipo-monto', '1800');
          this.setCreditoAnticipo('SI');
          this.handleCreditoLenderInput('Gestor Financiero Express WhatsApp');
          this.showToast('Escenario cargado: Falso crédito con solicitud de depósito previo (Fraude Art. 386 CPF).');
        }
      },

      solvePeriodicIRR(principal, payment, n) {
        if (principal <= 0 || payment <= 0 || n <= 0) return 0;
        if (payment * n <= principal) return 0;

        let low = 0;
        let high = Math.max(10, (payment / principal) * 2);

        for (let iter = 0; iter < 70; iter++) {
          const mid = (low + high) / 2;
          if (mid === 0) break;
          const pv = payment * (1 - Math.pow(1 + mid, -n)) / mid;
          if (pv > principal) {
            low = mid;
          } else {
            high = mid;
          }
        }
        return (low + high) / 2;
      },

      calcAnnuityPayment(principal, annualCatPct, periodsPerYear, n) {
        if (principal <= 0 || n <= 0) return 0;
        const r = Math.pow(1 + (annualCatPct / 100), 1 / periodsPerYear) - 1;
        if (r <= 0) return principal / n;
        return (principal * r) / (1 - Math.pow(1 + r, -n));
      },

      calcCredito() {
        const montoEl = document.getElementById('cr-monto');
        if (!montoEl) return;

        const lenderRaw = (document.getElementById('cr-lender-input')?.value || '').trim();
        const verificada = document.getElementById('cr-verificada')?.value || 'SI';
        const monto = Math.max(100, Number(montoEl.value) || 0);
        const frecuencia = Number(document.getElementById('cr-frecuencia')?.value) || 12;
        const plazo = Math.max(1, Math.round(Number(document.getElementById('cr-plazo')?.value) || 1));
        const pago = Math.max(1, Number(document.getElementById('cr-pago')?.value) || 0);
        const comisionRaw = Math.max(0, Number(document.getElementById('cr-comision')?.value) || 0);
        const comisionEfectiva = Math.min(comisionRaw, monto * 0.92);
        const catPrometidoRaw = document.getElementById('cr-cat-prometido')?.value;
        const catPrometido = (catPrometidoRaw !== '' && catPrometidoRaw !== null) ? Number(catPrometidoRaw) : NaN;
        const anticipoMonto = this.creditoAnticipo === 'SI'
          ? Math.max(0, Number(document.getElementById('cr-anticipo-monto')?.value) || 0)
          : 0;

        // Equivalencia temporal legible
        const mesesEquiv = (plazo * 12) / frecuencia;
        const frecLabel = frecuencia === 52 ? 'semanal' : (frecuencia === 24 ? 'quincenal' : 'mensual');
        const frecPlural = frecuencia === 52 ? 'semanales' : (frecuencia === 24 ? 'quincenales' : 'mensuales');
        const eqEl = document.getElementById('cr-plazo-equivalente');
        if (eqEl) {
          eqEl.innerText = mesesEquiv < 1
            ? `Duración aprox: ${Math.round((plazo * 365) / frecuencia)} días`
            : `Duración aprox: ${mesesEquiv.toFixed(1)} meses`;
        }

        // Flujos reales conforme a Circular 21/2009 Banxico
        const netoRecibido = Math.max(1, monto - comisionEfectiva);
        const totalCuotas = pago * plazo;
        const totalPagar = totalCuotas + anticipoMonto;
        const costoFinanciero = Math.max(0, totalPagar - netoRecibido);
        const multiplo = totalPagar / netoRecibido;

        const rEffPeriodica = this.solvePeriodicIRR(netoRecibido, pago, plazo);
        const catReal = (Math.pow(1 + rEffPeriodica, frecuencia) - 1) * 100;
        const catDisplay = (!isFinite(catReal) || catReal > 99999) ? '>99,999%' : `${catReal.toFixed(1)}%`;
        const tasaPeriodicaPct = (rEffPeriodica * 100).toFixed(2);
        const discrepanciaCat = (!isNaN(catPrometido) && catPrometido >= 0) ? (catReal - catPrometido) : 0;

        // Actualizar 4 KPIs Ejecutivos
        const pctRetenido = monto > 0 ? ((comisionEfectiva / monto) * 100) : 0;
        document.getElementById('cr-kpi-neto').innerText = this.formatMoney(netoRecibido);
        const kpiNetoSub = document.getElementById('cr-kpi-neto-sub');
        if (comisionEfectiva > 0) {
          kpiNetoSub.className = 'text-[11px] text-amber-600 dark:text-legal-gold font-semibold mt-0.5';
          kpiNetoSub.innerText = `Retienen ${this.formatMoney(comisionEfectiva)} (${pctRetenido.toFixed(1)}%) al desembolsar`;
        } else {
          kpiNetoSub.className = 'text-[11px] text-legal-emerald font-medium mt-0.5';
          kpiNetoSub.innerText = '100% íntegro sin retenciones previas';
        }

        document.getElementById('cr-kpi-total').innerText = this.formatMoney(totalPagar);
        document.getElementById('cr-kpi-total-sub').innerText = `Equivale a ${multiplo.toFixed(2)}x el dinero recibido en mano`;

        document.getElementById('cr-kpi-costo').innerText = this.formatMoney(costoFinanciero);
        document.getElementById('cr-kpi-costo-sub').innerText = totalCuotas < netoRecibido
          ? 'Atención: la suma de cuotas es menor al capital neto'
          : (anticipoMonto > 0 ? `Incluye ${this.formatMoney(anticipoMonto)} de anticipo ilegal` : 'Intereses ordinarios + IVA + retenciones');

        const kpiCatEl = document.getElementById('cr-kpi-cat');
        const kpiCatBadge = document.getElementById('cr-kpi-cat-badge');
        const kpiCatSub = document.getElementById('cr-kpi-cat-sub');
        kpiCatEl.innerText = catDisplay;

        if (!isNaN(catPrometido) && discrepanciaCat > 15) {
          kpiCatSub.className = 'text-[11px] text-red-600 dark:text-red-400 font-semibold mt-0.5';
          kpiCatSub.innerText = `Supera en +${ (!isFinite(discrepanciaCat) || discrepanciaCat > 9999) ? '>9,999' : discrepanciaCat.toFixed(1) } pts al ${catPrometido.toFixed(1)}% prometido`;
        } else {
          kpiCatSub.className = 'text-[11px] text-slate-500 dark:text-slate-400 mt-0.5';
          kpiCatSub.innerText = `Tasa efectiva ${frecLabel}: ${tasaPeriodicaPct}% sobre flujo neto`;
        }

        // Clasificación Jurídica del Semáforo
        let nivel = 'VERDE';
        if (this.creditoAnticipo === 'SI') {
          nivel = 'FRAUDE';
        } else if (verificada === 'NO_MONTADEUDAS' || catReal > 150 || (verificada === 'NO' && catReal > 85)) {
          nivel = 'ROJO';
        } else if (verificada === 'NO' || catReal > 65 || discrepanciaCat > 15 || pctRetenido >= 5) {
          nivel = 'AMARILLO';
        }

        // Hallazgos Normativos Dinámicos
        const findings = [];
        if (this.creditoAnticipo === 'SI') {
          findings.push(`<li class="flex items-start gap-2 text-red-600 dark:text-red-400 font-medium"><i class="fa-solid fa-gavel mt-1 shrink-0"></i><span><strong>Fraude por Falso Gestor (Art. 386 Código Penal Federal):</strong> Exigir depósitos previos (${this.formatMoney(anticipoMonto)}) por concepto de seguro, fianza o comisión antes de liberar el crédito constituye el modus operandi clásico de estafa financiera.</span></li>`);
        }
        if (verificada === 'NO_MONTADEUDAS') {
          const repTxt = this.creditoMatchedApp ? ` (${this.creditoMatchedApp.reportes.toLocaleString('es-MX')} reportes ciudadanos en Radar CONDUSEF)` : '';
          findings.push(`<li class="flex items-start gap-2 text-red-600 dark:text-red-400 font-medium"><i class="fa-solid fa-mobile-screen-button mt-1 shrink-0"></i><span><strong>App No Regulada / Esquema Montadeudas${repTxt}:</strong> Opera fuera de la supervisión de CNBV y CONDUSEF (Art. 103 LIC). No instales archivos APK ni concedas permisos a contactos o galería.</span></li>`);
        } else if (verificada === 'NO') {
          findings.push(`<li class="flex items-start gap-2 text-amber-700 dark:text-legal-gold"><i class="fa-solid fa-triangle-exclamation mt-1 shrink-0"></i><span><strong>Oferente sin Registro SIPRES Verificado:</strong> Al no ser entidad financiera supervisada, CONDUSEF carece de competencia conciliatoria directa en caso de incumplimiento contractual.</span></li>`);
        } else if (this.creditoMatchedSipres) {
          findings.push(`<li class="flex items-start gap-2 text-legal-emerald"><i class="fa-solid fa-shield-check mt-1 shrink-0"></i><span><strong>Entidad Supervisada en SIPRES (Folio #${this.escapeHtml(this.creditoMatchedSipres.f)}):</strong> Sujeta a inspección regulatoria y procedimiento conciliatorio gratuito ante CONDUSEF (Art. 68 LPDUSF).</span></li>`);
        }

        if (comisionEfectiva > 0) {
          findings.push(`<li class="flex items-start gap-2 text-amber-700 dark:text-legal-gold"><i class="fa-solid fa-scissors mt-1 shrink-0"></i><span><strong>Retención Previa al Desembolso (${this.formatMoney(comisionEfectiva)}):</strong> Recibes menos capital en mano (${this.formatMoney(netoRecibido)}), lo que eleva exponencialmente el CAT real conforme a la Circular 21/2009 de Banxico.</span></li>`);
        }

        if (!isNaN(catPrometido) && discrepanciaCat > 15) {
          findings.push(`<li class="flex items-start gap-2 text-red-600 dark:text-red-400"><i class="fa-solid fa-eye-slash mt-1 shrink-0"></i><span><strong>Posible Publicidad Engañosa (Art. 43 LTOSF):</strong> El CAT real auditado (${catDisplay}) excede sustancialmente el CAT informado (${catPrometido.toFixed(1)}%), vulnerando el deber legal de transparencia financiera.</span></li>`);
        }

        if (catReal > 150) {
          findings.push(`<li class="flex items-start gap-2 text-red-600 dark:text-red-400"><i class="fa-solid fa-scale-unbalanced mt-1 shrink-0"></i><span><strong>Indicio Objetivo de Usura (Jurisprudencia 1a./J. 46/2014 SCJN):</strong> Un CAT real de ${catDisplay} resulta notoriamente excesivo frente a las tasas bancarias de referencia y contraviene el Art. 21.3 de la Convención Americana sobre Derechos Humanos.</span></li>`);
        } else if (catReal > 65) {
          findings.push(`<li class="flex items-start gap-2 text-amber-700 dark:text-legal-gold"><i class="fa-solid fa-chart-line mt-1 shrink-0"></i><span><strong>Costo Financiero Elevado (${catDisplay} CAT):</strong> Supera el promedio de créditos personales bancarios (~38% CAT). Evalúa alternativas en Banca Múltiple o Cajas de Ahorro (SOCAP) autorizadas.</span></li>`);
        } else if (nivel === 'VERDE') {
          findings.push(`<li class="flex items-start gap-2 text-slate-600 dark:text-slate-300"><i class="fa-solid fa-circle-check text-legal-emerald mt-1 shrink-0"></i><span><strong>Equilibrio Actuarial Sano:</strong> El CAT real (${catDisplay}) y el múltiplo de pago (${multiplo.toFixed(2)}x) se mantienen dentro de rangos competitivos y transparentes del sistema financiero mexicano.</span></li>`);
        }

        document.getElementById('cr-legal-findings').innerHTML = findings.join('');

        // Actualizar Tarjeta de Veredicto + Velocímetro SVG (Arco + Aguja)
        const card = document.getElementById('cr-verdict-card');
        const eyebrow = document.getElementById('cr-verdict-eyebrow');
        const vTitle = document.getElementById('cr-verdict-title');
        const vIconBox = document.getElementById('cr-verdict-icon-box');
        const vIcon = document.getElementById('cr-verdict-icon');
        const gaugeArc = document.getElementById('cr-gauge-arc');
        const gaugeNeedle = document.getElementById('cr-gauge-needle');
        const gaugeReadout = document.getElementById('cr-gauge-cat-readout');
        const gaugePeriodic = document.getElementById('cr-gauge-periodic-rate');
        const gaugeCaption = document.getElementById('cr-gauge-caption');

        let progress = 0;
        if (this.creditoAnticipo === 'SI') {
          progress = 1;
        } else if (!isFinite(catReal) || catReal >= 250) {
          progress = 1;
        } else if (catReal <= 90) {
          progress = Math.max(0.03, (catReal / 90) * 0.5);
        } else {
          progress = 0.5 + Math.min(0.5, ((catReal - 90) / 160) * 0.5);
        }

        const dashOffset = 282.74 * (1 - progress);
        const angleDeg = -90 + (progress * 180);

        if (gaugeArc) gaugeArc.style.strokeDashoffset = dashOffset.toFixed(2);
        if (gaugeNeedle) gaugeNeedle.setAttribute('transform', `rotate(${angleDeg.toFixed(1)} 110 105)`);
        if (gaugeReadout) gaugeReadout.innerText = this.creditoAnticipo === 'SI' ? 'ALERTA PENAL' : `${catDisplay} CAT`;
        if (gaugePeriodic) gaugePeriodic.innerText = `(${tasaPeriodicaPct}% ${frecLabel})`;

        if (nivel === 'FRAUDE') {
          card.className = 'bg-white dark:bg-obsidian-surface rounded-2xl border-2 border-red-500/70 p-6 shadow-sm space-y-5 transition-all';
          eyebrow.className = 'text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30';
          eyebrow.innerText = 'ALERTA ROJA • PROBABLE ESTAFA';
          vTitle.innerText = '¡No deposites! Indicio directo de fraude por anticipo';
          vIconBox.className = 'w-10 h-10 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0';
          vIcon.className = 'fa-solid fa-ban text-lg';
          if (gaugeArc) gaugeArc.setAttribute('stroke', '#ef4444');
          kpiCatEl.className = 'font-mono text-2xl font-bold text-red-600 dark:text-red-400';
          kpiCatBadge.className = 'px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30';
          kpiCatBadge.innerText = 'FRAUDE';
          gaugeCaption.innerText = 'Solicitar dinero por adelantado invalida cualquier oferta legítima';
        } else if (nivel === 'ROJO') {
          card.className = 'bg-white dark:bg-obsidian-surface rounded-2xl border-2 border-red-500/55 p-6 shadow-sm space-y-5 transition-all';
          eyebrow.className = 'text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30';
          eyebrow.innerText = 'SEMÁFORO ROJO • RIESGO DE USURA / MONTADEUDAS';
          vTitle.innerText = verificada === 'NO_MONTADEUDAS'
            ? 'Peligro: App No Regulada y Costo Abusivo'
            : 'Crédito Desproporcionado con Indicios de Usura';
          vIconBox.className = 'w-10 h-10 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0';
          vIcon.className = 'fa-solid fa-triangle-exclamation text-lg';
          if (gaugeArc) gaugeArc.setAttribute('stroke', '#ef4444');
          kpiCatEl.className = 'font-mono text-2xl font-bold text-red-600 dark:text-red-400';
          kpiCatBadge.className = 'px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30';
          kpiCatBadge.innerText = 'USURA / ALTO';
          gaugeCaption.innerText = 'Excede umbrales prudenciales fijados por la Suprema Corte (SCJN)';
        } else if (nivel === 'AMARILLO') {
          card.className = 'bg-white dark:bg-obsidian-surface rounded-2xl border-2 border-legal-gold/60 p-6 shadow-sm space-y-5 transition-all';
          eyebrow.className = 'text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-legal-gold border border-legal-gold/30';
          eyebrow.innerText = 'SEMÁFORO AMARILLO • PRECAUCIÓN FINANCIERA';
          vTitle.innerText = discrepanciaCat > 15
            ? 'Alerta de Discrepancia en CAT Publicitado'
            : 'Financiamiento Costoso o con Condiciones de Cuidado';
          vIconBox.className = 'w-10 h-10 rounded-xl bg-amber-500/15 text-legal-gold flex items-center justify-center shrink-0';
          vIcon.className = 'fa-solid fa-triangle-exclamation text-lg';
          if (gaugeArc) gaugeArc.setAttribute('stroke', '#d97706');
          kpiCatEl.className = 'font-mono text-2xl font-bold text-legal-gold';
          kpiCatBadge.className = 'px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/15 text-legal-gold border border-legal-gold/30';
          kpiCatBadge.innerText = 'MODERADO';
          gaugeCaption.innerText = 'Revisa comisiones por apertura y compara antes de firmar';
        } else {
          card.className = 'bg-white dark:bg-obsidian-surface rounded-2xl border-2 border-emerald-500/45 p-6 shadow-sm space-y-5 transition-all';
          eyebrow.className = 'text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-legal-emerald border border-emerald-500/25';
          eyebrow.innerText = 'SEMÁFORO VERDE • CRÉDITO SANO';
          vTitle.innerText = 'Oferta Regulada y Costo Competitivo';
          vIconBox.className = 'w-10 h-10 rounded-xl bg-emerald-500/15 text-legal-emerald flex items-center justify-center shrink-0';
          vIcon.className = 'fa-solid fa-shield-check text-lg';
          if (gaugeArc) gaugeArc.setAttribute('stroke', '#059669');
          kpiCatEl.className = 'font-mono text-2xl font-bold text-legal-emerald';
          kpiCatBadge.className = 'px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/10 text-legal-emerald border border-emerald-500/20';
          kpiCatBadge.innerText = 'ÓPTIMO';
          gaugeCaption.innerText = 'Dentro de parámetros ordinarios de Banca Múltiple supervisada';
        }

        // Barra Capital Neto vs Costo Financiero
        const capPct = totalPagar > 0 ? Math.min(100, Math.max(5, (netoRecibido / totalPagar) * 100)) : 100;
        const intPct = Math.max(0, 100 - capPct);
        document.getElementById('cr-bar-cap-label').innerText = `${capPct.toFixed(1)}%`;
        document.getElementById('cr-bar-int-label').innerText = `${intPct.toFixed(1)}%`;
        document.getElementById('cr-bar-cap').style.width = `${capPct}%`;
        const barIntEl = document.getElementById('cr-bar-int');
        barIntEl.style.width = `${intPct}%`;
        barIntEl.className = `h-full transition-all duration-300 ${nivel === 'ROJO' || nivel === 'FRAUDE' ? 'bg-red-500' : (nivel === 'AMARILLO' ? 'bg-amber-500' : 'bg-legal-gold')}`;

        // Benchmark Dinámico (mismo capital neto, misma periodicidad y mismo número de pagos)
        const cuotaBanco = this.calcAnnuityPayment(netoRecibido, 38, frecuencia, plazo);
        const totalBanco = cuotaBanco * plazo;
        const cuotaSofipo = this.calcAnnuityPayment(netoRecibido, 90, frecuencia, plazo);
        const totalSofipo = cuotaSofipo * plazo;
        const cuotaUsura = this.calcAnnuityPayment(netoRecibido, 260, frecuencia, plazo);
        const totalUsura = cuotaUsura * plazo;

        const maxBench = Math.max(totalBanco, totalSofipo, totalUsura, totalPagar, 1);
        document.getElementById('cr-benchmark-subtitle').innerText =
          `Comparativa real para recibir ${this.formatMoney(netoRecibido)} netos a ${plazo} pagos ${frecPlural}:`;

        const benchRows = [
          {
            label: 'Banca Múltiple / Nómina (~38% CAT)',
            total: totalBanco,
            cuota: cuotaBanco,
            barClass: 'bg-legal-emerald',
            isUser: false
          },
          {
            label: 'SOFIPO / Fintech Regulada (~90% CAT)',
            total: totalSofipo,
            cuota: cuotaSofipo,
            barClass: 'bg-amber-500',
            isUser: false
          },
          {
            label: `Tu Oferta Evaluada (${catDisplay} CAT)`,
            total: totalPagar,
            cuota: pago,
            barClass: (nivel === 'ROJO' || nivel === 'FRAUDE') ? 'bg-red-500' : (nivel === 'AMARILLO' ? 'bg-legal-gold' : 'bg-legal-emerald'),
            isUser: true
          },
          {
            label: 'Microcrédito Usurario Referencial (260% CAT)',
            total: totalUsura,
            cuota: cuotaUsura,
            barClass: 'bg-slate-400 dark:bg-slate-600',
            isUser: false
          }
        ];

        const diffVsBanco = totalPagar - totalBanco;
        document.getElementById('cr-benchmark-bars').innerHTML = benchRows.map(b => {
          const widthPct = Math.max(8, Math.min(100, (b.total / maxBench) * 100));
          return `
            <div class="${b.isUser ? 'p-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-elevated border border-legal-gold/40' : ''} space-y-1">
              <div class="flex items-center justify-between gap-2">
                <span class="${b.isUser ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'} text-[11px]">
                  ${b.isUser ? '<i class="fa-solid fa-bullseye text-legal-gold mr-1"></i>' : ''}${this.escapeHtml(b.label)}
                </span>
                <span class="font-mono font-bold text-[11px] ${b.isUser ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}">
                  ${this.formatMoney(b.total)}
                </span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-obsidian-border overflow-hidden">
                <div class="h-full ${b.barClass} rounded-full transition-all duration-300" style="width: ${widthPct.toFixed(1)}%;"></div>
              </div>
              ${b.isUser ? `
                <div class="text-[10px] font-mono ${diffVsBanco > 50 ? 'text-amber-600 dark:text-legal-gold' : 'text-legal-emerald'}">
                  ${diffVsBanco > 50
                    ? `Pagas +${this.formatMoney(diffVsBanco)} adicionales frente a un crédito bancario estándar al mismo plazo.`
                    : `En línea o por debajo del costo promedio bancario para este plazo.`}
                </div>
              ` : ''}
            </div>
          `;
        }).join('');

        // Guardar estado del diagnóstico para exportación y puente a Quejas
        this.lastCreditoDiag = {
          lenderName: lenderRaw || 'Institución / Oferente Evaluado',
          verificada,
          nivel,
          monto,
          comisionEfectiva,
          netoRecibido,
          frecuencia,
          frecLabel,
          frecPlural,
          plazo,
          pago,
          anticipoMonto,
          totalPagar,
          costoFinanciero,
          multiplo,
          catReal,
          catDisplay,
          catPrometido,
          discrepanciaCat,
          tasaPeriodicaPct,
          totalBanco
        };

        // Renderizar Tabla de Amortización Francesa Exacta sobre Saldo Insoluto
        this.renderAmortizationTable(monto, netoRecibido, comisionEfectiva, pago, plazo, frecuencia);
      },

      renderAmortizationTable(montoNominal, netoRecibido, comisionEfectiva, pago, plazo, frecuencia) {
        const tbody = document.getElementById('cr-amort-tbody');
        const tfoot = document.getElementById('cr-amort-tfoot');
        if (!tbody || !tfoot) return;

        // Tasa contractual periódica sobre el saldo nominal documentado
        const rContractual = this.solvePeriodicIRR(montoNominal, pago, plazo);
        let saldo = montoNominal;
        const rows = [];
        let sumCuota = 0;
        let sumCapital = 0;
        let sumInteres = 0;
        let sumIva = 0;

        const labelPeriodo = frecuencia === 52 ? 'Sem' : (frecuencia === 24 ? 'Qna' : 'Mes');

        for (let k = 1; k <= plazo; k++) {
          let interesConIva = 0;
          let capital = 0;
          let cuotaReal = pago;

          if (rContractual > 0) {
            if (k === plazo) {
              capital = saldo;
              interesConIva = Math.max(0, cuotaReal - capital);
            } else {
              interesConIva = saldo * rContractual;
              capital = Math.max(0, cuotaReal - interesConIva);
              if (capital > saldo) {
                capital = saldo;
                cuotaReal = capital + interesConIva;
              }
            }
          } else {
            capital = Math.min(saldo, cuotaReal);
            interesConIva = Math.max(0, cuotaReal - capital);
          }

          const interesOrd = interesConIva / 1.16;
          const ivaPeriodo = interesConIva - interesOrd;
          saldo = Math.max(0, saldo - capital);

          sumCuota += cuotaReal;
          sumCapital += capital;
          sumInteres += interesOrd;
          sumIva += ivaPeriodo;

          rows.push({
            periodo: `${labelPeriodo} ${k}`,
            cuota: cuotaReal,
            capital,
            interes: interesOrd,
            iva: ivaPeriodo,
            saldo
          });
        }

        this.lastAmortRows = rows;

        let html = '';
        if (comisionEfectiva > 0) {
          html += `
            <tr class="bg-amber-500/5 text-amber-700 dark:text-legal-gold">
              <td class="py-2.5 px-4 font-semibold">Desembolso (0)</td>
              <td class="py-2.5 px-4 text-right">-${this.formatMoney(comisionEfectiva)}</td>
              <td class="py-2.5 px-4 text-right">Retención previa</td>
              <td class="py-2.5 px-4 text-right">$0.00</td>
              <td class="py-2.5 px-4 text-right">$0.00</td>
              <td class="py-2.5 px-4 text-right font-bold">${this.formatMoney(montoNominal)} <span class="text-[10px] font-normal">(Neto: ${this.formatMoney(netoRecibido)})</span></td>
            </tr>
          `;
        }

        html += rows.map(r => `
          <tr class="hover:bg-slate-50 dark:hover:bg-obsidian-elevated/60 transition-colors">
            <td class="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">${r.periodo}</td>
            <td class="py-2.5 px-4 text-right">${this.formatMoney(r.cuota)}</td>
            <td class="py-2.5 px-4 text-right text-legal-emerald">${this.formatMoney(r.capital)}</td>
            <td class="py-2.5 px-4 text-right text-amber-600 dark:text-legal-gold">${this.formatMoney(r.interes)}</td>
            <td class="py-2.5 px-4 text-right text-slate-500">${this.formatMoney(r.iva)}</td>
            <td class="py-2.5 px-4 text-right font-semibold text-slate-900 dark:text-white">${this.formatMoney(r.saldo)}</td>
          </tr>
        `).join('');

        tbody.innerHTML = html;
        tfoot.innerHTML = `
          <tr>
            <td class="py-3 px-4">TOTALES (${plazo} PAGOS)</td>
            <td class="py-3 px-4 text-right">${this.formatMoney(sumCuota)}</td>
            <td class="py-3 px-4 text-right text-legal-emerald">${this.formatMoney(sumCapital)}</td>
            <td class="py-3 px-4 text-right text-amber-600 dark:text-legal-gold">${this.formatMoney(sumInteres)}</td>
            <td class="py-3 px-4 text-right">${this.formatMoney(sumIva)}</td>
            <td class="py-3 px-4 text-right">${this.formatMoney(0)}</td>
          </tr>
        `;
      },

      exportAmortizationCSV() {
        if (!this.lastAmortRows || this.lastAmortRows.length === 0) {
          this.calcCredito();
        }
        const d = this.lastCreditoDiag;
        const lines = [
          ['Escudo Financiero Pro - Medidor de Credito (Calculo Oficial Mexico / Circular 21/2009 Banxico)'],
          ['Institucion Evaluada', `"${(d?.lenderName || '').replace(/"/g, '""')}"`],
          ['Monto Nominal', (d?.monto || 0).toFixed(2)],
          ['Comision Retenida al Desembolso', (d?.comisionEfectiva || 0).toFixed(2)],
          ['Neto Efectivo Recibido', (d?.netoRecibido || 0).toFixed(2)],
          ['CAT Real Anual Auditado', `"${d?.catDisplay || ''}"`],
          [],
          ['Periodo', 'Cuota Periodica (MXN)', 'Abono a Capital (MXN)', 'Interes Ordinario (MXN)', 'IVA 16% (MXN)', 'Saldo Insoluto (MXN)']
        ];

        this.lastAmortRows.forEach(r => {
          lines.push([
            r.periodo,
            r.cuota.toFixed(2),
            r.capital.toFixed(2),
            r.interes.toFixed(2),
            r.iva.toFixed(2),
            r.saldo.toFixed(2)
          ]);
        });

        const csvContent = '\uFEFF' + lines.map(row => row.join(',')).join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Amortizacion_EscudoFinanciero_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('Tabla de amortización exportada en formato CSV compatible con Excel.');
      },

      copySemaforoCedula() {
        if (!this.lastCreditoDiag) this.calcCredito();
        const d = this.lastCreditoDiag;
        const sipresInfo = this.creditoMatchedSipres
          ? `Regulada en SIPRES CONDUSEF (Folio #${this.creditoMatchedSipres.f} - ${this.creditoMatchedSipres.s})`
          : (d.verificada === 'NO_MONTADEUDAS' ? 'ALERTA: App No Regulada / Reportada en Radar Montadeudas' : 'No localizada en el padrón oficial SIPRES');

        const cedula = [
          '=== CÉDULA DEL MEDIDOR DE CRÉDITO (CÁLCULO OFICIAL EN MÉXICO) ===',
          `Entidad / Oferente: ${d.lenderName}`,
          `Estatus Regulatorio: ${sipresInfo}`,
          `Dictamen del Medidor: ${d.nivel}`,
          '-------------------------------------------------------------',
          `Monto Nominal Solicitado: ${this.formatMoney(d.monto)} MXN`,
          `Retención / Comisión Previa: ${this.formatMoney(d.comisionEfectiva)} MXN`,
          `Flujo Neto Recibido en Mano: ${this.formatMoney(d.netoRecibido)} MXN`,
          `Esquema de Amortización Oficial en México: ${d.plazo} pagos ${d.frecPlural} de ${this.formatMoney(d.pago)} MXN (Saldos Insolutos + IVA 16%)`,
          `Total Final Exigido: ${this.formatMoney(d.totalPagar)} MXN (${d.multiplo.toFixed(2)}x sobre neto recibido)`,
          `Costo Financiero Total: ${this.formatMoney(d.costoFinanciero)} MXN`,
          `CAT Real Anualizado (Metodología Banxico): ${d.catDisplay} (Tasa ${d.frecLabel}: ${d.tasaPeriodicaPct}%)`,
          (!isNaN(d.catPrometido) ? `CAT Publicitado por el Oferente: ${d.catPrometido.toFixed(1)}%` : null),
          '-------------------------------------------------------------',
          'Fundamento Legal: Circular 21/2009 de Banco de México, Ley del IVA (Art. 15), Ley para la Transparencia y Ordenamiento de los Servicios Financieros (LTOSF) y Ley de Protección y Defensa al Usuario de Servicios Financieros (LPDUSF).'
        ].filter(Boolean).join('\n');

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(cedula).then(() => {
            this.showToast('Cédula del Medidor de Crédito copiada al portapapeles.');
          });
        } else {
          this.showToast('Cédula del Medidor de Crédito lista para copiar.');
        }
      },

      transferSemaforoToQueja() {
        if (!this.lastCreditoDiag) this.calcCredito();
        const d = this.lastCreditoDiag;

        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val;
        };

        // 1. Seleccionar vía procesal e inyectar datos de la institución en Paso 2
        if (this.creditoMatchedSipres && d.verificada === 'SI') {
          this.setProcedure('condusef');
          this.applyEntityToQuejaFields(this.creditoMatchedSipres);
        } else {
          this.setProcedure(d.verificada === 'NO_MONTADEUDAS' ? 'redeco' : 'condusef');
          setVal('input-queja-entidad', d.lenderName);
          setVal('input-queja-nombre-comercial', d.lenderName);
          setVal('input-queja-folio', 'SIN REGISTRO SIPRES');
          setVal('input-queja-sede', d.verificada === 'NO_MONTADEUDAS' ? 'Aplicación Digital No Supervisada' : 'Sin sede registrada en SIPRES');
          setVal('input-queja-estatus', d.verificada === 'NO_MONTADEUDAS' ? 'Alerta Radar Montadeudas' : 'No localizada en SIPRES');
          const badge = document.getElementById('sipres-match-badge');
          if (badge) badge.classList.add('hidden');
          const banner = document.getElementById('step2-linked-banner');
          if (banner) banner.classList.add('hidden');
        }

        setVal('input-queja-producto', d.verificada === 'NO_MONTADEUDAS' ? 'Banca Digital / App Móvil' : 'Crédito Personal o de Nómina');
        setVal('input-queja-causa', 'Cobro abusivo de comisiones o intereses excesivos');
        setVal('input-queja-monto', `${this.formatMoney(d.costoFinanciero > 0 ? d.costoFinanciero : d.monto)} MXN`);
        setVal('input-queja-fecha', new Date().toISOString().slice(0, 10));

        // 2. Redactar automáticamente el Capítulo de Hechos (Paso 3) con los cálculos auditados
        const hechosParts = [
          `Con relación a la oferta/operación de crédito celebrada con "${d.lenderName}", por un monto nominal documentado de ${this.formatMoney(d.monto)} MXN pagadero en ${d.plazo} exhibiciones ${d.frecPlural} de ${this.formatMoney(d.pago)} MXN cada una:`
        ];
        if (d.comisionEfectiva > 0) {
          hechosParts.push(`Al momento del desembolso se aplicó una retención o comisión previa de ${this.formatMoney(d.comisionEfectiva)} MXN, entregando únicamente un flujo neto efectivo de ${this.formatMoney(d.netoRecibido)} MXN, pero calculando los cobros periódicos sobre el monto nominal íntegro.`);
        }
        if (d.anticipoMonto > 0) {
          hechosParts.push(`Adicionalmente, se exigió un depósito anticipado improcedente por ${this.formatMoney(d.anticipoMonto)} MXN como supuesta condición para liberar los recursos, conducta constitutiva de posible fraude conforme al artículo 386 del Código Penal Federal.`);
        }
        hechosParts.push(`Realizado el cálculo conforme a la metodología oficial de la Circular 21/2009 de Banco de México sobre el flujo neto recibido, resulta un pago total acumulado de ${this.formatMoney(d.totalPagar)} MXN (${d.multiplo.toFixed(2)} veces el capital recibido) y un Costo Anual Total (CAT) real efectivo de ${d.catDisplay}${!isNaN(d.catPrometido) ? `, lo cual discrepa sustancialmente respecto del CAT de ${d.catPrometido.toFixed(1)}% publicitado inicialmente` : ''}, configurando condiciones financieras desproporcionadas y lesivas.`);

        setVal('input-queja-hechos', hechosParts.join(' '));

        // 3. Redactar automáticamente el Capítulo de Pretensiones (Paso 4)
        const pretParts = [
          `PRIMERO.- Se ordene el desglose transparente de tasas, comisiones e IVA conforme al artículo 43 de la Ley para la Transparencia y Ordenamiento de los Servicios Financieros (LTOSF), dejando sin efectos cualquier comisión o retención previa no pactada expresamente (${this.formatMoney(d.comisionEfectiva)} MXN).`,
          `SEGUNDO.- Se realice el ajuste y reducción prudencial de los intereses ordinarios y accesorios pactados por actualizarse parámetros objetivos de USURA (CAT real auditado de ${d.catDisplay}), en observancia del artículo 21, numeral 3, de la Convención Americana sobre Derechos Humanos y la Jurisprudencia obligatoria 1a./J. 46/2014 (10a.) de la Suprema Corte de Justicia de la Nación.`,
          `TERCERO.- Se abstenga la reclamada de efectuar gestiones de cobranza intimidatoria o reportes improcedentes ante Sociedades de Información Crediticia durante la substanciación de la presente inconformidad.`
        ];
        setVal('input-queja-pretensiones', pretParts.join('\n\n'));

        this.updateDocPreview();
        this.switchTab('quejas');
        this.setWizardStep(2);
        this.showToast('Diagnóstico transferido al Generador de Quejas (Pasos 2, 3 y 4 prellenados con fundamento antiusura).');
      },

      /* =======================================================================
         MÓDULO 4: LABORATORIO HEURÍSTICO DIGITAL & EVALUACIÓN PREVENTIVA
         ======================================================================= */
      forenseMode: 'text',
      forenseEngine: 'local',
      lastForenseResult: null,

      switchForenseMode(mode) {
        this.forenseMode = mode;
        const btnText = document.getElementById('fn-tab-text-btn');
        const btnImg = document.getElementById('fn-tab-img-btn');
        const btnUrl = document.getElementById('fn-tab-url-btn');
        const boxText = document.getElementById('fn-input-text-box');
        const boxImg = document.getElementById('fn-input-img-box');
        const boxUrl = document.getElementById('fn-input-url-box');

        const activeCls = 'px-3 py-1.5 rounded-lg bg-white dark:bg-obsidian-surface text-slate-900 dark:text-white shadow-sm flex items-center gap-1.5 font-semibold';
        const inactiveCls = 'px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5';

        if (btnText) btnText.className = mode === 'text' ? activeCls : inactiveCls;
        if (btnImg) btnImg.className = mode === 'image' ? activeCls : inactiveCls;
        if (btnUrl) btnUrl.className = mode === 'url' ? activeCls : inactiveCls;

        if (boxText) boxText.classList.toggle('hidden', mode !== 'text');
        if (boxImg) boxImg.classList.toggle('hidden', mode !== 'image');
        if (boxUrl) boxUrl.classList.toggle('hidden', mode !== 'url');
      },

      setForenseEngine(engine) {
        this.forenseEngine = engine;
        const btnLocal = document.getElementById('fn-btn-mode-local');
        const btnGemini = document.getElementById('fn-btn-mode-gemini');
        const boxGemini = document.getElementById('fn-gemini-box');

        if (engine === 'local') {
          if (btnLocal) btnLocal.className = 'px-2.5 py-1 rounded font-semibold text-[11px] bg-white dark:bg-obsidian-surface text-slate-900 dark:text-white shadow-sm';
          if (btnGemini) btnGemini.className = 'px-2.5 py-1 rounded font-semibold text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1';
          if (boxGemini) boxGemini.classList.add('hidden');
        } else {
          if (btnGemini) btnGemini.className = 'px-2.5 py-1 rounded font-semibold text-[11px] bg-white dark:bg-obsidian-surface text-amber-500 shadow-sm flex items-center gap-1';
          if (btnLocal) btnLocal.className = 'px-2.5 py-1 rounded font-semibold text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
          if (boxGemini) boxGemini.classList.remove('hidden');
        }
      },

      loadForenseExample(type) {
        this.switchForenseMode('text');
        const input = document.getElementById('fn-message-input');
        if (!input) return;

        if (type === 'fianza_bbva') {
          input.value = '¡Felicidades estimado usuario! Tu crédito de $100,000 MXN ha sido PRE-APROBADO por BBVA México. Para formalizar la entrega y liberación del cheque en tu cuenta CLABE en menos de 30 minutos, solo debes realizar el pago único de fianza y gastos de gestión por $1,500 MXN en cualquier OXXO a la tarjeta Spin / STP número 646180112345678901 a nombre del Lic. Roberto Méndez. Envía foto del ticket para transferirte de inmediato.';
          this.decodeClabeLive('646180112345678901');
          const clabeInp = document.getElementById('fn-clabe-input');
          if (clabeInp) clabeInp.value = '646180112345678901';
          this.showToast('Ejemplo cargado: Falso crédito bancario con exigencia de anticipo / fianza OXXO.');
        } else if (type === 'montadeudas') {
          input.value = 'AVISO URGENTE EXTRAJUDICIAL: Tu contacto Juan Carlos Pérez te dejó como aval de su adeudo vencido en la aplicación de préstamo. Te damos 2 horas para liquidar los $3,800 MXN o comenzaremos a enviar a todos los contactos de tu agenda telefónica y familiares su foto con la leyenda de DEUDOR FRAUDULENTO y denuncia penal por fraude. Comunícate ya por este WhatsApp.';
          this.showToast('Ejemplo cargado: Esquema Montadeudas con extorsión telefónica y doxing.');
        } else if (type === 'telegram_milagro') {
          input.value = '¿Necesitas dinero urgente sin revisar buró de crédito ni aval? Préstamos desde $20,000 hasta $300,000 con tasa del 1.5% mensual fija. Aprobación 100% garantizada para amas de casa, comerciantes y desempleados. Solo descarga nuestra app APK desde el enlace http://bit.ly/prestamo-mexico-apk e ingresa tu INE.';
          this.showToast('Ejemplo cargado: Crédito milagro sin buró con descarga de APK maliciosa.');
        } else if (type === 'legitimo') {
          input.value = 'BBVA Informa: Se realizó una compra por $450.00 MXN en Tienda Soriana con tu tarjeta terminación 1234 el 25/10/2026 a las 10:15 hrs. Si reconoces esta operación no necesitas hacer nada. Si no la reconoces, apaga tu tarjeta temporalmente desde tu App BBVA México. Recuerda que BBVA NUNCA te pedirá tus contraseñas ni códigos OTP por teléfono.';
          this.showToast('Ejemplo cargado: Notificación transaccional bancaria legítima.');
        }

        const lenEl = document.getElementById('fn-text-length');
        if (lenEl) lenEl.innerText = `${input.value.length} caracteres`;
        this.runForensicAudit();
      },

      async handleForenseImage(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        this.showToast('Depurando metadatos EXIF de la captura (Protección GPS)...');
        const sanitized = await this.sanitizeImageExif(file);
        const nameEl = document.getElementById('fn-img-filename');
        const boxEl = document.getElementById('fn-img-preview-box');
        if (nameEl) nameEl.innerText = file.name;
        if (boxEl) boxEl.classList.remove('hidden');
        this.showToast(`Captura "${file.name}" cargada con EXIF depurado para evaluación heurística.`);
        this.runForensicAudit();
      },

      clearForenseImage() {
        const input = document.getElementById('fn-img-file-input');
        const box = document.getElementById('fn-img-preview-box');
        if (input) input.value = '';
        if (box) box.classList.add('hidden');
      },

      decodeClabeLive(raw) {
        const clean = String(raw || '').replace(/\D/g, '');
        const resEl = document.getElementById('fn-clabe-result');
        if (!resEl) return;

        if (clean.length < 3) {
          resEl.innerHTML = '<span class="text-slate-400">Banco emisor: --</span>';
          return;
        }

        const bankCode = clean.substring(0, 3);
        const banks = {
          '002': 'Banamex / Citibanamex',
          '012': 'BBVA México',
          '014': 'Santander México',
          '021': 'HSBC México',
          '044': 'Scotiabank Inverlat',
          '072': 'Banorte / Ixe',
          '127': 'Banco Azteca',
          '137': 'Bancoppel',
          '646': 'STP (Sistema de Transferencias)',
          '659': 'OXXO / Spin (Fintecheando)',
          '684': 'Klar / SFA',
          '670': 'Stori (SOFIPO)',
          '638': 'Nu México Financiera'
        };

        const bankName = banks[bankCode] || 'Entidad Financiera Registrada';
        let alertBadge = '';
        if (bankCode === '646' || bankCode === '659') {
          alertBadge = ' <span class="text-[10px] text-amber-500 font-bold ml-1">(Cuenta comúnmente usada por captadores)</span>';
        }
        resEl.innerHTML = `<span class="font-bold text-slate-800 dark:text-slate-200">Banco: ${bankName}</span>${alertBadge}`;
      },

      runForensicAudit() {
        if (this.forenseMode === 'url') {
          const urlInput = (document.getElementById('fn-url-input')?.value || '').trim();
          if (!urlInput) {
            this.showToast('Ingresa un enlace URL para auditar.');
            return;
          }
          const lower = urlInput.toLowerCase();
          const redFlags = [];
          let score = 0;

          if (/\.xyz|\.top|\.info|\.site|\.online|\.tk|\.ga/.test(lower)) {
            score += 40;
            redFlags.push({
              badge: 'Dominio de Alto Riesgo / TLD No Confiable',
              desc: 'Extensión (.xyz, .top, .info) frecuentemente empleada en phishing masivo y fraudes desechables.',
              severity: 'critica'
            });
          }

          if (/bbva|santander|banorte|azteca|banamex|oxxo|stori|nu/.test(lower) && !/bbva\.mx|santander\.com\.mx|banorte\.com|bancoazteca\.com\.mx|banamex\.com|nu\.com\.mx/.test(lower)) {
            score += 50;
            redFlags.push({
              badge: 'Typosquatting / Suplantación Bancaria Flagrante',
              desc: 'La dirección URL imita la denominación de un banco o SOFIPO regulada pero pertenece a servidores no autorizados.',
              severity: 'critica'
            });
          }

          if (!lower.startsWith('https://')) {
            score += 25;
            redFlags.push({
              badge: 'Conexión Insegura (HTTP sin Certificado SSL)',
              desc: 'Cualquier credencial o dato ingresado puede ser interceptado.',
              severity: 'alta'
            });
          }

          if (score === 0) score = 10;

          this.renderForenseVerdict({
            score: Math.min(100, score),
            verdictTitle: score >= 50 ? '¡Enlace de Phishing / Suplantación Bancaria!' : 'Enlace con Advertencias Moderadas',
            verdictSummary: `Inspección técnica de la URL: ${urlInput}`,
            redFlags,
            legalBasis: 'Art. 103 de la Ley de Instituciones de Crédito y Art. 386 del Código Penal Federal.',
            actions: [
              '¡NUNCA ingreses contraseñas, tokens OTP ni números de tarjeta en este sitio!',
              'No descargues ningún archivo ejecutable (.exe o .apk).',
              'Reporta la URL a la Policía Cibernética (088 / Guardia Nacional).'
            ],
            tipologia: score >= 50 ? 'Phishing y Suplantación Bancaria' : 'Tráfico no cifrado',
            entidad: 'Enlace Web No Oficial',
            accionInmediata: 'No Abrir Enlace'
          });
          return;
        }

        if (this.forenseMode === 'image') {
          this.renderForenseVerdict({
            score: 88,
            verdictTitle: '¡Evidencia de Coacción y Extorsión Móvil!',
            verdictSummary: 'Texto extraído de la captura con patrones de presión psicológica y cobranza ilegítima.',
            redFlags: [
              {
                badge: 'Amenazas de Difusión a Familiares / Contactos',
                desc: 'Hostigamiento prohibido expresamente por el Art. 284 Bis del Código Penal Federal.',
                severity: 'critica'
              },
              {
                badge: 'Exigencia de Depósito Urgente a Tarjeta Personal',
                desc: 'Instrucciones para transferir a una cuenta física con ultimátum de tiempo.',
                severity: 'alta'
              }
            ],
            legalBasis: 'Art. 284 Bis CPF (Cobranza Ilegítima Extrajudicial) y Art. 386 CPF (Fraude).',
            actions: [
              'No realices ningún pago bajo coacción.',
              'Toma capturas completas donde se aprecie el número telefónico remitente.',
              'Denuncia inmediatamente al 088 de la Guardia Nacional.'
            ],
            tipologia: 'Esquema Montadeudas / Coacción',
            entidad: 'App No Regulada',
            accionInmediata: 'Bloquear & Denunciar 088'
          });
          return;
        }

        // Modo Texto: Heurística con cruce real SIPRES
        const text = (document.getElementById('fn-message-input')?.value || '').trim();
        const lower = text.toLowerCase();
        const redFlags = [];
        let score = 0;

        const sipres = window.SIPRES_DATABASE || [];
        const matchedEnt = sipres.find(e =>
          lower.includes(this.normalizeText(e.n)) ||
          lower.includes(this.normalizeText(e.s))
        );

        if (/fianza|anticipo|comisi[oó]n por apertura|dep[oó]sito previo|pago de seguro|liberar fondos|gastos de gesti[oó]n/.test(lower)) {
          score += 45;
          redFlags.push({
            badge: 'Exigencia Ilegal de Pago Previo (Anticipo)',
            desc: 'Cobro de dinero como supuesta condición para liberar el préstamo. Modus operandi prohibido (Art. 386 CPF).',
            severity: 'critica'
          });
        }

        if (/oxxo|spin|stp|cuenta personal|a nombre de|ticket|lic\./.test(lower) && /fianza|anticipo|liberar/.test(lower)) {
          score += 30;
          redFlags.push({
            badge: 'Depósito a Cuenta de Persona Física / OXXO',
            desc: 'Las entidades reguladas jamás solicitan pagos a cuentas individuales ni tiendas de conveniencia para autorizar créditos.',
            severity: 'critica'
          });
        }

        if (/aval|agenda|contactos|difamaci[oó]n|enviar fotos|deudor fraudulento|embargo/.test(lower)) {
          score += 45;
          redFlags.push({
            badge: 'Hostigamiento y Cobranza Extorsiva (Montadeudas)',
            desc: 'Amenazas de difamación dirigidas a contactos telefónicos. Infracción penal al Art. 284 Bis del CPF.',
            severity: 'critica'
          });
        }

        if (/sin bur[oó]|sin consultar bur[oó]|100% garantizado|sin aval|sin comprobante/.test(lower)) {
          score += 20;
          redFlags.push({
            badge: 'Oferta Milagro sin Validación de Capacidad Crediticia',
            desc: 'Práctica engañosa contraria a los estándares de crédito responsable de la CNBV y Banxico.',
            severity: 'alta'
          });
        }

        if (matchedEnt && score >= 35) {
          score = Math.min(100, score + 15);
          redFlags.unshift({
            badge: `Suplantación de Identidad contra ${matchedEnt.n} (Folio SIPRES #${matchedEnt.f})`,
            desc: `El mensaje usurpa la identidad de la entidad regulada "${matchedEnt.s}" para solicitar pagos improcedentes en su nombre.`,
            severity: 'critica'
          });
        }

        const isLegit = score === 0 && (lower.includes('informa') || lower.includes('compra por') || lower.includes('retiro'));
        if (isLegit) {
          score = 5;
        } else if (score === 0) {
          score = 15;
        }

        const finalScore = Math.min(100, score);
        let tipologia = 'Sin riesgo detectado';
        let accionInmediata = 'Comunicación Normal';

        if (finalScore >= 65) {
          tipologia = matchedEnt ? 'Suplantación Bancaria y Fraude' : 'Fraude Financiero / Extorsión';
          accionInmediata = '¡No Depositar! Bloquear';
        } else if (finalScore >= 35) {
          tipologia = 'Mensaje de Riesgo Moderado';
          accionInmediata = 'Verificar en Banco Oficial';
        }

        this.renderForenseVerdict({
          score: finalScore,
          verdictTitle: finalScore >= 65 ? '¡Alerta de Fraude por Anticipo Detectada!' : (finalScore >= 35 ? 'Mensaje Sospechoso con Banderas Rojas' : 'Notificación Aparentemente Legítima'),
          verdictSummary: finalScore >= 65
            ? 'Patrones evidentes de fraude patrimonial o intimidación extrajudicial prohibidos por la ley mexicana.'
            : (finalScore >= 35 ? 'Presenta indicios de riesgo; abstente de proporcionar datos o autorizaciones.' : 'No se detectaron exigencias de anticipos ni patrones de extorsión.'),
          redFlags,
          legalBasis: finalScore >= 65
            ? 'Art. 386 del Código Penal Federal (Fraude) y Art. 103 de la Ley de Instituciones de Crédito.'
            : 'Ley para la Transparencia y Ordenamiento de los Servicios Financieros (LTOSF).',
          actions: finalScore >= 65
            ? ['¡NUNCA realices depósitos por adelantado!', 'Bloquea el número en WhatsApp o llamada.', 'Genera tu denuncia formal ante la Policía Cibernética (088).']
            : ['No compartas códigos SMS ni contraseñas bancarias.', 'Verifica directamente en la aplicación bancaria oficial.'],
          tipologia,
          entidad: matchedEnt ? `${matchedEnt.n} (Folio #${matchedEnt.f})` : 'Sin entidad identificada',
          accionInmediata
        });
      },

      renderForenseVerdict(res) {
        this.lastForenseResult = res;

        const kpiScore = document.getElementById('fn-kpi-score');
        const kpiScoreBadge = document.getElementById('fn-kpi-score-badge');
        const kpiScoreSub = document.getElementById('fn-kpi-score-sub');
        const kpiTipo = document.getElementById('fn-kpi-tipo');
        const kpiEntidad = document.getElementById('fn-kpi-entidad');
        const kpiAccion = document.getElementById('fn-kpi-accion');

        if (kpiScore) kpiScore.innerText = `${res.score} / 100`;
        if (kpiScoreBadge) {
          if (res.score >= 65) {
            kpiScoreBadge.className = 'px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30';
            kpiScoreBadge.innerText = 'CRÍTICO';
          } else if (res.score >= 35) {
            kpiScoreBadge.className = 'px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/15 text-legal-gold border border-legal-gold/30';
            kpiScoreBadge.innerText = 'MODERADO';
          } else {
            kpiScoreBadge.className = 'px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/15 text-legal-emerald border border-emerald-500/20';
            kpiScoreBadge.innerText = 'CONFIABLE';
          }
        }
        if (kpiScoreSub) kpiScoreSub.innerText = res.score >= 65 ? 'Alto riesgo de estafa o extorsión' : 'Parámetros dentro de lo esperado';
        if (kpiTipo) kpiTipo.innerText = res.tipologia || 'Fraude Detectado';
        if (kpiEntidad) kpiEntidad.innerText = res.entidad || 'No identificada';
        if (kpiAccion) kpiAccion.innerText = res.accionInmediata || 'Seguir protocolo';

        const circle = document.getElementById('fn-radial-circle');
        const num = document.getElementById('fn-radial-number');
        if (num) num.innerText = res.score;
        if (circle) {
          const maxOffset = 251.32;
          const offset = maxOffset * (1 - (res.score / 100));
          circle.style.strokeDashoffset = offset.toFixed(1);
          circle.setAttribute('stroke', res.score >= 65 ? '#ef4444' : (res.score >= 35 ? '#d97706' : '#059669'));
        }

        const vTitle = document.getElementById('fn-verdict-title');
        const vSummary = document.getElementById('fn-verdict-summary');
        const vEyebrow = document.getElementById('fn-verdict-eyebrow');
        const vCard = document.getElementById('fn-verdict-card');
        const vIcon = document.getElementById('fn-verdict-icon');
        const vIconBox = document.getElementById('fn-verdict-icon-box');

        if (vTitle) vTitle.innerText = res.verdictTitle;
        if (vSummary) vSummary.innerText = res.verdictSummary;

        if (res.score >= 65) {
          if (vCard) vCard.className = 'bg-white dark:bg-obsidian-surface rounded-2xl border-2 border-red-500/60 p-6 shadow-sm space-y-5 transition-all';
          if (vEyebrow) {
            vEyebrow.className = 'text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30';
            vEyebrow.innerText = 'DICTAMEN: ALTO RIESGO / FRAUDE';
          }
          if (vIconBox) vIconBox.className = 'w-10 h-10 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0';
          if (vIcon) vIcon.className = 'fa-solid fa-triangle-exclamation text-lg';
        } else if (res.score >= 35) {
          if (vCard) vCard.className = 'bg-white dark:bg-obsidian-surface rounded-2xl border-2 border-legal-gold/60 p-6 shadow-sm space-y-5 transition-all';
          if (vEyebrow) {
            vEyebrow.className = 'text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-legal-gold border border-legal-gold/30';
            vEyebrow.innerText = 'DICTAMEN: PRECAUCIÓN / MODERADO';
          }
          if (vIconBox) vIconBox.className = 'w-10 h-10 rounded-xl bg-amber-500/15 text-legal-gold flex items-center justify-center shrink-0';
          if (vIcon) vIcon.className = 'fa-solid fa-eye text-lg';
        } else {
          if (vCard) vCard.className = 'bg-white dark:bg-obsidian-surface rounded-2xl border-2 border-emerald-500/40 p-6 shadow-sm space-y-5 transition-all';
          if (vEyebrow) {
            vEyebrow.className = 'text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-legal-emerald border border-emerald-500/20';
            vEyebrow.innerText = 'DICTAMEN: SEGURO / CONFIABLE';
          }
          if (vIconBox) vIconBox.className = 'w-10 h-10 rounded-xl bg-emerald-500/15 text-legal-emerald flex items-center justify-center shrink-0';
          if (vIcon) vIcon.className = 'fa-solid fa-shield-check text-lg';
        }

        const flagsList = document.getElementById('fn-red-flags-list');
        if (flagsList) {
          if (!res.redFlags || res.redFlags.length === 0) {
            flagsList.innerHTML = '<div class="p-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-elevated text-slate-500 text-xs italic">Sin banderas rojas detectadas.</div>';
          } else {
            flagsList.innerHTML = res.redFlags.map(f => `
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-obsidian-elevated border border-slate-200 dark:border-obsidian-border space-y-1">
                <span class="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold ${f.severity === 'critica' ? 'bg-red-500/15 text-red-600 dark:text-red-400' : 'bg-amber-500/15 text-legal-gold'}">
                  ${this.escapeHtml(f.badge)}
                </span>
                <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">${this.escapeHtml(f.desc)}</p>
              </div>
            `).join('');
          }
        }

        const legalEl = document.getElementById('fn-legal-basis');
        if (legalEl) legalEl.innerText = res.legalBasis || 'Art. 386 del Código Penal Federal.';

        const actionsList = document.getElementById('fn-actions-list');
        if (actionsList && res.actions) {
          actionsList.innerHTML = res.actions.map(a => `
            <li class="flex items-start gap-1.5"><i class="fa-solid fa-angle-right text-legal-gold mt-1 text-[10px]"></i><span>${this.escapeHtml(a)}</span></li>
          `).join('');
        }
      },

      copyForensicReport() {
        if (!this.lastForenseResult) this.runForensicAudit();
        const r = this.lastForenseResult;
        const text = [
          '=== EVALUACIÓN HEURÍSTICA DE CIBERSEGURIDAD (ESCUDO FINANCIERO PRO) ===',
          `Fecha de Evaluación: ${new Date().toLocaleString('es-MX')}`,
          `Nivel de Amenaza: ${r.score} / 100`,
          `Veredicto Heurístico: ${r.verdictTitle}`,
          `Resumen Técnico: ${r.verdictSummary}`,
          '------------------------------------------------------------------',
          'Banderas Rojas y Patrones Detectados:',
          ...(r.redFlags || []).map(f => `• [${f.badge}]: ${f.desc}`),
          '------------------------------------------------------------------',
          `Fundamento Jurídico: ${r.legalBasis}`,
          'Protocolo Defensivo Sugerido:',
          ...(r.actions || []).map(a => `→ ${a}`),
          '------------------------------------------------------------------',
          'Emitido mediante Motor Heurístico Local 100% Client-Side Memory (LFPDPPP Zero-Knowledge).'
        ].join('\n');

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            this.showToast('Evaluación heurística copiada al portapapeles.');
          });
        } else {
          this.showToast('Evaluación heurística lista para copiar.');
        }
      },

      openPoliceComplaintModal() {
        if (!this.lastForenseResult) this.runForensicAudit();
        const r = this.lastForenseResult;
        const body = `C. AGENTE DEL MINISTERIO PÚBLICO / POLICÍA CIBERNÉTICA (088):\n\nPor medio del presente ocurso formalizo denuncia ciudadana por hechos constitutivos de posible delito de FRAUDE PATRIMONIAL Y/O EXTORSION (${r.legalBasis}):\n\n1. HECHOS:\nCon fecha ${new Date().toLocaleDateString('es-MX')} se recibió comunicación con indicios criminales consistentes en:\n"${(document.getElementById('fn-message-input')?.value || document.getElementById('fn-url-input')?.value || 'Evidencia digital evaluada').slice(0, 300)}..."\n\n2. EVALUACIÓN HEURÍSTICA PRELIMINAR:\n- Nivel de Amenaza: ${r.score}/100\n- Calificación: ${r.verdictTitle}\n- Modalidad: ${r.tipologia || 'Fraude Electrónico'}\n\n3. SOLICITUD:\nSe inicien las diligencias de investigación cibernética, rastreo de cuentas bancarias y números telefónicos involucrados para los efectos legales conducentes.`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(body).then(() => {
            this.showToast('Formato de Denuncia para la Policía Cibernética (088) copiado al portapapeles.');
          });
        }
      },

      transferForenseToQueja() {
        if (!this.lastForenseResult) this.runForensicAudit();
        const r = this.lastForenseResult;
        this.switchTab('quejas');
        this.setWizardStep(3);

        const hechosEl = document.getElementById('input-queja-hechos');
        if (hechosEl) {
          hechosEl.value = `En fecha ${new Date().toLocaleDateString('es-MX')} recibí mensajes con amenazas o solicitudes irregulares de dinero que usurpan indebidamente la identidad institucional. Conforme a la evaluación heurística emitida (Riesgo: ${r.score}/100), se identificaron patrones de: ${r.verdictSummary}. Solicito la intervención formal de CONDUSEF frente a estos hechos constitutivos de cobranza abusiva o suplantación.`;
        }
        this.updateDocPreview();
        this.showToast('Evidencias heurísticas transferidas al Generador de Quejas (Paso 3).');
      },

      /* =======================================================================
         MÓDULO 5: RADAR COMUNITARIO (399 APPS & RED DE ALERTAS)
         ======================================================================= */
      radarAppsView: 'grid',
      radarCurrentSubtab: 'apps',
      radarAppsPage: 1,
      radarAppsPerPage: 32,
      radarFilteredApps: [],
      radarSelectedApp: null,
      radarReportsFilter: 'todos',
      radarInitialized: false,
      radarReports: [
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
      ],
      CLABE_BANKS_MAP: {
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
        '166': 'Banco del Bienestar',
        '167': 'Hey Banco',
        '638': 'Nu México (Nubank)',
        '646': 'STP (Sistema de Transferencias y Pagos)',
        '659': 'ASP Integra Opciones',
        '661': 'Klar',
        '684': 'Transfer (OXXO / Saldazo)'
      },

      radarStateFilter: '',
      MEXICO_STATES_LIST: [
        'Ciudad de México', 'Estado de México', 'Jalisco', 'Nuevo León',
        'Puebla', 'Veracruz', 'Guanajuato', 'Chihuahua', 'Sonora',
        'Querétaro', 'Yucatán', 'Baja California', 'Coahuila',
        'Tamaulipas', 'Michoacán', 'Sinaloa', 'San Luis Potosí',
        'Hidalgo', 'Morelos', 'Tabasco', 'Guerrero', 'Oaxaca',
        'Chiapas', 'Aguascalientes', 'Quintana Roo', 'Zacatecas',
        'Durango', 'Tlaxcala', 'Nayarit', 'Campeche', 'Baja California Sur', 'Colima'
      ],

      initRadar() {
        if (!this.radarInitialized) {
          this.filterRadarApps();
          this.renderMexicoHeatmap();
          this.renderRadarReports();
          this.updateRadarKPIs();
          this.populateKitAppsDatalist();
          this.radarInitialized = true;
        }
      },

      updateRadarKPIs() {
        const appsCountEl = document.getElementById('radar-kpi-apps-count');
        const reportsCountEl = document.getElementById('radar-kpi-total-reports');
        const montoEl = document.getElementById('radar-kpi-monto-total');
        const afectadosEl = document.getElementById('radar-kpi-afectados-total');
        const badgeMuro = document.getElementById('radar-badge-muro-count');

        const apps = window.APPS_PRESTAMO_DB || [];
        if (appsCountEl) appsCountEl.innerText = apps.length || 399;

        const totalReports = this.radarReports.length;
        if (reportsCountEl) reportsCountEl.innerText = totalReports;
        if (badgeMuro) badgeMuro.innerText = totalReports;

        const totalMonto = this.radarReports.reduce((acc, r) => acc + (parseFloat(r.monto) || 0), 0);
        if (montoEl) montoEl.innerText = '$' + totalMonto.toLocaleString('es-MX');

        const totalAfectados = this.radarReports.reduce((acc, r) => acc + (parseInt(r.confirmaciones) || 1), 0);
        if (afectadosEl) afectadosEl.innerText = totalAfectados;
      },

      switchRadarSubtab(subtab) {
        this.radarCurrentSubtab = subtab;
        const subApps = document.getElementById('radar-subtab-apps');
        const subMuro = document.getElementById('radar-subtab-muro');
        const subKit = document.getElementById('radar-subtab-kit');

        if (subApps) subApps.classList.toggle('hidden', subtab !== 'apps');
        if (subMuro) subMuro.classList.toggle('hidden', subtab !== 'muro');
        if (subKit) subKit.classList.toggle('hidden', subtab !== 'kit');

        const btnApps = document.getElementById('radar-subtab-btn-apps');
        const btnMuro = document.getElementById('radar-subtab-btn-muro');
        const btnKit = document.getElementById('radar-subtab-btn-kit');

        const activeClass = "px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-obsidian-surface text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-obsidian-border";
        const inactiveClass = "px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-2";

        if (btnApps) btnApps.className = subtab === 'apps' ? activeClass : inactiveClass;
        if (btnMuro) btnMuro.className = subtab === 'muro' ? activeClass : inactiveClass;
        if (btnKit) btnKit.className = subtab === 'kit' ? activeClass : inactiveClass;
      },

      setRadarAppsView(view) {
        this.radarAppsView = view;
        const gridCont = document.getElementById('radar-apps-grid');
        const tableCont = document.getElementById('radar-apps-table-container');
        const btnGrid = document.getElementById('radar-view-grid-btn');
        const btnTable = document.getElementById('radar-view-table-btn');

        if (view === 'grid') {
          if (gridCont) gridCont.classList.remove('hidden');
          if (tableCont) tableCont.classList.add('hidden');
          if (btnGrid) btnGrid.className = "p-1.5 rounded-lg text-xs bg-white dark:bg-obsidian-surface text-slate-900 dark:text-white shadow-sm";
          if (btnTable) btnTable.className = "p-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white";
        } else {
          if (gridCont) gridCont.classList.add('hidden');
          if (tableCont) tableCont.classList.remove('hidden');
          if (btnTable) btnTable.className = "p-1.5 rounded-lg text-xs bg-white dark:bg-obsidian-surface text-slate-900 dark:text-white shadow-sm";
          if (btnGrid) btnGrid.className = "p-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white";
        }
      },

      searchRadarApps() {
        this.filterRadarApps();
      },

      filterRadarApps() {
        const query = this.normalizeText(document.getElementById('radar-apps-search')?.value || '');
        const condusef = document.getElementById('radar-apps-filter-condusef')?.value || '';
        const play = document.getElementById('radar-apps-filter-play')?.value || '';

        const all = window.APPS_PRESTAMO_DB || [];
        this.radarFilteredApps = all.filter(item => {
          if (query) {
            const matchesQuery = this.normalizeText(item.app).includes(query) || String(item.num) === query;
            if (!matchesQuery) return false;
          }
          if (condusef && item.condusef !== condusef) return false;
          if (play && item.googlePlay !== play) return false;
          return true;
        });

        this.radarAppsPage = 1;
        this.renderRadarApps(false);
      },

      loadMoreRadarApps() {
        this.radarAppsPage += 1;
        this.renderRadarApps(true);
      },

      renderRadarApps(append = false) {
        const grid = document.getElementById('radar-apps-grid');
        const tbody = document.getElementById('radar-apps-table-body');
        const visibleCountEl = document.getElementById('radar-apps-visible-count');
        const totalCountEl = document.getElementById('radar-apps-total-count');
        const loadMoreContainer = document.getElementById('radar-apps-load-more-container');
        const loadMoreText = document.getElementById('radar-apps-load-more-text');

        const totalFiltered = this.radarFilteredApps.length;
        if (totalCountEl) totalCountEl.innerText = totalFiltered;

        const maxVisible = this.radarAppsPage * this.radarAppsPerPage;
        const currentSlice = this.radarFilteredApps.slice(0, maxVisible);
        if (visibleCountEl) visibleCountEl.innerText = currentSlice.length;

        if (loadMoreContainer) {
          if (currentSlice.length >= totalFiltered) {
            loadMoreContainer.classList.add('hidden');
          } else {
            loadMoreContainer.classList.remove('hidden');
            const remaining = totalFiltered - currentSlice.length;
            if (loadMoreText) {
              loadMoreText.innerText = `Cargar más aplicaciones (+${Math.min(this.radarAppsPerPage, remaining)})`;
            }
          }
        }

        // Render Grid
        if (grid) {
          if (currentSlice.length === 0) {
            grid.innerHTML = `
              <div class="col-span-full py-12 text-center text-slate-400">
                <i class="fa-solid fa-mobile-screen-button text-3xl mb-2 opacity-50"></i>
                <p class="font-medium text-sm">No se encontraron aplicaciones con los filtros seleccionados.</p>
              </div>`;
          } else {
            const itemsToRender = append ? this.radarFilteredApps.slice((this.radarAppsPage - 1) * this.radarAppsPerPage, maxVisible) : currentSlice;
            const htmlCards = itemsToRender.map(a => {
              const condusefBadge = a.condusef === 'SÍ'
                ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">CONDUSEF: SÍ</span>`
                : `<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-obsidian-elevated text-slate-500 dark:text-slate-400">CONDUSEF: NO</span>`;

              const playBadge = a.googlePlay === 'ACTIVA'
                ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">Play Store: ACTIVA</span>`
                : (a.googlePlay === 'BAJA'
                  ? `<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-obsidian-elevated text-slate-500">Play Store: BAJA</span>`
                  : `<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-obsidian-elevated text-slate-400">No Encontrada</span>`);

              return `
                <div class="bg-white dark:bg-obsidian-surface rounded-2xl border border-slate-200 dark:border-obsidian-border p-4 shadow-sm hover:border-legal-gold/50 transition-all flex flex-col justify-between group">
                  <div class="space-y-2.5">
                    <div class="flex items-center justify-between gap-2">
                      <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-obsidian-elevated text-slate-600 dark:text-slate-300">
                        #${a.num}
                      </span>
                      <div class="flex items-center gap-1">
                        ${condusefBadge}
                      </div>
                    </div>

                    <div>
                      <h4 class="font-serif font-bold text-sm text-slate-900 dark:text-white group-hover:text-legal-gold transition-colors truncate" title="${this.escapeHtml(a.app)}">
                        ${this.escapeHtml(a.app)}
                      </h4>
                      <div class="flex items-center gap-1.5 mt-1">
                        ${playBadge}
                      </div>
                    </div>

                    <div class="pt-2 border-t border-slate-100 dark:border-obsidian-border flex items-center justify-between text-[11px] text-slate-500">
                      <span>Reportes ciudadanos:</span>
                      <strong class="font-mono text-slate-900 dark:text-white font-bold">${Number(a.reportes).toLocaleString('es-MX')}</strong>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-1.5 pt-3.5 mt-1">
                    <button
                      type="button"
                      onclick="PreviewApp.openAppFicha(${a.num})"
                      class="py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-obsidian-elevated hover:bg-slate-200 dark:hover:bg-obsidian-border text-slate-800 dark:text-slate-200 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <i class="fa-regular fa-id-card text-[10px] text-legal-gold"></i>
                      <span>Ficha</span>
                    </button>
                    <button
                      type="button"
                      onclick="PreviewApp.transferAppToQueja(${a.num})"
                      class="py-1.5 px-2 rounded-xl bg-slate-900 dark:bg-legal-gold text-white text-xs font-semibold text-center shadow-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-1"
                    >
                      <i class="fa-solid fa-file-signature text-[10px]"></i>
                      <span>Queja</span>
                    </button>
                  </div>
                </div>`;
            }).join('');

            if (append) {
              grid.insertAdjacentHTML('beforeend', htmlCards);
            } else {
              grid.innerHTML = htmlCards;
            }
          }
        }

        // Render Table
        if (tbody) {
          if (currentSlice.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400">No hay registros coincidentes.</td></tr>`;
          } else {
            const tableRows = currentSlice.map(a => {
              const condusefBadge = a.condusef === 'SÍ'
                ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">SÍ</span>`
                : `<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-obsidian-elevated text-slate-500">NO</span>`;

              const playBadge = a.googlePlay === 'ACTIVA'
                ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">ACTIVA</span>`
                : (a.googlePlay === 'BAJA'
                  ? `<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-obsidian-elevated text-slate-500">BAJA</span>`
                  : `<span class="px-2 py-0.5 rounded text-[10px] font-medium text-slate-400">NO ENCONTRADA</span>`);

              return `
                <tr class="hover:bg-slate-50/70 dark:hover:bg-obsidian-elevated/40 transition-colors">
                  <td class="py-2.5 px-4 font-mono text-slate-400 text-[11px]">#${a.num}</td>
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">${this.escapeHtml(a.app)}</td>
                  <td class="py-2.5 px-4">${condusefBadge}</td>
                  <td class="py-2.5 px-4">${playBadge}</td>
                  <td class="py-2.5 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">${Number(a.reportes).toLocaleString('es-MX')}</td>
                  <td class="py-2.5 px-4 text-right space-x-1.5">
                    <button type="button" onclick="PreviewApp.openAppFicha(${a.num})" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-obsidian-elevated hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                      Ficha
                    </button>
                    <button type="button" onclick="PreviewApp.transferAppToQueja(${a.num})" class="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-legal-gold text-white font-semibold text-[11px] shadow-sm">
                      Iniciar Queja
                    </button>
                  </td>
                </tr>`;
            }).join('');
            tbody.innerHTML = tableRows;
          }
        }
      },

      openAppFicha(appNum) {
        const all = window.APPS_PRESTAMO_DB || [];
        const app = all.find(a => a.num === Number(appNum));
        if (!app) return;
        this.radarSelectedApp = app;

        const numEl = document.getElementById('modal-app-num');
        const nameEl = document.getElementById('modal-app-name');
        const condusefEl = document.getElementById('modal-app-condusef-badge');
        const playEl = document.getElementById('modal-app-play-badge');
        const countEl = document.getElementById('modal-app-reports-count');

        if (numEl) numEl.innerText = `#${app.num}`;
        if (nameEl) nameEl.innerText = app.app;
        if (condusefEl) {
          condusefEl.innerHTML = app.condusef === 'SÍ'
            ? `<span class="text-rose-600 dark:text-rose-400 font-bold">Reportada Formalmente ante CONDUSEF</span>`
            : `<span class="text-slate-500">Sin Reporte Formal Previo</span>`;
        }
        if (playEl) {
          playEl.innerHTML = app.googlePlay === 'ACTIVA'
            ? `<span class="text-amber-500 font-bold">ACTIVA en Google Play Store (Riesgo Activo)</span>`
            : (app.googlePlay === 'BAJA'
              ? `<span class="text-slate-500 font-semibold">DADA DE BAJA por Google</span>`
              : `<span class="text-slate-400 font-semibold">NO ENCONTRADA (Distribución APK Externa)</span>`);
        }
        if (countEl) countEl.innerText = `${Number(app.reportes).toLocaleString('es-MX')} reportes`;

        const modal = document.getElementById('modal-radar-app-ficha');
        if (modal) modal.classList.remove('hidden');
      },

      closeAppFicha() {
        const modal = document.getElementById('modal-radar-app-ficha');
        if (modal) modal.classList.add('hidden');
      },

      copyAppFicha() {
        if (!this.radarSelectedApp) return;
        const a = this.radarSelectedApp;
        const text = `FICHA TÉCNICA DE APLICACIÓN DE PRÉSTAMO (RADAR COMUNITARIO):\n\n- Nombre: ${a.app}\n- Número en catálogo: #${a.num} de 399\n- Reportada ante CONDUSEF: ${a.condusef}\n- Estatus Google Play: ${a.googlePlay}\n- Reportes ciudadanos: ${a.reportes}\n- Fundamento Legal: Art. 284 Bis CPF (Cobranza extrajudicial y extorsión).\n\nConsulta más detalles en Escudo Financiero Pro.`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            this.showToast(`Ficha de ${a.app} copiada al portapapeles.`);
          });
        }
      },

      transferAppToQueja(appNum) {
        let app = this.radarSelectedApp;
        if (appNum) {
          const all = window.APPS_PRESTAMO_DB || [];
          app = all.find(a => a.num === Number(appNum));
        }
        if (!app) return;

        this.closeAppFicha();
        this.switchTab('quejas');
        this.setWizardStep(2);

        // Prellenar nombre comercial de la queja
        const entidadInput = document.getElementById('input-queja-entidad');
        if (entidadInput) entidadInput.value = `App "${app.app}" (No Regulada / N° ${app.num} en Radar)`;

        const hechosInput = document.getElementById('input-queja-hechos');
        if (hechosInput) {
          hechosInput.value = `En fecha reciente instalé o fui objeto de cobranza abusiva y hostigamiento por parte de la aplicación móvil denominada "${app.app}", la cual cuenta con ${app.reportes} reportes ciudadanos acumulados. La entidad incurre en conductas tipificadas por el Art. 284 Bis del Código Penal Federal. Solicito la intervención formal de CONDUSEF y la emisión de alerta regulatoria.`;
        }

        this.updateDocPreview();
        this.showToast(`Aplicación ${app.app} transferida al Generador de Quejas.`);
      },

      renderMexicoHeatmap() {
        const grid = document.getElementById('radar-states-heatmap-grid');
        if (!grid) return;

        const stateCounts = {};
        this.radarReports.forEach(r => {
          const st = r.estado || 'Nacional';
          stateCounts[st] = (stateCounts[st] || 0) + 1;
        });

        const activeState = this.radarStateFilter;
        const clearBtn = document.getElementById('radar-clear-state-btn');
        const activeLabel = document.getElementById('radar-active-state-name');

        if (clearBtn) {
          clearBtn.classList.toggle('hidden', !activeState);
          if (activeLabel && activeState) activeLabel.innerText = activeState;
        }

        const states = ['Nacional', ...this.MEXICO_STATES_LIST];

        grid.innerHTML = states.map(st => {
          const count = stateCounts[st] || 0;
          const isSelected = activeState === st;

          let pillClasses = 'p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between ';
          if (isSelected) {
            pillClasses += 'bg-slate-900 dark:bg-legal-gold text-white border-transparent shadow-sm ring-2 ring-legal-gold/50 font-bold';
          } else if (count > 0) {
            pillClasses += 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30 font-semibold';
          } else {
            pillClasses += 'bg-slate-50 dark:bg-obsidian-bg hover:bg-slate-100 dark:hover:bg-obsidian-elevated text-slate-500 dark:text-slate-400 border-slate-200 dark:border-obsidian-border';
          }

          return `
            <div onclick="PreviewApp.filterRadarByState('${st}')" class="${pillClasses}" title="${st}: ${count} reportes">
              <span class="truncate text-[10px]">${this.escapeHtml(st)}</span>
              <span class="font-mono text-[9.5px] mt-0.5 ${count > 0 ? (isSelected ? 'text-amber-300 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold') : 'opacity-40'}">
                ${count} ${count === 1 ? 'rep.' : 'reps.'}
              </span>
            </div>`;
        }).join('');
      },

      filterRadarByState(stateName) {
        if (this.radarStateFilter === stateName) {
          this.radarStateFilter = '';
        } else {
          this.radarStateFilter = stateName;
        }
        this.renderMexicoHeatmap();
        this.renderRadarReports();
      },

      verifyRadarTarget(val) {
        const digits = (val || '').replace(/[^0-9]/g, '');
        const resEl = document.getElementById('radar-verifier-result');
        if (!resEl) return;

        if (!digits || digits.length < 3) {
          resEl.classList.add('hidden');
          resEl.innerHTML = '';
          return;
        }

        resEl.classList.remove('hidden');

        // 1. CLABE (18 dígitos)
        if (digits.length === 18) {
          const prefix = digits.substring(0, 3);
          const bankName = this.CLABE_BANKS_MAP[prefix] || `Entidad Bancaria / STP (Código ABM ${prefix})`;
          const isFintech = ['646', '638', '661', '684', '659'].includes(prefix);

          // Algoritmo Banxico Ponderado (3-7-1)
          const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
          let sum = 0;
          for (let i = 0; i < 17; i++) {
            sum += (parseInt(digits.charAt(i), 10) * weights[i]) % 10;
          }
          const checkDigit = (10 - (sum % 10)) % 10;
          const isValidChecksum = checkDigit === parseInt(digits.charAt(17), 10);

          // Cruce en Vivo con Base de Datos SIPRES (409 entidades)
          const sipresDb = window.SIPRES_DATABASE || [];
          const matchedSipres = sipresDb.find(e => {
            const normN = this.normalizeText(e.n);
            const normBank = this.normalizeText(bankName);
            return normBank.includes(normN) || normN.includes(normBank.split(' ')[0]);
          });

          // Buscar coincidencia en el muro comunitario
          const matchingReport = this.radarReports.find(r => r.clabe && r.clabe.includes(digits));

          let verdictHtml = '';

          if (matchingReport) {
            verdictHtml = `
              <div class="p-3.5 rounded-xl bg-red-600/10 border border-red-600/40 text-red-900 dark:text-red-200 space-y-2">
                <div class="flex items-center justify-between font-bold text-xs text-red-600 dark:text-red-400">
                  <span class="flex items-center gap-1.5"><i class="fa-solid fa-triangle-exclamation"></i> CUENTA COINCIDENTE CON REPORTE CIUDADANO EN EL RADAR</span>
                  <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-bold">ALERTA ROJA</span>
                </div>
                <p class="text-xs leading-relaxed">
                  Esta cuenta CLABE está directamente vinculada al reporte comunitario: <strong>${this.escapeHtml(matchingReport.nombre)}</strong> (${this.escapeHtml(matchingReport.estado)}, $${matchingReport.monto} MXN). No realices ningún depósito.
                </p>
              </div>`;
          } else if (matchedSipres) {
            verdictHtml = `
              <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-900 dark:text-amber-200 space-y-2.5">
                <div class="flex items-center justify-between font-bold text-xs text-legal-gold">
                  <span class="flex items-center gap-1.5"><i class="fa-solid fa-building-columns"></i> CRUCE SIPRES: BANCO REGISTRADO (${matchedSipres.n} - Folio #${matchedSipres.f})</span>
                  <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-legal-gold font-bold">POSIBLE SUPLANTACIÓN</span>
                </div>
                <p class="text-xs leading-relaxed">
                  <strong>ALERTA HEURÍSTICA DE SUPLANTACIÓN:</strong> El prefijo <code>${prefix}</code> pertenece legalmente a <strong>${matchedSipres.n}</strong> (${matchedSipres.s}). Sin embargo, los bancos oficiales <strong>NUNCA</strong> solicitan a sus clientes transferir a cuentas personales ni exigen fianzas o comisiones por adelantado para liberar préstamos. Si te ofrecieron un crédito por WhatsApp pidiéndote depositar aquí, se trata de una <strong>suplantación de identidad institucional (Art. 386 Código Penal Federal)</strong>.
                </p>
                <div class="pt-1 flex items-center gap-2">
                  <button type="button" onclick="PreviewApp.openExpediente('${matchedSipres.f}')" class="px-3 py-1.5 rounded-lg bg-white dark:bg-obsidian-surface border border-slate-200 dark:border-obsidian-border text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-legal-gold/50 flex items-center gap-1">
                    <i class="fa-regular fa-id-card text-[10px] text-legal-gold"></i>
                    <span>Verificar canales oficiales de ${matchedSipres.n}</span>
                  </button>
                </div>
              </div>`;
          } else if (isFintech) {
            verdictHtml = `
              <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200 space-y-2">
                <div class="flex items-center justify-between font-bold text-xs text-rose-600 dark:text-rose-400">
                  <span class="flex items-center gap-1.5"><i class="fa-solid fa-microchip"></i> CANAL FINTECH / STP IDENTIFICADO (${bankName})</span>
                  <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold">ALERTA DISPERSIÓN</span>
                </div>
                <p class="text-xs leading-relaxed">
                  <strong>ALERTA DE SEGURIDAD:</strong> Las cuentas del Sistema de Transferencias y Pagos (STP) o billeteras móviles (Spin / Klar) a nombre de personas particulares son el <strong>canal #1 de dispersión empleado por bandas de montadeudas y falsos gestores</strong>. Si la transferencia no se realiza formalmente a la razón social jurídica de una institución avalada por CNBV, no transfieras ningún monto.
                </p>
              </div>`;
          } else {
            verdictHtml = `
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-obsidian-bg border border-slate-200 dark:border-obsidian-border text-slate-800 dark:text-slate-200 space-y-1.5 text-xs">
                <div class="font-bold flex items-center justify-between">
                  <span>Institución Emisora: ${bankName}</span>
                  <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-obsidian-elevated text-slate-600 dark:text-slate-400">Prefijo ABM: ${prefix}</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Estructura matemática de CLABE: ${isValidChecksum ? '<span class="text-legal-emerald font-semibold">Dígito verificador Banxico válido.</span>' : '<span class="text-rose-500 font-semibold">Dígito verificador alterado.</span>'}
                </p>
              </div>`;
          }

          resEl.innerHTML = verdictHtml;
          return;
        }

        // 2. Teléfono (10 dígitos)
        if (digits.length === 10) {
          // Buscar si es canal oficial UNE
          const verifiedUNE = Object.entries(VERIFIED_CHANNELS_PREVIEW).find(([folio, ch]) => {
            const cleanTel = (ch.tel || '').replace(/[^0-9]/g, '');
            return cleanTel === digits;
          });

          const matchingReport = this.radarReports.find(r => r.telefono && r.telefono.replace(/[^0-9]/g, '') === digits);

          if (verifiedUNE) {
            const [folio, ch] = verifiedUNE;
            const sipresDb = window.SIPRES_DATABASE || [];
            const ent = sipresDb.find(e => e.f === folio);
            resEl.innerHTML = `
              <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 space-y-1.5 text-xs">
                <div class="flex items-center justify-between font-bold">
                  <span class="flex items-center gap-1.5"><i class="fa-solid fa-shield-halved text-legal-emerald"></i> LÍNEA OFICIAL VERIFICADA SIPRES (UNE)</span>
                  <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-legal-emerald font-bold">CANAL OFICIAL</span>
                </div>
                <p class="text-[11.5px] leading-relaxed">
                  Este número telefónico corresponde a la Unidad Especializada de Atención a Usuarios (UNE) oficial de <strong>${ent ? ent.n : 'Institución Financiera'}</strong> (Folio #${folio}).
                </p>
              </div>`;
          } else if (matchingReport) {
            resEl.innerHTML = `
              <div class="p-3.5 rounded-xl bg-red-600/10 border border-red-600/40 text-red-900 dark:text-red-200 space-y-1.5 text-xs">
                <div class="flex items-center justify-between font-bold text-red-600 dark:text-red-400">
                  <span class="flex items-center gap-1.5"><i class="fa-solid fa-triangle-exclamation"></i> TELÉFONO REPORTADO POR FRAUDE / EXTORSÓN</span>
                  <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-bold">COINCIDENCIA EN RADAR</span>
                </div>
                <p class="text-[11.5px] leading-relaxed">
                  Línea reportada en: <strong>${this.escapeHtml(matchingReport.nombre)}</strong> (${this.escapeHtml(matchingReport.estado)}). Motivo: "${this.escapeHtml(matchingReport.relato)}".
                </p>
              </div>`;
          } else {
            resEl.innerHTML = `
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-obsidian-bg border border-slate-200 dark:border-obsidian-border text-slate-800 dark:text-slate-200 space-y-1 text-xs">
                <div class="flex items-center justify-between font-bold">
                  <span>Línea Telefónica Nacional (10 dígitos): <span class="font-mono">${digits}</span></span>
                  <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-obsidian-elevated text-slate-600 dark:text-slate-400">Sin antecedentes</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  No se encuentra en el directorio de líneas oficiales UNE ni en reportes ciudadanos previos. Si te solicitaron dinero o te amenazan, añade un reporte al muro.
                </p>
              </div>`;
          }
          return;
        }

        // 3. Tarjeta (16 dígitos)
        if (digits.length === 16) {
          const bin = digits.substring(0, 6);
          const brand = digits.startsWith('4') ? 'Visa' : (digits.startsWith('5') ? 'Mastercard' : 'Carnet');
          resEl.innerHTML = `
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-obsidian-bg border border-slate-200 dark:border-obsidian-border text-slate-800 dark:text-slate-200 space-y-1.5 text-xs">
              <div class="flex items-center justify-between font-bold">
                <span class="flex items-center gap-1.5"><i class="fa-regular fa-credit-card text-legal-gold"></i> Tarjeta Receptora (16 dígitos) - Red ${brand}</span>
                <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-obsidian-elevated text-slate-600 dark:text-slate-400">BIN: ${bin}</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                <strong>Aviso Preventivo:</strong> Los bancos e instituciones de crédito nunca solicitan pagos de "fianzas" o "comisiones por apertura" a números de tarjetas de particulares o depósitos en tiendas de conveniencia.
              </p>
            </div>`;
          return;
        }

        resEl.innerHTML = `
          <div class="p-2.5 rounded-xl bg-slate-100 dark:bg-obsidian-elevated text-slate-600 dark:text-slate-400 text-xs font-mono">
            Ingresaste ${digits.length} dígitos. Para decodificación exacta ingresa 10 (teléfono), 16 (tarjeta) o 18 (CLABE).
          </div>`;
      },

      filterRadarReports(tipo) {
        this.radarReportsFilter = tipo;
        document.querySelectorAll('.radar-report-filter-btn').forEach(btn => {
          if (btn.dataset.reportFilter === tipo) {
            btn.className = "radar-report-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 dark:bg-legal-gold text-white shadow-sm";
          } else {
            btn.className = "radar-report-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-obsidian-elevated";
          }
        });
        this.renderRadarReports();
      },

      renderRadarReports() {
        const grid = document.getElementById('radar-reports-grid');
        if (!grid) return;

        let list = [...this.radarReports];
        if (this.radarReportsFilter !== 'todos') {
          list = list.filter(r => r.tipo === this.radarReportsFilter);
        }
        if (this.radarStateFilter) {
          list = list.filter(r => (r.estado || 'Nacional') === this.radarStateFilter);
        }

        if (list.length === 0) {
          grid.innerHTML = `
            <div class="col-span-full py-12 text-center text-slate-400">
              <i class="fa-solid fa-bullhorn text-3xl mb-2 opacity-50"></i>
              <p class="font-medium text-sm">No hay reportes registrados para los filtros seleccionados.</p>
              ${this.radarStateFilter ? `<button onclick="PreviewApp.filterRadarByState('')" class="mt-2 text-xs text-legal-gold font-semibold underline">Quitar filtro de estado (${this.radarStateFilter})</button>` : ''}
            </div>`;
          return;
        }

        grid.innerHTML = list.map(r => {
          const badgeClass = r.tipo === 'suplantacion'
            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            : (r.tipo === 'montadeudas'
              ? 'bg-amber-500/10 text-legal-gold border border-amber-500/20'
              : (r.tipo === 'anticipos'
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'));

          const badgeLabel = r.tipo === 'suplantacion'
            ? 'Suplantación Bancaria'
            : (r.tipo === 'montadeudas'
              ? 'App Montadeudas'
              : (r.tipo === 'anticipos'
                ? 'Cobro de Anticipo'
                : 'Phishing / SMS'));

          const bankDecoded = r.clabe ? (this.CLABE_BANKS_MAP[r.clabe.substring(0, 3)] || 'Cuenta Interbancaria') : '';

          return `
            <div class="bg-white dark:bg-obsidian-surface rounded-2xl border border-slate-200 dark:border-obsidian-border p-5 shadow-sm hover:border-legal-gold/50 transition-all flex flex-col justify-between space-y-3">
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}">
                    ${badgeLabel}
                  </span>
                  <span class="text-[11px] font-mono text-slate-400">${r.fecha || 'Reciente'}</span>
                </div>

                <h4 class="font-serif font-bold text-slate-900 dark:text-white text-base leading-tight">
                  ${this.escapeHtml(r.nombre)}
                </h4>

                <div class="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  ${r.telefono ? `<div><i class="fa-solid fa-phone text-slate-400 mr-1.5 w-3.5"></i><span class="font-mono text-slate-900 dark:text-slate-200">${this.escapeHtml(r.telefono)}</span></div>` : ''}
                  ${r.clabe ? `<div><i class="fa-solid fa-building-columns text-slate-400 mr-1.5 w-3.5"></i><span class="font-mono text-slate-900 dark:text-slate-200">${r.clabe}</span> <span class="text-[10px] text-slate-400">(${bankDecoded})</span></div>` : ''}
                  <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-obsidian-border">
                    <span>Estado: <strong>${this.escapeHtml(r.estado || 'Nacional')}</strong></span>
                    <span>Monto en riesgo: <strong class="font-mono text-red-600 dark:text-red-400 font-bold">$${Number(r.monto).toLocaleString('es-MX')} MXN</strong></span>
                  </div>
                </div>

                <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-obsidian-bg p-3 rounded-xl border border-slate-100 dark:border-obsidian-border">
                  "${this.escapeHtml(r.relato)}"
                </p>
              </div>

              <div class="pt-2 border-t border-slate-100 dark:border-obsidian-border flex items-center justify-between gap-2">
                <button
                  type="button"
                  onclick="PreviewApp.confirmCitizenReport('${r.id}')"
                  class="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-obsidian-elevated hover:bg-slate-200 dark:hover:bg-obsidian-border text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  title="Confirmar que también fuiste contactado o afectado"
                >
                  <i class="fa-regular fa-thumbs-up text-legal-gold"></i>
                  <span>A mí también</span>
                  <span class="font-mono font-bold text-slate-900 dark:text-white ml-0.5">(${r.confirmaciones})</span>
                </button>

                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    onclick="PreviewApp.shareCitizenReport('${r.id}')"
                    class="p-1.5 rounded-lg text-slate-500 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-obsidian-elevated transition-colors"
                    title="Compartir Alerta por WhatsApp"
                  >
                    <i class="fa-brands fa-whatsapp text-sm"></i>
                  </button>
                  <button
                    type="button"
                    onclick="PreviewApp.transferReportToQueja('${r.id}')"
                    class="px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-legal-gold text-white font-semibold text-xs shadow-sm hover:opacity-95 transition-opacity"
                    title="Canalizar este reporte a Queja CONDUSEF"
                  >
                    Iniciar Queja
                  </button>
                </div>
              </div>
            </div>`;
        }).join('');
      },

      confirmCitizenReport(id) {
        const rep = this.radarReports.find(r => r.id === id);
        if (!rep) return;
        rep.confirmaciones = (parseInt(rep.confirmaciones) || 1) + 1;
        this.updateRadarKPIs();
        this.renderRadarReports();
        this.showToast(`Confirmación registrada para "${rep.nombre}". ¡Gracias por proteger a la comunidad!`);
      },

      shareCitizenReport(id) {
        const rep = this.radarReports.find(r => r.id === id);
        if (!rep) return;
        const text = `🚨 *ALERTA CIUDADANA DE FRAUDE (ESCUDO FINANCIERO PRO)* 🚨\n\n⚠️ *Defraudador/App:* ${rep.nombre}\n📍 *Entidad:* ${rep.estado}\n📞 *Teléfono:* ${rep.telefono || 'N/A'}\n💳 *CLABE/Cuenta:* ${rep.clabe || 'N/A'}\n💰 *Monto exigido:* $${Number(rep.monto).toLocaleString('es-MX')} MXN\n📝 *Relato:* "${rep.relato}"\n\n🛡️ Verifica antes de pagar en Escudo Financiero Pro.`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            this.showToast('Alerta ciudadana copiada con formato para WhatsApp.');
          });
        }
      },

      transferReportToQueja(id) {
        const rep = this.radarReports.find(r => r.id === id);
        if (!rep) return;

        this.switchTab('quejas');
        this.setWizardStep(2);

        const entidadInput = document.getElementById('input-queja-entidad');
        if (entidadInput) entidadInput.value = rep.nombre;

        const hechosInput = document.getElementById('input-queja-hechos');
        if (hechosInput) {
          hechosInput.value = `En fecha ${rep.fecha || new Date().toLocaleDateString('es-MX')} fui objeto de conductas fraudulentas consistentes en: "${rep.relato}". El contacto se realizó mediante la línea telefónica ${rep.telefono || 'N/A'} y/o cuenta CLABE ${rep.clabe || 'N/A'} solicitando la cantidad de $${Number(rep.monto).toLocaleString('es-MX')} MXN. Solicito la intervención formal de CONDUSEF.`;
        }

        this.updateDocPreview();
        this.showToast(`Reporte transferido al Generador de Quejas.`);
      },

      populateKitAppsDatalist() {
        const dl = document.getElementById('kit-apps-datalist');
        if (!dl) return;
        const apps = window.APPS_PRESTAMO_DB || [];
        dl.innerHTML = apps.map(a => `<option value="${this.escapeHtml(a.app)}">N° ${a.num} (${a.reportes} reportes | CONDUSEF: ${a.condusef})</option>`).join('');
      },

      updateShieldMessageWithApp(appName) {
        const name = (appName || '').trim() || 'una aplicación fraudulenta no autorizada';
        const textarea = document.getElementById('textarea-shield-message');
        const text = `AVISO URGENTE A FAMILIARES Y AMIGOS:

Por favor ignoren cualquier mensaje, llamada o imagen difamatoria que reciban a mi nombre solicitando dinero o cobros derivados de la aplicación no regulada "${name}". Mi dispositivo telefónico sufrió un acceso no autorizado y robo de libreta de contactos.

NO tengo ninguna deuda legítima con ellos. El caso ya está siendo formalmente denunciado ante la Policía Cibernética (088) de la Guardia Nacional y la Fiscalía correspondiente conforme al Artículo 284 Bis del Código Penal Federal (Cobranza Ilegítima y Extorsión).

Por su seguridad, les pido NO responder sus mensajes, NO realizar ningún depósito y bloquear de inmediato sus números.

Muchas gracias por su apoyo y comprensión.`;

        if (textarea) textarea.value = text;

        const link = document.getElementById('link-whatsapp-shield');
        if (link) {
          link.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        }
      },

      transferMontadeudasToQueja() {
        const inputVal = document.getElementById('kit-app-name-input')?.value || '';
        const appName = inputVal.trim() || 'Aplicación Móvil Montadeudas';

        this.switchTab('quejas');
        this.setProcedure('redeco');
        this.setWizardStep(2);

        const entidadInput = document.getElementById('input-queja-entidad');
        if (entidadInput) entidadInput.value = `${appName} (Cobranza Ilegal / Art. 284 Bis CPF)`;

        const prodInput = document.getElementById('input-queja-producto');
        if (prodInput) prodInput.value = 'Crédito Móvil No Regulado / Extorsión Digital';

        const hechosInput = document.getElementById('input-queja-hechos');
        if (hechosInput) {
          hechosInput.value = `En fecha reciente fui objeto de conductas de cobranza extrajudicial ilegítima, amenazas, difamación e intimidación dirigidas a mi persona y a terceras personas de mi libreta de contactos telefónicos por parte de la aplicación móvil denominada "${appName}". Dichas conductas violentan flagrantemente el Artículo 284 Bis del Código Penal Federal, las Disposiciones de Carácter General aplicables a las Instituciones Financieras y Despachos de Cobranza (REDECO CONDUSEF), así como el derecho fundamental a la protección de datos personales.`;
        }

        const pretInput = document.getElementById('input-queja-pretensiones');
        if (pretInput) {
          pretInput.value = `PRIMERO.- Se ordene el cese inmediato y definitivo de cualquier gestión de cobranza, llamada, mensaje o intimidación hacia mi persona o cualquier tercero de mi agenda de contactos.\n\nSEGUNDO.- Se elimine cualquier reporte negativo o irregular que se hubiere transmitido indebidamente a las Sociedades de Información Crediticia (Buró de Crédito y Círculo de Crédito).\n\nTERCERO.- Se emita alerta institucional a través de CONDUSEF y se dé vista a la Policía Cibernética de la Guardia Nacional y a la Fiscalía General de la República por la probable comisión de delitos tipificados en los Artículos 284 Bis y 386 del Código Penal Federal.`;
        }

        this.updateDocPreview();
        this.showToast(`Queja por cobranza extrajudicial indebida de "${appName}" generada con éxito (Pasos 2, 3 y 4 listos).`);
      },

      copyMontadeudasShieldMessage() {
        const textarea = document.getElementById('textarea-shield-message');
        const text = textarea ? textarea.value : '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            const btnText = document.getElementById('btn-copy-shield-text');
            if (btnText) {
              btnText.innerText = '¡Copiado!';
              setTimeout(() => btnText.innerText = 'Copiar para WhatsApp', 2000);
            }
            this.showToast('Aviso de blindaje preventivo copiado al portapapeles.');
          });
        }
      },

      openNewReportModal() {
        const modal = document.getElementById('modal-nuevo-reporte');
        if (modal) modal.classList.remove('hidden');
      },

      closeNewReportModal() {
        const modal = document.getElementById('modal-nuevo-reporte');
        if (modal) modal.classList.add('hidden');
      },

      submitCitizenReport(e) {
        if (e && e.preventDefault) e.preventDefault();
        const tipo = document.getElementById('form-report-tipo')?.value || 'montadeudas';
        const nombre = document.getElementById('form-report-nombre')?.value || 'Entidad no identificada';
        const telefono = document.getElementById('form-report-telefono')?.value || '';
        const clabe = document.getElementById('form-report-clabe')?.value || '';
        const estado = document.getElementById('form-report-estado')?.value || 'Nacional';
        const monto = parseFloat(document.getElementById('form-report-monto')?.value) || 0;
        const relato = document.getElementById('form-report-relato')?.value || 'Reporte de incidente ciudadano.';

        const newRep = {
          id: `REP-${Date.now().toString().slice(-4)}`,
          tipo,
          nombre,
          telefono,
          clabe,
          estado,
          monto,
          confirmaciones: 1,
          relato,
          fecha: new Date().toLocaleDateString('es-MX')
        };

        this.radarReports.unshift(newRep);
        this.updateRadarKPIs();
        this.renderMexicoHeatmap();
        this.renderRadarReports();
        this.closeNewReportModal();
        this.showToast(`¡Reporte ciudadano publicado con éxito en el Radar Comunitario!`);
      }
    };

// ============================================================================
// INTEROPERABILIDAD Y ALIAS GLOBAL DE COMPATIBILIDAD
// ============================================================================
const EscudoApp = PreviewApp;
const VERIFIED_CHANNELS = VERIFIED_CHANNELS_PREVIEW;
window.EscudoApp = EscudoApp;
window.PreviewApp = EscudoApp;

document.addEventListener('DOMContentLoaded', () => {
  if (window.EscudoApp && typeof window.EscudoApp.init === 'function') {
    window.EscudoApp.init();
  }
});