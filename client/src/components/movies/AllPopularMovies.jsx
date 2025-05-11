import { fetchPopularMovies } from '../../service/api';
import MediaGridPage from '../common/MediaGridPage';

const AllPopularMovies = () => <MediaGridPage fetchFunction={fetchPopularMovies} itemType="movie" storageKeyPrefix="popular" />;

export default AllPopularMovies;
