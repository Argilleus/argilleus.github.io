const musicGrid = document.getElementById("musicGrid");

const searchInput = document.getElementById("searchInput");

let catalog = [];

fetch("catalog.json")
.then(r => r.json())
.then(data => {

    catalog = data;

    createFilters();

    renderCards(catalog);

});
