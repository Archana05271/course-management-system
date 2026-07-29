/**
 * StudySphere - Core Client Engine
 * Features: Form Validation, Navigation, Live Course Search/Filters, Accordions & Sidebar Modules
 */

document.addEventListener("DOMContentLoaded", () => {
    initFormValidation();
    initDynamicNavigation();
    initCourseSearchAndFilters();
    initSyllabusAccordion();
    initLearningSidebarAccordion();
});

/* ==========================================================================
   1. ADVANCED FORM VALIDATION ENGINE
   ========================================================================== */
function initFormValidation() {
    const forms = document.querySelectorAll("form");

    forms.forEach((form) => {
        // Disable browser default bubbles for customized UI feedback
        form.setAttribute("novalidate", "true");

        form.addEventListener("submit", (e) => {
            let isValid = validateForm(form);
            if (!isValid) {
                e.preventDefault();
            }
        });

        const inputs = form.querySelectorAll("input, select, textarea");
        inputs.forEach((input) => {
            input.addEventListener("blur", () => validateField(input));
            input.addEventListener("input", () => {
                clearError(input);
                if (input.type === "password") {
                    const confirmField = form.querySelector('[id*="confirm"]');
                    if (confirmField && confirmField.value !== "") {
                        validateField(confirmField);
                    }
                }
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll("input, select, textarea");

    inputs.forEach((input) => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(input) {
    const value = input.value.trim();
    const form = input.closest("form");
    let errorMessage = "";

    // 1. Required Check
    if (input.hasAttribute("required")) {
        if (input.type === "checkbox" && !input.checked) {
            errorMessage = "You must accept this condition to proceed.";
        } else if (input.type !== "checkbox" && value === "") {
            errorMessage = "This field is required.";
        }
    }

    // 2. Email Validation
    if (!errorMessage && input.type === "email" && value !== "") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = "Please enter a valid email address.";
        }
    }

    // 3. Minimum Length Check
    if (!errorMessage && input.hasAttribute("minlength") && value.length < parseInt(input.getAttribute("minlength"))) {
        errorMessage = `Must be at least ${input.getAttribute("minlength")} characters long.`;
    }

    // 4. Password Match Check
    if (!errorMessage && (input.id.includes("confirm") || input.name.includes("confirm"))) {
        const mainPasswordInput = form.querySelector('input[type="password"]:not([id*="confirm"]):not([name*="confirm"])');
        if (mainPasswordInput && value !== mainPasswordInput.value.trim()) {
            errorMessage = "Passwords do not match.";
        }
    }

    if (errorMessage) {
        showError(input, errorMessage);
        return false;
    } else {
        clearError(input);
        return true;
    }
}

function showError(input, message) {
    clearError(input);

    input.classList.add("input-error");
    if (input.type !== "checkbox") {
        input.style.borderColor = "#ef4444";
    }

    const errorDiv = document.createElement("small");
    errorDiv.className = "field-error-msg";
    errorDiv.style.color = "#ef4444";
    errorDiv.style.fontSize = "0.8rem";
    errorDiv.style.marginTop = "0.35rem";
    errorDiv.style.display = "block";
    errorDiv.innerText = message;

    if (input.type === "checkbox") {
        const parentGroup = input.closest(".checkbox-group") || input.parentNode;
        parentGroup.appendChild(errorDiv);
    } else if (input.parentNode) {
        input.parentNode.appendChild(errorDiv);
    }
}

function clearError(input) {
    input.classList.remove("input-error");
    if (input.type !== "checkbox") {
        input.style.borderColor = "";
    }

    const container = input.type === "checkbox" ? (input.closest(".checkbox-group") || input.parentNode) : input.parentNode;
    if (container) {
        const existingError = container.querySelector(".field-error-msg");
        if (existingError) {
            existingError.remove();
        }
    }
}

/* ==========================================================================
   2. DYNAMIC PAGE NAVIGATION & ROUTING
   ========================================================================== */
function initDynamicNavigation() {
    // Active Sidebar Highlight
    const currentPath = window.location.pathname.split("/").pop();
    const menuItems = document.querySelectorAll(".sidebar-menu .menu-item");

    menuItems.forEach((item) => {
        const href = item.getAttribute("href");
        if (href === currentPath) {
            item.classList.add("active");
        }
    });

    // Dynamic Form Submission Handling
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
        form.addEventListener("submit", (e) => {
            if (validateForm(form)) {
                e.preventDefault();

                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerText = "Processing...";
                }

                setTimeout(() => {
                    const targetPage = form.getAttribute("action");
                    if (targetPage && targetPage !== "#") {
                        window.location.href = targetPage;
                    }
                }, 500);
            }
        });
    });
}

/* ==========================================================================
   3. STUDENT COURSE CATALOG SEARCH & FILTERING (browse-courses.html)
   ========================================================================== */
function initCourseSearchAndFilters() {
    const searchInput = document.querySelector(".filter-bar input[type='text']");
    const categorySelect = document.querySelectorAll(".filter-selects select")[0];
    const courseCards = document.querySelectorAll(".courses-grid .course-card");

    if (!searchInput || courseCards.length === 0) return;

    function filterCourses() {
        const query = searchInput.value.toLowerCase().trim();
        const selectedCategory = categorySelect ? categorySelect.value.toLowerCase() : "all categories";

        courseCards.forEach((card) => {
            const title = card.querySelector("h3") ? card.querySelector("h3").innerText.toLowerCase() : "";
            const description = card.querySelector("p") ? card.querySelector("p").innerText.toLowerCase() : "";
            const tag = card.querySelector(".course-tag") ? card.querySelector(".course-tag").innerText.toLowerCase() : "";

            const matchesQuery = title.includes(query) || description.includes(query) || tag.includes(query);
            const matchesCategory = selectedCategory.includes("all") || tag.includes(selectedCategory);

            if (matchesQuery && matchesCategory) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }

    searchInput.addEventListener("input", filterCourses);
    if (categorySelect) {
        categorySelect.addEventListener("change", filterCourses);
    }
}

/* ==========================================================================
   4. COURSE SYLLABUS ACCORDION TOGGLE (course-details.html)
   ========================================================================== */
function initSyllabusAccordion() {
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach((header) => {
        header.style.cursor = "pointer";
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            const arrow = header.querySelector("span:last-child");

            if (content && content.classList.contains("accordion-content")) {
                const isVisible = content.style.display === "block" || getComputedStyle(content).display === "block";

                if (isVisible) {
                    content.style.display = "none";
                    if (arrow) arrow.innerText = "▼";
                } else {
                    content.style.display = "block";
                    if (arrow) arrow.innerText = "▲";
                }
            }
        });
    });
}

/* ==========================================================================
   5. WORKSPACE SIDEBAR MODULE ACCORDION TOGGLE (course-content.html)
   ========================================================================== */
function initLearningSidebarAccordion() {
    const moduleTriggers = document.querySelectorAll(".module-block-trigger");

    moduleTriggers.forEach((trigger) => {
        trigger.style.cursor = "pointer";
        trigger.addEventListener("click", () => {
            const navList = trigger.nextElementSibling;
            if (navList && navList.classList.contains("sidebar-lessons-nav")) {
                const isHidden = navList.style.display === "none";
                navList.style.display = isHidden ? "flex" : "none";
            }
        });
    });
}