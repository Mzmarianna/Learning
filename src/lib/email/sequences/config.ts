/**
 * Email Sequence Configuration
 * Centralized configuration for email sequences including pricing
 */

// Book pricing configuration
export const BOOK_PRICING = {
  math: {
    title: 'Math Doesn\'t Suck',
    author: 'Danica McKellar',
    regularPrice: 19.99,
    memberPrice: 14.99,
    discountPercent: 25,
    currency: 'USD',
  },
  warriors: {
    title: 'Mindset: The New Psychology of Success',
    author: 'Carol Dweck',
    regularPrice: 17.99,
    memberPrice: 12.99,
    discountPercent: 28,
    currency: 'USD',
  },
};

// Format price helper
export function formatBookPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

// Get discount text
export function getDiscountText(bookType: 'math' | 'warriors'): string {
  const book = BOOK_PRICING[bookType];
  const savings = book.regularPrice - book.memberPrice;
  return `Save ${formatBookPrice(savings)} (${book.discountPercent}% off)`;
}

// Default user age for users without date of birth
// Age 10 is chosen as a reasonable middle ground for general content
// that works for both younger students and early middle schoolers
export const DEFAULT_USER_AGE = 10;
