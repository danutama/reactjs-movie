import MediaSlideSection from '../common/MediaSlideSection';
import { fetchTVOnTheAir } from '../../service/api';

function TvOnTheAir() {
  return <MediaSlideSection title="TV Shows On The Air" link="/tv-shows/on-the-air" fetchFunction={fetchTVOnTheAir} itemType="tv" />;
}

export default TvOnTheAir;
