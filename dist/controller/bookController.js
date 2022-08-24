"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getSingleBook = exports.getBooks = exports.createBooks = void 0;
const uuid_1 = require("uuid");
const book_1 = require("../model/book");
const user_1 = require("../model/user");
const utils_1 = require("../utils/utils");
async function createBooks(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const verified = req.user;
        const validationResult = utils_1.createBookSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await book_1.BookInstance.create({
            id,
            ...req.body,
            authorsID: verified.id,
        });
        if (req.headers["postman-token"]) {
            return res.status(201).json({
                msg: `You have successfully created a book`,
                record,
            });
        }
        else {
            return res.redirect("/author/dash");
        }
    }
    catch (err) {
        return res.status(500).json({
            msg: "failed to create",
            route: "/create",
        });
    }
}
exports.createBooks = createBooks;
async function getBooks(req, res, next) {
    try {
        const record = await book_1.BookInstance.findAll({
            include: [
                {
                    model: user_1.AuthorInstance,
                    attributes: ["id", "author", "age", "email", "address"],
                    as: "Authors",
                },
            ],
        });
        console.log(record);
        return record;
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read",
            route: "/fetch all books",
        });
    }
}
exports.getBooks = getBooks;
async function getSingleBook(req, res, next) {
    try {
        const { id } = req.params;
        const record = await book_1.BookInstance.findOne({
            where: { id },
            include: [
                {
                    model: user_1.AuthorInstance,
                    attributes: ["id", "author", "age", "email", "address"],
                    as: "Authors",
                },
            ],
        });
        if (req.headers["postman-token"]) {
            return res.status(200).json({
                msg: "Successfully gotten book information",
                record,
            });
        }
        res.render("updateBook", { record: record });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read single book",
            route: "/read/:id",
        });
    }
}
exports.getSingleBook = getSingleBook;
async function updateBook(req, res, next) {
    console.log("before");
    try {
        console.log("after");
        const { id } = req.params;
        console.log(req.body);
        const { name, isPublished, serialNumber, authorsID } = req.body;
        const validationResult = utils_1.updateBookSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await book_1.BookInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                Error: "Cannot find existing book",
            });
        }
        const updatedrecord = await record.update({
            name: name,
            isPublished: isPublished,
            serialNumber: serialNumber,
            authorsID: authorsID,
        });
        if (req.headers["postman-token"]) {
            return res.status(200).json({
                msg: "You have successfully updated your Book",
                updatedrecord,
            });
        }
        else {
            return res.redirect("/author/dash");
        }
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to update",
            route: "/update/:id",
        });
    }
}
exports.updateBook = updateBook;
async function deleteBook(req, res, next) {
    try {
        const { id } = req.params;
        const record = await book_1.BookInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                msg: "Cannot find Book",
            });
        }
        const deletedRecord = await record.destroy();
        return res.redirect("/author/dash");
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "failed to delete",
            route: "/delete/:id",
        });
    }
}
exports.deleteBook = deleteBook;
//# sourceMappingURL=bookController.js.map