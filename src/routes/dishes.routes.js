const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesController = require("../controllers/DishesController")
const DishesImageController = require("../controllers/DishesImageController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const validateAuthorization = require("../middlewares/validateAuthorization")

const dishesController = new DishesController()
const dishesImageController = new DishesImageController()

const upload = multer(uploadConfig.MULTER)

const dishesRoutes = Router();

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.post("/", validateAuthorization(["admin"]), dishesController.create)
dishesRoutes.put("/", validateAuthorization(["admin"]), dishesController.update)
dishesRoutes.delete("/:id", validateAuthorization(["admin"]), dishesController.delete)
dishesRoutes.get("/:id", validateAuthorization(["customer", "admin"]), dishesController.show)
dishesRoutes.get("/", validateAuthorization(["customer","admin"]), dishesController.index)
dishesRoutes.patch("/image/:id", validateAuthorization(["admin"]), upload.single("image"), dishesImageController.update)

module.exports = dishesRoutes;