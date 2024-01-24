
//Querying the DOM elements first
const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");


//function to get recipes
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
  try {

    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();  // converts json data into Javascript object

    recipeContainer.innerHTML = "";
    response.meals.forEach(meal => {
      const recipeDiv = document.createElement('div');
      recipeDiv.classList.add('recipe');
      recipeDiv.innerHTML = `
       <img src = "${meal.strMealThumb}">
       <h3> ${meal.strMeal}</h3>
       <p><span>${meal.strArea}</span>  Dish</p>
       <p> Belongs to <span>${meal.strCategory}</span> Category</p>

     `
      const button = document.createElement('button');
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      //Adding EventListener to recipe button
      button.addEventListener('click', () => {
        openRecipePopup(meal);
      });

      recipeContainer.appendChild(recipeDiv);
    });

  } 
  catch (error) {
    recipeContainer.innerHTML = "<h2>Sorry, error in fetching recipes...</h2>";
  }

}

//function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
  //console.log(meal)
  let ingredientList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientList += `<li>${measure} ${ingredient}</li>`
    }
    else {
      break;
    }
  }
  return ingredientList;
}

//recipe popup function
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
   <h2 class="recipeName"> ${meal.strMeal}</h2>
   <h3> Ingredients: </h3>
   <ul class="ingredientList"> ${fetchIngredients(meal)} </ul>
   <div class="recipeInstructions">
    <h3>Instructions:</h3>
    <p >${meal.strInstructions}</p>
  </div>
  `;


  recipeDetailsContent.parentElement.style.display = "block";
}

recipeCloseBtn.addEventListener('click', () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();   // used to prevent default behaviour of an event
  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML = `<h2>Type the meal in the search-box</h2>`;
    return;
  }
  fetchRecipes(searchInput);
});
