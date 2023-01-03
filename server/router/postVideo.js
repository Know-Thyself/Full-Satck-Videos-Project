import express from 'express'
const router = express.Router()
import client from '../db.js'

router.post('/', (req, res) => {
	let title = req.body.title
	let url = req.body.url
	let rating = req.body.rating
	let newVideo = {
		id: Date.now(),
		title: title,
		url: url,
		rating: rating,
		posted: new Date().toString(),
	}
	const regExp =
		/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
	const match = url.match(regExp)
	if (title !== '' && match) {
		const newID = newVideo.id
		const newTitle = newVideo.title
		const newURL = newVideo.url
		const newRating = newVideo.rating
		const newPosted = newVideo.posted

		const InsertQuery =
			'INSERT INTO youtube_videos (id, title, url, rating, posted) VALUES ($1, $2, $3, $4, $5)'
		client
			.query(InsertQuery, [newID, newTitle, newURL, newRating, newPosted])
			.then(() =>
				res.status(201).json({
					Result: 'Success!',
					Message: `Your video is successfully uploaded and given a new id: ${Date.now()}!`,
				})
			)
			.catch((err) => console.error(err))
	} else if (title === '') {
		return res.json({
			Result: 'failure',
			message: 'Title should not be empty!',
		})
	} else if (url === '') {
		return res.status(400).json({
			Result: 'failure',
			message: 'You have not entered a url!',
		})
	} else if (!match) {
		return res.status(400).json({
			Result: 'failure',
			message: 'Invalid url!',
		})
	}
})

export default router
