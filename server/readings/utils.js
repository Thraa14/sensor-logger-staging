export const sanitizeObject = (object) => {
  const result = Object.assign({}, object);
  Object
    .keys(result).
    forEach((key) => (result[key] === null) && delete result[key]);

  return result;
};
