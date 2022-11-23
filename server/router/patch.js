import express from 'express';
const router = express.Router();
import client from '../db.js';

router.patch('/', (req, res) => {
	const updatedRating = req.body.rating;
	const videoId = req.body.id;
	const voteQuery = `UPDATE youtube_videos SET rating=${updatedRating} WHERE id=${videoId}`;
	client
		.query(voteQuery)
		.then(() =>
			res.json({
				message: `The number of likes of the video by the id ${videoId} is successfully updated!`,
			})
		)
		.catch((err) => console.error(err));
});

export default router;
