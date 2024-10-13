const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesController = require("../controllers/DishesController")
const DishesImageController = require("../controllers/DishesImageController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const dishesController = new DishesController()
const dishesImageController = new DishesImageController()

const upload = multer(uploadConfig.MULTER)

const dishesRoutes = Router();

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.post("/", dishesController.create)
dishesRoutes.put("/", dishesController.update)
dishesRoutes.delete("/:id", dishesController.delete)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.get("/", dishesController.index)
dishesRoutes.patch("/image/:id", upload.single("image"), dishesImageController.update)

module.exports = dishesRoutes;