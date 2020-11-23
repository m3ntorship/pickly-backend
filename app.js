const config = require('config');
const dotenv = require('dotenv');
const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const expressWinston = require('express-winston');
const postRouter = require('./posts/post.routes');
const imageRouter = require('./images/image.routes');
const userRouter = require('./users/user.routes');
const voteRouter = require('./votes/vote.routes');
const feedbackRouter = require('./feedbacks/feedback.routes');
const reportRouter = require('./reports/reports.routes');
const { protector } = require('./users/user.controller');
const errorHandler = require('./middleware/errorhandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./m3ntorship-Posts-1.0.0-swagger.json');

const logger = require('./util/logger');
dotenv.config({ path: resolve('secrets', '.env') });

const app = express();

app.use(cors(), express.json());

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: false,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    blacklistedMetaFields: config.get('log_blacklisted_meta_fields'),
    headerBlacklist: ['authorization', 'cookie']
  })
);

app.get('/health', (req, res) => {
  res.json({ ok: true });
});
app.use('/', swaggerUi.serve);
app.get('/', swaggerUi.setup(swaggerDocument));

// protect all routes
app.use(protector);

app.get('/protected', (req, res) => {
  res.json({ protected: true });
});
app.use('/votes', voteRouter);
app.use('/posts', postRouter);
app.use('/images', imageRouter);
app.use('/users', userRouter);
app.use('/feedbacks', feedbackRouter);
app.use('/reports', reportRouter);

app.use(
  expressWinston.errorLogger({
    winstonInstance: logger,
    blacklistedMetaFields: config.get('log_blacklisted_meta_fields'),
    headerBlacklist: ['authorization', 'cookie']
  })
);

app.use(errorHandler);

module.exports = app;
