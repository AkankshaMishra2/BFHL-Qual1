exports.successResponse = (res, data) => {
  res.status(200).json({
    is_success: true,
    official_email: process.env.OFFICIAL_EMAIL,
    data
  });
};

exports.errorResponse = (res, status, message) => {
  res.status(status).json({
    is_success: false,
    official_email: process.env.OFFICIAL_EMAIL,
    error: message
  });
};
