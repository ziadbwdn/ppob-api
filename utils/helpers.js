const crypto = require('crypto');

class Helpers {
  /**
   * Generate unique invoice number
   */
  static generateInvoiceNumber() {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.getHours().toString().padStart(2, '0') + 
                   now.getMinutes().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV${dateStr}-${timeStr}${randomNum}`;
  }

  /**
   * Format currency to Indonesian Rupiah
   */
  static formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate random string
   */
  static generateRandomString(length = 10) {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
  }

  /**
   * Calculate pagination offset
   */
  static calculateOffset(page, limit) {
    return (page - 1) * limit;
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
  }
}

module.exports = Helpers;