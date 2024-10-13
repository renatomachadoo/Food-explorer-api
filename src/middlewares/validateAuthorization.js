const knex = require("../database/knex")
const AppError = require("../utils/AppError")

function validateAuthorization(requiredRoles){
    return async (request, response, next) => {
        const user_id = request.user.id

        const user = await knex("users").where({ id : user_id }).first()

        if(!user){
            throw new AppError("Utilizador não encontrado.")
        }

        if(!requiredRoles.includes(user.role)){
            throw new AppError("Não autorizado.", 401)
        }

        return next()
    }
}

module.exports = validateAuthorization