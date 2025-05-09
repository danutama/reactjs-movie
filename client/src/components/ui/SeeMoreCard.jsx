import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import Card from './Card';

function SeeMoreCard({ to = '/' }) {
  return (
    <Card className="d-flex align-items-center justify-content-center" >
      <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
        <Link to={to} className="text-muted see-more-card d-flex justify-content-center align-items-center fs-4 p-3 rounded-circle">
          <FaArrowRight />
        </Link>
      </div>
    </Card>
  );
}

export default SeeMoreCard;
