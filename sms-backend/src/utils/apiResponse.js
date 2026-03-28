export const successResponse = (res, data, message = 'Success') => {
  return res.json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message = 'Error', status = 400) => {
  return res.status(status).json({
    success: false,
    message
  });
};