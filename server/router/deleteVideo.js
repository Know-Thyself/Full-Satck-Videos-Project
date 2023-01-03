import express from 'express'
const router = express.Router()
import client from '../db.js'

router.delete('/', (req, res) => {
	const id = req.params.id
	const deleteQuery = `DELETE FROM youtube_videos WHERE id=${id}`
	if (id) {
		client
			.query(deleteQuery)
			.then(() =>
				res.json({
					Server: `A video by the id: ${id} is successfully deleted!`,
				})
			)
			.catch((err) => console.error(err))
	} else
		res.status(404).json({
			Server: `A video by the id: ${id} could not be found!`,
		})
})

export default router
