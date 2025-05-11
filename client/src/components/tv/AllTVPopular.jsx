import MediaGridPage from '../common/MediaGridPage';
import { fetchPopularTVShows } from '../../service/api';

const AllTVPopular = () => <MediaGridPage title="Popular TV Shows" fetchFunction={fetchPopularTVShows} itemType="tv" storageKeyPrefix="popularTV" detailPathPrefix="/tv-shows" />;

export default AllTVPopular;
