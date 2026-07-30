const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".music-card");
const resultCount = document.getElementById("resultCount");

function filterCards() {

    const search = searchInput.value.toLowerCase().trim();

    let visible = 0;

    cards.forEach(card => {

        const text = [
            card.dataset.title,
            card.dataset.composer,
            card.dataset.period,
            card.dataset.instrument
        ].join(" ").toLowerCase();

        if (text.includes(search)) {
            card.style.display = "";
            visible++;
        } else {
            card.style.display = "none";
        }

    });

    resultCount.textContent = visible;

}

searchInput.addEventListener("input", filterCards);

filterCards();
