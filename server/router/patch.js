import express from 'express';
const router = express.Router();
import client from '../db.js';

router.patch('/api', (req, res) => {
	const updatedRating = req.body.rating;
	const videoID = req.body.id;
	const voteQuery = `UPDATE youtube_videos SET rating=${updatedRating} WHERE id=${videoID}`;

	client
		.query(voteQuery)
		.then(() =>
			res.json({
				message: `The vote of the video by the id ${videoID} is successfully updated!`,
			})
		)
		.catch((err) => console.error(err));
});

export default router;
