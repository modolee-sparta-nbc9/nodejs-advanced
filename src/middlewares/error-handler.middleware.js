export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode ?? 500;
  const message =
    err.message ?? '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.';

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
