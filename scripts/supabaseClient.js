/**
 * Scoop & Sizzle - Supabase API Client
 * Integrated with cvrqfqmketfhcrdlqcws.supabase.co
 */

import { STORE_CONFIG, MENU_ITEMS, CATEGORIES } from './data.js';

export const SUPABASE_CONFIG = {
  url: 'https://cvrqfqmketfhcrdlqcws.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cnFmcW1rZXRmaGNyZGxxY3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NDI0NjcsImV4cCI6MjEwNzExODQ2N30.jlszxXZHz84COPD93XygpR4ogI0qKHNfo2J2Jn92JCE',
  publishableKey: 'sb_publishable_HuUrhH3XcBtRbOebAmiK7g_Ul2jVEPd'
};

const LOCAL_STORAGE_MENU_KEY = 'scoop_sizzle_custom_menu_v1';
const LOCAL_STORAGE_ORDERS_KEY = 'scoop_sizzle_orders_v1';
const LOCAL_STORAGE_SETTINGS_KEY = 'scoop_sizzle_custom_settings_v1';

class SupabaseService {
  constructor() {
    this.client = null;
    this.isOnline = false;
    this.hasTables = false;
    this.initClient();
  }

  async initClient() {
    if (window.supabase) {
      try {
        this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        await this.checkConnection();
      } catch (err) {
        console.warn('Supabase client initialization warning:', err);
      }
    }
  }

  getHeaders() {
    return {
      'apikey': SUPABASE_CONFIG.publishableKey,
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  /**
   * Check connection status to Supabase
   */
  async checkConnection() {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/auth/v1/settings`, {
        headers: {
          'apikey': SUPABASE_CONFIG.publishableKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
        }
      });

      if (res.ok) {
        this.isOnline = true;
        
        // Check if menu_items table exists
        const tableCheck = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/menu_items?select=id&limit=1`, {
          headers: this.getHeaders()
        });
        
        this.hasTables = tableCheck.ok;
        return {
          connected: true,
          tablesReady: this.hasTables,
          projectRef: 'cvrqfqmketfhcrdlqcws'
        };
      }
    } catch (e) {
      console.warn('Supabase ping check error:', e);
    }

    this.isOnline = false;
    return {
      connected: false,
      tablesReady: false,
      projectRef: 'cvrqfqmketfhcrdlqcws'
    };
  }

  /**
   * Fetch Categories (from Supabase if available, fallback to local)
   */
  async getCategories() {
    if (!this.hasTables) {
      await this.checkConnection();
    }

    if (this.hasTables) {
      try {
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/categories?select=*&order=sort_order.asc`, {
          headers: this.getHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data.map(cat => ({
              id: cat.id,
              title: cat.title,
              shortTitle: cat.short_title || cat.title,
              count: cat.count || '',
              description: cat.description || '',
              image: cat.image || 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80',
              badge: cat.badge || ''
            }));
          }
        }
      } catch (err) {
        console.warn('Could not fetch categories from Supabase, using defaults', err);
      }
    }

    return [...CATEGORIES];
  }

  /**
   * Fetch Menu Items (from Supabase if available, fallback to local)
   */
  async getMenuItems() {
    if (!this.hasTables) {
      await this.checkConnection();
    }

    if (this.hasTables) {
      try {
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/menu_items?select=*&order=sort_order.asc`, {
          headers: this.getHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data.map(item => ({
              id: item.id,
              name: item.name,
              category: item.category,
              description: item.description,
              price: Number(item.price),
              image: item.image,
              bestseller: !!item.bestseller,
              badge: item.badge || '',
              isVeg: item.is_veg !== false,
              calories: item.calories || ''
            }));
          }
        }
      } catch (err) {
        console.warn('Could not fetch from Supabase table, using cached menu', err);
      }
    }

    // Fallback to local storage or defaults
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_MENU_KEY);
      if (cached) return JSON.parse(cached);
    } catch (e) {}

    return [...MENU_ITEMS];
  }

  /**
   * Save (Insert/Update) a Menu Item
   */
  async saveMenuItem(item) {
    // 1. Update local storage first
    let currentItems = await this.getMenuItems();
    const index = currentItems.findIndex(i => i.id === item.id);
    if (index > -1) {
      currentItems[index] = { ...currentItems[index], ...item };
    } else {
      currentItems.unshift(item);
    }
    localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(currentItems));

    // 2. Sync to Supabase if tables exist
    if (this.hasTables) {
      try {
        const payload = {
          id: item.id,
          name: item.name,
          category: item.category,
          description: item.description,
          price: item.price,
          image: item.image,
          bestseller: !!item.bestseller,
          badge: item.badge || '',
          is_veg: item.isVeg !== false,
          calories: item.calories || ''
        };

        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/menu_items`, {
          method: 'POST',
          headers: {
            ...this.getHeaders(),
            'Prefer': 'resolution=merge-duplicates,return=representation'
          },
          body: JSON.stringify(payload)
        });
        return res.ok;
      } catch (err) {
        console.error('Supabase save item error:', err);
      }
    }

    return true;
  }

  /**
   * Delete a Menu Item
   */
  async deleteMenuItem(id) {
    let currentItems = await this.getMenuItems();
    currentItems = currentItems.filter(i => i.id !== id);
    localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(currentItems));

    if (this.hasTables) {
      try {
        await fetch(`${SUPABASE_CONFIG.url}/rest/v1/menu_items?id=eq.${id}`, {
          method: 'DELETE',
          headers: this.getHeaders()
        });
      } catch (err) {
        console.error('Supabase delete item error:', err);
      }
    }
    return true;
  }

  /**
   * Log an incoming customer order
   */
  async logOrder(orderData) {
    const newOrder = {
      id: 'ord-' + Date.now().toString(36),
      customer_name: orderData.name || 'Anonymous Customer',
      customer_phone: orderData.phone || '',
      order_type: orderData.orderType || 'Pickup',
      notes: orderData.notes || '',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      status: 'New',
      created_at: new Date().toISOString()
    };

    // Store in localStorage order history
    try {
      const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY) || '[]');
      orders.unshift(newOrder);
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {}

    // Save to Supabase if table ready
    if (this.hasTables) {
      try {
        await fetch(`${SUPABASE_CONFIG.url}/rest/v1/orders`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(newOrder)
        });
      } catch (err) {
        console.warn('Could not save order to Supabase:', err);
      }
    }

    return newOrder;
  }

  /**
   * Get all logged orders for Admin
   */
  async getOrders() {
    if (this.hasTables) {
      try {
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/orders?select=*&order=created_at.desc`, {
          headers: this.getHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) return data;
        }
      } catch (e) {}
    }

    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId, newStatus) {
    try {
      const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY) || '[]');
      const target = orders.find(o => o.id === orderId);
      if (target) {
        target.status = newStatus;
        localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
      }
    } catch (e) {}

    if (this.hasTables) {
      try {
        await fetch(`${SUPABASE_CONFIG.url}/rest/v1/orders?id=eq.${orderId}`, {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify({ status: newStatus })
        });
      } catch (e) {}
    }
    return true;
  }
}

export const supabaseService = new SupabaseService();
