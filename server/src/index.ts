import express from 'express';
import config from './config/config';
import cors from 'cors';
import connectDb from './db';
import router from './routes/paste.route';
import { getIp , runCronJob } from './utils';


const app = express();

app.use(cors({
    origin: config.CLIENT_URL,
    credentials: true
}));

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
})

app.use(express.json({ limit: '120kb' }));

app.use('/api/v1', router);

connectDb().then(() => {
    const localIpAddress = getIp();
    app.listen(config.PORT, () => {
        runCronJob(); // run cron job
        console.log(`Server running on port http://localhost:${config.PORT} ${localIpAddress && `or http://${localIpAddress}:${config.PORT}`}`);
    })
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
})

