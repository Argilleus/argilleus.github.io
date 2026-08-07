async function loadComposition() {

    const container = document.getElementById("compositionContent");

    try {

        const response = await fetch("../catalog.json");

        if (!response.ok) {
            throw new Error("Unable to load catalog.");
        }

        const catalog = await response.json();

        // Get filename without .html
        const slug = window.location.pathname
            .split("/")
            .pop()
            .replace(".html", "");

        const work = catalog.find(item => item.slug === slug);

        if (!work) {

            container.innerHTML = `
                <h2>Work not found</h2>
                <p>This edition does not exist in the catalog.</p>
            `;

            return;
        }

        document.title = `${work.title} | Argilleus Music Library`;

        // Dynamically update the meta description tag
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute(
                "content",
                `Free engraved edition of ${work.composer}'s ${work.title}. Download the PDF from Argilleus Music Library.`
            );
        }

        // Build the download section based on whether parts are available
        let downloadSectionHtml = "";

        if (work.parts && work.parts.length > 0) {
            const partsList = work.parts
                .map(part => `
                    <li>
                        <div class="part-info">
                            ${part.thumbnail ? `<img src="../${part.thumbnail}" alt="${part.name} preview" class="part-thumbnail">` : ''}
                            <span class="part-name">${part.name}</span>
                        </div>
                        <a href="../${part.pdf}" download class="download-btn part-btn">Download PDF</a>
                    </li>
                `)
                .join("");

            downloadSectionHtml = `
                <div class="parts-download-container">
                    <h3>Download Score & Parts</h3>
                    <ul class="parts-list">
                        ${partsList}
                    </ul>
                </div>
            `;
        } else {
            downloadSectionHtml = `
                <a
                    href="../${work.pdf}"
                    download
                    class="download-btn">

                    Download PDF

                </a>
            `;
        }

        container.innerHTML = `

    <h2>${work.title}</h2>

    <img
        src="../${work.thumbnail}"
        alt="${work.title}"
        class="composition-thumbnail">

    <table class="composition-info">

        <tr>
            <th>Composer</th>
            <td>${work.composer}</td>
        </tr>

        <tr>
            <th>Title</th>
            <td>${work.title}</td>
        </tr>

        <tr>
            <th>Year of Composition</th>
            <td>${work.year}</td>
        </tr>

        <tr>
            <th>Century</th>
            <td>${work.century}</td>
        </tr>

        <tr>
            <th>Period</th>
            <td>${work.period}</td>
        </tr>

        <tr>
            <th>Instrumentation</th>
            <td>${work.instrumentation.join(", ")}</td>
        </tr>

    </table>

    ${downloadSectionHtml}

    <section class="composition-description">

        <h3>About the Work</h3>

        <p>${work.about}</p>

        <h3>About this Edition</h3>

        <p>
            This edition has been newly engraved by Argilleus from public
            domain sources. It has been prepared for clear on-screen reading
            and high-quality printing while maintaining a clean and
            consistent engraving style.
        </p>

        <h3>Printing Instructions</h3>

        <p>
            If you're going to print this sheet music, use standard A4 paper, print on both sides and flip on long edge.
            Print all pages in order without removing any page, even if the page is blank. 
            The pdf is already formatted for printing, and the sheet music was engraved with page-turning in mind.
        </p>
    
    </section>

`;

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `
            <h2>Error</h2>
            <p>Unable to load this composition.</p>
        `;

    }

}

loadComposition();
