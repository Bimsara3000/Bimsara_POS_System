import {orders_db, history_db, cart_db} from "../db/DB.js";

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

$("#order_tbody").on('click', 'tr', function(){
    let idx = $(this).index();
    let obj = orders_db[idx];

    let index = obj.cart;

    $('#cart_history_tbody').empty();
    console.log(history_db[index]);
    history_db[index].map((item) => {
        let id = item.id;
        let name = item.name;
        let qty = item.qty;
        let price = item.price;

        let data = `<tr>
                            <td>${id}</td>
                            <td>${name}</td>
                            <td>${qty}</td>
                            <td>${price}</td>
                        </tr>`

        $('#cart_history_tbody').append(data);
    })
    // $("#item-table").css("display", "block");
});