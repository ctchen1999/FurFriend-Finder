import express from 'express';
import bodyParser from 'body-parser';
import { router as webhookRouter } from './router/webhookRouter';
import { router as userRouter } from './router/userRouter';
import { router as animalRouter } from './router/animalRouter';
import { cronSchedule as fetchDataSchedule } from './utils/dataSchedule.utils';
import { cronSchedule as sendDataSchedule } from './utils/sendDataSchedule.utils';

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use('/', webhookRouter);
app.use('/api/users', userRouter);
app.use('/api/animals', animalRouter);
app.use('*', (req, res, next) => {
    res.status(404).end('This route is not provided');
});

fetchDataSchedule.start();
sendDataSchedule.start();

const port = process.env.PORT || 2486;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
