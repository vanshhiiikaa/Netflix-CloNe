(function () {
  if (window.StreamFlixAppInitialized) {
    return;
  }
  window.StreamFlixAppInitialized = true;

  const movies = [
    { id: 1, title: "The Last Horizon", year: 2025, genre: "Sci-Fi", description: "A daring mission journeys beyond the edge of the known universe.", poster: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=500&q=80", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
    { id: 2, title: "Dark Nights", year: 2024, genre: "Thriller", description: "A detective discovers secrets hidden beneath a quiet city.", poster: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=500&q=80", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 3, title: "Into the Wild", year: 2025, genre: "Adventure", description: "An unforgettable journey into the heart of the wilderness.", poster: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=500&q=80", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
    { id: 4, title: "Lost in Space", year: 2023, genre: "Sci-Fi", description: "A stranded crew searches for a way back home.", poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=500&q=80", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 5, title: "The Silent City", year: 2024, genre: "Mystery", description: "One missing person. One city full of unanswered questions.", poster: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=500&q=80", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
    { id: 6, title: "Ocean Deep", year: 2025, genre: "Adventure", description: "An expedition encounters something extraordinary underwater.", poster: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=500&q=80", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 7, title: "Red Planet", year: 2024, genre: "Sci-Fi", description: "Humanity faces its greatest challenge on a distant planet.", poster: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=500&q=80", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
    { id: 8, title: "Final Pursuit", year: 2023, genre: "Action", description: "A race against time leads to an unexpected discovery.", poster: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80", video: "https://www.w3schools.com/html/mov_bbb.mp4" }
  ];

  const movieGrid = document.getElementById("movieGrid");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const resultsTitle = document.getElementById("resultsTitle");
  const emptyState = document.getElementById("emptyState");
  const clearSearch = document.getElementById("clearSearch");

  const modal = document.getElementById("playerModal");
  const videoPlayer = document.getElementById("videoPlayer");
  const playerTitle = document.getElementById("playerTitle");
  const playerDescription = document.getElementById("playerDescription");

  const featuredMovie = movies[0];

  function groupByGenre(list) {
    const map = new Map();
    list.forEach(m => {
      if (!map.has(m.genre)) map.set(m.genre, []);
      map.get(m.genre).push(m);
    });
    return Array.from(map.entries()).map(([genre, items]) => ({ genre, items }));
  }

  function createCard(movie) {
    const card = document.createElement('article');
    card.className = 'row-card';

    const img = document.createElement('img');
    img.src = movie.poster;
    img.alt = movie.title + ' poster';
    img.loading = 'lazy';
    img.addEventListener('error', () => { img.style.display = 'none'; }, { once: true });

    const info = document.createElement('div');
    info.className = 'movie-info';

    const title = document.createElement('h3');
    title.textContent = movie.title;

    const meta = document.createElement('div');
    meta.className = 'movie-meta';
    meta.textContent = `${movie.year} • ${movie.genre}`;

    const playButton = document.createElement('button');
    playButton.className = 'card-play';
    playButton.type = 'button';
    playButton.textContent = '▶ Play';
    playButton.setAttribute('aria-label', `Play ${movie.title}`);
    playButton.addEventListener('click', (e) => { e.stopPropagation(); openPlayer(movie); });

    info.append(title, meta, playButton);

    card.append(img, info);

    card.addEventListener('click', () => openPlayer(movie));

    return card;
  }

  function renderRows(list) {
    if (!movieGrid) return;

    movieGrid.replaceChildren();

    if (list.length === 0) {
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    // If searching, show single row of results
    if (resultsTitle.textContent === 'Search Results') {
      const row = document.createElement('div');
      row.className = 'row';
      const header = document.createElement('div');
      header.className = 'row-header';
      const title = document.createElement('h3');
      title.className = 'row-title';
      title.textContent = 'Search Results';
      header.appendChild(title);
      row.appendChild(header);

      const container = document.createElement('div');
      container.className = 'row-container';
      const scroll = document.createElement('div');
      scroll.className = 'row-scroll';

      list.forEach(m => scroll.appendChild(createCard(m)));

      container.appendChild(scroll);
      row.appendChild(container);
      movieGrid.appendChild(row);
      addRowNavIfNeeded(container, scroll);
      return;
    }

    const groups = groupByGenre(list);
    groups.forEach(group => {
      const row = document.createElement('div');
      row.className = 'row';

      const header = document.createElement('div');
      header.className = 'row-header';
      const title = document.createElement('h3');
      title.className = 'row-title';
      title.textContent = group.genre;
      header.appendChild(title);

      row.appendChild(header);

      const container = document.createElement('div');
      container.className = 'row-container';
      const scroll = document.createElement('div');
      scroll.className = 'row-scroll';

      group.items.forEach(m => scroll.appendChild(createCard(m)));

      container.appendChild(scroll);
      row.appendChild(container);
      movieGrid.appendChild(row);

      addRowNavIfNeeded(container, scroll);
    });
  }

  function addRowNavIfNeeded(container, scrollEl) {
    // Only add nav if overflow exists
    setTimeout(() => {
      if (scrollEl.scrollWidth > scrollEl.clientWidth + 2) {
        const nav = document.createElement('div');
        nav.className = 'row-nav';
        const prev = document.createElement('button');
        const next = document.createElement('button');
        prev.type = next.type = 'button';
        prev.innerHTML = '◀';
        next.innerHTML = '▶';
        prev.addEventListener('click', () => scrollByOffset(scrollEl, -1));
        next.addEventListener('click', () => scrollByOffset(scrollEl, 1));
        nav.append(prev, next);
        container.appendChild(nav);
      }
    }, 50);
  }

  function scrollByOffset(scrollEl, direction) {
    const card = scrollEl.querySelector('.row-card');
    if (!card) return;
    const scrollAmount = (card.clientWidth + 14) * 3; // scroll by 3 cards
    scrollEl.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }

  // Search movies by title or genre
  function searchMovies() {
    const query = (searchInput.value || '').trim().toLowerCase();

    const filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query) ||
      String(movie.year).includes(query)
    );

    resultsTitle.textContent = query ? 'Search Results' : 'Trending Now';
    clearSearch.hidden = !query;

    renderRows(filteredMovies);
  }

  if (searchBtn) searchBtn.addEventListener('click', searchMovies);
  if (searchInput) {
    searchInput.addEventListener('input', searchMovies);
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') searchMovies();
    });
  }

  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      searchInput.value = '';
      searchMovies();
      searchInput.focus();
    });
  }

  function openPlayer(movie) {
    if (!modal || !videoPlayer || !playerTitle || !playerDescription) return;

    playerTitle.textContent = movie.title;
    playerDescription.textContent = `${movie.year} • ${movie.genre} — ${movie.description}`;

    videoPlayer.pause();
    videoPlayer.src = movie.video;
    videoPlayer.load();

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    videoPlayer.play().catch(() => {});
  }

  function closePlayer() {
    if (!modal || !videoPlayer) return;

    videoPlayer.pause();
    videoPlayer.removeAttribute('src');
    videoPlayer.load();

    modal.hidden = true;
    document.body.style.overflow = '';
  }

  const closeButton = document.getElementById('closePlayer');
  if (closeButton) closeButton.addEventListener('click', closePlayer);

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closePlayer();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.hidden) closePlayer();
  });

  const heroTitle = document.getElementById('heroTitle');
  const heroDescription = document.getElementById('heroDescription');
  const heroPlay = document.getElementById('heroPlay');
  const heroInfo = document.getElementById('heroInfo');

  if (heroTitle) heroTitle.textContent = featuredMovie.title;
  if (heroDescription) heroDescription.textContent = featuredMovie.description;
  if (heroPlay) heroPlay.addEventListener('click', () => openPlayer(featuredMovie));
  if (heroInfo) heroInfo.addEventListener('click', () => openPlayer(featuredMovie));

  // Initial render
  renderRows(movies);
})();
