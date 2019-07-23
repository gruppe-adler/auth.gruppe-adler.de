import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
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
    storage: '../data/database.sqlite'
});

sequelize.addModels([ User, Group, UserGroup ]);
sequelize.sync({ force: true });

const app = express();

app.use(cookieParser());

app.use(cors({ credentials: true, origin: [ new RegExp('gruppe-adler\.de$', 'i'), new RegExp('gruppe-adler\.de:8080$', 'i')] }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set Access-Control-Allow Headers
// app.all('/*', (req: Request, res: Response, next: NextFunction) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, POST, DELETE, CONNECT, OPTIONS, TRACE, PATCH');
//     next();
// });

const {
    PORT = 80,
} = process.env;

app.use('/api/user', UserRouter);
app.use('/api/group', GroupRouter);
app.use('/api', AuthRouter);

app.use('/', express.static(join(__dirname, '../frontend')));

app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});
