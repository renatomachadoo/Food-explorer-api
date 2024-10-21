const { Router } = require("express")

const DishesCategoryController = require("../controllers/DishesCategoryController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const validateAuthorization = require("../middlewares/validateAuthorization")

const dishesCategoryController = new DishesCategoryController()

const dishesCategoryRoutes = Router();

dishesCategoryRoutes.use(ensureAuthenticated)

dishesCategoryRoutes.get("/", validateAuthorization(["customer","admin"]), dishesCategoryController.index)

module.exports = dishesCategoryRoutes;