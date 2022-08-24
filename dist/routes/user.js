"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = require("../controller/userController");
router.get("/forgetpassword", (req, res) => {
    res.render("forgetpassword");
});
router.get("/table", (req, res) => {
    res.render("dashBoard");
});
router.get("/register", (req, res) => {
    res.render("register");
});
router.post("/register", userController_1.RegisterUser);
router.get("/success", (req, res, next) => {
    res.render("successReg");
});
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", userController_1.LoginUser);
router.get("/dash", userController_1.renderUserDashBoard);
router.get("/logout", userController_1.LogOut);
router.get("/refresh", (req, res) => {
    res.render("logoutRefresh");
});
router.get("/author/:id", async (req, res, next) => {
    let record = await (0, userController_1.getUser)(req, res, next);
    res.status(200).json({ message: "successfully fetched a user", record });
});
router.get("/updateauthors/:id", userController_1.updateUser);
router.get("/deleteauthors/:id", userController_1.deleteUser);
router.get("/authors", userController_1.getUsers);
exports.default = router;
//# sourceMappingURL=user.js.map