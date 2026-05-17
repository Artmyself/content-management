import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

// Using your provided connection string
const connectionURL = 'postgresql://neondb_owner:npg_OeG7PIJv1Dwx@ep-morning-resonance-anwkk809-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(connectionURL);

export const query = async (text, params) => {
    try {
        // CHANGE THIS LINE: Add ".query" after "sql"
        const result = await sql.query(text, params);

        console.log("QUERY CHECK >>> ", result)

        // IMPORTANT: sql.query returns an object. 
        // We must return 'result.rows' so the rest of your code gets the data array.
        return result;
    } catch (err) {
        console.error('Database Connection Error:', err);
        throw err;
    }
};