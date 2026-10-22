import slugify from 'slugify';

export function createSlug(text) {
  if (!text) return '';
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}
