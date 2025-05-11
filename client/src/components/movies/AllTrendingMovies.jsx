import { fetchTrendingMovies } from '../../service/api';
import MediaGridPage from '../common/MediaGridPage';

const AllTrendingMovies = () => <MediaGridPage fetchFunction={fetchTrendingMovies} itemType="movie" storageKeyPrefix="trending" />;

export default AllTrendingMovies;
