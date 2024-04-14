import express from 'express';
import config from './config/config';
import cors from 'cors';
import connectDb from './db';
import router from './routes/paste.route';
import { getIp, runCronJob } from './utils';
import morgan from 'morgan';


// EXPRESS INSTANCE
const app = express();


// ----------------MIDDLEWARES-----------------
// CORS MIDDLEWARE
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
}));


// LOG EVERY REQUEST TO THE CONSOLE
app.use(morgan('dev'))

// MIDDLEWARE TO PARSE REQUEST BODY
app.use(express.json({ limit: '120kb' }));



app.get("/", (_, res) => {
    res.json({ message: "Server is running!" });
});

app.use('/api/v1', router);

app.all('*', (_, res) => {
    res.status(404).json({ message: 'Not Found' });
})

// ----------------MIDDLEWARES-----------------


// STARTING SERVER AND CONNECTING TO DB
connectDb().then(() => {
    const localIpAddress = getIp();
    app.listen(config.PORT, () => {
        runCronJob(); // run cron job
        console.log(`Server running on port http://localhost:${config.PORT} ${localIpAddress && `or http://${localIpAddress}:${config.PORT}`} in ${app.settings.env} mode`);
    })
}).catch((err: Error) => {
    console.error('Error connecting to MongoDB:', err);
})

