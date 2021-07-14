const schemes = require('./scheme-model');

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
/** @type {import("express").RequestHandler} */
const checkSchemeId = (req, res, next) => {
  const id = req.params.scheme_id;
  schemes.findById(id).then(
    result => {
      if (result) {
        req.scheme = result;
        next();
      }
      else {
        res.status(404).json({ message: `scheme with scheme_id ${id} not found` });
      }
    },
    error => next(error)
  );
};

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
/** @type {import("express").RequestHandler} */
const validateScheme = (req, res, next) => {
  const name = req.body.scheme_name;
  if (name && typeof name === 'string') {
    req.scheme = { scheme_name: name };
    next();
  }
  else {
    res.status(400).json({message: "invalid scheme_name"});
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
/** @type {import("express").RequestHandler} */
const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body;

  if (!instructions || typeof instructions !== 'string' || isNaN(step_number) || step_number < 1) {
    res.status(400).json({ message: 'invalid step' });
  }
  else {
    req.step = { instructions, step_number };
    next();
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
