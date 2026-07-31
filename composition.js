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

            <a
                href="../${work.pdf}"
                download
                class="download-btn">

                Download PDF

            </a>

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
