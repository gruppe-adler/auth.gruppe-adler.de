import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';

import { User } from './models/user.model';
import { Group } from './models/group.model';
import { UserGroup } from './models/user-group.model';

import { UserRouter } from './routers/user.router';
import { GroupRouter } from './routers/group.router';
import { AuthRouter } from './routers/auth.router';

const sequelize =  new Sequelize({
    dialect: 'sqlite',
    storage: join(__dirname, '../data/database.sqlite'),
    logging: false
});

sequelize.addModels([ User, Group, UserGroup ]);
sequelize.sync();

const app = express();

app.use(cookieParser());

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());+

app.use(morgan('short'))

const {
    PORT = 80,
} = process.env;

app.use('/api/v1/user', UserRouter);
app.use('/api/v1/group', GroupRouter);
app.use('/api/v1', AuthRouter);

app.use('/api/avatars/', express.static(join(__dirname, '../data/avatars')));

app.use('/', express.static(join(__dirname, '../frontend')));

app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});
