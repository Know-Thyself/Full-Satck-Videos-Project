import express from 'express'
const router = express.Router()
import client from '../db.js'

router.get('/', async (req, res) => {
	const id = req.params.id
	const query = `SELECT * FROM youtube_videos WHERE id = ${id}`
	try {
		const result = await client.query(query)
		if (result.rowCount === 1) res.json(result.rows)
		else
			res.status(404).json({
				message: `Video by id: ${id} could not be found!`,
			})
	} catch (error) {
		res.status(500).send(error)
	}
})

export default router
