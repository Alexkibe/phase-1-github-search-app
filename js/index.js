document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector("#github-form");
  const userList = document.querySelector('#user-list');
  const reposList = document.querySelector('#repos-list');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let search = e.target.search.value;

    try {
      const users = await searchUsers(search);
      renderUsers(users);
    } catch (error) {
      console.error(error);
    }
  });

  async function searchUsers(search) {
    const url = `https://api.github.com/search/users?q=${search}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items;
  }

  function renderUsers(users) {
    userList.innerHTML = '';
    reposList.innerHTML = '';

    users.forEach(user => {
      const userCard = createUserCard(user);
      const repoButton = userCard.querySelector('.repo-button');

      repoButton.addEventListener('click', async () => {
        try {
          const repos = await getUserRepos(user.repos_url);
          renderRepos(repos);
        } catch (error) {
          console.error(error);
        }
      });

      userList.appendChild(userCard);
    });
  }

  async function getUserRepos(url) {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  function renderRepos(repos) {
    repos.forEach(repo => {
      const repoCard = createRepoCard(repo);
      reposList.appendChild(repoCard);
    });
  }

  function createUserCard(user) {
    const userCard = document.createElement('li');
    userCard.className = 'all-users';
    userCard.innerHTML = `
      <div class='content'>
        <h3> User: ${user.login}</h3>
        <p> URL: ${user.html_url}</p>
        <div class ='repos'>
          <button class='repo-button' style='margin-bottom: 25px'>
            Repositories
          </button>
        </div>
        <img src=${user.avatar_url} />
      </div>
    `;

    return userCard;
  }

  function createRepoCard(repo) {
    const repoCard = document.createElement('li');
    repoCard.innerHTML = `
      <h4> ${repo.name} </h4>
      <p> ${repo.html_url}</p>
    `;

    return repoCard;
  }
});


