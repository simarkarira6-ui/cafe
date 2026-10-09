/**
 * Scoop & Sizzle - Cart & WhatsApp Ordering State Manager
 */

import { STORE_CONFIG } from './data.js';

const STORAGE_KEY = 'scoop_sizzle_cart_v1';

export class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.listeners = [];
  }

  loadCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Unable to access localStorage, starting with empty cart.', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Unable to persist cart to localStorage.', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach(fn => fn(state));
  }

  getState() {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
      items: [...this.items],
      totalCount,
      subtotal: Number(subtotal.toFixed(2)),
      formattedSubtotal: `${STORE_CONFIG.currencySymbol}${subtotal.toFixed(2)}`
    };
  }

  addItem(product, quantity = 1, options = {}) {
    const existingIndex = this.items.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity,
        options: options
      });
    }

    this.saveCart();
    return true;
  }

  updateQuantity(productId, delta) {
    const itemIndex = this.items.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    this.items[itemIndex].quantity += delta;
    if (this.items[itemIndex].quantity <= 0) {
      this.items.splice(itemIndex, 1);
    }

    this.saveCart();
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  /**
   * Generates clean, human-readable WhatsApp message
   */
  generateWhatsAppMessage(customerDetails = {}) {
    const {
      name = 'Valued Customer',
      phone = '',
      orderType = 'Takeaway / Pickup',
      notes = ''
    } = customerDetails;

    const state = this.getState();
    if (state.items.length === 0) return '';

    const lines = [
      `🍦 *NEW ORDER REQUEST — ${STORE_CONFIG.name.toUpperCase()}* 🍔`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 *Customer Name:* ${name}`,
      ...(phone ? [`📞 *Phone:* ${phone}`] : []),
      `📦 *Order Type:* ${orderType}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `*ORDER SUMMARY:*`
    ];

    state.items.forEach((item, index) => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      lines.push(`${index + 1}. *${item.name}*`);
      lines.push(`   ${item.quantity}x @ ${STORE_CONFIG.currencySymbol}${item.price.toFixed(2)} = ${STORE_CONFIG.currencySymbol}${itemTotal}`);
    });

    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`💰 *ESTIMATED SUBTOTAL:* ${state.formattedSubtotal}`);
    lines.push(`_(Applicable taxes/delivery fees confirmed by café)_`);
    
    if (notes && notes.trim().length > 0) {
      lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`📝 *Special Instructions / Requests:*`);
      lines.push(`${notes.trim()}`);
    }

    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`📍 Store: ${STORE_CONFIG.address}`);
    lines.push(`*Please reply to confirm availability and preparation time!*`);

    return lines.join('\n');
  }

  /**
   * Generates wa.me link with encoded text
   */
  getWhatsAppUrl(customerDetails = {}) {
    const message = this.generateWhatsAppMessage(customerDetails);
    const cleanNumber = STORE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }
}

export const cart = new CartManager();
