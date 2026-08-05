// ===============================
// Argilleus Music Library
// Homepage & Search Engine
// ===============================

const musicGrid = document.getElementById("musicGrid");
const searchInput = document.getElementById("searchInput");
const sectionTitle = document.getElementById("sectionTitle");
const sectionSubtext = document.getElementById("sectionSubtext");
const browseBtnWrapper = document.getElementById("browseBtnWrapper");
const themeToggle = document.getElementById("themeToggle");

let fullCatalog = [];

init();

async function init() {
    try {
        const response = await fetch("catalog.json");

        if (!response.ok) {
            throw new Error("Unable to load catalog.");
        }

        fullCatalog = await response.json();

        // Initial render: show featured works
        renderFeatured();

        // Setup real-time search listener
        if (searchInput) {
            searchInput.addEventListener("input", handleSearch);
        }

        // Initialize theme
        initTheme();

    } catch (error) {
        console.error(error);

        if (musicGrid) {
            musicGrid.innerHTML = `<p>Unable to load scores.</p>`;
        }
    }
}

function initTheme() {
    if (!themeToggle) return;

    // Load saved preference
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark-mode");
        themeToggle.textContent = "☀️ Light";
    } else {
        themeToggle.textContent = "🌙 Dark";
    }

    themeToggle.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark-mode");

        const dark = document.documentElement.classList.contains("dark-mode");

        themeToggle.textContent = dark ? "☀️ Light" : "🌙 Dark";

        localStorage.setItem("theme", dark ? "dark" : "light");
    });
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
        // Reset UI back to default featured works view
        if (sectionTitle) sectionTitle.textContent = "Featured Scores";
        if (sectionSubtext) sectionSubtext.style.display = "block";
        if (browseBtnWrapper) browseBtnWrapper.style.display = "block";

        renderFeatured();
        return;
    }

    // Hide subtext/browse button during active search
    if (sectionTitle) sectionTitle.textContent = "Search Results";
    if (sectionSubtext) sectionSubtext.style.display = "none";
    if (browseBtnWrapper) browseBtnWrapper.style.display = "none";

    // Filter catalog matching title, composer, period, instrumentation, or catalogue number
    const matches = fullCatalog.filter(work => {
        const titleMatch = work.title?.toLowerCase().includes(query);
        const composerMatch = work.composer?.toLowerCase().includes(query);
        const periodMatch = work.period?.toLowerCase().includes(query);
        const instrumentMatch = work.instrumentation?.some(inst =>
            inst.toLowerCase().includes(query)
        );
        const catalogueMatch = work.catalogue?.toLowerCase().includes(query);

        return (
            titleMatch ||
            composerMatch ||
            periodMatch ||
            instrumentMatch ||
            catalogueMatch
        );
    });

    renderGrid(matches);
}

function renderFeatured() {
    const featured = fullCatalog
        .filter(work => work.featured)
        .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));

    renderGrid(featured);
}

function renderGrid(works) {
    if (!musicGrid) return;

    musicGrid.innerHTML = "";

    if (works.length === 0) {
        musicGrid.innerHTML =
            `<p class="no-results">No scores found matching your search.</p>`;
        return;
    }

    works.forEach(addCard);
}

function addCard(work) {
    musicGrid.insertAdjacentHTML("beforeend", `
        <article
            class="music-card"
            onclick="window.location.href='${work.page}'">

            <img
                src="${work.thumbnail}"
                alt="${work.title}"
                class="thumbnail"
                onerror="this.src='images/no-thumbnail.png'">

            <p class="composer">
                ${work.composer}
            </p>

            <h3>
                ${work.title}
            </h3>

            <a
                href="${work.pdf}"
                download
                class="download-btn"
                onclick="event.stopPropagation();">
                Download PDF
            </a>

        </article>
    `);
}
