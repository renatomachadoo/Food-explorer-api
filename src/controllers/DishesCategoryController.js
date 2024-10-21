const knex = require("../database/knex")

class DishesCategoryController {
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

    const dishesByCategory = []

    dishesToReturn.map(( dish ) => {
        if(!dishesByCategory.find( dishByCategory => dishByCategory.category === dish.category )){
            dishesByCategory.push({
                category : dish.category,
                dishes : [dish]
            })
        }else{
            const dishCategory = dishesByCategory.find( dishByCategory => dishByCategory.category === dish.category )
            dishCategory.dishes.push(dish)
        }
    })

    return response.json(dishesByCategory)
  }
}

module.exports = DishesCategoryController