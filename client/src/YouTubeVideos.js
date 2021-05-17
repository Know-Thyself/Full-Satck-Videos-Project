import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import Button from '@material-ui/core/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import UploadVideoForm from './UploadVideoForm';
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpAltTwoToneIcon from '@material-ui/icons/ThumbUpAltTwoTone';
import ThumbDownTwoToneIcon from '@material-ui/icons/ThumbDownTwoTone';

const YouTubeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [backupVideos, setBackupVideos] = useState([]);

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then((data) => {
        setVideos(data);
        setBackupVideos(data);
      })
      .catch(err => console.error(err));
  }, []);

  const ascendingOrder = () => {
    fetch('/api/?order=asc')
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
      })
      .catch((err) => console.log(err));
  };

  const descendingOrder = () => {
    fetch('/api/?order=desc')
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
      })
      .catch((err) => console.log(err));
  };

  const addNewVideo = (title, url) => {
    const regExp =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const match = url.match(regExp);
    if (title === '') {
      alert('Title should not be empty!');
    } else if (url === '' || !match) {
      alert('Invalid url!');
    } else
      return setVideos([
        {
          id: Date.now(),
          title: title,
          url: url,
          rating: '',
          posted: new Date().toString(),
        },
        ...videos,
      ]);
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value.toLowerCase());
    const searchResult = videos.filter((video) =>
      video.title.toLowerCase().includes(searchInput)
    );
    setVideos(searchResult);
    if (e.target.value === '') setVideos(backupVideos);
  };

  const incrementRating = (e) => {
    const id = e.target.parentElement.id;
    const likedVideo = videos.find((video) => video.id.toString() === id);
    const updatedRating = likedVideo.rating + 1;
    const updatedVideo = { ...likedVideo, rating: updatedRating }
    const newState = [...videos];
    const i = newState.findIndex((video) => video.id === likedVideo.id);
    newState[i] = updatedVideo;
    setVideos(newState);

    const requestBody = { id: id, rating: updatedRating };
    fetch('/api', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      })
      .catch((err) => console.log(err));
  };

  const decrementRating = (e) => {
    const id = e.target.parentElement.id;
    const dislikedVideo = videos.find((video) => video.id.toString() === id);
    const updatedRating = dislikedVideo.rating - 1;
    const updatedVideo = { ...dislikedVideo, rating: updatedRating }
    const newState = [...videos];
    const i = newState.findIndex((video) => video.id === dislikedVideo.id);
    newState[i] = updatedVideo;
    setVideos(newState);

    const requestBody = { id: id, rating: updatedRating };
    fetch('/api', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)

      })
      .catch((err) => console.log(err));
  };

  const videoRemover = (e) => {
    const id = e.target.parentElement.id;
    fetch(`/api/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      })
      .catch((err) => console.log(err));
    let remainingVideos = videos.filter(
      (video) => video.id.toString() !== id
    );
    return setVideos(remainingVideos);
  };

  return (
    <div key='mainWrapper'>
      <div key='buttonAndSearch' className='add-button-and-search-wrapper'>
        <header className='App-header'>
          <div>
            <Button className='ascending' onClick={ascendingOrder} variant='contained' color='default'>
              Ascending
            </Button>
          </div>
          <div>
            <h1>Video Recommendation</h1>
          </div>
          <div>
            <Button className='descending' onClick={descendingOrder} variant='contained' color='default'>
              Descending
            </Button>
          </div>
        </header>
        <UploadVideoForm addNewVideo={addNewVideo} />
        <div key='input-form' className='search-input-wrapper'>
          <i key='fasIcon' className='fas fa-search'></i>
          <input
            key='search-input'
            type='text'
            className='search-bar'
            placeholder='Search for a video ...'
            value={searchInput}
            onChange={handleSearchInput}
          />
        </div>
      </div>
      <div key='displayWrapper' className='display-wrapper'>
        {videos.map((video, index) => {
          return (
            <div key={index} className='video-and-title'>
              <h4>{video.title}</h4>
              <ReactPlayer
                width='560'
                height='315'
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className='embedded-video'
                allowFullScreen
                frameBorder="0"
                url={video.url}
              />
              <h5 className='rating'>Rating: {video.rating}</h5>
              <h6 className={video.posted ? 'posted' : 'd-none'}>
                Posted: {video.posted}
              </h6>
              <div className='buttons-container'>
                <ThumbDownTwoToneIcon id={video.id}
                  onClick={decrementRating}
                  className='dislike'
                  icon={'ThumbUp'}
                  fontSize='large'
                  aria-hidden='false'
                  variant='contained'
                  style={{ color: 'black' }}
                />
                <Button id={video.id}
                  onClick={videoRemover}
                  variant="contained"
                  color="secondary"
                  className='button'
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
                <ThumbUpAltTwoToneIcon id={video.id}
                  onClick={incrementRating}
                  className='like'
                  icon={'ThumbUp'}
                  fontSize='large'
                  aria-hidden='false'
                  variant='contained'
                  style={{ color: 'black' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default YouTubeVideos;