export default class OrderModel {
    constructor(id, customer, date, cart, price) {
        this.id = id;
        this.customer = customer;
        this.date = date;
        this.cart = cart;
        this.price = price;
    }
}