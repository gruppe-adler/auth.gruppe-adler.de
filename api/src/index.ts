import 'reflect-metadata';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';

import * as express from 'express';

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';

import { User, Group, UserGroup } from './models';
import v1Router from './v1';

const sequelize =  new Sequelize({
    dialect: 'sqlite',
    storage: join(__dirname, '../data/database.sqlite'),
    logging: false
});

sequelize.addModels([ User, Group, UserGroup ]);
sequelize.sync();

const app = express();

// cors
app.use(cors({
    credentials: true,
    origin: [
        new RegExp('gruppe-adler\.de$', 'i'),
        new RegExp('localhost:[0-9]+$', 'i'),
        new RegExp('127.0.0.1:[0-9]+$', 'i'),
        new RegExp('127.0.0.1$', 'i'),
        new RegExp('localhost$', 'i')
    ]
}));

// body and cookie parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// logger
app.use(morgan('short'));

// api
app.use('/api/v1/', v1Router);

// avatars
app.use('/avatars/', express.static(join(__dirname, '../data/avatars')));

// frontend
app.use('/', express.static(join(__dirname, '../frontend')));
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/index.html'));
});

const {
    PORT = 80
} = process.env;

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});

