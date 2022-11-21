import pg from 'pg';
const Client = pg.Client;
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const client = new Client({
	connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
	connectionTimeoutMillis: 5000,
	ssl: {
		rejectUnauthorized: false,
	},
});

client.connect();

export default client;
