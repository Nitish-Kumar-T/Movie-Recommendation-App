const movies = [
    { title: "The Shawshank Redemption", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", genre: "Drama" },
    { title: "The Godfather", description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", genre: "Crime" },
    { title: "The Dark Knight", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", genre: "Action" },
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
        `;
        movieList.appendChild(movieElement);
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

    displayMovies(filteredMovies);
}

document.getElementById("search").addEventListener("input", filterMovies);
document.getElementById("genre-filter").addEventListener("change", filterMovies);

displayMovies(movies);