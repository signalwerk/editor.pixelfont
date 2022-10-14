const range = (size, cb) => {
  return Array.from({ length: size }, (_, i) => cb(i));
};

export default range;
