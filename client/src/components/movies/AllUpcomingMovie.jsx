import { fetchLatestMovies } from '../../service/api';
import MediaGridPage from '../common/MediaGridPage';

const AllLatestMovie = () => <MediaGridPage fetchFunction={fetchLatestMovies} itemType="movie" storageKeyPrefix="latest" />;

export default AllLatestMovie;
