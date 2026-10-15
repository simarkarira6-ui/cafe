/**
 * Scoop & Sizzle - Main Application Logic
 */

import { STORE_CONFIG, CATEGORIES, MENU_ITEMS, SPECIAL_OFFERS, TESTIMONIALS } from './data.js';
import { cart } from './cart.js';
import { supabaseService } from './supabaseClient.js';

class App {
  constructor() {
    this.currentCategoryFilter = 'all';
    this.searchQuery = '';
    this.categories = [...CATEGORIES];
    this.menuItems = [...MENU_ITEMS];
    this.customerDetails = {
      name: '',
      phone: '',
      orderType: 'Pickup / Takeaway',
      notes: ''
    };

    this.init();
  }

  async init() {
    this.loadCustomSettings();
    this.renderStoreDetails();

    // Fetch dynamic categories and menu items from Supabase / local cache
    try {
      this.categories = await supabaseService.getCategories();
    } catch (e) {
      this.categories = [...CATEGORIES];
    }

    try {
      this.menuItems = await supabaseService.getMenuItems();
    } catch (e) {
      this.menuItems = [...MENU_ITEMS];
    }

    this.renderCategories();
    this.renderBestsellers();
    this.renderMenuTabs();
    this.renderMenuItems();
    this.renderSpecialOffers();
    this.renderTestimonials();
    this.renderContactAndHours();

    this.initNav();
    this.initCartListeners();
    this.initSearch();
    this.initKeyboardEvents();
  }

  loadCustomSettings() {
    try {
      const saved = localStorage.getItem('scoop_sizzle_custom_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) STORE_CONFIG.name = parsed.name;
        if (parsed.tagline) STORE_CONFIG.tagline = parsed.tagline;
        if (parsed.whatsappNumber) STORE_CONFIG.whatsappNumber = parsed.whatsappNumber;
        if (parsed.address) STORE_CONFIG.address = parsed.address;
        if (parsed.currencySymbol) STORE_CONFIG.currencySymbol = parsed.currencySymbol;
        if (parsed.announcementText && STORE_CONFIG.announcement) STORE_CONFIG.announcement.text = parsed.announcementText;
      }
    } catch (e) {}
  }

  // --- Dynamic Store Info Rendering ---
  renderStoreDetails() {
    // Announcement Bar
    const announceEl = document.getElementById('announcementBar');
    if (announceEl && STORE_CONFIG.announcement.active) {
      announceEl.innerHTML = `
        <div class="container announcement-inner">
          <span class="announcement-badge">${STORE_CONFIG.announcement.badge}</span>
          <span class="announcement-text">${STORE_CONFIG.announcement.text}</span>
          <a href="${STORE_CONFIG.announcement.actionLink}" class="announcement-link">${STORE_CONFIG.announcement.actionText} →</a>
        </div>
      `;
    }

    // Dynamic brand title placeholders
    document.querySelectorAll('.js-store-name').forEach(el => el.textContent = STORE_CONFIG.name);
    document.querySelectorAll('.js-store-phone').forEach(el => {
      el.textContent = STORE_CONFIG.phone;
      if (el.tagName === 'A') el.href = `tel:${STORE_CONFIG.phone.replace(/[^0-9+]/g, '')}`;
    });
    document.querySelectorAll('.js-store-whatsapp').forEach(el => {
      el.textContent = STORE_CONFIG.whatsappNumberFormatted;
      if (el.tagName === 'A') {
        const cleanDigits = STORE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
        el.href = `https://wa.me/${cleanDigits}`;
      }
    });
    document.querySelectorAll('.js-store-address').forEach(el => el.textContent = STORE_CONFIG.address);
  }

