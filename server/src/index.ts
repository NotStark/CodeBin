import express from 'express';
import config from './config/config';
import cors from 'cors';
import connectDb from './db';
import router from './routes/paste.route';
import { getIp, runCronJob } from './utils';
import morgan from 'morgan';

const app = express();

// MIDDLEWARES
app.use(cors({
    origin: config.CLIENT_URL,
    methods: 'GET,POST',
    credentials: true
}));

app.use(morgan('dev')) // log every request to the console

app.use(express.json({ limit: '120kb' }));

app.use('/api/v1', router);


// STARTING SERVER AND MONGOOSE CLIENT
connectDb().then(() => {
    const localIpAddress = getIp();
    app.listen(config.PORT, () => {
        
        runCronJob(); // run cron job
        console.log(`Server running on port http://localhost:${config.PORT} ${localIpAddress && `or http://${localIpAddress}:${config.PORT}`} in ${app.settings.env} mode`);
    })
}).catch((err : Error) => {
    console.error('Error connecting to MongoDB:', err);
})

