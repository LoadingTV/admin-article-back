export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Zа-яА-Я0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
};