  // --- Category Explorer ---
  renderCategories() {
    const container = document.getElementById('categoryExplorer');
    if (!container) return;

    container.innerHTML = this.categories.map(cat => `
      <div class="category-card" data-category="${cat.id}" role="button" tabindex="0" aria-label="Explore ${cat.title}">
        <div class="category-img-arch">
          <img src="${cat.image}" alt="${cat.title}" loading="lazy" width="300" height="350" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80';">
        </div>
        <h3 class="category-card-title">${cat.shortTitle}</h3>
        <span class="category-card-count">${cat.count}</span>
      </div>
    `).join('');

    container.querySelectorAll('.category-card').forEach(card => {
      const handleAction = () => {
        const catId = card.dataset.category;
        this.filterMenuByCategory(catId);
        const menuSection = document.getElementById('menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      };
      card.addEventListener('click', handleAction);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAction();
        }
      });
    });
  }

  // --- Bestsellers Grid ---
  renderBestsellers() {
    const container = document.getElementById('bestsellersGrid');
    if (!container) return;

    const bestsellers = this.menuItems.filter(item => item.bestseller).slice(0, 4);

    container.innerHTML = bestsellers.map(item => this.createProductCardHtml(item)).join('');
    this.attachAddToCartListeners(container);
  }

  // --- Menu Tabs & Filter ---
  renderMenuTabs() {
    const tabsContainer = document.getElementById('menuTabs');
    if (!tabsContainer) return;

    const tabs = [
      { id: 'all', label: 'All Delights' },
      ...this.categories.map(c => ({ id: c.id, label: c.shortTitle }))
    ];

    tabsContainer.innerHTML = tabs.map(tab => `
      <button class="menu-tab-btn ${this.currentCategoryFilter === tab.id ? 'active' : ''}" 
              data-cat-tab="${tab.id}">
        ${tab.label}
      </button>
    `).join('');

    tabsContainer.querySelectorAll('.menu-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.catTab;
        this.filterMenuByCategory(catId);
      });
    });
  }

  filterMenuByCategory(catId) {
    this.currentCategoryFilter = catId;
    
    // Update active tab buttons
    document.querySelectorAll('.menu-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.catTab === catId);
    });

    // Update active category cards in explorer
    document.querySelectorAll('.category-card').forEach(card => {
      card.classList.toggle('active', card.dataset.category === catId);
    });

    this.renderMenuItems();
  }

  // --- Full Menu Rendering ---
  renderMenuItems() {
    const container = document.getElementById('fullMenuGrid');
    if (!container) return;

    let items = this.menuItems;

    if (this.currentCategoryFilter !== 'all') {
      items = items.filter(i => i.category === this.currentCategoryFilter);
    }

    if (this.searchQuery.trim().length > 0) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.description.toLowerCase().includes(q)
      );
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
          <p style="font-size: 2.5rem; margin-bottom: 0.5rem;">🍨🔍</p>
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: var(--color-chocolate-dark);">No sweet or savory bites found</h3>
          <p style="color: var(--color-chocolate-muted); font-size: 0.9rem; margin-top: 0.4rem;">Try searching for "strawberry", "burger", "shake" or browse our categories.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => this.createProductCardHtml(item)).join('');
    this.attachAddToCartListeners(container);
  }

  createProductCardHtml(item) {
    const categoryObj = this.categories.find(c => c.id === item.category);
    const catName = categoryObj ? categoryObj.shortTitle : (item.category || 'Dessert');

    return `
      <article class="product-card" data-product-id="${item.id}">
        <div class="product-image-box">
          <img src="${item.image}" alt="${item.name}" loading="lazy" width="400" height="300" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80';">
          ${item.badge ? `<span class="product-badge-corner ${item.bestseller ? 'bestseller' : ''}">${item.badge}</span>` : ''}
          <span class="product-badge-dietary" title="${item.isVeg ? 'Vegetarian' : 'Contains Meat'}">
            ${item.isVeg ? '🌱' : '🥩'}
          </span>
        </div>
        <div class="product-body">
          <span class="product-category-label">${catName}</span>
          <h4 class="product-title">${item.name}</h4>
          <p class="product-desc">${item.description}</p>
          <div class="product-footer">
            <span class="product-price">${STORE_CONFIG.currencySymbol}${Number(item.price).toFixed(2)}</span>
            <button class="add-to-order-btn js-add-to-cart" data-id="${item.id}" aria-label="Add ${item.name} to order">
              <span>+</span> Add
            </button>
          </div>
        </div>
      </article>
    `;
  }

  attachAddToCartListeners(container) {
    container.querySelectorAll('.js-add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const item = this.menuItems.find(m => m.id === id);
        if (item) {
          cart.addItem(item, 1);
          this.showToast(`Added ${item.name} to order! 🍦`);
        }
      });
    });
  }

  // --- Special Offers / Combos ---
  renderSpecialOffers() {
    const container = document.getElementById('specialOffersGrid');
    if (!container) return;

    container.innerHTML = SPECIAL_OFFERS.map(offer => `
      <article class="offer-card">
        <div class="offer-card-image">
          <img src="${offer.image}" alt="${offer.title}" loading="lazy" width="450" height="250">
          <span class="offer-discount-badge">${offer.badge}</span>
        </div>
        <div class="offer-card-body">
          <span class="offer-tag">${offer.tag}</span>
          <h3 class="offer-title">${offer.title}</h3>
          <p class="offer-desc">${offer.description}</p>
          <div class="offer-includes">
            ${offer.includes.map(inc => `
              <div class="offer-include-item">
                <span class="check">✓</span> ${inc}
              </div>
            `).join('')}
          </div>
          <div class="offer-footer">
            <div class="offer-pricing">
              <span class="offer-price-current">${STORE_CONFIG.currencySymbol}${offer.price.toFixed(2)}</span>
              <span class="offer-price-orig">${STORE_CONFIG.currencySymbol}${offer.originalPrice.toFixed(2)}</span>
            </div>
            <button class="btn btn-primary js-add-combo" data-id="${offer.id}">
              Add Combo
            </button>
          </div>
        </div>
      </article>
    `).join('');

    container.querySelectorAll('.js-add-combo').forEach(btn => {
      btn.addEventListener('click', () => {
        const offerId = btn.dataset.id;
        const offer = SPECIAL_OFFERS.find(o => o.id === offerId);
        if (offer) {
          cart.addItem({
            id: offer.id,
            name: `Combo Deal: ${offer.title}`,
            price: offer.price,
            image: offer.image,
            category: 'combo'
          }, 1);
          this.showToast(`Added ${offer.title} Combo! 🍔`);
        }
      });
    });
  }

  // --- Testimonials ---
  renderTestimonials() {
    const container = document.getElementById('testimonialsGrid');
    if (!container) return;

    container.innerHTML = TESTIMONIALS.map(t => `
      <div class="testimonial-card">
        <div class="testimonial-stars">★★★★★</div>
        <p class="testimonial-quote">"${t.quote}"</p>
        <div class="testimonial-author-box">
          <div class="testimonial-avatar">${t.name.charAt(0)}</div>
          <div>
            <h4 class="testimonial-name">${t.name}</h4>
            <span class="testimonial-fav">Loves: ${t.favorite}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- Location & Hours ---
  renderContactAndHours() {
    const hoursContainer = document.getElementById('hoursTable');
    if (hoursContainer) {
      hoursContainer.innerHTML = STORE_CONFIG.hours.map(h => `
        <div class="hours-row">
          <span>${h.days}</span>
          <span style="font-weight: 700;">${h.time}</span>
        </div>
      `).join('');
    }

    const mapBtn = document.getElementById('openMapsBtn');
    if (mapBtn) {
      mapBtn.href = STORE_CONFIG.googleMapsUrl;
    }
  }

  // --- Navigation & Mobile Drawer ---
  initNav() {
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    const menuToggle = document.getElementById('menuToggleBtn');
    const menuClose = document.getElementById('menuCloseBtn');
    const mobileBackdrop = document.getElementById('mobileNavBackdrop');

    const openMenu = () => document.body.classList.add('mobile-nav-active', 'drawer-open');
    const closeMenu = () => document.body.classList.remove('mobile-nav-active', 'drawer-open');

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMenu);

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // --- Cart Drawer & WhatsApp Integration ---
  initCartListeners() {
    const cartBackdrop = document.getElementById('cartBackdrop');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const openCartButtons = document.querySelectorAll('.js-open-cart');

    const openCart = () => {
      document.body.classList.add('cart-open', 'drawer-open');
    };

    const closeCart = () => {
      document.body.classList.remove('cart-open', 'drawer-open');
    };

    openCartButtons.forEach(btn => btn.addEventListener('click', openCart));
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

    // Customer form bindings
    const nameInput = document.getElementById('orderCustomerName');
    const phoneInput = document.getElementById('orderCustomerPhone');
    const notesInput = document.getElementById('orderCustomerNotes');
    const typeButtons = document.querySelectorAll('.js-order-type');

    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        this.customerDetails.name = e.target.value;
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        this.customerDetails.phone = e.target.value;
      });
    }

    if (notesInput) {
      notesInput.addEventListener('input', (e) => {
        this.customerDetails.notes = e.target.value;
      });
    }

    typeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        typeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.customerDetails.orderType = btn.dataset.type;
      });
    });

    // WhatsApp Order Button
    const sendWhatsAppBtn = document.getElementById('sendWhatsAppOrderBtn');
    if (sendWhatsAppBtn) {
      sendWhatsAppBtn.addEventListener('click', async () => {
        const state = cart.getState();
        if (state.items.length === 0) {
          this.showToast('Your cart is empty! Add treats first.');
          return;
        }

        // Log order to Supabase Cloud & Local Order History
        try {
          await supabaseService.logOrder({
            name: this.customerDetails.name,
            phone: this.customerDetails.phone,
            orderType: this.customerDetails.orderType,
            notes: this.customerDetails.notes,
            items: state.items,
            subtotal: state.subtotal
          });
        } catch (err) {
          console.warn('Order logging notice:', err);
        }

        const url = cart.getWhatsAppUrl(this.customerDetails);
        window.open(url, '_blank', 'noopener,noreferrer');
        this.showToast('Opening WhatsApp with your order! 📱');
      });
    }

    // Subscribe to Cart State Changes
    cart.subscribe((state) => {
      this.updateCartUi(state);
    });
  }

  updateCartUi(state) {
    // Badges
    document.querySelectorAll('.js-cart-count').forEach(el => {
      el.textContent = state.totalCount;
    });

    // Mobile Order Bar
    const mobileBar = document.getElementById('mobileOrderBar');
    if (mobileBar) {
      if (state.totalCount > 0) {
        mobileBar.classList.add('visible');
        document.body.classList.add('has-cart-items');
        document.getElementById('mobileOrderBarCount').textContent = `${state.totalCount} item${state.totalCount > 1 ? 's' : ''}`;
        document.getElementById('mobileOrderBarTotal').textContent = state.formattedSubtotal;
      } else {
        mobileBar.classList.remove('visible');
        document.body.classList.remove('has-cart-items');
      }
    }

    // Cart Drawer Content
    const cartBody = document.getElementById('cartItemsList');
    const subtotalEl = document.getElementById('cartSubtotalAmount');
    const sendBtn = document.getElementById('sendWhatsAppOrderBtn');

    if (subtotalEl) subtotalEl.textContent = state.formattedSubtotal;
    if (sendBtn) sendBtn.disabled = state.items.length === 0;

    if (!cartBody) return;

    if (state.items.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">🍦</div>
          <h3 class="cart-empty-title">Your Tray is Empty</h3>
          <p class="cart-empty-desc">Discover our artisan ice cream cones, thickshakes, waffles, and sizzling burgers.</p>
          <a href="#menu" class="btn btn-strawberry" onclick="document.body.classList.remove('cart-open', 'drawer-open')">Browse Menu</a>
        </div>
      `;
      return;
    }

    cartBody.innerHTML = state.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-price">${STORE_CONFIG.currencySymbol}${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        <div class="cart-item-actions">
          <div class="cart-stepper">
            <button class="stepper-btn js-cart-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="stepper-val">${item.quantity}</span>
            <button class="stepper-btn js-cart-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-remove-btn js-cart-remove" data-id="${item.id}" aria-label="Remove item">✕</button>
        </div>
      </div>
    `).join('');

    // Attach Stepper Actions
    cartBody.querySelectorAll('.js-cart-plus').forEach(btn => {
      btn.addEventListener('click', () => cart.updateQuantity(btn.dataset.id, 1));
    });
    cartBody.querySelectorAll('.js-cart-minus').forEach(btn => {
      btn.addEventListener('click', () => cart.updateQuantity(btn.dataset.id, -1));
    });
    cartBody.querySelectorAll('.js-cart-remove').forEach(btn => {
      btn.addEventListener('click', () => cart.removeItem(btn.dataset.id));
    });
  }

  // --- Real-Time Search Filtering ---
  initSearch() {
    const searchInput = document.getElementById('menuSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderMenuItems();
    });
  }

  // --- Keyboard Shortcuts & Escape Key ---
  initKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.body.classList.remove('cart-open', 'mobile-nav-active', 'drawer-open');
      }
    });
  }

  // --- Toast Notification Feedback ---
  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}

// Start app on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.scoopApp = new App();
});
