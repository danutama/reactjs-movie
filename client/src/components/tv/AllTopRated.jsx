import MediaGridPage from '../common/MediaGridPage';
import { fetchTopRatedTVShows } from '../../service/api';

const AllTopRated = () => <MediaGridPage title="Top Rated TV Shows" fetchFunction={fetchTopRatedTVShows} itemType="tv" storageKeyPrefix="topRatedTV" detailPathPrefix="/tv-shows" />;

export default AllTopRated;
