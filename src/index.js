const addBtn = document.querySelector('#new-toy-btn');
const toyForm = document.querySelector('.container');
let addToy = false;

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy;
  if (addToy) {
    toyForm.style.display = 'block';
    // submit listener here
  } else {
    toyForm.style.display = 'none';
  }
});

const TOYAPI = 'http://localhost:3000/toys/';

const toyContainer = document.getElementById('toy-collection');
function fetchToys() {
  fetch(TOYAPI)
    .then((response) => response.json())
    .then((toyData) => toyData.forEach(renderToy))
    .catch((error) => console.error('Error fetching toys...', error));
}

function renderToy(toy) {
  const { id, name, image, likes } = toy;
  toyContainer.innerHTML += `<div class="card" data-id=${id}>
    <h2>${name}</h2>
    <img src="${image}" class="toy-avatar" />
    <p>${likes} Like</p>
    <button class="like-btn">Like <3</button>
  </div>`;

  // const toyCard = document.createElement('div');
  // toyCard.setAttribute('class', 'card');
  // toyCard.dataset.id = id

  // const header = document.createElement('h2');
  // header.innerHTML = name;

  // const cardImage = document.createElement('img');
  // cardImage.className = 'toy-avatar';
  // cardImage.src = image;

  // const subHeader = document.createElement('p');
  // subHeader.innerHTML = `${likes} Likes`;

  // const button = document.createElement('button');
  // button.innerHTML = 'Like <3';
  // button.className = 'like-btn';

  // toyCard.append(header, cardImage, subHeader, button);
  // toyContainer.append(toyCard);
}

const newToyForm = document.querySelector('.add-toy-form');
newToyForm.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const image = event.target.image.value;
  event.target.reset();
  postNewToy({ name, image, likes: 0 });
}

function postNewToy(newToyObj) {
  fetch(TOYAPI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(newToyObj),
  })
    .then((resp) => resp.json())
    .then((newToy) => renderToy(newToy))
    .catch((error) => console.error('Error posting toy', error));
}

toyContainer.addEventListener('click', handleClick);

function handleClick(event) {
  if (event.target.className === 'like-btn') {
    handleLike(event);
  }
}

function handleLike(event) {
  const toyId = event.target.parentElement.dataset.id;
  const likeCountNode = event.target.previousElementSibling;
  const newLikeCount = parseInt(likeCountNode.innerHTML) + 1;
  //optimistic rendering of new like count
  likeCountNode.innerHTML = `${newLikeCount} Likes`;

  //sending the likeCountNode tag for pessimistic rendering
  postIncreasedLike(toyId, newLikeCount, likeCountNode);
}

function postIncreasedLike(toyId, newLikeCount, likeCountNode) {
  fetch(TOYAPI + toyId, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ likes: newLikeCount }),
  })
    .then((resp) => resp.json())
    // uncomment line below for pessimistic render and comment out line 95
    //.then((data) => (likeCountNode.innerHTML = `${newLikeCount} Likes`))
    .catch((error) => console.error('Error posting toy', error));
}

fetchToys();
