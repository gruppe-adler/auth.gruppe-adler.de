import * as express from 'express';
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize-typescript';

import { User } from './models/user.model';
import { Group } from './models/group.model';

import { UserRouter } from './routers/user.router';
import { GroupRouter } from './routers/group.router';

const sequelize =  new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
});

sequelize.addModels([ User, Group ]);
sequelize.sync({ force: true });

const app = express();

const {
    PORT = 3000,
} = process.env;

app.get('/', (req: Request, res: Response) => {
    res.status(200).json(sequelize.options);
});

app.use('/user', UserRouter);
app.use('/group', GroupRouter);

app.listen(PORT, () => {
    console.log('server started at http://localhost:'+PORT);
});