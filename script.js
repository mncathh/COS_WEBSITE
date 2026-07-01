// HEADER SCROLL EFFECT
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

// FADE-UP ON SCROLL
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

// STAT NUMBER COUNT-UP ANIMATION
document.addEventListener('DOMContentLoaded', function() {
  const statNumbers = document.querySelectorAll('.stat .num');
  let animationStarted = false;

  // Reads the final number to count up to, from data-target
  function getTarget(el) {
    return parseInt(el.getAttribute('data-target'), 10);
  }

  // Reads the suffix (e.g. "+") to append after the number, from data-suffix
  function getSuffix(el) {
    return el.getAttribute('data-suffix') || '';
  }

  // Animates a single stat number from 0 to target using ease-out timing
  function animateNumber(el, target, suffix, duration = 1500) {
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic for a smoother finish
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(eased * target);

      // Update the displayed number (and suffix, if any)
      if (suffix) {
        el.innerHTML = currentValue + '<span class="suffix">' + suffix + '</span>';
      } else {
        el.textContent = currentValue;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Snap to the exact final value once done
        if (suffix) {
          el.innerHTML = target + '<span class="suffix">' + suffix + '</span>';
        } else {
          el.textContent = target;
        }
      }
    }

    requestAnimationFrame(update);
  }

  // Watches the stats section and triggers the count-up once it's visible
  const statsSection = document.getElementById('stats-section');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animationStarted) {
        animationStarted = true;
        // Start all number animations at once
        statNumbers.forEach(el => {
          const target = getTarget(el);
          const suffix = getSuffix(el);
          animateNumber(el, target, suffix);
        });
      }
    });
  }, { threshold: 0.3 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // Fallback: if the stats section is already visible on page load
  if (statsSection && statsSection.getBoundingClientRect().top < window.innerHeight * 0.7) {
    setTimeout(() => {
      if (!animationStarted) {
        animationStarted = true;
        statNumbers.forEach(el => {
          const target = getTarget(el);
          const suffix = getSuffix(el);
          animateNumber(el, target, suffix);
        });
      }
    }, 400);
  }
});