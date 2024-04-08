
// https://shorturl.at/ovNRV

import { z } from 'zod'; 

const envSchema = z.object({
    PORT: z.coerce.number().min(1000, 'PORT should be greater than 1000').default(3000), 
    CLIENT_URL: z.string().url(),
    MONGODB_URI: z.string().url('MongoDB URI is invalid, please check your environment variable'), 
    DB_NAME: z.string().default('codebin'),
});

/**
 * Validates the environment variables based on the defined schema.
 * If any of the variables are invalid, it will log an error and exit the process.
 * Returns the validated environment variables.
 */
function validateEnv() {
    try {
        const validatedEnv: Readonly<z.infer<typeof envSchema>> = envSchema.parse(process.env); // Parse and make the object read-only (immutable) - can also use Object.freeze to explicitly make the env immuatable
        return validatedEnv;
    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error('❌ Invalid environment variables', err.message);
        } else {
            console.error(err);
        }
        process.exit(1);
    }
}


const config = validateEnv();


export default config;


