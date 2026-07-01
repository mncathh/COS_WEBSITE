// =========================================================
// HEADER SCROLL EFFECT
// Adds/removes the "scrolled" class on the header depending
// on how far down the page the user has scrolled.
// =========================================================
const header = document.getElementById('site-header');

function updateHeader() {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', updateHeader);
updateHeader(); // run once on load in case the page is already scrolled

// =========================================================
// FADE-UP ON SCROLL
// Elements with the "fade-up" class stay paused until they
// scroll into view, then the CSS animation is allowed to run.
// =========================================================
const faders = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target); // only animate once
        }
    });
}, { threshold: 0.15 });

faders.forEach(el => {
    el.style.animationPlayState = 'paused'; // start paused
    observer.observe(el);
});

// =========================================================
// VALUE PROPOSITION SLIDER
// Lets the user click prev/next arrows to scroll the row of
// value cards left/right by one "step" (card width + gap) at a time.
// =========================================================
const track = document.getElementById('valueSliderTrack');
const sliderContainer = document.querySelector('.value-slider-container');
const slides = document.querySelectorAll('.value-slide');
const prevBtn = document.getElementById('prevValue');
const nextBtn = document.getElementById('nextValue');
let offset = 0; // current horizontal scroll offset in pixels

// Calculates how far to move per click: one card's width + the gap between cards
function getStep() {
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24;
    return slides[0].getBoundingClientRect().width + gap;
}

// Calculates the furthest the track can scroll before running out of content
function getMaxOffset() {
    return Math.max(0, track.scrollWidth - sliderContainer.clientWidth);
}

// Applies the current offset to the track and updates button disabled states
function applySlider() {
    const maxOffset = getMaxOffset();
    if (offset > maxOffset) offset = maxOffset;
    if (offset < 0) offset = 0;
    track.style.transform = `translateX(-${offset}px)`;
    prevBtn.disabled = offset <= 0;
    nextBtn.disabled = offset >= maxOffset - 1;
}

// Move one step left
prevBtn.addEventListener('click', () => {
    offset -= getStep();
    applySlider();
});

// Move one step right
nextBtn.addEventListener('click', () => {
    offset += getStep();
    applySlider();
});

// Recalculate slider bounds when the window is resized (debounced)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(applySlider, 200);
});

// Set the initial state of the slider (arrow disabled states, etc.)
applySlider();