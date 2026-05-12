export const slugify = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const generateReference = (prefix) =>
  `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
