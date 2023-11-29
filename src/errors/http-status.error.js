export class BadRequest {
  constructor(message) {
    this.message = message;
    this.statusCode = 400;
  }
}

export class Unauthorized {
  constructor(message) {
    this.message = message;
    this.statusCode = 401;
  }
}

export class Forbidden {
  constructor(message) {
    this.message = message;
    this.statusCode = 403;
  }
}

export class NotFound {
  constructor(message) {
    this.message = message;
    this.statusCode = 404;
  }
}

export class InternalServerError {
  constructor(message) {
    this.message = message;
    this.statusCode = 500;
  }
}
