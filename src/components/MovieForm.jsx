import React, { useState, useEffect } from 'react';

const MovieForm = ({ addMovie, updateMovie, editingMovie, setEditingMovie }) => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [notes, setNotes] = useState('');
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    if (editingMovie) {
      setTitle(editingMovie.title);
      setGenre(editingMovie.genre);
      setRating(editingMovie.rating);
      setNotes(editingMovie.notes);
      setWatched(editingMovie.watched);
    }
  }, [editingMovie]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const movie = { title, genre, rating, notes, watched };

    if (editingMovie) {
      updateMovie({ ...movie, id: editingMovie.id });
    } else {
      addMovie(movie);
    }

    // Reset form
    setTitle('');
    setGenre('');
    setRating('');
    setNotes('');
    setWatched(false);
    setEditingMovie(null);
  };

  return (
    <form onSubmit={handleSubmit} className="movie-form">
      <h2>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
      <input type="number" min="1" max="10" placeholder="Rating (1-10)" value={rating} onChange={(e) => setRating(e.target.value)} />
      <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <label>
        <input type="checkbox" checked={watched} onChange={(e) => setWatched(e.target.checked)} />
        Watched
      </label>
      <button type="submit">{editingMovie ? 'Update' : 'Add'} Movie</button>
      {editingMovie && <button type="button" onClick={() => setEditingMovie(null)}>Cancel</button>}
    </form>
  );
};

export default MovieForm;