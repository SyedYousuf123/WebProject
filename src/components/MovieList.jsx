import React from 'react';

const MovieList = ({ movies, deleteMovie, startEdit }) => {
  return (
    <div className="movie-list">
      <h2>Your Watchlist ({movies.length} movies)</h2>
      {movies.length === 0 ? <p>No movies yet! Add one above.</p> : (
        <ul>
          {movies.map(movie => (
            <li key={movie.id} className="movie-card">
              <h3>{movie.title} {movie.watched && '(Watched ✅)'}</h3>
              <p>Genre: {movie.genre || 'N/A'}</p>
              <p>Rating: {movie.rating || 'N/A'}/10</p>
              <p>Notes: {movie.notes || 'None'}</p>
              <button onClick={() => startEdit(movie)}>Edit</button>
              <button onClick={() => deleteMovie(movie.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MovieList;