import MediaByGenrePage from '../common/MediaByGenrePage';
import { fetchGenres, fetchMoviesByGenre } from '../../service/api';

const MovieByGenre = () => <MediaByGenrePage fetchItemsByGenre={fetchMoviesByGenre} fetchGenres={fetchGenres} itemType="movie" storageKeyPrefix="Movies" detailPathPrefix="/movies" />;

export default MovieByGenre;
