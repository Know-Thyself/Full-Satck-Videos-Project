import React from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';

const LikeDislikeDeleteButtons = ({ video, videos, rating, id, stateUpdater, videoRemover }) => {
  const voteUpdater = (videoObj, totalVote) => {
    let updatedVideo = { ...videoObj, rating: totalVote };
    let newData = [...videos];
    const i = newData.findIndex((video) => video.id === videoObj.id);
    newData[i] = updatedVideo;

    const requestBody = updatedVideo;
    fetch('/api', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Field-Name': 'Accept-Patch' }, body: JSON.stringify(requestBody) })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      })
      .catch((err) => console.log(err));

    return stateUpdater(newData);
  };

  return (
    <div className='buttons-container'>
      <ThumbDownAltIcon
        onClick={() => voteUpdater(video, rating - 1)}
        className='dislike'
        fontSize='large'
        variant='contained'
      />
      <Button
        id={id}
        onClick={() => videoRemover(id)}
        variant='contained'
        color='secondary'
        className='delete-button'
        startIcon={<DeleteIcon />}
      >
        Delete
      </Button>
      <ThumbUpAltIcon
        onClick={() => voteUpdater(video, rating + 1)}
        className='like'
        fontSize='large'
        variant='contained'
      />
    </div>
  );

};

export default LikeDislikeDeleteButtons;