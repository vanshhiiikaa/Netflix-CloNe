
const movies = [
  {
    id: 1,
    title: "The Last Horizon",
    year: 2025,
    genre: "Sci-Fi",
    description: "A daring mission journeys beyond the edge of the known universe.",
    poster: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=500&q=80",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  },
  {
    id: 2,
    title: "Dark Nights",
    year: 2024,
    genre: "Thriller",
    description: "A detective discovers secrets hidden beneath a quiet city.",
    poster: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=500&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    id: 3,
    title: "Into the Wild",
    year: 2025,
    genre: "Adventure",
    description: "An unforgettable journey into the heart of the wilderness.",
    poster: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=500&q=80",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  },
  {
    id: 4,
    title: "Lost in Space",
    year: 2023,
    genre: "Sci-Fi",
    description: "A stranded crew searches for a way back home.",
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=500&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    id: 5,
    title: "The Silent City",
    year: 2024,
    genre: "Mystery",
    description: "One missing person. One city full of unanswered questions.",
    poster: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=500&q=80",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  },
  {
    id: 6,
    title: "Ocean Deep",
    year: 2025,
    genre: "Adventure",
    description: "An expedition encounters something extraordinary underwater.",
    poster: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=500&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    id: 7,
    title: "Red Planet",
    year: 2024,
    genre: "Sci-Fi",
    description: "Humanity faces its greatest challenge on a distant planet.",
    poster: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=500&q=80",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  },
  {
    id: 8,
    title: "Final Pursuit",
    year: 2023,
    genre: "Action",
    description: "A race against time leads to an unexpected discovery.",
    poster: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4"
  }
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

// Render movie cards

function renderMovies(list) {
  movieGrid.replaceChildren();

  emptyState.hidden = list.length > 0;

  if (list.length === 0) return;

  const query = searchInput.value.trim();

  // Search results ko ek hi horizontal row mein dikhayein.
  const rows = query
    ? [{ title: "Search Results", movies: list }]
    : [
        { title: "Trending Now", movies: list },
        ...[...new Set(list.map(movie => movie.genre))]
          .map(genre => ({
            title: genre + " Movies",
            movies: list.filter(movie => movie.genre === genre)
          }))
      ];

  rows.forEach((row, rowIndex) => {
    if (!row.movies.length) return;

    const section = document.createElement("section");
    section.className = "movie-row";

    const heading = document.createElement("div");
    heading.className = "row-heading";

    const title = document.createElement("h3");
    title.textContent = row.title;

    const count = document.createElement("span");
    count.className = "row-count";
    count.textContent = `${row.movies.length} titles`;

    heading.append(title, count);

    const shell = document.createElement("div");
    shell.className = "carousel-shell";

    const track = document.createElement("div");
    track.className = "carousel-track";
    track.id = `carousel-${rowIndex}`;
    track.setAttribute("aria-label", row.title);
    track.setAttribute("tabindex", "0");

    const leftButton = document.createElement("button");
    leftButton.className = "carousel-arrow left";
    leftButton.type = "button";
    leftButton.textContent = "‹";
    leftButton.setAttribute("aria-label", `Scroll ${row.title} left`);

    const rightButton = document.createElement("button");
    rightButton.className = "carousel-arrow right";
    rightButton.type = "button";
    rightButton.textContent = "›";
    rightButton.setAttribute("aria-label", `Scroll ${row.title} right`);

    // Create cards from the existing movie data.
    row.movies.forEach(movie => {
      const card = document.createElement("article");
      card.className = "movie-card";

      const poster = document.createElement("img");
      poster.className = "poster";
      poster.src = movie.poster;
      poster.alt = movie.title + " poster";
      poster.loading = "lazy";

      poster.addEventListener("error", () => {
        poster.style.display = "none";
      }, { once: true });

      const info = document.createElement("div");
      info.className = "movie-info";

      const name = document.createElement("h3");
      name.textContent = movie.title;

      const meta = document.createElement("div");
      meta.className = "movie-meta";
      meta.textContent = `${movie.year} • ${movie.genre}`;

      const play = document.createElement("button");
      play.className = "card-play";
      play.type = "button";
      play.textContent = "▶ Play";
      play.setAttribute("aria-label", `Play ${movie.title}`);
      play.addEventListener("click", () => openPlayer(movie));

      info.append(name, meta, play);
      card.append(poster, info);

      card.addEventListener("click", event => {
        if (!event.target.closest("button")) {
          openPlayer(movie);
        }
      });

      track.appendChild(card);
    });

    // Scroll by approximately one card group.
    function scrollCarousel(direction) {
      const card = track.querySelector(".movie-card");
      if (!card) return;

      const trackStyle = getComputedStyle(track);
      const gap = parseFloat(trackStyle.columnGap) || 0;
      const distance = (card.getBoundingClientRect().width + gap) * 3;

      track.scrollBy({
        left: direction * distance,
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth"
      });
    }

    leftButton.addEventListener("click", () => {
      scrollCarousel(-1);
    });

    rightButton.addEventListener("click", () => {
      scrollCarousel(1);
    });

    // Update arrow states at the start and end.
    function updateArrows() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      leftButton.disabled = track.scrollLeft <= 2;
      rightButton.disabled = track.scrollLeft >= maxScroll - 2;
    }

    track.addEventListener("scroll", updateArrows, {
      passive: true
    });

    // Support mouse wheel and keyboard arrow navigation.
    track.addEventListener("keydown", event => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollCarousel(1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollCarousel(-1);
      }
    });

    shell.append(leftButton, track, rightButton);
    section.append(heading, shell);
    movieGrid.appendChild(section);

    // Wait until layout is calculated before setting arrow states.
    requestAnimationFrame(updateArrows);
  });
}


    // Clicking the card opens the player too.
    card.addEventListener("click", (event) => {
      if (!event.target.closest("button")) {
        openPlayer(movie);
      }
    });

    movieGrid.appendChild(card);
  });
}

