import MediaSlideSection from '../common/MediaSlideSection';
import { fetchTVAiringToday } from '../../service/api';

function TvAiringToday() {
  return <MediaSlideSection title="TV Shows Airing Today" link="/tv-shows/airing-today" fetchFunction={fetchTVAiringToday} itemType="tv" />;
}

export default TvAiringToday;
