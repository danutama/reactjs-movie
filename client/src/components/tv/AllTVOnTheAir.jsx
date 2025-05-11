import MediaGridPage from '../common/MediaGridPage';
import { fetchTVOnTheAir } from '../../service/api';

const AllTVOnTheAir = () => <MediaGridPage title="On The Air" fetchFunction={fetchTVOnTheAir} itemType="tv" storageKeyPrefix="onTheAirTV" detailPathPrefix="/tv-shows" />;

export default AllTVOnTheAir;
