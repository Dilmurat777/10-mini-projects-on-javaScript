const mainEl = document.getElementById('main');
const formEl = document.getElementById('form');
const searchEl = document.getElementById('search');


const APIURL = "https://api.github.com/users/";

getUser('')

async function getUser(username) {
	const resp = await fetch(APIURL + username);
	const respData = await resp.json();

	createUserCard(respData);

	getRepos(username);
};

async function getRepos(username) {
	const resp = await fetch(APIURL + username + '/repos');
	const respData = await resp.json();

	addReposToCard(respData);
}

function createUserCard(user) {

	const cardHTML = `
		<div class='card'>
			<div>
				<img class='avatar' src='${user.avatar_url}' alt='${user.name}'/>
			</div>
			<div class='user-info'>
				<h2>${user.name}</h2>
				<p>${user.bio}</p>
				<ul class='info'>
					<li>${user.followers} <strong>Followers</strong></li>
					<li>${user.following} <strong>Following</strong></li>
					<li>${user.public_repos} <strong>Repos</strong></li>
				</ul>
				<h4>Projects:</h4>
				<div id='repos'></div>
			</div>
		</div>
	`;


	mainEl.innerHTML = cardHTML;
}

function addReposToCard(repos) {
	const reposEl = document.getElementById('repos');

	repos.sort((a, b) => b.stargazers_count - a.stargazers_count).forEach((repo) => {
		const repoEl = document.createElement('a');
		repoEl.classList.add('repo')

		repoEl.href = repo.html_url;
		repoEl.target = '_blank';
		repoEl.innerText = repo.name;

		reposEl.appendChild(repoEl)
	})

	console.log(repos)
}

formEl.addEventListener('submit', (e) => {
		e.preventDefault();

		const user = searchEl.value;

		if(user) {
			getUser(user);
			searchEl.value = ''
		}
})