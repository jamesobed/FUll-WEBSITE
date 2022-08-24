"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.LogOut = exports.renderUserDashBoard = exports.LoginUser = exports.RegisterUser = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils/utils");
const user_1 = require("../model/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const book_1 = require("../model/book");
async function RegisterUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = utils_1.registerSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const duplicatEmail = await user_1.AuthorInstance.findOne({
            where: { email: req.body.email },
        });
        if (duplicatEmail) {
            return res.status(409).json({
                msg: "Email is used, please change email",
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await user_1.AuthorInstance.create({
            id: id,
            author: req.body.author,
            age: req.body.age,
            email: req.body.email,
            password: passwordHash,
            address: req.body.address,
        });
        return res.redirect("/author/success");
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "failed to register",
            route: "/register",
        });
    }
}
exports.RegisterUser = RegisterUser;
async function LoginUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = utils_1.loginSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const User = (await user_1.AuthorInstance.findOne({
            where: { email: req.body.email },
        }));
        const { id } = User;
        const token = (0, utils_1.generateToken)({ id });
        const validUser = await bcryptjs_1.default.compare(req.body.password, User.password);
        if (!validUser) {
            res.status(401).json({
                message: "Password do not match",
            });
        }
        if (validUser) {
            res
                .cookie("token", token, {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: "strict",
            })
                .cookie("id", id, {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: "strict",
            });
            return res.redirect("/author/dash");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "failed to login",
            route: "/login",
        });
    }
}
exports.LoginUser = LoginUser;
async function renderUserDashBoard(req, res, next) {
    const id = req.cookies.id;
    try {
        const record = await user_1.AuthorInstance.findOne({
            where: { id },
            include: [
                {
                    model: book_1.BookInstance,
                    as: "Books",
                },
            ],
        });
        return res.render("dashBoard", { record });
    }
    catch (error) {
        res.redirect("/author/login");
    }
}
exports.renderUserDashBoard = renderUserDashBoard;
async function LogOut(req, res, next) {
    res.cookie("token", "", {
        maxAge: 0,
        sameSite: "strict",
        httpOnly: true,
    });
    res.cookie("id", "", {
        maxAge: 0,
        sameSite: "strict",
        httpOnly: true,
    });
    if (req.headers["postman-token"]) {
        return res.status(200).json({ msg: "You have successfully logout" });
    }
    else {
        return res.redirect("/author/refresh");
    }
}
exports.LogOut = LogOut;
async function getUsers(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        const record = await user_1.AuthorInstance.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: book_1.BookInstance,
                    as: "Books",
                },
            ],
        });
        return res.status(200).json({
            msg: "You have successfully fetch all authors",
            count: record.count,
            record: record.rows,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read",
            route: "/read",
        });
    }
}
exports.getUsers = getUsers;
async function getUser(req, res, next) {
    try {
        const id = req.params.id;
        const record = await user_1.AuthorInstance.findOne({
            where: { id },
        });
        return record;
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to get user",
            route: "/read",
        });
    }
}
exports.getUser = getUser;
async function updateUser(req, res, next) {
    try {
        const id = req.params.id;
        const { email, password } = req.body;
        const record = await user_1.AuthorInstance.findOne({
            where: {
                id,
            },
        });
        if (!record) {
            return res.status(404).json({ msg: "User not found" });
        }
        const updatedrecord = await record.update({ email, password });
        return res.status(200).json({
            msg: "You have successfully updated a book",
            record,
        });
    }
    catch (error) { }
    {
        res.status(500).json({
            msg: "failed to update",
            route: "/update/:id",
        });
    }
}
exports.updateUser = updateUser;
async function deleteUser(req, res, next) {
    try {
        const id = req.params.id;
        const record = await user_1.AuthorInstance.destroy({
            where: { id },
        });
        return res.status(200).json({
            msg: "You have successfully deleted a book",
            record,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to delete",
            route: "/delete",
        });
    }
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map