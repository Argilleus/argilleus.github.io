const searchInput = document.getElementById("searchInput");

const cards = document.querySelectorAll(".music-card");
const resultCount = document.getElementById("resultCount");

const composerFilters = document.querySelectorAll(".composer-filter");
const periodFilters = document.querySelectorAll(".period-filter");
const instrumentFilters = document.querySelectorAll(".instrument-filter");

function checkedValues(nodeList) {
    return [...nodeList]
        .filter(cb => cb.checked)
        .map(cb => cb.value.toLowerCase());
}

function filterCards() {

    const search = searchInput.value.toLowerCase();

    const composers = checkedValues(composerFilters);
    const periods = checkedValues(periodFilters);
    const instruments = checkedValues(instrumentFilters);

    let visible = 0;

    cards.forEach(card => {

        const title = card.dataset.title.toLowerCase();
        const composer = card.dataset.composer.toLowerCase();
        const period = card.dataset.period.toLowerCase();
        const instrument = card.dataset.instrument.toLowerCase();

        const matchesSearch =
            search === "" ||
            title.includes(search) ||
            composer.includes(search);

        const matchesComposer =
            composers.length === 0 ||
            composers.includes(composer);

        const matchesPeriod =
            periods.length === 0 ||
            periods.includes(period);

        const matchesInstrument =
            instruments.length === 0 ||
            instruments.includes(instrument);

        if (
            matchesSearch &&
            matchesComposer &&
            matchesPeriod &&
            matchesInstrument
        ) {
            card.style.display = "";
            visible++;
        } else {
            card.style.display = "none";
        }

    });

    resultCount.textContent = visible;

}

searchInput.addEventListener("input", filterCards);

document.querySelectorAll("input[type=checkbox]").forEach(cb =>
    cb.addEventListener("change", filterCards)
);

filterCards();
