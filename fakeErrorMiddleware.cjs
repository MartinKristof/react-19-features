module.exports = (req, res, next) => {
  const body = req.body || {};

  if (body.text === 'error') {
    // Simulate a 500 error
    setTimeout(() => {
      res.status(500).jsonp({
        error: 'error message here',
      });
    }, 1500);
  }

  next();
};
