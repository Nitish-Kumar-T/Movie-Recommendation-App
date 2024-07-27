const movies = [
    { id: 1, title: "The Shawshank Redemption", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", genre: "Drama", rating: 4.5 },
    { id: 2, title: "The Godfather", description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", genre: "Crime", rating: 4.8 },
    { id: 3, title: "The Dark Knight", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", genre: "Action", rating: 4.7 },
    { id: 4, title: "Pulp Fiction", description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.", genre: "Crime", rating: 4.6 },
    { id: 5, title: "Forrest Gump", description: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75.", genre: "Drama", rating: 4.4 },
    { id: 6, title: "Inception", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", genre: "Sci-Fi", rating: 4.5 },
];

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
let currentUser = null;

const users = [
    { username: "user1", password: "pass1", preferredGenres: ["Drama", "Crime"] },
    { username: "user2", password: "pass2", preferredGenres: ["Action", "Sci-Fi"] }
];

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

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        document.getElementById("login-form").style.display = "none";
        document.getElementById("user-info").style.display = "block";
        document.getElementById("user-welcome").textContent = `Welcome, ${username}!`;
        document.getElementById("recommendations-container").style.display = "block";
        updateRecommendations();
    } else {
        alert("Invalid username or password");
    }
}

function logout() {
    currentUser = null;
    document.getElementById("login-form").style.display = "block";
    document.getElementById("user-info").style.display = "none";
    document.getElementById("recommendations-container").style.display = "none";
}

function updateRecommendations() {
    const recommendationsList = document.getElementById("recommendations-list");
    recommendationsList.innerHTML = "";

    const recommendedMovies = movies.filter(movie => 
        currentUser.preferredGenres.includes(movie.genre)
    ).sort((a, b) => b.rating - a.rating).slice(0, 3);

    recommendedMovies.forEach(movie => {
        const recommendationElement = document.createElement("div");
        recommendationElement.classList.add("recommendation");
        recommendationElement.innerHTML = `
            <h3>${movie.title}</h3>
            <p>${movie.description.substring(0, 50)}...</p>
            <p>Rating: ${movie.rating.toFixed(1)}</p>
        `;
        recommendationsList.appendChild(recommendationElement);
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

document.getElementById("login-button").addEventListener("click", login);
document.getElementById("logout-button").addEventListener("click", logout);

filterMovies();
updateWatchlistDisplay();
document.getElementById("login-form").style.display = "block";