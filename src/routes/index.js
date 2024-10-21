const { Router } = require("express")

const usersRouter = require("./users.routes")
const dishesRouter = require("./dishes.routes")
const sessionsRouter = require("./sessions.routes")
const favoriteDishesRouter = require("./favoriteDishes.routes")
const dishesCategoryRouter = require("./dishesCategory.routes")

const routes = Router()

routes.use("/users", usersRouter)
routes.use("/dishes", dishesRouter)
routes.use("/sessions", sessionsRouter)
routes.use("/favorite_dishes", favoriteDishesRouter)
routes.use("/dishes_category", dishesCategoryRouter)

module.exports = routes