import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <>
      <div>Not Found</div>
      <Link to={'/'}>
        <button>Go Back Home</button>
      </Link>
    </>
  );
}

export default NotFoundPage;
