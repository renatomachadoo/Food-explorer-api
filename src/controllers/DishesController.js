const AppError = require("../utils/AppError")
const knex = require("../database/knex")
const DiskStorage = require("../providers/DiskStorage")
class DishesController {
  async create(request, response){
    const { name, description, price, category, ingredients } = request.body

    if(!name || !description || !price || !category || !ingredients){
      throw new AppError("Todos os campos têm de estar preenchidos.")
    }

    let categoryId
    const categoryExists = await knex("categories").where({ name : category }).first()

    if(categoryExists){
      categoryId = categoryExists.id
    }else {
      const [categoryCreated] = await knex("categories").insert({ name : category})
      categoryId = categoryCreated
    }

    const [dishId] = await knex("dishes").insert({ name, description, price, category_id : categoryId})

    const ingredientsToInsert = ingredients.map( ingredient => {
      return {
        name : ingredient,
        dish_id : dishId
      }
    })

    await knex("ingredients").insert(ingredientsToInsert)

    return response.json({ message : "Prato criado com sucesso.", dish_id : dishId})
  }

  async update(request, response){
    const { name, description, image, price, category, ingredients, dishId } = request.body

    if(!dishId){
      throw new AppError("Nenhum prato encontrado.")
    }

    const [dishExists] = await knex("dishes").where({ id : dishId })

    if(!dishExists){
      throw new AppError("Nenhum prato encontrado.")
    }
    
    let categoryExists = await knex("categories").where({ name : category }).first()
    if(!categoryExists){
      const [categoryId] = await knex("categories").insert({ name : category})
      categoryExists = categoryId
    }

    await knex('ingredients').where({ dish_id: dishExists.id }).del()
    
    dishExists.name = name ?? dishExists.name
    dishExists.description = description ?? dishExists.description
    dishExists.price = price ?? dishExists.price
    dishExists.category_id = categoryExists.id

    const ingredientsToInsert = ingredients.map( ingredient => {
      return {
        name : ingredient,
        dish_id : dishExists.id
      }
    })

    await knex("ingredients").insert(ingredientsToInsert)
    await knex("dishes").where({ id : dishExists.id }).update(dishExists)

    return response.json("Prato atualizado com sucesso.")
  }

  async delete(request, response){
    const { id } = request.params

    const diskStorage = new DiskStorage()

    const dish = await knex("dishes").where({ id }).first()

    if(dish && dish.image){
      await diskStorage.deleteFile(dish.image)
    }

    await knex('dishes').where({ id }).del()

    if(dish && dish.category_id){
      const dishWithCategory = await knex("dishes").where({ category_id : dish.category_id }).first()
  
      if(!dishWithCategory){
        await knex("categories").where({ id : dish.category_id }).del()
      }
    }

    return response.json()
  }

  async show(request, response){
    const { id } = request.params

    const dish = await knex("dishes").where({ id }).first()

    if(!dish){
      throw new AppError("Prato não encontrado.")
    }

    const category = await knex("categories").where({ id : dish.category_id }).first()
    
    const ingredients = await knex("ingredients").select("name").where({ dish_id : dish.id })

    delete dish.category_id

    dish.category = category.name
    dish.ingredients = ingredients

    return response.json(dish)
  }

  async index(request, response){
    const { search } = request.query
    const user_id = request.user.id

    const userFavorites = await knex("favorite_dishes").where({ user_id })

    const dishesQuery = knex("ingredients")
      .select([
        "dishes.id",
        "dishes.name",
        "dishes.description",
        "dishes.price",
        "dishes.category_id",
        "dishes.image"
      ])
      .innerJoin('dishes', {'dishes.id': 'ingredients.dish_id'})
      .groupBy("dishes.id");

    if (search) {
      dishesQuery
        .whereLike("ingredients.name", `%${search}%`)
        .orWhereLike("dishes.name", `%${search}%`);
    }

    const dishes = await dishesQuery;

    const categories = await knex("categories")

    const allIngredients = await knex("ingredients")

    const dishesToReturn = dishes.map( dish => {
      dish.ingredients = []
      allIngredients.map( ingredient => {
        if(ingredient.dish_id === dish.id){
          dish.ingredients.push(ingredient.name)
        }
      })

      const matchedCategory = categories.find(category => category.id === dish.category_id)
      dish.category = matchedCategory.name
      delete dish.category_id

      const isFavoriteMatched = userFavorites.find( userFavorite => userFavorite.dish_id === dish.id)
      if(isFavoriteMatched){
        dish.isFavorite = true
      }else{
        dish.isFavorite = false
      }

      return dish
    })

    return response.json(dishesToReturn)
  }
}

module.exports = DishesController