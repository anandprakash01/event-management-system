// No need for this, when using zod

// .string({error: iss => (!iss.input ? "Name is required" : "Invalid input")})
// this will perfectly handle the empty string

export const sanitizeEmptyStrings = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (req.body[key] === "") {
        req.body[key] = undefined;
      }
    }
  }
  next();
};
