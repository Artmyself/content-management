const repo = require('./Repository');

exports.list = async (req, res) => {
    const limit = 10;
    const offset = ((req.query.page || 1) - 1) * limit;
    const artists = await repo.findAll(limit, offset);
    res.json(artists);
};

exports.create = async (req, res) => {
    try {
        const artist = await repo.create(req.body);
        res.status(201).json(artist);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Placeholder for CSV Logic (requires json2csv/csv-parser)
exports.exportCSV = async (req, res) => { res.send("CSV Export logic here"); };
exports.importCSV = async (req, res) => { res.send("CSV Import logic here"); };