/* ==========================================================================
   MC360 MAIN JAVASCRIPT ARCHITECTURE
   ========================================================================== */

/* ==========================================================================
   1. Core Landing Page & Navigation Handlers
   ========================================================================== */
/* =============================================
       DROPDOWN LOGIC
       ============================================= */
    (function () {
      'use strict';

      var dropdowns = [
        { btn: 'dd-products-btn', panel: 'dd-products', wrap: 'dd-products-wrap' },
        { btn: 'dd-customers-btn', panel: 'dd-customers', wrap: 'dd-customers-wrap' },
      ];

      function closeAll(except) {
        dropdowns.forEach(function (d) {
          if (d.btn === except) return;
          var b = document.getElementById(d.btn);
          var p = document.getElementById(d.panel);
          if (!b || !p) return;
          b.classList.remove('dd-open');
          b.setAttribute('aria-expanded', 'false');
          p.classList.remove('dd-visible');
        });
      }

      dropdowns.forEach(function (d) {
        var btn = document.getElementById(d.btn);
        var panel = document.getElementById(d.panel);
        if (!btn || !panel) return;

        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var isOpen = panel.classList.contains('dd-visible');
          closeAll(isOpen ? null : d.btn);
          if (!isOpen) {
            btn.classList.add('dd-open');
            btn.setAttribute('aria-expanded', 'true');
            panel.classList.add('dd-visible');
          } else {
            btn.classList.remove('dd-open');
            btn.setAttribute('aria-expanded', 'false');
            panel.classList.remove('dd-visible');
          }
        });
      });

      // Close on outside click
      document.addEventListener('click', function () { closeAll(); });

      // Keep open when clicking inside dropdown
      document.querySelectorAll('.nav-dropdown').forEach(function (p) {
        p.addEventListener('click', function (e) { e.stopPropagation(); });
      });

      // Close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAll();
      });

      /* ---- Hamburger + Mobile panel ---- */
      var hamBtn = document.getElementById('nav-hamburger');
      var mobPanel = document.getElementById('nav-mobile-panel');

      if (hamBtn && mobPanel) {
        hamBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          var open = mobPanel.classList.toggle('mob-open');
          hamBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
          mobPanel.setAttribute('aria-hidden', open ? 'false' : 'true');
        });
      }

      // Close mobile panel on outside click
      document.addEventListener('click', function (e) {
        if (mobPanel && !mobPanel.contains(e.target) && e.target !== hamBtn) {
          mobPanel.classList.remove('mob-open');
          if (hamBtn) hamBtn.setAttribute('aria-expanded', 'false');
        }
      });

      /* ---- Mobile accordions ---- */
      [['mob-products-btn', 'mob-products-sub', 'mob-products-chevron'],
      ['mob-customers-btn', 'mob-customers-sub', 'mob-customers-chevron']].forEach(function (arr) {
        var btn = document.getElementById(arr[0]);
        var sub = document.getElementById(arr[1]);
        var chv = document.getElementById(arr[2]);
        if (!btn || !sub) return;
        btn.addEventListener('click', function () {
          var open = sub.classList.toggle('mob-sub-open');
          if (chv) chv.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
        });
      });

      /* ---- Close mobile panel when a link inside it is clicked ---- */
      if (mobPanel) {
        mobPanel.querySelectorAll('a').forEach(function (a) {
          a.addEventListener('click', function () {
            mobPanel.classList.remove('mob-open');
            if (hamBtn) hamBtn.setAttribute('aria-expanded', 'false');
          });
        });
      }

    })();

    /* =============================================
       NAV SCROLL
       ============================================= */
    const nav = document.getElementById('main-nav');
    const spySections = document.querySelectorAll('section[id]');
    const spyNavLinks = document.querySelectorAll('.nav-link');
    const bttBtn = document.getElementById('back-to-top');
    const heroSection = document.getElementById('hero');
    const navActivePill = document.getElementById('nav-active-pill');

    function updateNavPill(activeLink) {
      if (activeLink) {
        navActivePill.style.left = `${activeLink.offsetLeft}px`;
        navActivePill.style.top = `${activeLink.offsetTop}px`;
        navActivePill.style.width = `${activeLink.offsetWidth}px`;
        navActivePill.style.height = `${activeLink.offsetHeight}px`;
        navActivePill.style.opacity = '1';
      } else {
        navActivePill.style.opacity = '0';
      }
    }

    function handleScrollAndPill() {
      const scrollY = window.scrollY;
      nav.classList.toggle('scrolled', scrollY > 36);

      // Back to Top visibility — show after passing Hero section
      const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 600;
      bttBtn.classList.toggle('btt-visible', scrollY > heroBottom - 100);

      let current = '';
      spySections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      let activeLink = null;
      spyNavLinks.forEach(link => {
        link.classList.remove('active');
        if (current && link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
          activeLink = link;
        }
      });

      updateNavPill(activeLink);
    }

    window.addEventListener('scroll', handleScrollAndPill, { passive: true });
    window.addEventListener('resize', handleScrollAndPill, { passive: true });

    // Run once on load to initialize state
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleScrollAndPill);
    } else {
      handleScrollAndPill();
    }

    // Back to Top click
    bttBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* =============================================
       SCROLL REVEAL
       ============================================= */
    const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -52px 0px' });
    reveals.forEach(el => revealObs.observe(el));

    /* =============================================
       COUNTER ANIMATION
       ============================================= */
    const counters = document.querySelectorAll('[data-count]');
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => counterObs.observe(el));

    function animateCount(el) {
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimal = el.dataset.decimal || '';
      const duration = 2000;
      const start = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const val = Math.floor(ease * target);
        el.textContent = val.toLocaleString() + decimal + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString() + decimal + suffix;
      }
      requestAnimationFrame(tick);
    }
    /* =============================================
       SMOOTH SCROLL
       ============================================= */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        try {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const offset = 100;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        } catch (err) {
          console.warn('Invalid scroll target:', href);
        }
      });
    });

    /* =============================================
       MAGNETIC BUTTONS (subtle)
       ============================================= */
    document.querySelectorAll('.btn-primary, .nav-trial').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.18;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });

    /* =============================================
       CHATBOT WIDGET
       ============================================= */

    // Chatbot knowledge base
    const KB = {
      greet: [
        'Hi there! 👋 I\'m the MC360 AI assistant. I can answer questions about our platform, the 4 modules, pricing, and how to get started. What would you like to know?',
        'Hello! Welcome to MC360. I\'m here to help you learn about our maritime intelligence platform. Ask me anything!',
      ],
      mc360: `MC360 (MaritimeConnect360) is an All in One enterprise operating system designed exclusively for maritime companies.\n\nWe unify your entire operation into one intelligent platform:\n\n⛽ Bunker Quantity Survey\n🔍 Vessel Inspection\n🚢 Vessel Condition Survey\n🛡️ Global Sanctions\n\nInstead of juggling 7+ disconnected tools, your fleet managers, operations directors and compliance teams work from one single source of truth — powered by AI throughout.`,
      bqs: `⛽ **Bunker Quantity Survey (BQS)**\n\nEliminate costly bunker disputes with AI-validated quantity measurements.\n\n• Real-time calculations during delivery\n• Automatic survey report generation\n• Full audit trail from delivery to sign-off\n• AI anomaly detection — flags discrepancies before sign-off\n• Dispute prevention with locked timestamps\n\nAI Example: MC360 detected a 1.8% discrepancy in a recent delivery and flagged it before the captain signed — saving a potential $40,000 dispute.`,
      inspection: `🔍 **Vessel Inspection**\n\nReplace clipboard inspections with smart digital workflows.\n\n• Digital inspection checklists (customisable)\n• Inspector assignment and scheduling\n• Photo and video evidence capture\n• Instant compliance report generation\n• Predictive scheduling based on vessel age & route history\n\nAI Example: Predictive scheduling reduced missed inspections by 34% for one of our global fleet operators — entirely automated.`,
      vcs: `🚢 **Vessel Condition Survey (VCS)**\n\nComprehensive assessments with structured data capture and corrective action workflows.\n\n• Condition scoring with industry benchmarking\n• Deficiency tracking with severity ratings\n• Corrective Action Request (CAR) workflows\n• Continuous condition record per vessel\n• AI outlier detection vs fleet averages\n\nAI Example: AI flagged a hull condition score 18% below fleet average — the issue was caught 3 months before it would have triggered a port-state control detention.`,
      sanctions: `🛡️ **Global Sanctions**\n\nReal-time counterparty screening against 50+ global sanctions lists.\n\n• OFAC, EU, UN, OFSI and 47 more lists\n• Automated counterparty risk scoring\n• Instant alerts when a match is detected\n• Full compliance documentation & audit trail\n• Continuous monitoring — not just point-in-time checks\n\nAI Example: A European operator avoided a $2M OFAC fine when MC360 flagged a cargo owner match within 4 seconds of onboarding — before any contract was signed.`,
      modules: `MC360 has 4 core modules that work individually or together:\n\n1. ⛽ **Bunker Quantity Survey** — AI-validated measurements, real-time calculations, dispute prevention\n2. 🔍 **Vessel Inspection** — Digital workflows, photo evidence, instant reports\n3. 🚢 **Vessel Condition Survey** — Condition scoring, deficiency tracking, CAR workflows\n4. 🛡️ **Global Sanctions** — 50+ lists, real-time screening, automated alerts\n\nWant details on any specific module? Just ask!`,
      pricing: `MC360 has 3 pricing tiers:\n\n**Starter — $299/vessel/month**\n• Up to 5 vessels\n• Vessel Inspection module\n• Standard reporting\n• 5 user seats\n\n**Professional — $799/vessel/month** ⭐ Most Popular\n• Up to 25 vessels\n• All 4 modules\n• AI Chat + Recommendations\n• Advanced analytics\n• 25 user seats\n\n**Enterprise — Custom pricing**\n• Unlimited vessels\n• All modules + future modules\n• Company Knowledge AI\n• Custom integrations & API\n• Dedicated account team + SLA\n\nAll plans include a 30-day free trial. No credit card required.`,
      trial: `Starting your free trial is simple:\n\n1. Click **Start Free Trial** on this page\n2. Create your account (takes 2 minutes)\n3. Add your vessels and team members\n4. Your fleet is live in under 24 hours\n\n✅ 30-day free trial\n✅ No credit card required\n✅ Full platform access\n✅ Cancel anytime\n\nNeed a guided walkthrough first? Click **Book Demo** and our team will walk you through the platform live.`,
      ai: `MC360 has AI built into every module — not bolted on afterwards:\n\n💬 **AI Chat** — Ask questions about your entire fleet in plain language. "Which vessels need inspection this week?" gets you an instant, data-backed answer.\n\n⚡ **AI Recommendations** — Proactive risk and anomaly surfacing across all modules. You\'re alerted before problems escalate.\n\n📚 **Ask Company Knowledge** — Query against your own company procedures, policies and historical data — not just public information.\n\n🔮 **Coming soon:** Predictive Inspections, Live Vessel Intelligence, and Autonomous Fleet Operations.`,
      compliance: `MC360 is built for the most regulated industry on earth:\n\n🛡️ **Standards & Certifications:**\n• IMO 2020 — Sulphur compliance tracking\n• MARPOL — Pollution prevention reporting\n• SOLAS — Safety of Life at Sea workflows\n• ISM Code — Safety management compliance\n• SOC 2 Type II — Independently audited security\n• ISO 9001 — Quality management certified\n• GDPR — Full data residency controls\n• OFAC — Sanctions compliance built-in\n\n🔒 **Security:**\n• Role-based access control\n• Complete audit trails with timestamps\n• AES-256 encryption at rest & in transit\n• 99.7% platform uptime`,
      contact: `Here\'s how to reach us:\n\n📅 **Book a Demo** — Click the "Book Demo" button in the navigation. Our team will give you a live, personalised walkthrough of the platform.\n\n🚀 **Start Free Trial** — Get full access to MC360 for 14 days, free. No credit card needed.\n\n📧 **Sales enquiries** — Reach our team via the Contact page in the footer.\n\nWe typically respond within 1 business day.`,
      fallback: [
        "That\'s a great question! I\'m best at answering questions about MC360\'s platform, our 4 modules, pricing, and how to get started. Could you rephrase or try one of the suggestions below?",
        "I may not have a specific answer for that, but I can tell you about our platform, modules (BQS, Inspection, VCS, Sanctions), pricing, or how to start a free trial. Which would help?",
        "Let me point you in the right direction. I can explain our modules, pricing, AI capabilities, compliance standards, or how to get started. What\'s most useful?",
      ],
    };

    function getResponse(input) {
      const q = input.toLowerCase();
      if (/hello|hi |hey|greet|start|begin/.test(q)) return KB.greet[Math.floor(Math.random() * KB.greet.length)];
      if (/what is mc360|about mc360|what does mc360|tell me about mc|mc360 do|overview|explain mc|what.*platform/.test(q)) return KB.mc360;
      if (/bunker|bqs|fuel|vlsfo|mgo|hfo|lng|delivery|quantity survey/.test(q)) return KB.bqs;
      if (/inspection|inspect|checklist|inspector|photograph|photo|evidence|psc|port state/.test(q)) return KB.inspection;
      if (/condition|vcs|vessel condition|deficien|corrective|car|survey|hull/.test(q)) return KB.vcs;
      if (/sanction|ofac|ofsi|eu list|un list|counterparty|screening|comply|compliance risk|match/.test(q)) return KB.sanctions;
      if (/module|feature|what can|capabilities|all module|four|4 module/.test(q)) return KB.modules;
      if (/pric|cost|plan|tier|starter|professional|enterprise|how much|subscription|per vessel/.test(q)) return KB.pricing;
      if (/trial|free|start|get started|sign up|register|onboard|setup/.test(q)) return KB.trial;
      if (/ai |artificial|intelligence|chat|recommend|knowledge|predict|smart|automat/.test(q)) return KB.ai;
      if (/security|gdpr|soc2|soc 2|iso|imo|marpol|solas|encrypt|audit|certif|complian/.test(q)) return KB.compliance;
      if (/contact|demo|reach|speak|call|email|team|sales/.test(q)) return KB.contact;
      return KB.fallback[Math.floor(Math.random() * KB.fallback.length)];
    }

    /* =============================================
       CHATBOT INIT
       ============================================= */
    function initChatbot() {
      const widget = document.getElementById('cb-widget');
      const panel = document.getElementById('cb-panel');
      const fab = document.getElementById('cb-fab');
      const closeBtn = document.getElementById('cb-close');
      const msgs = document.getElementById('cb-msgs');
      const input = document.getElementById('cb-input');
      const sendBtn = document.getElementById('cb-send');
      const chips = document.getElementById('cb-chips');

      if (!fab || !panel) return;

      let open = false;

      function toggleChat(forceOpen, isExplicitClick) {
        open = forceOpen !== undefined ? forceOpen : !open;
        if (open) {
          panel.style.display = 'flex';
          requestAnimationFrame(() => { panel.classList.add('cb-open'); });
          if (isExplicitClick) {
            input.focus();
          }
        } else {
          panel.classList.remove('cb-open');
          setTimeout(() => { if (!open) panel.style.display = 'none'; }, 320);
        }
      }

      fab.addEventListener('click', () => toggleChat(undefined, true));
      closeBtn.addEventListener('click', () => toggleChat(false));

      function addMsg(text, who) {
        const div = document.createElement('div');
        div.className = 'cb-msg cb-' + who;
        const bubble = document.createElement('div');
        bubble.className = 'cb-bubble';
        // Convert **bold** and \n
        bubble.innerHTML = text
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br>');
        div.appendChild(bubble);
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
        return div;
      }

      function showTyping() {
        const div = document.createElement('div');
        div.className = 'cb-msg cb-ai cb-typing-row';
        div.innerHTML = '<div class="cb-bubble cb-typing"><span></span><span></span><span></span></div>';
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
        return div;
      }

      function updateChips(arr) {
        chips.innerHTML = '';
        arr.forEach(label => {
          const btn = document.createElement('button');
          btn.className = 'cb-chip';
          btn.textContent = label;
          btn.addEventListener('click', () => send(label));
          chips.appendChild(btn);
        });
      }

      function send(text) {
        if (!text.trim()) return;
        addMsg(text, 'user');
        input.value = '';
        chips.innerHTML = '';
        const typingRow = showTyping();
        const delay = 700 + Math.random() * 600;
        setTimeout(() => {
          typingRow.remove();
          const reply = getResponse(text);
          addMsg(reply, 'ai');
          // Contextual follow-up chips
          const q = text.toLowerCase();
          let next = [];
          if (/module|overview|mc360|platform|about/.test(q)) next = ['BQS Module ⛽', 'Vessel Inspection 🔍', 'Condition Survey 🚢', 'Global Sanctions 🛡️'];
          else if (/bunker|bqs/.test(q)) next = ['Vessel Inspection 🔍', 'Pricing plans', 'Start free trial'];
          else if (/inspect/.test(q)) next = ['Condition Survey 🚢', 'Global Sanctions 🛡️', 'Pricing plans'];
          else if (/condition|vcs/.test(q)) next = ['Global Sanctions 🛡️', 'Pricing plans', 'Start free trial'];
          else if (/sanction|ofac/.test(q)) next = ['Pricing plans', 'Start free trial', 'Book a demo'];
          else if (/pric|cost/.test(q)) next = ['Start free trial', 'Book a demo', 'All 4 modules'];
          else if (/trial|start|free/.test(q)) next = ['Book a demo', 'All 4 modules', 'Pricing plans'];
          else if (/ai|intel/.test(q)) next = ['All 4 modules', 'Pricing plans', 'Start free trial'];
          else if (/security|compli/.test(q)) next = ['Pricing plans', 'Start free trial', 'Book a demo'];
          else next = ['What is MC360?', 'Show all modules', 'Pricing plans', 'Start free trial'];
          updateChips(next);
        }, delay);
      }

      sendBtn.addEventListener('click', () => send(input.value));
      input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.value); } });



      // Open chatbot when clicking the static preview card in the Hero
      const heroCard = document.getElementById('hf-ai-card');
      if (heroCard) {
        heroCard.addEventListener('click', () => toggleChat(true, true));
      }

      // Chatbot starts closed by default. Only opens when clicking the FAB or Hero card.

      // Boot greeting
      setTimeout(() => {
        addMsg(KB.greet[0], 'ai');
        updateChips(['What is MC360?', 'Show all modules', 'Pricing plans', 'Start free trial']);
      }, 600);
    }

    // Ensure the DOM is fully loaded before executing chatbot init
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
      initChatbot();
    }

    /* =============================================
       TEXT REVEAL ANIMATIONS
       ============================================= */
    function initTextReveal() {
      const targets = document.querySelectorAll('.hero-h1, .display-md, .comp-h2, .cta-h2');

      targets.forEach(target => {
        const html = target.innerHTML;
        const tokens = html.split(/(<[^>]+>|\s+)/);
        let result = '';
        let wordIndex = 0;

        tokens.forEach(token => {
          if (token.trim() === '') {
            result += token;
          } else if (token.startsWith('<')) {
            result += token;
          } else {
            // No stagger — all words fire together for instant feel
            result += `<span class="reveal-word-wrapper"><span class="reveal-word" style="transition-delay:${wordIndex * 0.008}s">${token}</span></span>`;
            wordIndex++;
          }
        });

        target.innerHTML = result;
      });

      // Fire immediately when even 1px enters the viewport, pre-trigger 120px ahead
      const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-text-active');
            textObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px 120px 0px' });

      targets.forEach(target => {
        // If element is already visible on load, activate instantly
        const rect = target.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          target.classList.add('reveal-text-active');
        } else {
          textObserver.observe(target);
        }
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTextReveal);
    } else {
      initTextReveal();
    }

    /* =============================================
       INTERACTIVE PROBLEM & SOLUTION CARDS
       ============================================= */
    function initProblemSolutionInteractions() {
      const probCards = document.querySelectorAll('.prob-card');
      const fill = document.getElementById('silo-progress-fill');
      const countStatus = document.querySelector('.silo-count-status');
      const autoBtn = document.getElementById('silo-auto-btn');
      const resetBtn = document.getElementById('silo-reset-btn');
      const probArrow = document.querySelector('.prob-arrow');
      const solutionCard = document.querySelector('.prob-solution');

      const solTitle = document.querySelector('.prob-sol-title');
      const solSub = document.querySelector('.prob-sol-sub');

      if (!solTitle || !solSub) return;

      const originalTitle = solTitle.innerHTML;
      const originalSub = solSub.innerHTML;

      const totalSilos = probCards.length;

      // Track state of each silo
      let connectedStates = Array(totalSilos).fill(false);

      // Mouse move spotlight effect on Solution Card
      if (solutionCard) {
        // Initial middle coordinates so it starts centered nicely
        solutionCard.style.setProperty('--mouse-x', '50%');
        solutionCard.style.setProperty('--mouse-y', '50%');

        solutionCard.addEventListener('mousemove', (e) => {
          const rect = solutionCard.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          solutionCard.style.setProperty('--mouse-x', `${x}px`);
          solutionCard.style.setProperty('--mouse-y', `${y}px`);
        });
      }

      function updateWorkspaceState() {
        const connectedCount = connectedStates.filter(Boolean).length;
        const percent = Math.round((connectedCount / totalSilos) * 100);

        // Update progress bar
        if (fill) {
          fill.style.width = `${percent}%`;
        }

        // Update status text
        if (countStatus) {
          if (connectedCount === totalSilos) {
            countStatus.textContent = "All Silos Integrated";
            countStatus.classList.add('all-clean');
          } else {
            const remaining = totalSilos - connectedCount;
            countStatus.textContent = `${remaining} Disconnected Silo${remaining > 1 ? 's' : ''}`;
            countStatus.classList.remove('all-clean');
          }
        }

        // Toggle action buttons
        if (autoBtn) {
          autoBtn.style.display = connectedCount === totalSilos ? 'none' : 'inline-block';
        }
        if (resetBtn) {
          resetBtn.style.display = connectedCount > 0 ? 'inline-block' : 'none';
        }

        // Arrow state
        if (probArrow) {
          if (connectedCount === totalSilos) {
            probArrow.classList.add('all-clean');
            probArrow.textContent = '✓';
          } else {
            probArrow.classList.remove('all-clean');
            probArrow.textContent = '↓';
          }
        }

        // Solution card styling and text updates
        if (solutionCard) {
          if (connectedCount === totalSilos) {
            solutionCard.classList.add('all-connected');

            // Fade transition for text
            solTitle.style.opacity = '0';
            solSub.style.opacity = '0';
            setTimeout(() => {
              solTitle.innerHTML = 'MC360 Unified. 100% Connected.';
              solSub.innerHTML = 'All 6 operations are now synchronized into a single source of truth.';
              solTitle.style.opacity = '1';
              solSub.style.opacity = '1';
            }, 150);
          } else {
            const wasAllConnected = solutionCard.classList.contains('all-connected');
            solutionCard.classList.remove('all-connected');

            if (wasAllConnected) {
              solTitle.style.opacity = '0';
              solSub.style.opacity = '0';
              setTimeout(() => {
                solTitle.innerHTML = originalTitle;
                solSub.innerHTML = originalSub;
                solTitle.style.opacity = '1';
                solSub.style.opacity = '1';
              }, 150);
            }
          }
        }
      }

      probCards.forEach((card, idx) => {
        card.addEventListener('click', () => {
          connectedStates[idx] = !connectedStates[idx];

          if (connectedStates[idx]) {
            card.classList.add('is-connected');
            card.querySelector('.silo-status').textContent = 'Integrated';
          } else {
            card.classList.remove('is-connected');
            card.querySelector('.silo-status').textContent = 'Siloed';
          }

          updateWorkspaceState();
        });
      });

      if (autoBtn) {
        autoBtn.addEventListener('click', () => {
          connectedStates = Array(totalSilos).fill(true);
          probCards.forEach(card => {
            card.classList.add('is-connected');
            card.querySelector('.silo-status').textContent = 'Integrated';
          });
          updateWorkspaceState();
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          connectedStates = Array(totalSilos).fill(false);
          probCards.forEach(card => {
            card.classList.remove('is-connected');
            card.querySelector('.silo-status').textContent = 'Siloed';
          });
          updateWorkspaceState();
        });
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initProblemSolutionInteractions);
    } else {
      initProblemSolutionInteractions();
    }

    /* =============================================
       FAQ ACCORDION
       ============================================= */
    function initFAQAccordion() {
      document.querySelectorAll('.faq-q').forEach(q => {
        q.addEventListener('click', () => {
          const faqId = q.dataset.faq;
          const item = faqId ? document.getElementById(faqId) : q.closest('.faq-item');
          if (!item) return;
          const isOpen = item.classList.contains('open');
          document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('open');
            const b = i.querySelector('.faq-q');
            if (b) b.setAttribute('aria-expanded', 'false');
          });
          if (!isOpen) {
            item.classList.add('open');
            q.setAttribute('aria-expanded', 'true');
          }
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initFAQAccordion);
    } else {
      initFAQAccordion();
    }

/* ==========================================================================
    2. PRODUCT PAGE HANDLERS
    ========================================================================== */
/* =============================================
       SCROLL REVEAL
       ============================================= */
    (function () {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
      }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    })();

    /* =============================================
       HERO VIDEO TOGGLE
       ============================================= */
    (function () {
      const vid = document.getElementById('hero-vid');
      const btn = document.getElementById('hero-vid-btn');
      const icon = document.getElementById('hero-vid-icon');
      if (!vid || !btn) return;
      const pausePath = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
      const playPath = '<path d="M8 5v14l11-7z"/>';
      function syncIcon() {
        icon.innerHTML = vid.paused ? playPath : pausePath;
        btn.setAttribute('aria-label', vid.paused ? 'Play video' : 'Pause video');
      }
      btn.addEventListener('click', () => { vid.paused ? vid.play() : vid.pause(); });
      vid.addEventListener('play', syncIcon);
      vid.addEventListener('pause', syncIcon);
    })();

    /* =============================================
       PRODUCT TOUR TABS
       ============================================= */
    (function () {
      const tabs = document.querySelectorAll('.tour-tab');
      const panels = document.querySelectorAll('.tour-panel');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.panel;
          tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
          panels.forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          const panel = document.querySelector(`.tour-panel[data-panel="${target}"]`);
          if (panel) {
            panel.style.display = '';
            // rAF to allow display to apply before animation class
            requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add('active')));
          }
        });
      });
    })();

    /* =============================================
       PRODUCT VIDEO PLAY/PAUSE
       ============================================= */
    (function () {
      const video = document.getElementById('pvideo-main');
      const playBtn = document.getElementById('pvideo-play-btn');
      if (!video || !playBtn) return;
      playBtn.addEventListener('click', () => {
        if (video.paused) { video.play(); playBtn.classList.add('hidden'); }
        else { video.pause(); playBtn.classList.remove('hidden'); }
      });
      video.addEventListener('click', () => {
        if (video.paused) { video.play(); playBtn.classList.add('hidden'); }
        else { video.pause(); playBtn.classList.remove('hidden'); }
      });
      video.addEventListener('ended', () => { playBtn.classList.remove('hidden'); });
    })();

    /* =============================================
       IMAGE LIGHTBOX
       ============================================= */
    (function () {
      const lb = document.getElementById('lightbox');
      const lbImg = document.getElementById('lightbox-img');
      const lbClose = document.getElementById('lightbox-close');
      document.querySelectorAll('.img-lightbox-trigger').forEach(el => {
        el.addEventListener('click', () => {
          const src = el.dataset.lightbox;
          if (!src) return;
          lbImg.src = src;
          lb.classList.add('open');
          document.body.style.overflow = 'hidden';
        });
      });
      function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }
      if (lbClose) lbClose.addEventListener('click', closeLb);
      lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
    })();

    /* =============================================
       FAQ ACCORDION
       ============================================= */
    (function () {
      document.querySelectorAll('.faq-q').forEach(q => {
        q.addEventListener('click', () => {
          const faqId = q.dataset.faq;
          const item = document.getElementById(faqId);
          if (!item) return;
          const isOpen = item.classList.contains('open');
          document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
          if (!isOpen) item.classList.add('open');
        });
      });
    })();

    /* =============================================
       COUNTER ANIMATION
       ============================================= */
    (function () {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const decimal = el.dataset.decimal || '';
          const suffix = el.dataset.suffix || '';
          const duration = 1800;
          const startTime = performance.now();
          const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(ease * target);
            el.textContent = current.toLocaleString() + decimal + suffix;
            if (progress < 1) { requestAnimationFrame(step); }
            else { el.textContent = target.toLocaleString() + decimal + suffix; }
          };
          requestAnimationFrame(step);
          obs.unobserve(el);
        });
      }, { threshold: 0.5 });
      document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
    })();

    /* =============================================
       BACK TO TOP
       ============================================= */
    (function () {
      const btt = document.getElementById('back-to-top');
      if (!btt) return;
      window.addEventListener('scroll', () => { btt.classList.toggle('btt-visible', window.scrollY > 600); }, { passive: true });
      btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    })();

    /* =============================================
       FUTURE MODULE / IN DEVELOPMENT LINK HANDLER
       ============================================= */
    (function () {
      document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        const text = link.textContent.trim();

        // Handle placeholder '#' or explicit 'in-development' links
        if (href === '#' || link.dataset.inDevelopment === 'true') {
          e.preventDefault();
          const isSubfolder = window.location.pathname.includes('/products/');
          const targetUrl = (isSubfolder ? '../../future-module.html' : 'future-module.html') + 
            (text ? '?page=' + encodeURIComponent(text) : '');
          window.location.href = targetUrl;
        }
      });
    })();

