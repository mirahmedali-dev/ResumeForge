// assets/js/templates.js

// assets/js/templates.js

document.addEventListener('DOMContentLoaded', () => {
  // Find all cards
  const cards = document.querySelectorAll('.cards');

  cards.forEach(card => {
    // Read the template slug from data-template (e.g., "modern-professional")
    const templateSlug = card.dataset.template;

    // Make the entire card clickable
    card.addEventListener('click', () => {
      // Pass only the slug in the URL, JS on builder.html will append .css
      window.location.href = `builder.html?template=${encodeURIComponent(templateSlug)}`;
    });

    // Make the first button inside the card clickable too
    const btn = card.querySelector('button');
    if (btn) {
      btn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent triggering the card click
        window.location.href = `builder.html?template=${encodeURIComponent(templateSlug)}`;
      });
    }
  });
});
