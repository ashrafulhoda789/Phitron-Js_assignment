let group = [];
window.addEventListener('load', () => {
    loadDrinks();
});

function loadDrinks() {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=a')

    .then(res => res.json())
    .then(data => {
        if (data.drinks) displayDrinks(data.drinks);
        else document.getElementById('drink-container').innerHTML = "<h3>No Default Drinks Found</h3>";
    })
    .catch(() => {
        document.getElementById('drink-container').innerHTML = "<h3>Failed to load data</h3>";
    });
}

function displayDrinks(drinks) {
    const container = document.getElementById('drink-container');
    container.innerHTML = "";

    drinks.forEach(drink => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
        <h3>${drink.strDrink}</h3>
        <p><b>Category:</b> ${drink.strCategory}</p>
        <p>${drink.strInstructions.slice(0, 15)}...</p>
        <button onclick="addToGroup('${drink.strDrink}')">Add to Group</button>
        <button onclick="showDetails('${drink.idDrink}')">Details</button>
        `;
        container.appendChild(div);
    });
}

function searchDrink() {
    const searchText = document.getElementById('search-input').value.trim();

    if (searchText === "") {
        alert("Please enter a drink name!");
        return;
    }

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`)
        .then(res => res.json())
        .then(data => {
            if (data.drinks) displayDrinks(data.drinks.slice(0, 8));
            else document.getElementById('drink-container').innerHTML = "<h3>No Drink Found </h3>";
        })
        .catch(() => {
            document.getElementById('drink-container').innerHTML = "<h3>Error while searching!</h3>";
        });
}

function addToGroup(drinkName) {
    if (group.includes(drinkName)) {
        alert("This drink is already added!");
        return;
    }

    if (group.length === 7) {
        alert("You can’t add more than 7 drinks!");
        return;
    }
    group.push(drinkName);
    updateGroupList();
}
function updateGroupList() {
    const list = document.getElementById('group-list');
    list.innerHTML = "";
    group.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });
    document.getElementById('count').innerText = group.length;
}

function showDetails(id) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data => {
            const drink = data.drinks[0];
            document.getElementById('modal-body').innerHTML = `
                <h2>${drink.strDrink}</h2>
                <p class="modal-item"><b>Category:</b> ${drink.strCategory}</p>
                <p class="modal-item"><b>Glass:</b> ${drink.strGlass}</p>
                <p class="modal-item"><b>Type:</b> ${drink.strAlcoholic}</p>
                <p class="modal-item"><b>Instructions:</b> ${drink.strInstructions}</p>
                <img class="modal-item" src="${drink.strDrinkThumb}" width="100%">
            `;
            document.getElementById('detailsModal').style.display = 'block';
        });
}

function closeModal() {
    document.getElementById('detailsModal').style.display = 'none';
}