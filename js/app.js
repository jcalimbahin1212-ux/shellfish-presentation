// shellfish ubg - app logic
// by shrimpify

(function () {
  'use strict';

  // ─── state ───
  let currentFilter = 'all';
  let currentCategory = null;
  let searchQuery = '';
  let favorites = JSON.parse(localStorage.getItem('sf_favs') || '[]');
  let recentlyPlayed = JSON.parse(localStorage.getItem('sf_recent') || '[]');
  let sidebarOpen = false;
  let bossMode = false;

  // ─── stats ───
  let stats = JSON.parse(localStorage.getItem('sf_stats') || 'null') || {
    sessions: 0,
    uniquePlayed: [],
    gameCounts: {},
    catCounts: {},
    streak: 0,
    longestStreak: 0,
    lastPlayDate: null,
    daysPlayed: []
  };

  // ─── achievements ───
  let unlockedAchievements = JSON.parse(localStorage.getItem('sf_achievements') || '{}');

  const ACHIEVEMENTS = [
    { id: 'first_catch', name: 'first catch', desc: 'play your first game', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z" stroke="currentColor" stroke-width="1.2"/></svg>' },
    { id: 'ten_games', name: 'shrimp cocktail', desc: 'play 10 different games', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M8 4v4l3 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' },
    { id: 'fifty_games', name: 'deep sea diver', desc: 'play 50 different games', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M4 6l4-4 4 4M4 10l4 4 4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { id: 'hundred_games', name: 'ocean explorer', desc: 'play 100 different games', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M2.5 8h11M8 2.5a9 9 0 013 5.5 9 9 0 01-3 5.5M8 2.5a9 9 0 00-3 5.5 9 9 0 003 5.5" stroke="currentColor" stroke-width="1"/></svg>' },
    { id: 'five_favs', name: 'shell collector', desc: 'favorite 5 games', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3l1.5 3 3.5.5-2.5 2.5.6 3.5L8 10.8 4.9 12.5l.6-3.5L3 6.5 6.5 6z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>' },
    { id: 'twenty_favs', name: 'reef keeper', desc: 'favorite 20 games', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2C5 2 2 5 2 8c0 4 6 6 6 6s6-2 6-6c0-3-3-6-6-6z" stroke="currentColor" stroke-width="1.2"/></svg>' },
    { id: 'streak_3', name: 'current rider', desc: '3-day play streak', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l1 4 4-1-3 3 3 3-4-1-1 4-1-4-4 1 3-3-3-3 4 1z" stroke="currentColor" stroke-width="1"/></svg>' },
    { id: 'streak_7', name: 'tide master', desc: '7-day play streak', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 13c2-2 3-5 3-8M8 13c2-2 3-5 3-8M13 13c-1-2-2-4-2-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' },
    { id: 'streak_30', name: 'leviathan', desc: '30-day play streak', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8c1.5-3 4-5 6-5s4.5 2 6 5c-1.5 3-4 5-6 5s-4.5-2-6-5z" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.2"/></svg>' },
    { id: 'night_owl', name: 'night owl', desc: 'play a game after midnight', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 8a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5c-1 1-1.5 2.5-1.5 4A4.5 4.5 0 0010 11.5c1.5 0 2.5-.5 3.5-1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' },
    { id: 'early_bird', name: 'early bird', desc: 'play a game before 7am', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.2"/><path d="M8 3V1M8 15v-2M3 8H1M15 8h-2M4.5 4.5L3 3M13 13l-1.5-1.5M4.5 11.5L3 13M13 3l-1.5 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' },
    { id: 'all_cats', name: 'completionist', desc: 'play a game from every category', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
  ];

  const quotes = [
    "she shell on my fish till i ubg",
    "the crustacean experience",
    "shrimply the best games",
    "no cap, just shellfish",
    "unblocked and unhinged",
    "for educational purposes only",
    "the ocean called, it wants its games back",
    "catch these games, not feelings",
    "shrimp today, game tomorrow",
    "low-key the best ubg site",
    "you didn't get this from us",
    "games so clean they squeaky",
    "shrimpify does it again",
    "welcome to the reef",
    "the shell has spoken",
  ];

  // ─── dom refs ───
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const splash = $('#splash');
  const app = $('#app');
  const searchInput = $('#search');
  const searchCount = $('#search-count');
  const gameGrid = $('#game-grid');
  const noResults = $('#no-results');
  const homeView = $('#home-view');
  const playView = $('#play-view');
  const playTitle = $('#play-title');
  const gameFrame = $('#game-frame');
  const gameLoading = $('#game-loading');
  const categoryList = $('#category-list');
  const homeQuote = $('#home-quote');
  const gameCountEl = $('#game-count');
  const sidebar = $('#sidebar');
  const favBtn = $('#fav-btn');
  const toastContainer = $('#toast-container');
  const particlesCanvas = $('#particles');

  // ─── splash ───
  function initSplash() {
    if (sessionStorage.getItem('sf_splash')) {
      splash.classList.add('hidden');
      app.classList.remove('hidden');
      init();
      return;
    }
    setTimeout(() => {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.classList.add('hidden');
        app.classList.remove('hidden');
        sessionStorage.setItem('sf_splash', '1');
        init();
      }, 500);
    }, 1800);
  }

  // ─── init ───
  function init() {
    loadTheme();
    homeQuote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    gameCountEl.textContent = GAMES.length + ' games available';
    buildCategories();
    renderGrid();
    bindEvents();
    initParticles();
  }

  // ─── themes ───
  function loadTheme() {
    const saved = localStorage.getItem('sf_theme') || 'midnight';
    applyTheme(saved);
  }

  function applyTheme(name) {
    if (name === 'midnight') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', name);
    }
    localStorage.setItem('sf_theme', name);
    $$('.theme-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.theme === name);
    });
    // update particles on theme change
    if (particlesCtx) updateParticleColor();
  }

  // ─── particles ───
  let particlesCtx = null;
  let particles = [];
  let particleColor = 'rgba(255,255,255,0.3)';
  let particleAnimId = null;

  function updateParticleColor() {
    const style = getComputedStyle(document.documentElement);
    const c = style.getPropertyValue('--theme-particle').trim() || '#ffffff';
    particleColor = c;
  }

  function initParticles() {
    const canvas = particlesCanvas;
    particlesCtx = canvas.getContext('2d');
    resizeParticles();
    updateParticleColor();
    // create initial particles
    for (let i = 0; i < 40; i++) {
      particles.push(createParticle(canvas.width, canvas.height, true));
    }
    animateParticles();
    window.addEventListener('resize', resizeParticles);
  }

  function resizeParticles() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
  }

  function createParticle(w, h, randomY) {
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + 10,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.1,
    };
  }

  function animateParticles() {
    const ctx = particlesCtx;
    const w = particlesCanvas.width;
    const h = particlesCanvas.height;
    ctx.clearRect(0, 0, w, h);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < -10 || p.x < -10 || p.x > w + 10) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // spawn new particles occasionally
    if (particles.length < 40 && Math.random() < 0.1) {
      particles.push(createParticle(w, h, false));
    }

    particleAnimId = requestAnimationFrame(animateParticles);
  }

  // ─── categories ───
  function buildCategories() {
    const cats = [...new Set(GAMES.map(g => g.cat))].sort();
    categoryList.innerHTML = cats.map(c => {
      const meta = CATEGORY_META[c] || { tag: '---', label: c };
      const count = GAMES.filter(g => g.cat === c).length;
      return `<button class="sidebar-item" data-category="${c}">
        <span class="sidebar-dot"></span>${meta.label} <span style="margin-left:auto;font-size:0.65rem;color:var(--text-muted)">${count}</span>
      </button>`;
    }).join('');
  }

  // ─── render ───
  function getFilteredGames() {
    let list = [...GAMES];

    if (currentFilter === 'favorites') {
      list = list.filter(g => favorites.includes(g.name));
    } else if (currentFilter === 'recent') {
      list = list.filter(g => recentlyPlayed.includes(g.name));
      list.sort((a, b) => recentlyPlayed.indexOf(a.name) - recentlyPlayed.indexOf(b.name));
    } else if (currentFilter === 'popular') {
      list = list.filter(g => POPULAR_GAMES.includes(g.name));
    }

    if (currentCategory) {
      list = list.filter(g => g.cat === currentCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(g =>
        g.name.includes(q) ||
        g.cat.includes(q) ||
        g.desc.includes(q)
      );
    }

    return list;
  }

  function renderGrid() {
    const filtered = getFilteredGames();

    if (filtered.length === 0) {
      gameGrid.innerHTML = '';
      noResults.classList.remove('hidden');
      searchCount.textContent = '';
    } else {
      noResults.classList.add('hidden');
      searchCount.textContent = searchQuery ? filtered.length : '';

      gameGrid.innerHTML = filtered.map((g, i) => {
        const meta = CATEGORY_META[g.cat] || { tag: '---' };
        const isFav = favorites.includes(g.name);
        const delay = Math.min(i * 20, 600);
        return `<div class="game-card" data-game="${encodeURIComponent(g.name)}" tabindex="0" style="animation-delay:${delay}ms">
          <div class="card-fav${isFav ? ' active' : ''}"></div>
          <div class="card-tag">${meta.tag}</div>
          <div class="card-name">${g.name}</div>
          <div class="card-category">${g.cat}</div>
        </div>`;
      }).join('');
    }
  }

  // ─── stats tracking ───
  function trackGamePlay(name) {
    const game = GAMES.find(g => g.name === name);
    if (!game) return;

    stats.sessions++;
    if (!stats.uniquePlayed.includes(name)) {
      stats.uniquePlayed.push(name);
    }
    stats.gameCounts[name] = (stats.gameCounts[name] || 0) + 1;
    stats.catCounts[game.cat] = (stats.catCounts[game.cat] || 0) + 1;

    // streak tracking
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastPlayDate !== today) {
      if (stats.lastPlayDate) {
        const last = new Date(stats.lastPlayDate);
        const now = new Date(today);
        const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          stats.streak++;
        } else if (diff > 1) {
          stats.streak = 1;
        }
      } else {
        stats.streak = 1;
      }
      stats.lastPlayDate = today;
      if (!stats.daysPlayed.includes(today)) {
        stats.daysPlayed.push(today);
      }
    }

    if (stats.streak > stats.longestStreak) {
      stats.longestStreak = stats.streak;
    }

    localStorage.setItem('sf_stats', JSON.stringify(stats));
  }

  // ─── achievements checking ───
  function checkAchievements() {
    const toUnlock = [];
    const hour = new Date().getHours();
    const allCats = [...new Set(GAMES.map(g => g.cat))];
    const playedCats = Object.keys(stats.catCounts);

    const checks = {
      first_catch: () => stats.uniquePlayed.length >= 1,
      ten_games: () => stats.uniquePlayed.length >= 10,
      fifty_games: () => stats.uniquePlayed.length >= 50,
      hundred_games: () => stats.uniquePlayed.length >= 100,
      five_favs: () => favorites.length >= 5,
      twenty_favs: () => favorites.length >= 20,
      streak_3: () => stats.streak >= 3,
      streak_7: () => stats.streak >= 7,
      streak_30: () => stats.streak >= 30,
      night_owl: () => hour >= 0 && hour < 5,
      early_bird: () => hour >= 5 && hour < 7,
      all_cats: () => allCats.every(c => playedCats.includes(c)),
    };

    for (const [id, check] of Object.entries(checks)) {
      if (!unlockedAchievements[id] && check()) {
        unlockedAchievements[id] = Date.now();
        toUnlock.push(ACHIEVEMENTS.find(a => a.id === id));
      }
    }

    if (toUnlock.length > 0) {
      localStorage.setItem('sf_achievements', JSON.stringify(unlockedAchievements));
      toUnlock.forEach((a, i) => {
        setTimeout(() => showToast(a), i * 500);
      });
    }
  }

  // ─── toasts ───
  function showToast(achievement) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${achievement.icon}</span>
      <span class="toast-text">
        <span class="toast-label">achievement unlocked</span>
        ${achievement.name}
      </span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3500);
  }

  // ─── stats modal ───
  function openStatsModal() {
    const modal = $('#stats-modal');
    const content = $('#stats-content');

    // find most played
    let mostPlayed = '-';
    let mostCount = 0;
    for (const [name, count] of Object.entries(stats.gameCounts)) {
      if (count > mostCount) {
        mostPlayed = name;
        mostCount = count;
      }
    }

    // top categories
    const topCats = Object.entries(stats.catCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    const maxCatCount = topCats.length > 0 ? topCats[0][1] : 1;

    content.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.sessions}</div>
          <div class="stat-label">total sessions</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.uniquePlayed.length}</div>
          <div class="stat-label">unique games</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.streak}</div>
          <div class="stat-label">current streak</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.longestStreak}</div>
          <div class="stat-label">longest streak</div>
        </div>
      </div>
      <div class="stat-card" style="margin-bottom:20px">
        <div class="stat-label" style="margin-bottom:2px">most played</div>
        <div class="stat-value" style="font-size:1.1rem">${mostPlayed}</div>
        <div class="stat-label">${mostCount} sessions</div>
      </div>
      ${topCats.length > 0 ? `
        <div class="stats-section-title">top categories</div>
        ${topCats.map(([cat, count]) => `
          <div class="stat-bar-group">
            <div class="stat-bar-label">
              <span>${cat}</span>
              <span>${count}</span>
            </div>
            <div class="stat-bar-track">
              <div class="stat-bar-fill" style="width:${(count / maxCatCount * 100).toFixed(0)}%"></div>
            </div>
          </div>
        `).join('')}
      ` : '<div class="stat-label">play some games to see stats here</div>'}
    `;

    modal.classList.add('active');
  }

  // ─── achievements modal ───
  function openAchievementsModal() {
    const modal = $('#achievements-modal');
    const content = $('#achievements-content');
    const unlocked = Object.keys(unlockedAchievements).length;

    content.innerHTML = `
      <div class="stat-label" style="margin-bottom:16px">${unlocked} / ${ACHIEVEMENTS.length} unlocked</div>
      <div class="achievement-grid">
        ${ACHIEVEMENTS.map(a => {
          const isUnlocked = !!unlockedAchievements[a.id];
          return `<div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-info">
              <div class="achievement-name">${a.name}</div>
              <div class="achievement-desc">${a.desc}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    `;

    modal.classList.add('active');
  }

  // ─── boss mode ───
  function toggleBossMode() {
    bossMode = !bossMode;
    document.body.classList.toggle('boss-mode', bossMode);
  }

  // ─── play game ───
  function playGame(name) {
    const game = GAMES.find(g => g.name === name);
    if (!game) return;

    // update recent
    recentlyPlayed = recentlyPlayed.filter(n => n !== name);
    recentlyPlayed.unshift(name);
    if (recentlyPlayed.length > 50) recentlyPlayed = recentlyPlayed.slice(0, 50);
    localStorage.setItem('sf_recent', JSON.stringify(recentlyPlayed));

    // track stats
    trackGamePlay(name);

    // show play view with transition
    homeView.classList.add('view-exit');
    setTimeout(() => {
      homeView.classList.add('hidden');
      homeView.classList.remove('view-exit');
      playView.classList.remove('hidden');
      playView.classList.add('view-enter');
      setTimeout(() => playView.classList.remove('view-enter'), 300);
    }, 200);

    playTitle.textContent = game.name;

    // update fav button
    favBtn.className = favorites.includes(name) ? 'icon-btn active' : 'icon-btn';
    favBtn.dataset.game = name;

    // load iframe
    gameLoading.classList.remove('loaded');
    gameFrame.src = '';
    requestAnimationFrame(() => {
      gameFrame.src = game.url;
    });

    gameFrame.onload = () => {
      gameLoading.classList.add('loaded');
    };

    // timeout fallback for loading
    setTimeout(() => {
      gameLoading.classList.add('loaded');
    }, 8000);

    // check achievements after play
    setTimeout(() => checkAchievements(), 100);
  }

  function closeGame() {
    playView.classList.add('hidden');
    homeView.classList.remove('hidden');
    gameFrame.src = '';
    renderGrid();
  }

  // ─── favorites ───
  function toggleFav(name) {
    if (favorites.includes(name)) {
      favorites = favorites.filter(n => n !== name);
    } else {
      favorites.push(name);
    }
    localStorage.setItem('sf_favs', JSON.stringify(favorites));
    // check achievements after fav change
    checkAchievements();
  }

  // ─── sidebar ───
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    sidebar.classList.toggle('collapsed', !sidebarOpen);
    document.body.classList.toggle('sidebar-open', sidebarOpen);
  }

  function setFilter(filter) {
    currentFilter = filter;
    currentCategory = null;
    $$('.sidebar-item').forEach(el => el.classList.remove('active'));
    const btn = $(`.sidebar-item[data-filter="${filter}"]`);
    if (btn) btn.classList.add('active');
    renderGrid();
  }

  function setCategory(cat) {
    currentCategory = cat;
    currentFilter = 'all';
    $$('.sidebar-item').forEach(el => el.classList.remove('active'));
    const btn = $(`.sidebar-item[data-category="${cat}"]`);
    if (btn) btn.classList.add('active');
    renderGrid();
  }

  // ─── events ───
  function bindEvents() {
    // sidebar toggle
    $('#sidebar-toggle').addEventListener('click', toggleSidebar);

    // search
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.toLowerCase().trim();
      renderGrid();
    });

    // keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // boss mode toggle: backtick
      if (e.key === '`' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        toggleBossMode();
        return;
      }
      // don't process other shortcuts in boss mode
      if (bossMode) return;

      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === 'Escape') {
        // close modals first
        const activeModal = $('.modal-overlay.active');
        if (activeModal) {
          activeModal.classList.remove('active');
          return;
        }
        if (!playView.classList.contains('hidden')) {
          closeGame();
        } else if (searchInput === document.activeElement) {
          searchInput.blur();
          searchInput.value = '';
          searchQuery = '';
          renderGrid();
        } else if (sidebarOpen) {
          toggleSidebar();
        }
      }
    });

    // game cards (delegated)
    gameGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.game-card');
      if (!card) return;
      const name = decodeURIComponent(card.dataset.game);
      playGame(name);
    });

    gameGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const card = e.target.closest('.game-card');
        if (!card) return;
        const name = decodeURIComponent(card.dataset.game);
        playGame(name);
      }
    });

    // card glow effect
    gameGrid.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.game-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    });

    // back button
    $('#back-btn').addEventListener('click', closeGame);

    // fav button
    favBtn.addEventListener('click', () => {
      const name = favBtn.dataset.game;
      if (!name) return;
      toggleFav(name);
      favBtn.className = favorites.includes(name) ? 'icon-btn active' : 'icon-btn';
    });

    // random game
    $('#random-btn').addEventListener('click', () => {
      const game = GAMES[Math.floor(Math.random() * GAMES.length)];
      playGame(game.name);
    });

    // fullscreen
    $('#fullscreen-btn').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // play fullscreen (game only)
    $('#play-fullscreen-btn').addEventListener('click', () => {
      const wrapper = $('#game-frame-wrapper');
      if (!document.fullscreenElement) {
        wrapper.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // stats button
    $('#stats-btn').addEventListener('click', openStatsModal);

    // achievements button in sidebar
    $('#achievements-btn').addEventListener('click', () => {
      openAchievementsModal();
    });

    // theme picker
    $('#theme-picker').addEventListener('click', (e) => {
      const swatch = e.target.closest('.theme-swatch');
      if (!swatch) return;
      applyTheme(swatch.dataset.theme);
    });

    // modal close buttons
    $$('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.close;
        if (modalId) $('#' + modalId).classList.remove('active');
      });
    });

    // close modal on overlay click
    $$('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    });

    // sidebar filter buttons
    sidebar.addEventListener('click', (e) => {
      const filterBtn = e.target.closest('[data-filter]');
      if (filterBtn) {
        setFilter(filterBtn.dataset.filter);
        return;
      }
      const catBtn = e.target.closest('[data-category]');
      if (catBtn) {
        setCategory(catBtn.dataset.category);
      }
    });

    // click outside sidebar to close on mobile
    document.addEventListener('click', (e) => {
      if (sidebarOpen && window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && e.target.id !== 'sidebar-toggle') {
          toggleSidebar();
        }
      }
    });
  }

  // ─── start ───
  initSplash();
})();
