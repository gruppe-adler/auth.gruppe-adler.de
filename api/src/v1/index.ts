import * as graphqlExpress from 'express-graphql';
import { Router } from 'express';
import { buildSchemaSync } from 'type-graphql';

import resolvers from './resolvers';
import { AuthRouter } from './AuthRouter';

const router = Router();

const schema = buildSchemaSync({ resolvers });

router.use('/graphql', graphqlExpress(req =>({
    schema,
    graphiql: true,
    rootValue: req
})));

router.use(AuthRouter);

export default router;