import express from 'express';
const router = express.Router();
import client from '../db.js';

router.get('/', async (req, res) => {
	const videosQuery = 'SELECT * FROM youtube_videos';
	try {
		const result = await client.query(videosQuery);
		res.json(result.rows);
	} catch (error) {
		res.status(500).send(error);
	}
});

export default router;
