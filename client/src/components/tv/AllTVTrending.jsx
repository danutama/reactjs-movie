import MediaGridPage from '../common/MediaGridPage';
import { fetchTrendingTVShows } from '../../service/api';

const AllTVTrending = () => <MediaGridPage title="Trending TV Shows" fetchFunction={fetchTrendingTVShows} itemType="tv" storageKeyPrefix="trendingTV" detailPathPrefix="/tv-shows" />;

export default AllTVTrending;
