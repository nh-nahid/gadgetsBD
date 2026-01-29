// utils/slugify.js
export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s*&\s*/g, "-")   // replace " & " with "-"
    .replace(/\s+/g, "-")       // replace spaces with "-"
    .replace(/[^\w-]+/g, "");   // remove any special chars
