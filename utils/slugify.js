export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s*&\s*/g, "-")   
    .replace(/\s+/g, "-")       
    .replace(/[^\w-]+/g, "");   
