const repo = require('./Repository');

exports.getByArtist = async (req, res) => {
    const songs = await repo.findByArtist(req.params.artistId);
    res.json(songs);
};

exports.create = async (req, res) => {
    const song = await repo.create(req.body);
    res.status(201).json(song);
};