document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     1. MENU MOBILE
     ========================================================= */
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================================================
     2. FILTRO ANTEPRIMA PROFESSIONISTI (INDEX.HTML)
     ========================================================= */
  const teamGrid = document.getElementById('teamGrid');
  if (teamGrid) {
    const homeFilterBtns = document.querySelectorAll('.preview-header .filter-btn');
    const homeCards = teamGrid.querySelectorAll('.pro-card');

    homeFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        homeFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedCategory = btn.dataset.filter;
        homeCards.forEach((card) => {
          const match =
            selectedCategory === 'all' || card.dataset.category === selectedCategory;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* =========================================================
     3. RICERCA E FILTRI AREA (PROFESSIONISTI.HTML)
     ========================================================= */
  const directoryGrid = document.getElementById('professionalsDirectory');
  if (directoryGrid) {
    const searchInput = document.getElementById('proSearch');
    const searchClear = document.getElementById('proSearchClear');
    const areaBtns = document.querySelectorAll('.pro-filter-btn');
    const resultsCounter = document.getElementById('resultsCounter');
    const noResultsMsg = document.getElementById('noResultsMsg');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const proCards = Array.from(directoryGrid.querySelectorAll('.pro-card'));

    let currentArea = 'all';
    let currentQuery = '';

    const normalizeText = (str) =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[’']/g, "'");

    const filterDirectory = () => {
      const normalizedQuery = normalizeText(currentQuery.trim());
      let visibleCount = 0;

      proCards.forEach((card) => {
        const cardAreas = (card.dataset.areas || '').split(/\s+/);
        const areaMatch = currentArea === 'all' || cardAreas.includes(currentArea);

        const cardText = normalizeText(card.textContent || '');
        const queryMatch = !normalizedQuery || cardText.includes(normalizedQuery);

        if (areaMatch && queryMatch) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (resultsCounter) {
        resultsCounter.textContent =
          visibleCount === 1
            ? 'Visualizzato 1 professionista'
            : `Visualizzati ${visibleCount} professionisti`;
      }

      if (noResultsMsg) {
        noResultsMsg.hidden = visibleCount > 0;
      }

      if (searchClear) {
        searchClear.classList.toggle('visible', currentQuery.trim().length > 0);
      }
    };

    areaBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        areaBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentArea = btn.dataset.area || 'all';
        filterDirectory();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentQuery = e.target.value;
        filterDirectory();
      });
    }

    if (searchClear && searchInput) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        currentQuery = '';
        filterDirectory();
        searchInput.focus();
      });
    }

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        currentQuery = '';
        currentArea = 'all';
        areaBtns.forEach((b) => {
          b.classList.toggle('active', b.dataset.area === 'all');
        });
        filterDirectory();
      });
    }
  }

  /* =========================================================
     4. GESTIONE INVIO FORM (CONTATTI E NEWSLETTER)
     ========================================================= */
  const forms = document.querySelectorAll('.therapeia-form');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let feedback = form.querySelector('.form-feedback');
      if (!feedback) {
        feedback = document.createElement('p');
        feedback.className = 'form-feedback';
        feedback.style.marginTop = '14px';
        feedback.style.padding = '12px 16px';
        feedback.style.borderRadius = '8px';
        feedback.style.backgroundColor = 'var(--primary-light)';
        feedback.style.color = 'var(--primary-dark)';
        feedback.style.fontWeight = '600';
        feedback.style.fontSize = '0.9rem';
        form.appendChild(feedback);
      }

      feedback.textContent =
        'Grazie! La tua richiesta è stata inviata correttamente. Ti risponderemo al più presto.';
      form.reset();
    });
  });
});