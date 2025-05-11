import MediaSlideSection from '../common/MediaSlideSection';
import { fetchTrendingTVShows } from '../../service/api';

function TvTrending() {
  return <MediaSlideSection title="Trending TV Shows" link="/tv-shows/trending" fetchFunction={fetchTrendingTVShows} itemType="tv" />;
}

export default TvTrending;
