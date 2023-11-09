const mealsEl = document.querySelector('.meals');
const favoriteContainer = document.getElementById('fav-meals');
const searchTerms = document.getElementById('search-terms');
const searchBtn = document.getElementById('search');
const mealPopup = document.getElementById('meal-popup');
const closePopupBtn = document.querySelector('.close-popup');
const mealInfoEl = document.querySelector('#meal-info');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  const respData = await resp.json();

  if (respData.meals) {
    const randomMeal = respData.meals[0];
    addMeal(randomMeal, true);
  } else {
    console.log('No meal data found.');
  }
}

async function getMealById(id) {
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
  const respData = await resp.json();
  console.log(respData)
  
  if (respData.meals) {
    const meal = respData.meals[0];
    return meal;
  } else {
    return null;
  }
}

async function getMealBySearch(term) {
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);
  const respData = await resp.json();
  const meals = respData.meals;
    return meals

}

function addMeal(mealData, random = false) {
  const meal = document.createElement('div');
  meal.classList.add('meal');

  meal.innerHTML = `
        <div class="meal-header">
					${random ? `<span class="random">Random Recipe</span>` : ''}
					<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
				</div>
				<div class="meal-body">
					<h4>${mealData.strMeal}</h4>
					<button class="fav-btn">
						<i class="fa-solid fa-heart"></i>
					</button>
				</div>`;

  const btn = meal.querySelector('.meal-body .fav-btn');
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) {
      removeMealLS(mealData.idMeal);
      btn.classList.remove('active');
    } else {
      addMealLS(mealData.idMeal);
      btn.classList.add('active');
    }
    favoriteContainer.innerHTML = '';
    fetchFavMeals();
  });

  meal.addEventListener('click', () => {
    showMealInfo(mealData)
  })

  mealsEl.appendChild(meal);
}

function addMealLS(mealId) {
  const mealIds = getMealLS();

  localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
  const mealIds = getMealLS();

  localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

function getMealLS() {
  const mealIds = JSON.parse(localStorage.getItem('mealIds'));

  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {

  favoriteContainer.innerHTML = '';

  const mealIds = getMealLS();


  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];

    meal = await getMealById(mealId);

    addMealFav(meal);
  }
}

function addMealFav(mealData) {

  if (mealData) {
    const favMeal = document.createElement('li');

    favMeal.innerHTML = `
      <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
      <span>${mealData.strMeal}</span>
      <button class='clear'><i class="fa-solid fa-xmark"></i></i></button>
    `;

    const btn = favMeal.querySelector('.clear')

    btn.addEventListener('click', () => {
      removeMealLS(mealData.idMeal)

      fetchFavMeals()
    }) 
    favMeal.addEventListener('click', () => {
      showMealInfo(mealData)
    })

    favoriteContainer.appendChild(favMeal);
  } 
}

searchBtn.addEventListener('click', async () => {
  mealsEl.innerHTML = '';
  const search = searchTerms.value;
  const meals = await getMealBySearch(search)

  if(meals) {
    meals.forEach((meal) => {
      addMeal(meal)
    })
  }
})

function showMealInfo(mealData) {

  mealInfoEl.innerHTML = '';

  const mealEl = document.createElement('div');

  const ingredients = [];

  for(let i = 1; i <= 20; i++) {
    if(mealData['strIngredient'+i]) {
      ingredients.push(`${mealData ['strIngredient'+i]} - ${mealData ['strMeasure'+i]}`)
    } else {
      break
    }
  }

  mealEl.innerHTML = `
          <h1>${mealData.strMeal}</h1>
					<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
					<p>
            ${mealData.strInstructions}
					</p>
          <h3>Ingredients:</h3>
          <ul class='ingredient'>
            ${ingredients.map((ing) => `
            <li>${ing}</li>
            `).join('')}
          </ul>
  `

  mealInfoEl.appendChild(mealEl)

  mealPopup.classList.remove('hidden')
}


closePopupBtn.addEventListener('click', () => {
  mealPopup.classList.add('hidden');
})