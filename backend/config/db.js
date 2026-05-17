// connect database
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();


const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env

const sql = neon(`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`);

const query = async (text, params) => {
    try {
        return await sql(text, params);
    } catch (err) {
        console.error('Database Error:', err);
        throw err;
    }
};

module.exports = { query };