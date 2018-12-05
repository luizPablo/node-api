require('dotenv-safe').load();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import graphlHTTP from 'express-graphql';
import jwt from 'jsonwebtoken';
import auth from './src/auth';
import schema from './src/graphql/schema';

const PORT = 5000;
const app = express();
app.use(express.json());
app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ttc_db', { useNewUrlParser: true });

app.get('/', (req, res) => {
    return res.json({
        msg: 'Welcome! This is the API for the Sidia challenger...'
    })
});

app.post('/login', auth.login);
app.post('/register', auth.register);

app.use('/graphql', auth.verify, graphlHTTP((req, res) => ({
    schema: schema,
    graphiql: true,
    rootValue: jwt.decode(req.headers['x-access-token']),
})));

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});