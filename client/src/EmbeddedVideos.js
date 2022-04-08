import React from 'react';
import PropTypes from 'prop-types';

const EmbeddedVideo = ({ id, loading }) => {
	return (
		<>
			{loading ? (<iframe
			className='embedded-video'
			width='560'
			height='215'
			src={`https://www.youtube.com/embed/${id}`}
			title='YouTube video player'
			frameBorder='0'
			allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
			allowFullScreen /> 
			) : (
				<span className='loading-span'>Loading video...</span>
			)}
		</>
	);
};

EmbeddedVideo.propTypes = {
	id: PropTypes.string.isRequired,
};

export default EmbeddedVideo;
