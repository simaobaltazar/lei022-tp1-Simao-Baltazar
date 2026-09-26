class ItemNotFoundException extends Error {
  constructor(message = "Item not found") {
    super(message);
    this.name = "ItemNotFoundException";
    this.statusCode = 404;
    }
}
module.exports = { ItemNotFoundException };