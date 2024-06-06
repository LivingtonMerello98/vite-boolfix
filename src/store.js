import { reactive } from 'vue';
import axios from 'axios';

export const store = reactive({
    result: [],
    info: {},
    apiUrl: 'https://api.themoviedb.org/3/search/',
    apiKey: '55d225bdb3e209cf2f546c83d3db58cf',

    searchMovies(query) {
        // URL per la ricerca di film e serie TV
        const movieUrl = `${this.apiUrl}movie?api_key=${this.apiKey}&query=${query}&language=it_IT`;
        const tvUrl = `${this.apiUrl}tv?api_key=${this.apiKey}&query=${query}&language=it_IT`;

        // Effettua le chiamate HTTP in parallelo per ottenere i risultati dei film e delle serie TV
        axios.all([
            axios.get(movieUrl),
            axios.get(tvUrl)
        ]).then(axios.spread((moviesResponse, tvResponse) => {
            //elaborazioni risultati fil e serie
            const movies = moviesResponse.data.results.map(movie => ({
                type: 'movie',
                title: movie.title,
                originalTitle: movie.original_title,
                language: movie.original_language,
                vote: movie.vote_average
            }));

            const tvShows = tvResponse.data.results.map(tvShow => ({
                type: 'tv',
                title: tvShow.name,
                originalTitle: tvShow.original_name,
                language: tvShow.original_language,
                vote: tvShow.vote_average
            }));

            // unione risultati fil e serie tv
            this.result = [...movies, ...tvShows];
            console.log('Store Result:', this.result);
        }))
    }
});
