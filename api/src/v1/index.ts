import * as graphqlExpress from 'express-graphql';
import { Router } from 'express';
import { buildSchemaSync } from 'type-graphql';

import resolvers from './resolvers';
import { JwtService } from '../utils/JwtService';
import { AvatarRouter } from './AvatarRouter';

const router = Router();

const schema = buildSchemaSync({ resolvers });

router.use(JwtService.extractUserMiddleware);

router.use('/', AvatarRouter);

router.use('/graphql', graphqlExpress((req, res) => ({
    schema,
    graphiql: true,
    context: { request: req, response: res }
})));

export default router;
