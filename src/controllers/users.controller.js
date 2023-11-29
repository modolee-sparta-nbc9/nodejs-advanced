export class UsersController {
  readMyInfo = (req, res, next) => {
    try {
      const me = res.locals.user;

      return res.status(200).json({
        success: true,
        message: '내 정보 조회에 성공했습니다.',
        data: me,
      });
    } catch (error) {
      next(error);
    }
  };
}
