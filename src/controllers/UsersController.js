const AppError = require("../utils/AppError")
const knex = require("../database/knex")
const { hash } = require("bcryptjs")

class UsersController {
  async create(request, response){
    const { username, email, password } = request.body

    if(!username || !email || !password){
      throw new AppError("Todos os campos devem estar preenchidos.")
    }

    const userAlreadyExists = await knex("users").where({ email }).first()

    if(userAlreadyExists){
      throw new AppError("O endereço de email já está em uso.")
    }

    const hashedPassword = await hash(password, 8)

    await knex('users').insert({ username, email, password : hashedPassword })

    response.json("Utilizador criado com sucesso.")
  }
}

module.exports = UsersController