import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type Book = {
  id: number;
  title: string;
  imageUrl: string;
  favouriteCount: number;
  watchedCount: number;
  description: string;
  authors: string;
  publishedDate: string;
};

function BookPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetch(`/api/books/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Book not found');
        return res.json();
      })
      .then((data: Book) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!book) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="w-full md:w-48 h-auto rounded-xl object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
          <p className="text-sm text-gray-500 mb-1">By {book.authors}</p>
          <p className="text-sm text-gray-400 mb-3">
            Published: {book.publishedDate}
          </p>
          <p className="mb-4 text-gray-700">{book.description}</p>

          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <div className="text-xl font-semibold text-blue-600">
                {book.favouriteCount}
              </div>
              <div className="text-gray-500 text-sm">Favourites</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-green-600">
                {book.watchedCount}
              </div>
              <div className="text-gray-500 text-sm">Watched</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookPage;
