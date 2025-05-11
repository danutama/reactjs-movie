import MediaByGenrePage from '../common/MediaByGenrePage';
import { fetchTVGenres, fetchTVShowsByGenre } from '../../service/api';

const TVShowsByGenre = () => <MediaByGenrePage fetchItemsByGenre={fetchTVShowsByGenre} fetchGenres={fetchTVGenres} itemType="tv" storageKeyPrefix="TVShows" detailPathPrefix="/tv-shows" />;

export default TVShowsByGenre;
