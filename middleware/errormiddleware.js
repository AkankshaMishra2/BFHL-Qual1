module.exports = (err, req, res, next) => {
  console.error(err.message || err);
  res.status(500).json({
    is_success: false,
    official_email: process.env.OFFICIAL_EMAIL,
    error: err.message || "Internal Server Error"
  });
};
