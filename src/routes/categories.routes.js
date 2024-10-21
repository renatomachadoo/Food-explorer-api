const { Router } = require("express")

const CategoriesController = require("../controllers/CategoriesController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const validateAuthorization = require("../middlewares/validateAuthorization")

const categoriesController = new CategoriesController()

const categoriesRoutes = Router();

categoriesRoutes.use(ensureAuthenticated)

categoriesRoutes.get("/", validateAuthorization(["admin"]), categoriesController.index)

module.exports = categoriesRoutes;