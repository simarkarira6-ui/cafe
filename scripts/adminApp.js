/**
 * Scoop & Sizzle - Admin Panel Controller
 */

import { supabaseService, SUPABASE_CONFIG } from './supabaseClient.js';
import { STORE_CONFIG, CATEGORIES } from './data.js';

class AdminController {
  constructor() {
    this.menuItems = [];
    this.orders = [];
    this.init();
  }

  async init() {
    this.initAuth();
    this.initTabs();
    this.initSupabaseStatus();
    this.initMenuControls();
    this.initOrderControls();
    this.initSettingsControls();
    this.loadSqlPreview();
    
    await this.refreshData();
  }

  // --- 1. Security Authentication Lock ---
  initAuth() {
    const lockModal = document.getElementById('authLockModal');
    const authForm = document.getElementById('authPinForm');
    const pinInput = document.getElementById('authPinInput');
    const errorMsg = document.getElementById('pinErrorMsg');
    const logoutBtn = document.getElementById('logoutBtn');

    const getStoredPassword = () => {
      return localStorage.getItem('scoop_admin_password_v1') || 'scoop2026';
    };

    const unlock = () => {
      sessionStorage.setItem('scoop_admin_unlocked', 'true');
      if (lockModal) {
        lockModal.style.setProperty('display', 'none', 'important');
      }
      this.showToast('Welcome to Scoop & Sizzle Admin! 🍨');
    };

    // Auto-unlock if current session is already authorized
    if (sessionStorage.getItem('scoop_admin_unlocked') === 'true') {
      if (lockModal) lockModal.style.setProperty('display', 'none', 'important');
    }

    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const entered = (pinInput ? pinInput.value : '').trim();
        const currentPass = getStoredPassword();

        if (entered === currentPass || (currentPass === 'scoop2026' && (entered === '1234' || entered === 'admin'))) {
          unlock();
        } else {
          if (errorMsg) {
            errorMsg.textContent = 'Incorrect password. Please try again.';
          }
          if (pinInput) {
            pinInput.value = '';
            pinInput.focus();
          }
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('scoop_admin_unlocked');
        localStorage.removeItem('scoop_admin_unlocked');
        window.location.reload();
      });
    }
  }

  // --- 2. Tab Navigation ---
  initTabs() {
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    const tabContents = document.querySelectorAll('.admin-tab-content');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        tabContents.forEach(tc => {
          tc.style.display = tc.id === `tab-${tabId}` ? 'block' : 'none';
        });
      });
    });

    const openSqlBtn = document.getElementById('btnOpenSqlModal');
    if (openSqlBtn) {
      openSqlBtn.addEventListener('click', () => {
        const sqlTabBtn = document.querySelector('[data-tab="supabase"]');
        if (sqlTabBtn) sqlTabBtn.click();
      });
    }
  }

  // --- 3. Supabase Cloud Status ---
  async initSupabaseStatus() {
    const badge = document.getElementById('supabaseStatusBadge');
    const text = document.getElementById('supabaseStatusText');
    const diag = document.getElementById('connectionDiagnostic');
    const syncBtn = document.getElementById('btnSyncWithCloud');

    const check = async () => {
      badge.className = 'admin-pill-status warning';
      text.textContent = 'Checking Cloud...';

      const status = await supabaseService.checkConnection();
      if (status.connected) {
        if (status.tablesReady) {
          badge.className = 'admin-pill-status connected';
          text.textContent = `🟢 Supabase Synced (${status.projectRef})`;
          if (diag) {
            diag.innerHTML = `
              <strong>✅ Cloud Database Connected & Synced</strong><br>
              Supabase Project: <code>${status.projectRef}</code><br>
              All tables (<code>menu_items</code>, <code>orders</code>) are active and accepting live queries.
            `;
          }
        } else {
          badge.className = 'admin-pill-status warning';
          text.textContent = `⚡ API Active: ${status.projectRef}`;
          if (diag) {
            diag.innerHTML = `
              <strong>⚡ Supabase Connected (Project: ${status.projectRef})</strong><br>
              Status: API keys validated. Database tables are ready to be created.<br>
              👉 Click <button id="btnQuickSql" class="btn btn-primary" style="padding: 0.2rem 0.6rem; font-size: 0.75rem; margin-left: 0.5rem;">View SQL Script</button> to initialize the database in 1 click.
            `;
            const qBtn = document.getElementById('btnQuickSql');
            if (qBtn) {
              qBtn.addEventListener('click', () => {
                document.querySelector('[data-tab="supabase"]').click();
              });
            }
          }
        }
      } else {
        badge.className = 'admin-pill-status warning';
        text.textContent = `Offline / Local Mode`;
        if (diag) {
          diag.innerHTML = `Running in local cache mode with instant sync. Re-checking Supabase cloud ping...`;
        }
      }
    };

    await check();

    if (syncBtn) {
      syncBtn.addEventListener('click', async () => {
        this.showToast('Pinging Supabase cloud... ☁️');
        await check();
        await this.refreshData();
      });
    }
  }

  // --- 4. Refresh & Metrics ---
  async refreshData() {
    this.menuItems = await supabaseService.getMenuItems();
    this.orders = await supabaseService.getOrders();

    this.renderStats();
    this.renderMenuTable();
    this.renderOrdersTable();
  }

  renderStats() {
    const itemsCountEl = document.getElementById('statItemsCount');
    const totalMenuBadge = document.getElementById('totalMenuCount');
    const ordersCountEl = document.getElementById('statOrdersCount');
    const totalOrdersBadge = document.getElementById('totalOrdersCount');
    const revEl = document.getElementById('statEstRevenue');

    if (itemsCountEl) itemsCountEl.textContent = this.menuItems.length;
    if (totalMenuBadge) totalMenuBadge.textContent = this.menuItems.length;

    if (ordersCountEl) ordersCountEl.textContent = this.orders.length;
    if (totalOrdersBadge) totalOrdersBadge.textContent = this.orders.length;

    const totalRev = this.orders.reduce((sum, o) => sum + (Number(o.subtotal) || 0), 0);
    if (revEl) revEl.textContent = `$${totalRev.toFixed(2)}`;
  }

  // --- 5. Menu Table & Modal ---
  initMenuControls() {
    const searchInput = document.getElementById('adminMenuSearch');
    const catSelect = document.getElementById('adminCategoryFilter');
    const addBtn = document.getElementById('btnAddNewItem');
    const modal = document.getElementById('itemModalBackdrop');
    const closeBtn = document.getElementById('btnCloseModal');
    const cancelBtn = document.getElementById('btnCancelModal');
    const form = document.getElementById('itemForm');

    const openModal = (item = null) => {
      document.getElementById('modalTitle').textContent = item ? 'Edit Menu Item' : 'Add New Menu Item';
      document.getElementById('itemId').value = item ? item.id : 'item-' + Date.now();
      document.getElementById('itemName').value = item ? item.name : '';
      document.getElementById('itemCategory').value = item ? item.category : 'ice-cream';
      document.getElementById('itemPrice').value = item ? item.price : '';
      document.getElementById('itemDesc').value = item ? item.description : '';
      document.getElementById('itemImage').value = item ? item.image : 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80';
      document.getElementById('itemBadge').value = item ? (item.badge || '') : '';
      document.getElementById('itemCalories').value = item ? (item.calories || '') : '';
      document.getElementById('itemBestseller').checked = item ? !!item.bestseller : false;
      document.getElementById('itemIsVeg').checked = item ? item.isVeg !== false : true;

      modal.classList.add('open');
    };

    const closeModal = () => modal.classList.remove('open');

    if (addBtn) addBtn.addEventListener('click', () => openModal());
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (searchInput) searchInput.addEventListener('input', () => this.renderMenuTable());
    if (catSelect) catSelect.addEventListener('change', () => this.renderMenuTable());

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const item = {
        id: document.getElementById('itemId').value,
        name: document.getElementById('itemName').value.trim(),
        category: document.getElementById('itemCategory').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        description: document.getElementById('itemDesc').value.trim(),
        image: document.getElementById('itemImage').value.trim() || 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80',
        badge: document.getElementById('itemBadge').value.trim(),
        calories: document.getElementById('itemCalories').value.trim(),
        bestseller: document.getElementById('itemBestseller').checked,
        isVeg: document.getElementById('itemIsVeg').checked
      };

      await supabaseService.saveMenuItem(item);
      closeModal();
      this.showToast(`Saved "${item.name}" successfully! 🍨`);
      await this.refreshData();
    });

    this.openEditModal = openModal;
  }

  renderMenuTable() {
    const tbody = document.getElementById('adminMenuTableBody');
    if (!tbody) return;

    const query = (document.getElementById('adminMenuSearch')?.value || '').toLowerCase();
    const catFilter = document.getElementById('adminCategoryFilter')?.value || 'all';

    let list = this.menuItems;

    if (catFilter !== 'all') {
      list = list.filter(i => i.category === catFilter);
    }

    if (query) {
      list = list.filter(i => i.name.toLowerCase().includes(query) || (i.description || '').toLowerCase().includes(query));
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #888;">No menu items found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(item => `
      <tr>
        <td><img src="${item.image}" class="table-thumb" alt="${item.name}"></td>
        <td>
          <strong>${item.name}</strong>
          ${item.calories ? `<br><small style="color: #888;">${item.calories}</small>` : ''}
        </td>
        <td><span style="text-transform: capitalize; font-weight: 700;">${item.category}</span></td>
        <td><strong>$${Number(item.price).toFixed(2)}</strong></td>
        <td>${item.bestseller ? '<span class="badge-status new">Bestseller</span>' : (item.badge || '—')}</td>
        <td>${item.isVeg ? '🌱 Veg' : '🥩 Non-veg'}</td>
        <td>
          <button class="btn btn-outline js-edit-item" data-id="${item.id}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">Edit</button>
          <button class="btn btn-outline js-delete-item" data-id="${item.id}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; color: #D9445E; border-color: #D9445E;">Delete</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.js-edit-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = this.menuItems.find(i => i.id === btn.dataset.id);
        if (item) this.openEditModal(item);
      });
    });

    tbody.querySelectorAll('.js-delete-item').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const item = this.menuItems.find(i => i.id === id);
        if (confirm(`Are you sure you want to delete "${item?.name}"?`)) {
          await supabaseService.deleteMenuItem(id);
          this.showToast(`Deleted "${item?.name}"`);
          await this.refreshData();
        }
      });
    });
  }

  // --- 6. Orders Management ---
  initOrderControls() {
    const refreshBtn = document.getElementById('btnRefreshOrders');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        this.orders = await supabaseService.getOrders();
        this.renderOrdersTable();
        this.renderStats();
        this.showToast('Orders refreshed 📋');
      });
    }
  }

  renderOrdersTable() {
    const tbody = document.getElementById('adminOrdersTableBody');
    if (!tbody) return;

    if (this.orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #888;">No customer orders placed yet. Orders from the website WhatsApp tray will appear here.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.orders.map(order => {
      const itemsList = Array.isArray(order.items) 
        ? order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')
        : 'Order items';

      const statusClass = (order.status || 'New').toLowerCase();

      return `
        <tr>
          <td><code>${order.id.slice(0, 8)}</code></td>
          <td>
            <strong>${order.customer_name || 'Customer'}</strong>
            ${order.customer_phone ? `<br><small>${order.customer_phone}</small>` : ''}
          </td>
          <td>${order.order_type || 'Pickup'}</td>
          <td style="max-width: 250px; font-size: 0.8125rem;">
            ${itemsList}
            ${order.notes ? `<br><em>Note: ${order.notes}</em>` : ''}
          </td>
          <td><strong>$${Number(order.subtotal || 0).toFixed(2)}</strong></td>
          <td><span class="badge-status ${statusClass}">${order.status || 'New'}</span></td>
          <td>
            <select class="admin-form-select js-order-status-select" data-id="${order.id}" style="padding: 0.3rem 0.5rem; font-size: 0.75rem;">
              <option value="New" ${order.status === 'New' ? 'selected' : ''}>New</option>
              <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
              <option value="Ready" ${order.status === 'Ready' ? 'selected' : ''}>Ready</option>
              <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.js-order-status-select').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const orderId = sel.dataset.id;
        const newStatus = e.target.value;
        await supabaseService.updateOrderStatus(orderId, newStatus);
        this.showToast(`Order status updated to ${newStatus}`);
        await this.refreshData();
      });
    });
  }

  // --- 7. Settings Controls ---
  initSettingsControls() {
    const form = document.getElementById('storeSettingsForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedConfig = {
          name: document.getElementById('settingStoreName').value,
          tagline: document.getElementById('settingTagline').value,
          whatsappNumber: document.getElementById('settingWhatsApp').value,
          address: document.getElementById('settingAddress').value,
          currencySymbol: document.getElementById('settingCurrency').value,
          announcementText: document.getElementById('settingAnnouncement').value
        };

        localStorage.setItem('scoop_sizzle_custom_settings_v1', JSON.stringify(updatedConfig));
        this.showToast('Store settings saved! Updated on website.');
      });
    }

    const pwForm = document.getElementById('changePasswordForm');
    if (pwForm) {
      pwForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPw = (document.getElementById('inputNewPassword')?.value || '').trim();
        const confirmPw = (document.getElementById('inputConfirmPassword')?.value || '').trim();

        if (newPw.length < 4) {
          alert('Password must be at least 4 characters long.');
          return;
        }

        if (newPw !== confirmPw) {
          alert('Passwords do not match. Please verify and re-enter.');
          return;
        }

        localStorage.setItem('scoop_admin_password_v1', newPw);
        pwForm.reset();
        this.showToast('Admin password updated successfully! 🔐');
      });
    }
  }

  // --- 8. SQL Preview & Copy ---
  async loadSqlPreview() {
    const box = document.getElementById('sqlDisplayBox');
    const copyBtn = document.getElementById('btnCopySql');

    try {
      const res = await fetch('supabase_schema.sql');
      if (res.ok) {
        const sqlText = await res.text();
        if (box) box.textContent = sqlText;

        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(sqlText).then(() => {
              this.showToast('SQL Schema copied to clipboard! 📋');
            });
          });
        }
      }
    } catch (e) {
      if (box) box.textContent = '-- Please open supabase_schema.sql directly in the project folder.';
    }
  }

  showToast(msg) {
    const container = document.getElementById('adminToastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AdminController();
});
