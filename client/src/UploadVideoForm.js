import React, { useState } from 'react';
//import Button from 'react-bootstrap/Button';
import { Button } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';

const UploadVideoForm = ({ addNewVideo }) => {
  const [reveal, setReveal] = useState(false);
  const [controller, setController] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [newVideo, setNewVideo] = useState({});

  const addVideo = () => {
    setReveal(true);
  };
  const submitNewVideo = (e) => {
    e.preventDefault();
    setController(true);
    setNewVideo({ id: Date.now(), title: title, url: url, rating: '', posted: new Date().toString() });
    addNewVideo(title, url);
    setTitle('');
    setUrl('');
    setController(false)
  };

  // if (controller) {
  //   const rules = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(newVideo),
  //   };
  //   fetch('http://127.0.0.1:5000', rules)
  //     .then(response => response.json())
  //     .then(data => console.log(data));
  // }

  return (
    <div>
      <Button onClick={addVideo} className='add-button' variant='contained' color='primary'>
        Add Video
      </Button>
      <form
        onSubmit={submitNewVideo}
        className={reveal ? 'reveal-form' : 'd-none'}
        action='submit'
      >
        <div className='form-group'>
          <label className='form-label text-light' htmlFor='Title'>
            Title
          </label>
          <input
            type='text'
            className='form-control'
            id='title'
            name='title'
            placeholder='Enter a title'
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
        <div className='form-group'>
          <label className='form-label text-light' htmlFor='url'>
            URL
          </label>
          <input
            type='text'
            className='form-control'
            id='url'
            name='url'
            placeholder='Enter a url'
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
          <small id='info' className='form-text text-muted'>
            Please make sure you enter a valid YouTube url.
          </small>
        </div>
        <Button type='submit' className='submit-btn' variant='contained' color='primary'>
          Upload
        </Button>
      </form>
    </div>
  );
};

export default UploadVideoForm;