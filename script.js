// ================= ELEMENT REFERENCES =================

const modal       = document.getElementById("image-modal");
const modalImg    = document.getElementById("modal-img");
const closeBtn    = document.querySelector(".close");
const portfolioGrid = document.getElementById("portfolio");
const scrollTopBtn  = document.getElementById("scrollTopBtn");

//================== CHANGE LANGUAGE ======================//
const translations = {
  en: {
    nav_all:        "All",
    nav_branding:   "Branding",
    nav_logo:       "Logo",
    nav_prints:     "Prints",
    nav_packaging:  "Packaging",
    nav_about:      "About / Contact",
    intro:          "We make it simple,<br>but unique!",
    intro_sub:      "Click below to explore",
    about_h2:       "graphic designer",
    about_p1:       "Since 2020, I have been working with various companies in Lamia, in the field of brand identity design and advertising, gaining experience through a range of creative projects.",
    about_p2:       "In 2025, I decided to start my own path, placing more focus on quality, attention to detail, and how each project comes together as a whole — with the aim of creating thoughtful solutions that truly respond to each client's needs.",
    about_p3:       "I mainly work on logo design and printed materials such as business cards, menus, flyers, and posters, as well as more personal projects like wedding and baptism invitations.",
    about_p4:       "I'm drawn to simplicity, functionality, and clean aesthetics. For me, every project is an opportunity to create something meaningful and unique.",
    footer:         "© 2025 mly.dsg — Maria Limperi. All rights reserved."
  },
  gr: {
    nav_all:        "Όλα",
    nav_branding:   "Branding",
    nav_logo:       "Λογότυπα",
    nav_prints:     "Εκτυπώσεις",
    nav_packaging:  "Συσκευασία",
    nav_about:      "Σχετικά / Επικοινωνία",
    intro:          "We make it simple,<br>but unique!",
    intro_sub:      "Πατήστε παρακάτω για περισσότερα!",
    name:           "ΜΑΡΙΑ ΛΥΜΠΕΡΗ",
    about_h2:       "γραφίστρια",
    about_p1:       "Από το 2020, συνεργάζομαι με διάφορες επιχειρήσεις στη Λαμία, στον τομέα του brand identity και της διαφήμισης, αποκτώντας εμπειρία μέσα από ένα ευρύ φάσμα δημιουργικών projects.",
    about_p2:       "Το 2025, αποφάσισα να ξεκινήσω τη δική μου πορεία, δίνοντας μεγαλύτερη έμφαση στην ποιότητα, στη λεπτομέρεια και στο πώς κάθε project αποκτά τη δική του ολοκληρωμένη ταυτότητα — με στόχο να δημιουργώ λύσεις που ανταποκρίνονται πραγματικά στις ανάγκες κάθε πελάτη.",
    about_p3:       "Εργάζομαι κυρίως σε σχεδιασμό λογοτύπων και έντυπα υλικά όπως επαγγελματικές κάρτες, μενού, φυλλάδια και αφίσες, καθώς και σε πιο προσωπικά projects όπως προσκλητήρια γάμου και βάπτισης.",
    about_p4:       "Με εκφράζει η απλότητα, η λειτουργικότητα και η καθαρή αισθητική. Για μένα, κάθε project είναι μια ευκαιρία να δημιουργήσω κάτι ουσιαστικό και μοναδικό.",
    footer:         "© 2025 mly.dsg — Maria Limperi. Όλα τα δικαιώματα διατηρούνται."
  }
};

let currentLang = localStorage.getItem("lang") || "en";
 
function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
 
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
 
    // Button always shows the OTHER language (the one you'd switch TO)
    document.querySelectorAll("#langToggle").forEach(btn => {
        btn.textContent = lang === "en" ? "GR" : "EN";
    });
 
    // Update the html lang attribute for accessibility
    document.documentElement.lang = lang === "gr" ? "el" : "en";
}
 
// Updated DOMContentLoaded — replace your existing one with this:
window.addEventListener("DOMContentLoaded", () => {
    loadPortfolio();
 
    // Language toggle button
    document.querySelectorAll("#langToggle").forEach(btn => {
        btn.addEventListener("click", () => {
            applyLanguage(currentLang === "en" ? "gr" : "en");
        });
    });
 
    // Apply saved language on page load
    applyLanguage(currentLang);
 
    // Highlight "About/Contact" link when on about page
    if (window.location.pathname.includes("about")) {
        document.querySelectorAll('.menu-bar a[href="about.html"]').forEach(a => {
            a.classList.add("active");
        });
    }
});
// ================= FETCH & RENDER IMAGES =================

/**
 * Loads portfolio.json, renders all images into the grid,
 * then applies any category filter from the URL query string.
 */
