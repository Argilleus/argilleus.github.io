// ===== Elements =====

const musicGrid = document.getElementById("musicGrid");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");

const composerContainer = document.getElementById("composerFilters");
const periodContainer = document.getElementById("periodFilters");
const instrumentContainer = document.getElementById("instrumentFilters");

let catalog = [];

// ===== Load catalog =====

fetch("catalog.json")
    .then(response => response.json())
    .then(data => {

        catalog = data;

        createFilters();
        renderCards(catalog);

        searchInput.addEventListener("input", filterCatalog);

        document.addEventListener("change", function (e) {

            if (e.target.type === "checkbox") {
                filterCatalog();
            }

        });

    });

// ===== Render cards =====

function renderCards(list) {

    musicGrid.innerHTML = "";

    list.forEach(work => {

        const instruments = work.instrumentation
            .map(i => `<span>${i}</span>`)
            .join("");

        const catalogue = work.catalogue
            ? `<span>${work.catalogue}</span>`
            : "";

        musicGrid.innerHTML += `

<article class="music-card"
onclick="window.location.href='${work.page}'">

    <img
        src="${work.thumbnail}"
        class="thumbnail"
        alt="${work.title}">

    <p class="composer">
        ${work.composer}
    </p>

    <h3>
        ${work.title}
    </h3>

    <div class="tags">

        ${instruments}

        <span>${work.period}</span>

        <span>${work.year}</span>

        ${catalogue}

    </div>

    <a
        href="${work.pdf}"
        download
        class="download-btn"
        onclick="event.stopPropagation();">

        Download PDF

    </a>

</article>

`;

    });

    resultCount.textContent = list.length;

}

// ===== Create filters =====

function createFilters() {

    createCheckboxGroup(
        uniqueValues("composer"),
        composerContainer,
        "composer-filter"
    );

    createCheckboxGroup(
        uniqueValues("period"),
        periodContainer,
        "period-filter"
    );

    createCheckboxGroup(
        uniqueValues("instrumentation"),
        instrumentContainer,
        "instrument-filter"
    );

}

function uniqueValues(property) {

    let values = [];

    catalog.forEach(work => {

        const value = work[property];

        if (Array.isArray(value)) {
            values.push(...value);
        } else {
            values.push(value);
        }

    });

    return [...new Set(values)].sort();

}

function createCheckboxGroup(values, container, className) {

    container.innerHTML = "";

    values.forEach(value => {

        const label = document.createElement("label");

        label.innerHTML = `
            <input
                type="checkbox"
                class="${className}"
                value="${value}">
            ${value}
        `;

        container.appendChild(label);

    });

}

// ===== Helpers =====

function checkedValues(className) {

    return [...document.querySelectorAll("." + className + ":checked")]
        .map(cb => cb.value.toLowerCase());

}

// ===== Filtering =====

function filterCatalog() {

    const search = searchInput.value.toLowerCase().trim();

    const composers = checkedValues("composer-filter");
    const periods = checkedValues("period-filter");
    const instruments = checkedValues("instrument-filter");

    const filtered = catalog.filter(work => {

        const searchable = [

            work.title,
            work.composer,
            work.period,
            work.genre || "",
            work.catalogue || "",
            ...(work.instrumentation || [])

        ].join(" ").toLowerCase();

        const matchesSearch =
            search === "" ||
            searchable.includes(search);

        const matchesComposer =
            composers.length === 0 ||
            composers.includes(work.composer.toLowerCase());

        const matchesPeriod =
            periods.length === 0 ||
            periods.includes(work.period.toLowerCase());

        const matchesInstrument =
            instruments.length === 0 ||
            work.instrumentation.some(i =>
                instruments.includes(i.toLowerCase())
            );

        return (
            matchesSearch &&
            matchesComposer &&
            matchesPeriod &&
            matchesInstrument
        );

    });

    renderCards(filtered);

}
