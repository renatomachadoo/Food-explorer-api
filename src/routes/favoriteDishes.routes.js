const { Router } = require("express")

const FavoriteDishesController = require("../controllers/FavoriteDishesController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const favoriteDishesController = new FavoriteDishesController()

const favoriteDishesRoutes = Router();

favoriteDishesRoutes.use(ensureAuthenticated)

favoriteDishesRoutes.post("/", favoriteDishesController.create)
favoriteDishesRoutes.delete("/:dish_id", favoriteDishesController.delete)

module.exports = favoriteDishesRoutes;