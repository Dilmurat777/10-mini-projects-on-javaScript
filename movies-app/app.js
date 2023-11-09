const mainEl = document.querySelector('main');
const formEl = document.querySelector('#form');
const searchEl = document.querySelector('#search');

const APIURL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1';
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

// initially at fav movies
getMovies(APIURL);

formEl.addEventListener('submit', (e) => {
	e.preventDefault();
	
	const textSearch = searchEl.value;
	if(textSearch) {
		getMovies(SEARCHAPI + textSearch);
		searchEl.value = '';
	}
})


async function getMovies(url) {
  const resp = await fetch(url);
  const respData = await resp.json();
	showMovies(respData.results)
  return respData;
}

function showMovies(movies) {
	// clean mean
	mainEl.innerHTML = '';

	movies.forEach((movie) => {
    const { overview, poster_path, vote_average, title } = movie;
    const moveEl = document.createElement('div');
    moveEl.classList.add('movie');

    moveEl.innerHTML = `
			<img src="${IMGPATH + poster_path}" alt="${title}">
			<div class="movie-info">
				<h3>${title}</h3>
				<span class="${getClassByRate(vote_average)}">${vote_average}</span>
			</div>
			<div class="overview">
			<h4>Overview:</h4>
				${overview}
			</div>
		`;
    mainEl.appendChild(moveEl);
  });
}

function getClassByRate(vote) {
	if(vote >= 8) {
		return 'green'
	} else if(vote >= 5) {
		return 'orange'
	} else {
		return 'red'
	}
}




