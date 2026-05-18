import { ArtistRepository } from './Repository.js';
import fs from 'fs';
import csv from 'csv-parser';
import { Parser } from 'json2csv';
import { query } from '../../config/db.js';

export const list = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const data = await query(
            `SELECT * FROM artist WHERE name ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
            [`%${search}%`, limit, offset]
        );

        const countRes = await query(`SELECT COUNT(*) FROM artist WHERE name ILIKE $1`, [`%${search}%`]);

        res.json({
            data: data || [],
            total: parseInt(countRes[0].count || 0)
        });
    } catch (err) {
        console.error("Artist List Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};


export const create = async (req, res) => {
    // Debug log: See if the request hits this function
    console.log("POST /api/artists - Payload received:", req.body);

    const { name, dob, gender, address, first_release_year, no_of_albums_released } = req.body;

    try {
        // Validation
        if (!name || !dob) {
            return res.status(400).json({ error: "Name and Date of Birth are required." });
        }

        // Raw SQL Query - Ensure table name 'artist' is correct
        await query(
            `INSERT INTO artist (name, dob, gender, address, first_release_year, no_of_albums_released, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
            [
                name,
                dob,
                gender,
                address,
                parseInt(first_release_year),
                parseInt(no_of_albums_released) // Ensure these are numbers
            ]
        );

        res.status(201).json({ message: "Artist record created successfully!" });
    } catch (err) {
        console.error("Artist Creation DB Error:", err.message);
        res.status(500).json({ error: "Failed to save artist: " + err.message });
    }
};



// EXPORT CSV
export const exportCSV = async (req, res) => {
    try {
        const artists = await ArtistRepository.getAllExport();

        const fields = ['name', 'dob', 'gender', 'address', 'first_release_year', 'no_of_albums_released'];
        const json2csvParser = new Parser({ fields });
        const csvData = json2csvParser.parse(artists);

        res.header('Content-Type', 'text/csv');
        res.attachment('artists_export.csv');
        return res.send(csvData);
    } catch (err) {
        res.status(500).json({ error: "Export failed: " + err.message });
    }
};

// IMPORT CSV
export const importCSV = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                for (const row of results) {
                    await ArtistRepository.create({
                        name: row.name,
                        dob: row.dob,
                        gender: row.gender,
                        address: row.address,
                        first_release_year: parseInt(row.first_release_year),
                        no_of_albums_released: parseInt(row.no_of_albums_released)
                    });
                }
                fs.unlinkSync(filePath); // Delete temp file
                res.json({ message: `${results.length} artists imported successfully` });
            } catch (err) {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                res.status(500).json({ error: "Import failed: " + err.message });
            }
        });
};