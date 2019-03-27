import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize-typescript';

import { User } from './models/user.model';
import { Group } from './models/group.model';

import { UserRouter } from './routers/user.router';
import { GroupRouter } from './routers/group.router';
import { AuthRouter } from './routers/auth.router';

const sequelize =  new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
});

sequelize.addModels([ User, Group ]);
sequelize.sync({ force: true });

const app = express();

app.use(cookieParser());

const bp = bodyParser.json();
app.use(bp);


const {
    PORT = 3000,
} = process.env;

app.get('/', (req: Request, res: Response) => {
    res.status(200).json(sequelize.options);
});

app.use('/user', UserRouter);
app.use('/group', GroupRouter);
app.use('', AuthRouter);

app.listen(PORT, () => {
    console.log('server started at http://localhost:'+PORT);
});