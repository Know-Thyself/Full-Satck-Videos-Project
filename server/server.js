const express = require('express');
const { Client } = require('pg');
const app = express();
const path = require('path');
const exampleresponse = require('../exampleresponse.json');
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));

// const DATABASE_URL = 'postgres://augnfuyknjbavd:06bbf2f03faf5b7ab282ed1fc5ab4b08fa68fdd30815055cd82138e8f1c81c24@ec2-54-228-99-58.eu-west-1.compute.amazonaws.com:5432/d55e7mui6ph6gm';


const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  host: 'ec2-54-228-99-58.eu-west-1.compute.amazonaws.com',
  port: 5432,
  user: 'augnfuyknjbavd',
  database: 'd55e7mui6ph6gm',
  password: '06bbf2f03faf5b7ab282ed1fc5ab4b08fa68fdd30815055cd82138e8f1c81c24'
});

client.connect();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH');
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

const videosQuery = 'SELECT * FROM videos';
const videosAscQuery = 'SELECT * FROM videos ORDER BY rating ASC';
const videosDescQuery = 'SELECT * FROM videos ORDER BY rating DESC';

app.get('/api', async (req, res) => {
  if (!req.query.order) {
    try {
      const result = await client.query(videosQuery);
      res.json(result.rows);
    } catch (error) {
      res.status(500).send(error);
    }
  } else if (req.query.order === 'asc') {
    try {
      const result = await client.query(videosAscQuery);
      res.json(result.rows);
    } catch (error) {
      res.status(500).send(error);
    }
  } else if (req.query.order === 'desc') {
    try {
      const result = await client.query(videosDescQuery);
      res.json(result.rows);
    } catch (error) {
      res.status(500).send(error);
    }
  }
})


app.get("/", (req, res) => {
  res.json({ message: 'Server is ready!' });
});

let videos = [];
videos.push(exampleresponse);
function* flatten(array, depth) {
  if (depth === undefined) {
    depth = 1;
  }
  for (const item of array) {
    if (Array.isArray(item) && depth > 0) {
      yield* flatten(item, depth - 1);
    } else {
      yield item;
    }
  };
};

videos = [...flatten(videos, Infinity)];

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
    videos.push(newVideo);
    res.status(201).json({
      Result: 'Success!',
      Message: `Your video is successfully uploaded and given a new id: ${Date.now()}!`,
    });
  } else if (title === '') {
    return res.json({
      Result: 'failure',
      message: 'Title should not be empty!',
    });
  } else if (url === '') {
    return res.status(400).json({ Result: 'failure', message: 'You have not entered a url!' });
  } else if (!match) {
    return res.status(400).json({ Result: 'failure', message: 'Invalid url!' });
  }

});

app.patch('/api', (req, res) => {
  let updatedVideo = req.body;
  let newData = [...videos];
  const i = newData.findIndex((video) => video.id === updatedVideo.id);
  newData[i] = updatedVideo;
  videos = newData;
  res.json({ message: `The rating of the video by the id: ${req.body.id} is successfully updated!` })
});

app.get('/api/:id', (req, res) => {
  const id = req.params.id;
  const videoById = videos.find((video) => video.id.toString() === id);
  if (videoById) res.json(videoById);
  else
    res.status(404).json({ message: `Video by id: ${id} could not be found!` });
});

app.delete('/api/:id', (req, res) => {
  const id = req.params.id;
  const remainingVideos = videos.filter(video => video.id !== id);
  videos = remainingVideos;
  if (id) {
    res.json({ Server: `A video by the id: ${id} is successfully deleted!` });
  } else res
    .status(404)
    .json({ Server: `A video by the id: ${id} could not be found!` });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
