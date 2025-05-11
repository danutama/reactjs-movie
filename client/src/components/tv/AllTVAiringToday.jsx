import MediaGridPage from '../common/MediaGridPage';
import { fetchTVAiringToday } from '../../service/api';

const AllTVAiringToday = () => <MediaGridPage title="Airing Today" fetchFunction={fetchTVAiringToday} itemType="tv" storageKeyPrefix="airingTodayTV" detailPathPrefix="/tv-shows" />;

export default AllTVAiringToday;
