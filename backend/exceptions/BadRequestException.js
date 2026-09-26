class BadRequestException extends Error {
  constructor(message = "Invalid request") {
    super(message);
    this.name = "BadRequestException";
    this.statusCode = 400;
    }
}
module.exports = { BadRequestException };