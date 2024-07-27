const movies = [
    { id: 1, title: "The Shawshank Redemption", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", genre: "Drama", rating: 4.5 },
    { id: 2, title: "The Godfather", description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", genre: "Crime", rating: 4.8 },
    { id: 3, title: "The Dark Knight", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", genre: "Action", rating: 4.7 },
];

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

function displayMovies(filteredMovies) {
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = "";

    filteredMovies.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");
        movieElement.innerHTML = `
            <h2>${movie.title}</h2>
            <p>${movie.description.substring(0, 100)}...</p>
            <p class="genre">${movie.genre}</p>
            <p class="rating">Rating: ${movie.rating.toFixed(1)}</p>
            <div class="user-rating">
                ${'★'.repeat(5).split('').map((star, index) => 
                    `<span class="star" data-rating="${index + 1}">${star}</span>`
                ).join('')}
            </div>
            <button class="view-details" data-id="${movie.id}">View Details</button>
        `;
        movieList.appendChild(movieElement);

        const stars = movieElement.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', () => rateMovie(movie, star.dataset.rating));
        });

        const viewDetailsButton = movieElement.querySelector('.view-details');
        viewDetailsButton.addEventListener('click', () => openMovieModal(movie));
    });
}

function filterMovies() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const selectedGenre = document.getElementById("genre-filter").value;

    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
        const matchesGenre = selectedGenre === "" || movie.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    sortMovies(filteredMovies);
}

function sortMovies(moviesToSort) {
    const sortBy = document.getElementById("sort-select").value;
    moviesToSort.sort((a, b) => {
        if (sortBy === "title") {
            return a.title.localeCompare(b.title);
        } else if (sortBy === "rating") {
            return b.rating - a.rating;
        }
    });

    displayMovies(moviesToSort);
}

function rateMovie(movie, rating) {
    movie.rating = (movie.rating + Number(rating)) / 2;
    filterMovies();
}

function openMovieModal(movie) {
    const modal = document.getElementById("movie-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const modalGenre = document.getElementById("modal-genre");
    const modalRating = document.getElementById("modal-rating");
    const addToWatchlistButton = document.getElementById("add-to-watchlist");

    modalTitle.textContent = movie.title;
    modalDescription.textContent = movie.description;
    modalGenre.textContent = `Genre: ${movie.genre}`;
    modalRating.textContent = `Rating: ${movie.rating.toFixed(1)}`;

    addToWatchlistButton.onclick = () => addToWatchlist(movie);

    modal.style.display = "block";
}

function closeMovieModal() {
    const modal = document.getElementById("movie-modal");
    modal.style.display = "none";
}

function addToWatchlist(movie) {
    if (!watchlist.some(item => item.id === movie.id)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        updateWatchlistDisplay();
        alert(`${movie.title} has been added to your watchlist!`);
    } else {
        alert(`${movie.title} is already in your watchlist!`);
    }
}

function updateWatchlistDisplay() {
    const watchlistElement = document.getElementById("watchlist");
    watchlistElement.innerHTML = "";

    watchlist.forEach(movie => {
        const li = document.createElement("li");
        li.textContent = movie.title;
        watchlistElement.appendChild(li);
    });
}

document.getElementById("search").addEventListener("input", filterMovies);
document.getElementById("genre-filter").addEventListener("change", filterMovies);
document.getElementById("sort-select").addEventListener("change", filterMovies);

document.querySelector(".close").addEventListener("click", closeMovieModal);
window.addEventListener("click", (event) => {
    const modal = document.getElementById("movie-modal");
    if (event.target === modal) {
        closeMovieModal();
    }
});

filterMovies();
updateWatchlistDisplay();