function loadPortfolio() {
    if (!portfolioGrid) return; // not on index page

    fetch("JSON/portfolio.json")
        .then(res => {
            if (!res.ok) throw new Error("Failed to load portfolio data");
            return res.json();
        })
        .then(data => {
            data.forEach(item => {
                const img = document.createElement("img");

                img.src              = item.src;
                img.alt              = item.alt || "";
                img.dataset.category = item.category || "";
                img.loading          = "lazy";
                img.style.opacity    = "0";
                img.style.transition = "opacity 0.3s ease";

                if (item.full) img.dataset.full = item.full;

                img.onload = () => { img.style.opacity = "1"; };

                portfolioGrid.appendChild(img);
            });

            // ✅ Apply URL filter AFTER images are in the DOM — no setTimeout needed
            applyUrlFilter();
        })
        .catch(err => console.error("Portfolio load error:", err));
}


// ================= URL FILTER =================

/**
 * Reads ?category= from the URL and filters/scrolls accordingly.
 * Called once images are rendered, so no race condition.
 */
function applyUrlFilter() {
    const params   = new URLSearchParams(window.location.search);
    const category = params.get("category");

    if (category) {
        filterImages(category);
        setActiveNavItem(category);

        // Only scroll if user landed via a category link (not the homepage itself)
        portfolioGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}


// ================= FILTER FUNCTION =================

function filterImages(category) {
    const images = document.querySelectorAll(".portfolio-grid img");

    images.forEach(img => {
        if (!img.dataset.category) {
            img.style.display = "none";
            return;
        }

        const categories = img.dataset.category.split(" ");
        const isPackagingOnly = categories.includes("packaging-only");

        if (category === "all" && isPackagingOnly) {
            // Hide packaging-only items from All
            img.style.opacity = "0";
            setTimeout(() => { img.style.display = "none"; }, 200);
        } else if (category === "packaging" && isPackagingOnly) {
            // Show packaging-only items in Packaging
            img.style.display = "block";
            img.style.opacity = "1";
        } else if (category === "all" || categories.includes(category)) {
            img.style.display = "block";
            img.style.opacity = "1";
        } else {
            img.style.opacity = "0";
            setTimeout(() => { img.style.display = "none"; }, 200);
        }
    });
}


// ================= ACTIVE NAV STATE =================

/**
 * Highlights the correct desktop nav item.
 * Works for both ?category= URL params and direct clicks.
 */
function setActiveNavItem(category) {
    document.querySelectorAll(".menu-bar a[data-category]").forEach(link => {
        link.classList.toggle("active", link.dataset.category === category);
    });
}


// ================= SCROLL TO PORTFOLIO =================

function goToPortfolio(category) {
    // If we're not on the index page, navigate there
    if (!portfolioGrid) {
        window.location.href = "index.html?category=" + category;
        return;
    }

    filterImages(category);
    setActiveNavItem(category);

    portfolioGrid.scrollIntoView({ behavior: "smooth", block: "start" });
}


// ================= IMAGE CLICK (OPEN MODAL) =================

if (portfolioGrid) {
    portfolioGrid.addEventListener("click", e => {
        if (e.target.tagName !== "IMG") return;

        const img    = e.target;
        const src    = img.dataset.full || img.src;
        const altTxt = img.alt || "";

        modalImg.src = src;
        modalImg.alt = altTxt;

        modal.style.display = "block";
        modal.setAttribute("aria-hidden", "false");
        modal.scrollTop = 0;

        // Trap focus inside modal
        closeBtn.focus();
    });
}


// ================= MODAL CLOSE =================

function closeModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = ""; // free memory
}

if (closeBtn)  closeBtn.addEventListener("click",  closeModal);

if (modal) {
    // Click outside image
    modal.addEventListener("click", e => {
        if (e.target === modal) closeModal();
    });

    // Swipe down to close (mobile)
    let startY = 0;
    modal.addEventListener("touchstart", e => { startY = e.touches[0].clientY; }, { passive: true });
    modal.addEventListener("touchend",   e => {
        if (e.changedTouches[0].clientY - startY > 300) closeModal();
    });
}

// ESC key
window.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal && modal.style.display === "block") closeModal();
});


// ================= SCROLL TO TOP BUTTON =================

if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
        scrollTopBtn.classList.toggle("show", window.scrollY > 300);
    }, { passive: true });

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


// ================= BURGER MENU =================

function toggleBurger() {
    const btn  = document.getElementById("burgerBtn");
    const menu = document.getElementById("burgerMenu");
    const isOpen = btn.classList.toggle("open");

    menu.classList.toggle("open", isOpen);
    btn.setAttribute("aria-expanded", isOpen);
    menu.setAttribute("aria-hidden",  !isOpen);
}

function closeBurger() {
    const btn  = document.getElementById("burgerBtn");
    const menu = document.getElementById("burgerMenu");

    btn.classList.remove("open");
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden",  "true");
}