import { BookSearchRequest, BookSearchResponse } from '../types';

class BookSearchService {
  private baseUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';

  async searchBooks(request: BookSearchRequest): Promise<BookSearchResponse> {
    try {
      // Match the exact structure expected by your n8n workflow
      const requestBody = {
        body: {
          query: request.query
        }
      };

      console.log('Sending request to n8n:', this.baseUrl);
      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error(`n8n request failed with status ${response.status}`);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return this.simulateSearch(request);
      }

      // Check if response has content before parsing JSON
      const text = await response.text();
      console.log('Raw response text:', text);
      
      if (!text || text.trim() === '') {
        console.warn('Empty response from API, using mock data');
        return this.simulateSearch(request);
      }
      
      try {
        const data = JSON.parse(text);
        console.log('Parsed response data:', data);
        
        // Transform n8n response to match expected structure
        if (data.success && data.results) {
          return {
            results: data.results,
            totalResults: data.totalResults || data.results.length,
            processingTime: data.processingTime || 'N/A',
            query: data.query || request.query
          };
        }
        
        // If response doesn't match expected structure, fall back to mock
        console.warn('Response structure check failed:');
        console.warn('- Has success property:', 'success' in data);
        console.warn('- Has results property:', 'results' in data);
        console.warn('- Success value:', data.success);
        console.warn('- Results length:', data.results?.length);
        
        console.warn('Unexpected response structure from n8n:', data);
        return this.simulateSearch(request);
      } catch (jsonError) {
        console.warn('Invalid JSON response, using mock data:', jsonError);
        return this.simulateSearch(request);
      }
    } catch (error) {
      console.warn('Network error occurred, falling back to mock data:', error);
      return this.simulateSearch(request);
    }
  }

  private async simulateSearch(request: BookSearchRequest): Promise<BookSearchResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock data for development
    const mockBooks = [
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
        similarityScore: 0.92,
        recommendation: 'This Hugo Award-winning novel perfectly matches your request for science fiction with a strong female protagonist. Jemisin creates a compelling world with Essun, a powerful woman on a desperate quest.',
        googleBooksUrl: 'https://books.google.com/books?id=example1',
        isbn: '9780316229296'
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
        similarityScore: 0.88,
        recommendation: 'Ishiguro\'s latest explores AI consciousness through Klara\'s unique perspective. This recent science fiction work features a compelling female-coded protagonist navigating complex human relationships.',
        googleBooksUrl: 'https://books.google.com/books?id=example2',
        isbn: '9780571364886'
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
        similarityScore: 0.85,
        recommendation: 'Alderman\'s thought-provoking novel centers entirely on female empowerment in a sci-fi setting. Multiple strong female characters drive this recent, award-winning narrative about power dynamics.',
        googleBooksUrl: 'https://books.google.com/books?id=example3',
        isbn: '9780316547611'
      }
    ];

    return {
      results: mockBooks,
      totalResults: mockBooks.length,
      processingTime: '2.1s',
      query: request.query
    };
  }
}

export const bookSearchService = new BookSearchService();