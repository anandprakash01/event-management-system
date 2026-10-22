import {AppError} from "../utils/AppError.js";

const validateRequest = schema => (req, res, next) => {
  const parsedData = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!parsedData.success) {
    const flatErrors = parsedData.error.flatten().fieldErrors;

    // Grabs the very first error message Zod generates
    const errorMessage = parsedData.error.issues[0].message;

    // const errors = parsedData.error.format();
    // console.log(errors);
    // const path = parsedData.error.issues[0].path;
    // const fieldName =
    //   path.length > 0 ? path[path.length - 1].charAt(0).toUpperCase() : "Field";

    throw new AppError(400, `Invalid input data: ${errorMessage}`);
  }

  req.body = parsedData.data.body;
  // req.query = parsedData.data.query;
  // req.params = parsedData.data.params;

  next();
};

export {validateRequest};
