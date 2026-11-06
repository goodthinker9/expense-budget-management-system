/**
 * validateId — route-param middleware
 *
 * Validates that req.params.id is a positive integer.
 * Use as: router.get('/:id', validateId, handler)
 *
 * Returns 400 { message: "Invalid id" } for anything that is not
 * a whole number ≥ 1, preventing Postgres from receiving a bogus
 * value and throwing an unhandled 22P02 cast error.
 */
const validateId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  next();
};

export default validateId;
