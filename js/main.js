/* ── Nav scroll effect ── */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  }, { passive: true });
}

/* ── Mobile hamburger ── */
const burger  = document.getElementById('nav-burger');
const navMenu = document.getElementById('nav-menu');

if (burger && navMenu) {
  burger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  // Close on nav link click
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      // Also close any open dropdown
      document.querySelectorAll('.nav__item.open').forEach(el => el.classList.remove('open'));
    });
  });
}

/* ── Dropdown menus ── */
document.querySelectorAll('.nav__item > button').forEach(btn => {
  const parent = btn.closest('.nav__item');
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = parent.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    // Close siblings
    document.querySelectorAll('.nav__item.open').forEach(el => {
      if (el !== parent) {
        el.classList.remove('open');
        el.querySelector('button')?.setAttribute('aria-expanded', 'false');
      }
    });
  });
});
// Close dropdowns on outside click
document.addEventListener('click', () => {
  document.querySelectorAll('.nav__item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('button')?.setAttribute('aria-expanded', 'false');
  });
});
// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.nav__item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('button')?.setAttribute('aria-expanded', 'false');
    });
  }
});

/* ── Volunteer form ── */
const form       = document.getElementById('vol-form');
const successMsg = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('form-error');
        valid = false;
        field.addEventListener('input', () => field.classList.remove('form-error'), { once: true });
      }
    });
    if (!valid) return;

    const btn = form.querySelector('button[type=submit]');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Sending&hellip;';

    // Google Apps Script web app URL — replace with your deployed URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzNJiRnRlt8X4RZUkxCtEbMGE3hxBRUwSb_4iAEsZGdVf7q0G5Q7d5C7n2AM9XG4ko/exec';

    const payload = {
      first_name: form.querySelector('#first').value,
      last_name:  form.querySelector('#last').value,
      email:      form.querySelector('#email').value,
      role:       form.querySelector('#role').value,
      subject:    form.querySelector('#subject').value,
      message:    form.querySelector('#message').value,
      newsletter: form.querySelector('#newsletter').checked ? 'Yes' : 'No',
    };

    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(payload).toString(),
    })
      .then(() => {
        form.reset();
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      })
      .catch(() => {
        alert('Network error. Please check your connection and try again.');
      })
      .finally(() => {
        btn.innerHTML = orig;
        btn.disabled = false;
      });
  });
}
