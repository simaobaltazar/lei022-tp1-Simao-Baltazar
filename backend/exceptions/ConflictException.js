class ConflictException extends Error {
  constructor(message = "This field already exists") {
    super(message);
    this.name = "ConflictException";
    this.statusCode = 409;
    }
}
module.exports = {ConflictException};