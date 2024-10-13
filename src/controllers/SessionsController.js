const AppError = require("../utils/AppError")
const knex = require("../database/knex")
const { compare } = require("bcryptjs")
const authConfig = require("../configs/auth")
const { sign } = require("jsonwebtoken")

class SessionsController{
    async create(request, response){
        const { email, password } = request.body

        if(!email || !password){
            throw new AppError("E-mail ou palavra-passe não preenchidos.")
        }

        const user = await knex("users").where({ email }).first()

        if(!user){
            throw new AppError("E-mail ou palavra-passe incorretos.")
        }

        const passwordMatched = await compare(password, user.password)

        if(!passwordMatched){
            throw new AppError("E-mail ou palavra-passe incorretos.")
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({}, secret, {
            subject : String(user.id),
            expiresIn
        })

        delete user.password

        return response.json({ user, token })
    }
}

module.exports = SessionsController