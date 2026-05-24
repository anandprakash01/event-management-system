import AppError from "../utils/AppError.js";

const validate = schema => (req, res, next) => {
  const parsedData = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!parsedData.success) {
    const flatErrors = parsedData.error.flatten().fieldErrors;

    const errors = parsedData.error.issues[0].message;
    // const errors = parsedData.error.format();

    // console.log(errors);

    // const path = parsedData.error.issues[0].path;
    // const fieldName =
    //   path.length > 0 ? path[path.length - 1].charAt(0).toUpperCase() : "Field";

    throw new AppError(400, `Invalid input data: ${errors}`);
  }

  req.body = parsedData.data.body;
  // req.query = parsedData.data.query;
  // req.params = parsedData.data.params;

  next();
};

export {validate};
