"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUsers = void 0;
const db_1 = require("../db");
const catchAsync_1 = require("../utils/catchAsync");
// TODO -> limited to admin only
exports.getUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const users = await db_1.prisma.users.findMany({});
    res.status(200).json(users);
});
exports.updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const email = req.params.email;
    const user = await db_1.prisma.users.findUnique({
        where: {
            email: email,
        },
    });
    if (!user)
        res.status(404).send('User Not Found');
    await db_1.prisma.users.update({
        where: { email },
        data: req.body,
    });
    res.status(200).json({ message: 'Update success' });
});
exports.deleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const email = req.params.email;
    const user = await db_1.prisma.users.findUnique({
        where: {
            email: email,
        },
    });
    if (!user)
        res.status(404).send('User Not Found');
    await db_1.prisma.users.delete({ where: { email } });
    res.status(200).send('User Delete Successfully.');
});
