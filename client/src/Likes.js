import React from 'react';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';

const Likes = ({ video, videos, likes, stateUpdater }) => {
	const voteUpdater = (videoObj, totalVote) => {
		let updatedVideo = { ...videoObj, rating: totalVote };
		let newData = [...videos];
		const i = newData.findIndex((video) => video.id === videoObj.id);
		newData[i] = updatedVideo;

		const requestBody = updatedVideo;
		fetch('/videos', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Field-Name': 'Accept-Patch',
			},
			body: JSON.stringify(requestBody),
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
		stateUpdater(newData);
	};

	function numToStringFormatter(num) {
		return Math.abs(num) >= 1000000
			? Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + 'M'
			: Math.abs(num) >= 1000 && Math.abs(num) < 1000000
			? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'K'
			: Math.sign(num) * Math.abs(num);
	}

	return (
		<div className='likes-container'>
			<ThumbUpAltIcon
				onClick={() => voteUpdater(video, likes + 1)}
				className='like'
				fontSize='large'
				variant='contained'
			/>
			<h3 className='likes'>Votes: {numToStringFormatter(likes)}</h3>
			<ThumbDownAltIcon
				onClick={() => voteUpdater(video, likes - 1)}
				className='dislike'
				fontSize='large'
				variant='contained'
			/>
		</div>
	);
};

export default Likes;
