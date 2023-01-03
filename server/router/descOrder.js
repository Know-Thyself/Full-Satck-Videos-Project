import express from 'express'
const router = express.Router()
import client from '../db.js'

router.get('/', async (req, res) => {
	const videosDescQuery = 'SELECT * FROM youtube_videos ORDER BY rating DESC'
	try {
		const result = await client.query(videosDescQuery)
		res.json(result.rows)
	} catch (error) {
		res.status(500).send(error)
	}
})

export default router
