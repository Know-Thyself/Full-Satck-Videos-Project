import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import UploadVideoForm from './UploadVideoForm';
import SearchBar from './SearchBar'
import Title from './Title';
import EmbeddedVideos from './EmbeddedVideos';
import Votes from './Votes';
import LikeDislikeDeleteButtons from './LikeDislikeDeleteButtons';

const YouTubeVideos = () => {
  const [videos, setVideos] = useState([]);
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
    } else {
      let newArray = videos;
      newArray = [
        ...newArray,
        {
          id: Date.now(),
          title: title,
          url: url,
          rating: 0,
          posted: new Date().toString(),
        }
      ];
      console.log(newArray)
      return setVideos(newArray);
    };
  };

  const videoRemover = (id) => {
    const remainingVideos = videos.filter(
      (video) => video.id !== id
    );
    setVideos(remainingVideos);
    fetch(`/api/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      })
      .catch((err) => console.log(err));
  };
  const stateUpdater = (updatedState) => {
    console.log(updatedState)
    let newState = updatedState;
    console.log(newState)
    return setVideos(newState);
  };

  return (
    <div key='mainWrapper'>
      <div key='buttonAndSearch' className='add-button-and-search-wrapper'>
        <Header ascendingOrder={ascendingOrder} descendingOrder={descendingOrder} />
        <UploadVideoForm addNewVideo={addNewVideo} />
        <SearchBar stateUpdater={stateUpdater} videos={backupVideos} />
      </div>
      <div key='displayWrapper' className='main-container'>
        {videos.map((video, index) => {
          const video_id = video.url.split('v=')[1];
          return (
            <div key={index} className='video-and-details-wrapper'>
              <Title title={video.title} />
              <EmbeddedVideos id={video_id} />
              <Votes vote={video.rating} />
              <LikeDislikeDeleteButtons video={video} rating={video.rating} id={video.id} stateUpdater={stateUpdater} videoRemover={videoRemover} videos={videos} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YouTubeVideos;