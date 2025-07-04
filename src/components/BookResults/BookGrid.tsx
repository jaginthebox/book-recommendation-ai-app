import React from 'react';
import { Book } from '../../types';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  onBookClick?: (book: Book) => void;
}

const BookGrid: React.FC<BookGridProps> = ({ books, onBookClick }) => {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onClick={() => onBookClick?.(book)}
        />
      ))}
    </div>
  );
};

export default BookGrid;