class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
      this.statusCode = 404; // custom status for 404
    }
  }
  
  module.exports = NotFoundError;
  