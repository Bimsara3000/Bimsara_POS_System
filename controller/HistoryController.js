import {orders_db} from "../db/DB.js";

export function loadOrders(customer) {
    $('#order_tbody').empty();
    orders_db.map((item) => {
        if (item.customer === customer) {
            let id = item.id;
            let date = item.date;
            let price = item.price;

            let data = `<tr>
                                <td>${id}</td>
                                <td>${customer}</td>
                                <td>${date}</td>
                                <td>${price}</td>
                            </tr>`

            $('#order_tbody').append(data);
        }
    })
}