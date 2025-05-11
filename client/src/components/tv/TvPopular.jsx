import MediaSlideSection from '../common/MediaSlideSection';
import { fetchPopularTVShows } from '../../service/api';

function TvPopular() {
  return <MediaSlideSection title="Popular TV Shows" link="/tv-shows/popular" fetchFunction={fetchPopularTVShows} itemType="tv" />;
}

export default TvPopular;
