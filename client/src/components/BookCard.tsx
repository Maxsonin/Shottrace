import { Link } from 'react-router-dom';

type BookCardProps = {
  includeStats: boolean;
  book: Book;
};

type Book = {
  id: number;
  title: string;
  imageUrl: string;
  favouriteCount: number;
  watchedCount: number;
};

const BookCard = ({ includeStats, book }: BookCardProps) => {
  return (
    <Link
      to={`/book/${book.id}`}
      className="relative group w-50 rounded-lg overflow-hidden shadow-lg"
    >
      <img
        src={book.imageUrl}
        alt="Book Cover"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {includeStats && (
        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-sm">
          <div className="flex items-center space-x-2 mb-1">
            <span>❤️</span>
            <span>{book.favouriteCount}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>👁️</span>
            <span>{book.watchedCount}</span>
          </div>
        </div>
      )}
    </Link>
  );
};

export default BookCard;
