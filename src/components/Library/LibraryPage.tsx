import React, { useState, useEffect } from 'react';
import { Book, Heart, BookOpen, Star, Calendar, Search, Filter, Plus, Edit3, Trash2, Eye, EyeOff, StickyNote } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Book as BookType } from '../../types';
import BookCard from '../BookResults/BookCard';
import NotesModal from './NotesModal';

interface SavedBook extends BookType {
  savedAt: string;
  isRead: boolean;
  readAt?: string;
  rating?: number;
  notes?: string;
  tags?: string[];
}

const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);
  const [activeTab, setActiveTab] = useState<'saved' | 'read' | 'notes'>('saved');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'fiction' | 'non-fiction' | 'recent'>('all');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<SavedBook | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockSavedBooks: SavedBook[] = [
      {
        id: '1',
        title: 'The Fifth Season',
        authors: ['N.K. Jemisin'],
        description: 'A woman searches for her daughter in a world where the earth itself is out to kill everyone. The first book in the acclaimed Broken Earth trilogy.',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop',
        publishedDate: '2015',
        pageCount: 512,
        categories: ['Science Fiction', 'Fantasy'],
        rating: 4.3,
        ratingCount: 45000,
        googleBooksUrl: 'https://books.google.com/books?id=example1',
        isbn: '9780316229296',
        savedAt: '2024-01-15',
        isRead: true,
        readAt: '2024-01-20',
        rating: 5,
        notes: 'Absolutely incredible world-building. The magic system is fascinating and the characters are so well developed. Can\'t wait to read the next book in the series!',
        tags: ['sci-fi', 'fantasy', 'award-winner']
      },
      {
        id: '2',
        title: 'Klara and the Sun',
        authors: ['Kazuo Ishiguro'],
        description: 'From her place in the store, Klara, an artificial friend with outstanding observational qualities, watches carefully the behavior of those who come in to browse.',
        coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
        publishedDate: '2021',
        pageCount: 303,
        categories: ['Science Fiction', 'Literary Fiction'],
        rating: 4.1,
        ratingCount: 28000,
        googleBooksUrl: 'https://books.google.com/books?id=example2',
        isbn: '9780571364886',
        savedAt: '2024-01-10',
        isRead: false,
        tags: ['literary', 'ai', 'ishiguro']
      },
      {
        id: '3',
        title: 'The Power',
        authors: ['Naomi Alderman'],
        description: 'What would happen if women developed a physical power that they had never had before? The Power is our era\'s The Handmaid\'s Tale.',
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
        publishedDate: '2016',
        pageCount: 432,
        categories: ['Science Fiction', 'Dystopian Fiction'],
        rating: 4.2,
        ratingCount: 52000,
        googleBooksUrl: 'https://books.google.com/books?id=example3',
        isbn: '9780316547611',
        savedAt: '2024-01-05',
        isRead: true,
        readAt: '2024-01-12',
        rating: 4,
        notes: 'Thought-provoking exploration of power dynamics. The premise is fascinating and the execution is mostly solid, though it gets a bit heavy-handed at times.',
        tags: ['dystopian', 'feminism', 'power']
      },
      {
        id: '4',
        title: 'Project Hail Mary',
        authors: ['Andy Weir'],
        description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.',
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop',
        publishedDate: '2021',
        pageCount: 496,
        categories: ['Science Fiction', 'Adventure'],
        rating: 4.5,
        ratingCount: 89000,
        googleBooksUrl: 'https://books.google.com/books?id=example4',
        isbn: '9780593135204',
        savedAt: '2024-01-18',
        isRead: false,
        tags: ['space', 'adventure', 'humor']
      }
    ];
    setSavedBooks(mockSavedBooks);
  }, []);

  const filteredBooks = savedBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'fiction' && book.categories.some(cat => cat.toLowerCase().includes('fiction'))) ||
                         (filterBy === 'non-fiction' && !book.categories.some(cat => cat.toLowerCase().includes('fiction'))) ||
                         (filterBy === 'recent' && new Date(book.savedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    const matchesTab = activeTab === 'saved' || 
                      (activeTab === 'read' && book.isRead) ||
                      (activeTab === 'notes' && book.notes);
    
    return matchesSearch && matchesFilter && matchesTab;
  });

  const toggleReadStatus = (bookId: string) => {
    setSavedBooks(books => books.map(book => 
      book.id === bookId 
        ? { 
            ...book, 
            isRead: !book.isRead, 
            readAt: !book.isRead ? new Date().toISOString().split('T')[0] : undefined 
          }
        : book
    ));
  };

  const removeBook = (bookId: string) => {
    setSavedBooks(books => books.filter(book => book.id !== bookId));
  };

  const openNotesModal = (book: SavedBook) => {
    setSelectedBook(book);
    setShowNotesModal(true);
  };

  const saveNotes = (bookId: string, notes: string, rating?: number) => {
    setSavedBooks(books => books.map(book => 
      book.id === bookId ? { ...book, notes, rating } : book
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to access your library</h2>
          <p className="text-gray-600">Create an account to save books and track your reading progress.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold">My Library</h1>
            </div>
            <p className="text-xl text-white text-opacity-90 max-w-2xl mx-auto">
              Your personal collection of saved books, reading progress, and notes
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saved Books</p>
                <p className="text-2xl font-bold text-gray-900">{savedBooks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Books Read</p>
                <p className="text-2xl font-bold text-gray-900">{savedBooks.filter(b => b.isRead).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedBooks.filter(b => b.rating).length > 0 
                    ? (savedBooks.filter(b => b.rating).reduce((acc, b) => acc + (b.rating || 0), 0) / savedBooks.filter(b => b.rating).length).toFixed(1)
                    : '—'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <StickyNote className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">With Notes</p>
                <p className="text-2xl font-bold text-gray-900">{savedBooks.filter(b => b.notes).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4 sm:mb-0">
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'saved'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Saved ({savedBooks.length})
                </button>
                <button
                  onClick={() => setActiveTab('read')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'read'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Read ({savedBooks.filter(b => b.isRead).length})
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'notes'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  With Notes ({savedBooks.filter(b => b.notes).length})
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Books</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="recent">Recently Added</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex space-x-4">
                  {/* Book Cover */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-28 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={book.coverImage}
                        alt={`Cover of ${book.title}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {book.title}
                      </h3>
                      <div className="flex items-center space-x-1 ml-2">
                        {book.isRead && (
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <BookOpen className="w-3 h-3 text-green-600" />
                          </div>
                        )}
                        {book.notes && (
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                            <StickyNote className="w-3 h-3 text-purple-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      by {book.authors.join(', ')}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Saved {new Date(book.savedAt).toLocaleDateString()}</span>
                      </div>
                      
                      {book.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{book.rating}/5</span>
                        </div>
                      )}
                    </div>

                    {book.tags && book.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {book.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {book.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {book.notes}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleReadStatus(book.id)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            book.isRead
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {book.isRead ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{book.isRead ? 'Read' : 'Mark as Read'}</span>
                        </button>
                        
                        <button
                          onClick={() => openNotesModal(book)}
                          className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Notes</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeBook(book.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'saved' && 'No saved books yet'}
              {activeTab === 'read' && 'No books marked as read'}
              {activeTab === 'notes' && 'No books with notes'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'saved' && 'Start building your library by saving books you want to read.'}
              {activeTab === 'read' && 'Mark books as read to track your reading progress.'}
              {activeTab === 'notes' && 'Add notes to your books to remember your thoughts and insights.'}
            </p>
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {showNotesModal && selectedBook && (
        <NotesModal
          book={selectedBook}
          onClose={() => setShowNotesModal(false)}
          onSave={saveNotes}
        />
      )}
    </div>
  );
};

export default LibraryPage;