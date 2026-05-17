const service = require('./Service');
const repo = require('./Repository');

exports.list = async (req, res) => {
    const data = await service.getPaginatedUsers(req.query.page);
    res.json(data);
};

exports.remove = async (req, res) => {
    await repo.delete(req.params.id);
    res.json({ message: "User deleted" });
};