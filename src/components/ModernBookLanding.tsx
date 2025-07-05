'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { cn } from '@/lib/utils'
import { Menu, X, BookOpen, Sparkles, Search, Star, Users, TrendingUp, Heart, Zap, Coffee, Moon, Clock, Award, ArrowRight, Play } from 'lucide-react'
import { useBookSearch } from '../hooks/useBookSearch'
import EnhancedBookGrid from './BookResults/EnhancedBookGrid'
import LoadingSpinner from './Common/LoadingSpinner'
import { Book } from '../types'

export function ModernBookLanding() {
    const { isLoading, results, error, totalResults, processingTime, hasSearched, searchBooks } = useBookSearch();
    const [query, setQuery] = useState('');
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    const moodButtons = [
        { id: 'adventurous', label: 'Adventurous', icon: Zap, color: 'from-orange-400 to-red-500', query: 'thrilling adventure books with action and excitement' },
        { id: 'romantic', label: 'Romantic', icon: Heart, color: 'from-pink-400 to-rose-500', query: 'heartwarming romance novels with emotional depth' },
        { id: 'thoughtful', label: 'Thoughtful', icon: Coffee, color: 'from-amber-400 to-orange-500', query: 'thought-provoking literary fiction that makes you think' },
        { id: 'mysterious', label: 'Mysterious', icon: Moon, color: 'from-indigo-400 to-purple-500', query: 'gripping mystery and thriller books with plot twists' }
    ];

    const handleSearch = async (searchQuery: string) => {
        setQuery(searchQuery);
        await searchBooks({ query: searchQuery });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isLoading) {
            handleSearch(query.trim());
        }
    };

    const handleMoodClick = (mood: typeof moodButtons[0]) => {
        setSelectedMood(mood.id);
        setQuery(mood.query);
        handleSearch(mood.query);
    };

    const handleBookClick = (book: Book) => {
        console.log('Book clicked:', book);
    };

    return (
        <>
            <ModernHeader />
            <main className="overflow-x-hidden">
                {/* Hero Section */}
                <section>
                    <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
                        <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full px-4 py-2 mb-6 border border-purple-200">
                                    <TrendingUp className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-800">
                                        500,000+ readers trust BookMind
                                    </span>
                                </div>

                                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl">
                                    Find Your Next 
                                    <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                        Favorite Book
                                    </span>
                                    in 30 Seconds
                                </h1>
                                
                                <p className="mt-8 max-w-2xl text-pretty text-lg text-gray-600">
                                    AI-powered recommendations that understand your mood, preferences, and reading history. 
                                    <span className="font-semibold text-purple-700">No more endless browsing.</span>
                                </p>

                                {/* Trust Indicators */}
                                <div className="mt-6 flex items-center space-x-6 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className="font-medium">4.9/5 rating</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Award className="w-4 h-4 text-green-600" />
                                        <span className="font-medium">97% match rate</span>
                                    </div>
                                </div>

                                {/* Mood Selection */}
                                <div className="mt-8">
                                    <p className="text-sm font-medium text-gray-700 mb-3">What's your mood today?</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {moodButtons.map((mood) => {
                                            const Icon = mood.icon;
                                            return (
                                                <button
                                                    key={mood.id}
                                                    onClick={() => handleMoodClick(mood)}
                                                    disabled={isLoading}
                                                    className={`group relative overflow-hidden bg-gradient-to-br ${mood.color} text-white p-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                        selectedMood === mood.id ? 'ring-2 ring-white shadow-lg' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                                        <span className="font-medium text-sm">{mood.label}</span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Search Bar */}
                                <form onSubmit={handleSubmit} className="mt-8">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Search className="w-5 h-5 text-gray-400" />
                                        </div>
                                        
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Describe your perfect book..."
                                            disabled={isLoading}
                                            className="w-full pl-12 pr-16 py-4 text-base border border-gray-200 rounded-xl 
                                                     focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                                     disabled:opacity-50 disabled:cursor-not-allowed
                                                     shadow-sm hover:shadow-md transition-shadow duration-200
                                                     placeholder-gray-400 bg-white"
                                        />
                                        
                                        <button
                                            type="submit"
                                            disabled={!query.trim() || isLoading}
                                            className="absolute inset-y-0 right-0 pr-2 flex items-center
                                                     disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
                                                          text-white px-4 py-2 rounded-lg transition-all duration-200
                                                          flex items-center space-x-2 font-medium shadow-sm hover:shadow-md
                                                          transform hover:-translate-y-0.5">
                                                <Sparkles className="w-4 h-4" />
                                                <span>Find Books</span>
                                            </div>
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="px-8 text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                                        <button onClick={() => handleSearch("bestselling fiction books with strong characters")}>
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            <span className="text-nowrap">Get Personalized Recommendations</span>
                                        </button>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="px-5 text-base hover:bg-purple-50 hover:text-purple-700 group">
                                        <button>
                                            <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                            <span className="text-nowrap">Watch Demo</span>
                                        </button>
                                    </Button>
                                </div>

                                {/* Quick Stats */}
                                <div className="mt-8 text-sm text-gray-500">
                                    <p>✓ Free forever • ✓ No credit card required • ✓ Instant results</p>
                                </div>
                            </div>
                            
                            {/* Hero Image */}
                            <img
                                className="pointer-events-none order-first ml-auto h-56 w-full object-cover sm:h-96 lg:absolute lg:inset-0 lg:-right-20 lg:-top-96 lg:order-last lg:h-max lg:w-2/3 lg:object-contain opacity-20 lg:opacity-100"
                                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=1200&fit=crop&crop=center"
                                alt="Stack of Books"
                                height="1200"
                                width="800"
                            />
                        </div>
                    </div>
                </section>

                {/* Trusted By Section */}
                <section className="bg-background pb-16 md:pb-32">
                    <div className="group relative m-auto max-w-6xl px-6">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r md:pr-6">
                                <p className="text-end text-sm text-gray-600 font-medium">Trusted by readers from</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider
                                    speedOnHover={20}
                                    speed={40}
                                    gap={112}>
                                    <div className="flex">
                                        <div className="mx-auto h-8 w-fit flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-semibold">Harvard</span>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="mx-auto h-8 w-fit flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-semibold">Stanford</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex">
                                        <div className="mx-auto h-8 w-fit flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-semibold">MIT</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex">
                                        <div className="mx-auto h-8 w-fit flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-semibold">Oxford</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex">
                                        <div className="mx-auto h-8 w-fit flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-semibold">Cambridge</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex">
                                        <div className="mx-auto h-8 w-fit flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-semibold">Yale</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex">
                                        <div className="mx-auto h-8 w-fit flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-semibold">Princeton</span>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="mx-auto h-8 w-fit flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-semibold">Columbia</span>
                                        </div>
                                    </div>
                                </InfiniteSlider>

                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                                    direction="left"
                                    blurIntensity={1}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                                    direction="right"
                                    blurIntensity={1}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                {(hasSearched || isLoading) && (
                    <section className="bg-gray-50 py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {isLoading && (
                                <LoadingSpinner 
                                    message="Our AI is analyzing millions of books to find your perfect matches..."
                                />
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-8">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                <span className="text-red-600 text-lg font-bold">!</span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-red-800">Oops! Something went wrong</h3>
                                            <p className="text-red-700 mt-1">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!isLoading && !error && hasSearched && results.length > 0 && (
                                <EnhancedBookGrid 
                                    books={results} 
                                    onBookClick={handleBookClick}
                                    totalResults={totalResults}
                                    processingTime={processingTime}
                                />
                            )}

                            {!isLoading && !error && hasSearched && results.length === 0 && (
                                <div className="text-center py-16">
                                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        No books found for "{query}"
                                    </h3>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                        Try adjusting your search terms or being more specific about what you're looking for.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Discover', href: '#discover' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
]

const ModernHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="group bg-background/80 fixed z-20 w-full border-b backdrop-blur-3xl">
                <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                        BookMind
                                    </h1>
                                    <p className="text-xs text-gray-500">AI Book Discovery</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <a
                                                href={item.href}
                                                className="text-muted-foreground hover:text-purple-600 block duration-150 font-medium">
                                                <span>{item.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <a
                                                href={item.href}
                                                className="text-muted-foreground hover:text-purple-600 block duration-150">
                                                <span>{item.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* Trust Signals in Header */}
                            <div className="hidden lg:flex items-center space-x-6 text-sm text-gray-600 mr-6">
                                <div className="flex items-center space-x-1">
                                    <Users className="w-4 h-4 text-purple-600" />
                                    <span className="font-medium">500K+ users</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="font-medium">4.9/5</span>
                                </div>
                            </div>
                            
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-purple-50 hover:text-purple-700">
                                    <a href="#login">
                                        <span>Sign In</span>
                                    </a>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200">
                                    <a href="#signup">
                                        <span>Start Free</span>
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}