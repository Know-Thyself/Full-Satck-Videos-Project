import express from 'express';
const router = express.Router();
import client from '../db.js';

router.get('/', async (req, res) => {
	const videosAscQuery = 'SELECT * FROM youtube_videos ORDER BY rating ASC';
	try {
		const result = await client.query(videosAscQuery);
		res.json(result.rows);
	} catch (error) {
		res.status(500).send(error);
	}
});

export default router;