import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import { Sequelize } from 'sequelize-typescript';

import { User } from './models/user.model';
import { Group } from './models/group.model';

import { UserRouter } from './routers/user.router';
import { GroupRouter } from './routers/group.router';
import { AuthRouter } from './routers/auth.router';

const sequelize =  new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

sequelize.addModels([ User, Group ]);
sequelize.sync({ force: true });

const app = express();

app.use(cookieParser());

const bp = bodyParser.json();
app.use(bp);

// set Access-Control-Allow Headers
app.all('/*', (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, POST, DELETE, CONNECT, OPTIONS, TRACE, PATCH');
    next();
});

const {
    PORT = 3000,
} = process.env;

app.use('/api/user', UserRouter);
app.use('/api/group', GroupRouter);
app.use('/api', AuthRouter);

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});
