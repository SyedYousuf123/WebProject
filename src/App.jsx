// Updated App.js - Now with Default Movies: The Matrix and Inception
// On first load (when localStorage is empty), these two movies are automatically added.
// High-quality official poster URLs used.
// Search bar and all previous features remain intact.
// Still using ONLY 3 hooks.

import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPoster, setNewPoster] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDesc, setEditingDesc] = useState('');
  const [editingPoster, setEditingPoster] = useState('');
  const titleInputRef = useRef(null);

  // Load from localStorage OR add default movies on first visit
  useEffect(() => {
    const storedMovies = JSON.parse(localStorage.getItem('movies'));
    if (storedMovies && storedMovies.length > 0) {
      setMovies(storedMovies);
    } else {
      // Default movies
      const defaultMovies = [
        {
          id: 1,
          title: 'The Matrix',
          desc: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
          poster: 'https://original.fontsinuse.com/fontsinuse.com/use-images/170/170602/170602.jpeg',
          watched: false
        },
        {
          id: 2,
          title: 'Inception',
          desc: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
          poster: 'https://c8.alamy.com/comp/DBW2KB/inception-2010-christopher-nolan-dir-015-moviestore-collection-ltd-DBW2KB.jpg',
          watched: false
        }
      ];
      setMovies(defaultMovies);
      localStorage.setItem('movies', JSON.stringify(defaultMovies));
    }
  }, []);

  // Save to localStorage whenever movies change
  useEffect(() => {
    if (movies.length > 0) {
      localStorage.setItem('movies', JSON.stringify(movies));
    }
  }, [movies]);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addMovie = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newMovie = {
      id: Date.now(),
      title: newTitle,
      desc: newDesc,
      poster: newPoster || '',
      watched: false
    };
    setMovies([...movies, newMovie]);
    setNewTitle('');
    setNewDesc('');
    setNewPoster('');
    setSearchTerm('');
    titleInputRef.current.focus();
  };

  const deleteMovie = (id) => {
    setMovies(movies.filter(movie => movie.id !== id));
  };

  const startEditing = (movie) => {
    setEditingId(movie.id);
    setEditingTitle(movie.title);
    setEditingDesc(movie.desc);
    setEditingPoster(movie.poster);
  };

  const updateMovie = (e) => {
    e.preventDefault();
    if (!editingTitle.trim()) return;
    setMovies(movies.map(movie => 
      movie.id === editingId 
        ? { ...movie, title: editingTitle, desc: editingDesc, poster: editingPoster } 
        : movie
    ));
    setEditingId(null);
  };

  const toggleWatched = (id) => {
    setMovies(movies.map(movie => 
      movie.id === id 
        ? { ...movie, watched: !movie.watched } 
        : movie
    ));
  };

  return (
    <div className="App">
      <header className="header">
        <h1>My Movie Watchlist</h1>
        <p>Track movies you want to watch</p>
      </header>

      <main className="main">
        <section className="add-section">
          <h2>Add a Movie</h2>
          <form onSubmit={addMovie} className="add-form">
            <input
              ref={titleInputRef}
              type="text"
              placeholder="Movie Title *"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Short Description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <input
              type="url"
              placeholder="Poster Image URL (optional)"
              value={newPoster}
              onChange={(e) => setNewPoster(e.target.value)}
            />
            <button type="submit">Add to Watchlist</button>
          </form>
          <small>Tip: Paste a direct image URL for the poster.</small>
        </section>

        <section className="movies-grid">
          <div className="search-bar-container">
            <h2>Your Watchlist ({filteredMovies.length} {filteredMovies.length === movies.length ? 'movies' : 'results'})</h2>
            <input
              type="text"
              placeholder="Search movies by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {filteredMovies.length === 0 ? (
            <p className="empty-message">
              {searchTerm ? 'No movies match your search.' : 'Your watchlist is empty. Add some movies!'}
            </p>
          ) : (
            <div className="grid">
              {filteredMovies.map(movie => (
                <div key={movie.id} className={`movie-card ${movie.watched ? 'watched' : ''}`}>
                  <div className="poster-container">
                    <img 
                      src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'} 
                      alt={`${movie.title} poster`}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=Poster+Not+Found'; }}
                    />
                    <div className="overlay">
                      <button onClick={() => toggleWatched(movie.id)} className="watched-btn">
                        {movie.watched ? '✓ Watched' : 'Mark as Watched'}
                      </button>
                    </div>
                  </div>
                  {editingId === movie.id ? (
                    <form onSubmit={updateMovie} className="edit-form">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        value={editingDesc}
                        onChange={(e) => setEditingDesc(e.target.value)}
                      />
                      <input
                        type="url"
                        placeholder="Poster URL"
                        value={editingPoster}
                        onChange={(e) => setEditingPoster(e.target.value)}
                      />
                      <div className="edit-buttons">
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="movie-info">
                      <h3>{movie.title}</h3>
                      {movie.desc && <p>{movie.desc}</p>}
                      <div className="actions">
                        <button onClick={() => startEditing(movie)}>Edit</button>
                        <button onClick={() => deleteMovie(movie.id)} className="delete">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;