import os from 'node:os'
import cron from 'node-cron';
import PasteModel from './models/paste.model';
import config from './config/config';

/**
 * Retrieves the IPv4 address of the current machine's network interface.
 *
 * @return {string} The IPv4 address of the current machine's network interface.
 */
function getIp() {
    for (const iterator of Object.values(os.networkInterfaces())) {
        return iterator?.find(address => address.family === 'IPv4' && !address.internal)?.address;
    }
}

/*
? Notes
! Deletes Documents where expireAt is not set or set to 0 and createdAt - currentTime > expireAt
? $expr allows us to perform aggregation expressions in a regular query
? $subtract - Subtracts two numbers to return the difference, or two dates to return the difference in milliseconds (https://shorturl.at/lsAMW)
? $gt: checks which value is greater between two fields
*/
function runCronJob() {
    // runs every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
        const currentTime = new Date();
        try {
            const result = await PasteModel.deleteMany({
                'settings.expireAt': { $ne: 0 },
                $expr: {
                    $gt: [{ $subtract: [currentTime, '$createdAt'] }, '$settings.expireAt']
                }
            });
            console.log('Deleted documents:', result.deletedCount);
        } catch (error) {
            console.error('Error deleting documents:', error);
        }
    });
}





export { getIp, runCronJob }