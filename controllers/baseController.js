async function triggerError(req, res, next) {
  const err = new Error("Intentional server error")
  err.status = 500
  throw err
}

module.exports = { triggerError }