import { Link } from 'react-router-dom';

function Books() {
  const books = [
    {
      id: 1,
      title: 'Book 1',
    },
    {
      id: 2,
      title: 'Book 2',
    },
    {
      id: 3,
      title: 'Book 3',
    },
  ];

  return (
    <>
      <h1>Books</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link to={`/book/${book.id}`}>{book.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Books;
