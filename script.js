const movies = [
    { title: "The Shawshank Redemption", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", genre: "Drama", rating: 4.5 },
    { title: "The Godfather", description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", genre: "Crime", rating: 4.8 },
    { title: "The Dark Knight", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", genre: "Action", rating: 4.7 },
];

function displayMovies(filteredMovies) {
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = "";

    filteredMovies.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");
        movieElement.innerHTML = `
            <h2>${movie.title}</h2>
            <p>${movie.description}</p>
            <p class="genre">${movie.genre}</p>
            <p class="rating">Rating: ${movie.rating.toFixed(1)}</p>
            <div class="user-rating">
                ${'★'.repeat(5).split('').map((star, index) => 
                    `<span class="star" data-rating="${index + 1}">${star}</span>`
                ).join('')}
            </div>
        `;
        movieList.appendChild(movieElement);

        const stars = movieElement.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', () => rateMovie(movie, star.dataset.rating));
        });
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

document.getElementById("search").addEventListener("input", filterMovies);
document.getElementById("genre-filter").addEventListener("change", filterMovies);
document.getElementById("sort-select").addEventListener("change", filterMovies);

filterMovies();