export const stringToSlug = (string: string) => {
  return string
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const slugToString = (slug: string) => {
  return slug
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => {
      return letter.toUpperCase();
    });
};
