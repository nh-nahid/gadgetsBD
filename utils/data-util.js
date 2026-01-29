// utils/data-util.js

export const replaceMongoIdInArray = (array) => {
  return array.map(item => {
    const id = item._id ? item._id.toString() : undefined;
    const { _id, ...rest } = item;
    return { id, ...rest };
  });
};

export const replaceMongoIdInObject = (obj) => {
  if (!obj) return null;
  const id = obj._id ? obj._id.toString() : obj.id || null;
  const { _id, ...rest } = obj;
  return { id, ...rest };
};
