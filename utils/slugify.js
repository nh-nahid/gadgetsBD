export const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s*&\s*/g, "-")       
    .replace(/[\s]+/g, "-")        
    .replace(/[^\w-]+/g, "")        
    .replace(/--+/g, "-")           
    .replace(/^-+|-+$/g, "");  
