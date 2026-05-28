// validate.js — Express middleware that validates req.body (or req.query/req.params)
// against a Zod schema. Returns 400 with clear error messages on failure.

/**
 * Returns Express middleware that validates req.body against the given Zod schema.
 * On success, replaces req.body with the parsed (and stripped) result.
 * On failure, returns 400 with structured error details.
 *
 * Usage:  router.post('/route', verifyJWT, validate(mySchema), handler)
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    // Replace body with parsed & stripped data (removes unknown fields)
    req.body = result.data;
    next();
  };
}

/**
 * Same as validate() but checks req.query instead of req.body.
 */
function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const errors = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }));

      return res.status(400).json({
        error: 'Query validation failed',
        details: errors
      });
    }

    req.query = result.data;
    next();
  };
}

module.exports = { validate, validateQuery };