// Search movies by title or genre
function searchMovies() {
  const query = searchInput.value.trim().toLowerCase();

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(query) ||
    movie.genre.toLowerCase().includes(query) ||
    String(movie.year).includes(query)
  );

  resultsTitle.textContent = query ? "Search Results" : "Trending Now";
  clearSearch.hidden = !query;

  renderMovies(filteredMovies);
}

searchBtn.addEventListener("click", searchMovies);

searchInput.addEventListener("input", searchMovies);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchMovies();
  }
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  searchMovies();
  searchInput.focus();
});

// Open video player
function openPlayer(movie) {
  playerTitle.textContent = movie.title;
  playerDescription.textContent =
    `${movie.year} • ${movie.genre} — ${movie.description}`;

  // Stop the previous video before loading another.
  videoPlayer.pause();
  videoPlayer.src = movie.video;
  videoPlayer.load();

  modal.hidden = false;
  document.body.style.overflow = "hidden";

  // Autoplay may be blocked by browser settings.
  videoPlayer.play().catch(() => {
    // The user can start playback using the video controls.
  });
}

// Close video player
function closePlayer() {
  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.load();

  modal.hidden = true;
  document.body.style.overflow = "";
}

document.getElementById("closePlayer")
  .addEventListener("click", closePlayer);

// Close when clicking outside the player panel
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closePlayer();
  }
});

// Close with Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closePlayer();
  }
});

// Hero section
document.getElementById("heroTitle").textContent =
  featuredMovie.title;

document.getElementById("heroDescription").textContent =
  featuredMovie.description;

document.getElementById("heroPlay")
  .addEventListener("click", () => openPlayer(featuredMovie));

document.getElementById("heroInfo")
  .addEventListener("click", () => openPlayer(featuredMovie));

// Start the app
renderMovies(movies);
