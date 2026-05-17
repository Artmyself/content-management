const repo = require('./Repository');
exports.getPaginatedUsers = async (page = 1) => {
    const limit = 10;
    const offset = (page - 1) * limit;
    const users = await repo.findAll(limit, offset);
    const total = await repo.count();
    return { users, total, pages: Math.ceil(total / limit) };
};