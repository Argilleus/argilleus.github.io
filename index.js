// ===============================
// Argilleus Music Library
// Homepage
// ===============================

const musicGrid = document.getElementById("musicGrid");

loadFeaturedScores();

async function loadFeaturedScores() {

    try {

        const response = await fetch("catalog.json");

        if (!response.ok) {
            throw new Error("Unable to load catalog.");
        }

        const catalog = await response.json();

        const featured = catalog
            .filter(work => work.featured)
            .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999))

        featured.forEach(addFeaturedCard);

    }

    catch (error) {

        console.error(error);

        musicGrid.innerHTML = `
            <p>
                Unable to load featured scores.
            </p>
        `;

    }

}

function addFeaturedCard(work) {

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
