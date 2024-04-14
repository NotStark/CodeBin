
// https://shorturl.at/ovNRV
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

const envSchema = z.object({
    // coerce converts the value to the specified type
    PORT: z.coerce.number().min(1000, { message: 'PORT should be greater than 1000' }).default(3000),
    MONGODB_URI: z.string().url({ message: 'MongoDB URI is invalid, please check your environment variable' }),
    DB_NAME: z.coerce.string().default('codebin'),
    CLIENT_URL: z.string().url().or(z.string().default('*'))
});

/**
 * Validates the environment variables based on the defined schema.
 * If any of the variables are invalid, it will log an error and exit the process.
 * Returns the validated environment variables.
 */
function validateEnv() {
    try {
        const validatedEnv = envSchema.readonly().parse(process.env); // Parse and make the object read-only (immutable) - can also use Object.freeze to explicitly make the env immuatable
        return validatedEnv;
    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error('❌ Invalid environment variables', fromZodError(err).toString());
        } else {
            console.error(err);
        }
        process.exit(1);
    }
}


const config = validateEnv();


export default config;


