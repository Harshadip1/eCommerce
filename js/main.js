// Cart & Wishlist state
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); }
function saveWishlist() { localStorage.setItem('wishlist', JSON.stringify(wishlist)); updateWishlistCount(); }

function updateCartCount() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}
function updateWishlistCount() {
  document.querySelectorAll('.wishlist-count').forEach(el => el.textContent = wishlist.length);
}

function addToCart(id, name, price, emoji) {
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, name, price, emoji, qty: 1 });
  saveCart();
  showToast(name + ' added to cart');
}

function toggleWishlist(id, name, price, emoji, btn) {
  const idx = wishlist.findIndex(i => i.id === id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    if (btn) btn.classList.remove('active');
    showToast('Removed from wishlist');
  } else {
    wishlist.push({ id, name, price, emoji });
    if (btn) btn.classList.add('active');
    showToast(name + ' saved to wishlist');
  }
  saveWishlist();
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Tabs
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });
}

// Qty selectors
function initQty() {
  document.querySelectorAll('.qty-selector, .cart-qty').forEach(sel => {
    const input = sel.querySelector('input');
    if (!input) return;
    sel.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        let val = parseInt(input.value) || 1;
        if (btn.textContent.trim() === '+') val++;
        else if (val > 1) val--;
        input.value = val;
      });
    });
  });
}

// Wishlist button state
function initWishlistBtns() {
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    const id = btn.dataset.id;
    if (wishlist.find(i => i.id === id)) btn.classList.add('active');
  });
}

// Payment option selection
function initPayment() {
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input[type=radio]');
      if (radio) radio.checked = true;
    });
  });
}

// Sticky header shadow
function initHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// Scroll fade-up animations
function initScrollAnimations() {
  const els = document.querySelectorAll('.product-card, .category-card, .feature-card, .testimonial-card, .stat-card, .team-card, .order-card');
  els.forEach(el => el.classList.add('fade-up'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

// Countdown timer
function initTimer() {
  const blocks = document.querySelectorAll('.timer-block');
  if (!blocks.length) return;
  let total = 3 * 3600 + 47 * 60 + 22;
  setInterval(() => {
    if (total <= 0) return;
    total--;
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const vals = [h, m, s];
    blocks.forEach((b, i) => {
      const num = b.querySelector('.num');
      if (num) num.textContent = String(vals[i]).padStart(2, '0');
    });
  }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateWishlistCount();
  initTabs();
  initQty();
  initWishlistBtns();
  initPayment();
  initHeader();
  initScrollAnimations();
  initTimer();
});
