const AppError = require("../utils/AppError")
const knex = require("../database/knex")
const DiskStorage = require("../providers/DiskStorage")

class DishesImageController {
    async update(request, response){
        const { id } = request.params
        const dishImage = request.file.filename

        const diskStorage = new DiskStorage()

        if(!id){
            await diskStorage.deleteTmpFile(dishImage)
            throw new AppError("Prato não encontrado.")
        }

        const dish = await knex("dishes").where({ id }).first()

        if(!dish){
            await diskStorage.deleteTmpFile(dishImage)
            throw new AppError("Prato não encontado.")
        }

        if(dish.image){
            await diskStorage.deleteFile(dish.image)
        }

        await diskStorage.saveFile(dishImage)

        dish.image = dishImage

        await knex("dishes").update(dish).where({ id : dish.id})

        return response.json()
    }
}

module.exports = DishesImageController