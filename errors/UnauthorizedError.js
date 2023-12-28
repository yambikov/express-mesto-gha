// 401
// "message":"Неправильные email или пароль"

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
