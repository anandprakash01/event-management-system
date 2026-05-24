export const cleanEmptyStrings = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (req.body[key] === "") {
        req.body[key] = undefined;
      }
    }
  }
  next();
};
