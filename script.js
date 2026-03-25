// ================= ELEMENT REFERENCES =================

// Modal elements
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.querySelector(".close");

// Portfolio container
const portfolioGrid = document.getElementById("portfolio");

// Scroll-to-top button
const scrollTopBtn = document.getElementById("scrollTopBtn");


// ================= FETCH & RENDER IMAGES =================

fetch("JSON/portfolio.json")
    .then(res => res.json()) // convert JSON file to JS object
    .then(data => {

        data.forEach(item => {
            const img = document.createElement("img");

            // Set image source and alt text
            img.src = item.src;
            img.alt = item.alt;

            // Store category (used for filtering)
            img.dataset.category = item.category;

            // ✅ Lazy loading (loads only when needed)
            img.loading = "lazy";

            // ✅ Fade-in effect (start invisible)
            img.style.opacity = "0";

            // When image finishes loading → fade in
            img.onload = () => {
                img.style.opacity = "1";
            };

            // If there is a full-size image, store it
            if (item.full) {
                img.dataset.full = item.full;
            }

            // Add image to the grid
            portfolioGrid.appendChild(img);
        });
    });


// ================= IMAGE CLICK (OPEN MODAL) =================

portfolioGrid.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {

        const img = e.target;

        // Use full image if exists, otherwise fallback to thumbnail
        const fullImg = img.dataset.full || img.src;

        // Show modal
        modal.style.display = "block";
        modalImg.src = fullImg;

        // Reset scroll to top each time modal opens
        modal.scrollTop = 0;
    }
});


// ================= MODAL CLOSE EVENTS =================

// Close with ESC key
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal.style.display = "none";
    }
});

// Close with X button
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close when clicking outside image
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});


// ================= FILTER FUNCTION =================

function filterImages(category) {
    const images = document.querySelectorAll(".portfolio-grid img");

    images.forEach(img => {

        // Safety check
        if (!img.dataset.category) {
            img.style.display = "none";
            return;
        }

        // Support multiple categories per image
        const categories = img.dataset.category.split(" ");

        if (category === "all" || categories.includes(category)) {
            img.style.display = "block";
            img.style.opacity = "1";
        } else {
            // Fade out before hiding
            img.style.opacity = "0";
            setTimeout(() => img.style.display = "none", 200);
        }
    });
}


// ================= SCROLL TO PORTFOLIO =================

function goToPortfolio(category) {
    filterImages(category);

    document.getElementById("portfolio").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ================= MOBILE SWIPE DOWN TO CLOSE MODAL =================

let startY = 0;

// Detect touch start
modal.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
});

// Detect touch end
modal.addEventListener("touchend", e => {
    const endY = e.changedTouches[0].clientY;

    // If swipe down is big enough → close modal
    if (endY - startY > 100) {
        modal.style.display = "none";
    }
});


// ================= SCROLL TO TOP BUTTON =================

// Show button after scrolling down
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
});

// Scroll smoothly to top
scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// ================= MENU ACTIVE STATE =================

document.querySelectorAll(".menu-bar div").forEach(btn => {
    btn.addEventListener("click", () => {

        // Remove active from all
        document.querySelectorAll(".menu-bar div")
            .forEach(b => b.classList.remove("active"));

        // Add active to clicked
        btn.classList.add("active");
    });
});

// ================= BURGER MENU =================

function toggleBurger() {
    const btn = document.getElementById("burgerBtn");
    const menu = document.getElementById("burgerMenu");
    btn.classList.toggle("open");
    menu.classList.toggle("open");
}

function burgerNav(category) {
    // Reuse existing functions — no behaviour change
    goToPortfolio(category);

    // Close the burger menu after selection
    document.getElementById("burgerBtn").classList.remove("open");
    document.getElementById("burgerMenu").classList.remove("open");
}