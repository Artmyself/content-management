import { neon } from '@neondatabase/serverless';
import 'dotenv/config';


const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env
const connectionURL = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`;


const sql = neon(connectionURL);

export const query = async (text, params) => {
    try {
        const result = await sql(text, params);
        return result;
    } catch (err) {
        console.error('Database Connection Error:', err);
        throw err;
    }
};