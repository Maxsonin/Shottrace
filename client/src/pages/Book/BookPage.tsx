import { useParams } from 'react-router-dom';

function Book() {
  const { id } = useParams<{ id: string }>();

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
      <div>Book #{id}</div>
      <div>{books.find((book) => book.id === Number(id))?.title}</div>
    </>
  );
}

export default Book;
