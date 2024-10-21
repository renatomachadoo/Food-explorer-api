const { Router } = require("express")

const UsersController = require("../controllers/UsersController")
const UsersValidateController = require("../controllers/UsersValidateController")

const usersController = new UsersController()
const usersValidateController = new UsersValidateController()

const userRoutes = Router();

userRoutes.post("/", usersController.create)
userRoutes.get("/validate", usersValidateController.index)

module.exports = userRoutes;