const AppError = require("../utils/AppError")
const knex = require("../database/knex")

class FavoriteDishesController{
    async create(request, response){
        const { dishId } = request.body
        const user_id = request.user.id

        if(!dishId){
            throw new AppError("O prato não está identificado.")
        }

        const dishExists = await knex("dishes").where({ id : dishId }).first()

        if(!dishExists){
            throw new AppError("Prato não encontrado.")
        }

        const alreadyInFavorites = await knex("favorite_dishes").where({ user_id : user_id, dish_id : dishExists.id }).first()

        if(alreadyInFavorites){
            throw new AppError("Este prato já está nos favoritos.")
        }

        await knex("favorite_dishes").insert({ user_id : user_id, dish_id : dishExists.id })

        return response.json("Prato adicionado aos favoritos com sucesso.")
    }

    async delete(request, response){
        const { dish_id } = request.params
        const user_id = request.user.id

        await knex("favorite_dishes").where({ user_id : user_id, dish_id : dish_id }).del()

        return response.json("Prato removido dos favoritos com sucesso.")
    }
}

module.exports = FavoriteDishesController