import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url'
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const port = process.env.PORT || 8000
import getVideos from './router/getVideos.js'
import ascOrder from './router/ascOrder.js'
import descOrder from './router/descOrder.js'
import postVideo from './router/postVideo.js'
import patch from './router/patch.js'
import getById from './router/getById.js'
import deleteVideo from './router/deleteVideo.js'

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, '../client/build')))

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH')
	res.setHeader('Access-Control-Allow-Headers', 'application/json')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
	res.header(
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Methods',
		'Access-Control-Allow-Origin',
		'Origin, X-Requested-With, Content-Type, Accept'
	)
	next()
})

app.get('/', (req, res) => {
	res.json({ message: 'Server is ready!' })
})

app.use('/videos', getVideos)
app.use('/videos/sort/asc', ascOrder)
app.use('/videos/sort/dec', descOrder)
app.use('/videos', postVideo)
app.use('/videos', patch)
app.use('/videos/:id', getById)
app.use('/videos/:id', deleteVideo)

app.listen(port, () => {
	console.log(
		`Server is listening on port ${port} and ready to accept requests!`
	)
})
