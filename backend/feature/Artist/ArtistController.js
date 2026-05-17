import { ArtistRepository } from './Repository.js';
import fs from 'fs';
import csv from 'csv-parser';
import { Parser } from 'json2csv';

export const list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const artists = await ArtistRepository.findAll(limit, offset);
        res.json(artists);
    } catch (err) {
        res.status(500).json({ error: err.message });
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