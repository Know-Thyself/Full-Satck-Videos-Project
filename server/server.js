import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
// import cookieParser from 'cookie-parser';
// import session from 'express-session';
dotenv.config();
const Client = pg.Client;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../client/build')));

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const client = new Client({
	connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
	connectionTimeoutMillis: 5000,
	ssl: {
		rejectUnauthorized: false,
	},
});

//var conString = isProduction ? process.env.DATABASE_URL : connectionString; //Can be found in the Details page
// var client = new Client(conString);
// client.connect(function (err) {
// 	if (err) {
// 		return console.error('could not connect to postgres', err);
// 	}
// 	client.query('SELECT NOW() AS "theTime"', function (err, result) {
// 		if (err) {
// 			return console.error('error running query', err);
// 		}
// 		console.log(result.rows[0].theTime);
// 		// >> output: 2018-08-23T14:02:57.117Z
// 		client.end();
// 	});
// });

//const client = new Client(process.env.DATABASE_URL);

client.connect();
// let sessionOptions = {
// 	secret: process.env.SESSION_SECRET,
// 	saveUninitialized: true,
// 	resave: true,
// 	cookie: {
// 		sameSite: 'Lax',
// 		secure: false,
// 		maxAge: 1000 * 60 * 60 * 24 * 30, // One month
// 	},
// };

// if (process.env.NODE_ENV !== 'dev') {
// 	sessionOptions.cookie.secure = true;
// 	sessionOptions.cookie.sameSite = 'none';
// }
// app.use(session(sessionOptions));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, DELETE, PUT, PATCH'
	);
	res.setHeader('Access-Control-Allow-Headers', 'application/json');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.header(
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Methods',
		'Access-Control-Allow-Origin',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

app.get('/', (req, res) => {
	res.json({ message: 'Server is ready!' });
});

app.get('/api', async (req, res) => {
	const videosQuery = 'SELECT * FROM youtube_videos';
	try {
		const result = await client.query(videosQuery);
		res.json(result.rows);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get('/api/sort/asc', async (req, res) => {
	const videosAscQuery = 'SELECT * FROM youtube_videos ORDER BY rating ASC';
	try {
		const result = await client.query(videosAscQuery);
		res.json(result.rows);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get('/api/sort/dec', async (req, res) => {
	const videosDescQuery = 'SELECT * FROM youtube_videos ORDER BY rating DESC';
	try {
		const result = await client.query(videosDescQuery);
		res.json(result.rows);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/api', (req, res) => {
	let title = req.body.title;
	let url = req.body.url;
	let newVideo = {
		id: Date.now(),
		title: title,
		url: url,
		rating: 0,
		posted: new Date().toString(),
	};
	const regExp =
		/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
	const match = url.match(regExp);
	if (title !== '' && match) {
		const newID = newVideo.id;
		const newTitle = newVideo.title;
		const newURL = newVideo.url;
		const newRating = newVideo.rating;
		const newPosted = newVideo.posted;

		const InsertQuery =
			'INSERT INTO youtube_videos (id, title, url, rating, posted) VALUES ($1, $2, $3, $4, $5)';
		client
			.query(InsertQuery, [newID, newTitle, newURL, newRating, newPosted])
			.then(() =>
				res.status(201).json({
					Result: 'Success!',
					Message: `Your video is successfully uploaded and given a new id: ${Date.now()}!`,
				})
			)
			.catch((err) => console.error(err));
	} else if (title === '') {
		return res.json({
			Result: 'failure',
			message: 'Title should not be empty!',
		});
	} else if (url === '') {
		return res.status(400).json({
			Result: 'failure',
			message: 'You have not entered a url!',
		});
	} else if (!match) {
		return res.status(400).json({
			Result: 'failure',
			message: 'Invalid url!',
		});
	}
});

app.patch('/api', (req, res) => {
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

app.get('/api/:id', async (req, res) => {
	const id = req.params.id;
	const query = `SELECT * FROM youtube_videos WHERE id = ${id}`;
	try {
		const result = await client.query(query);
		if (result.rowCount === 1) res.json(result.rows);
		else
			res.status(404).json({
				message: `Video by id: ${id} could not be found!`,
			});
	} catch (error) {
		res.status(500).send(error);
	}
});

app.delete('/api/:id', (req, res) => {
	const id = req.params.id;
	const deleteQuery = `DELETE FROM youtube_videos WHERE id=${id}`;
	if (id) {
		client
			.query(deleteQuery)
			.then(() =>
				res.json({
					Server: `A video by the id: ${id} is successfully deleted!`,
				})
			)
			.catch((err) => console.error(err));
	} else
		res.status(404).json({
			Server: `A video by the id: ${id} could not be found!`,
		});
});

app.listen(port, () => {
	console.log(
		`Server is listening on port ${port} and ready to accept requests!`
	);
});
