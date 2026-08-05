// ===============================
// Argilleus Music Library
// Theme Manager
// ===============================

// Apply the saved theme immediately to avoid a flash of light mode.
if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark-mode");
}

document.addEventListener("DOMContentLoaded", () => {

    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) return;

    function updateIcon() {
        themeToggle.textContent =
            document.documentElement.classList.contains("dark-mode")
                ? "☀︎"
                : "☾";
    }

    updateIcon();

    themeToggle.addEventListener("click", () => {

        document.documentElement.classList.toggle("dark-mode");

        const dark =
            document.documentElement.classList.contains("dark-mode");

        localStorage.setItem(
            "theme",
            dark ? "dark" : "light"
        );

        updateIcon();

    });

});
