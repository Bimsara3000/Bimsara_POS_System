import {orders_db, cart_db, history_db, customers_db, items_db} from "../db/DB.js";
// import OrderModel from "../model/OrderModel.js";
import CartModel from "../model/CartModel.js";
// import CustomerModel from "../model/CustomerModel";

export function loadCustomerMenu() {
    $('#customer_menu').empty();
    customers_db.forEach(customer => {
        $('#customer_menu').append(`<li><a class="dropdown-item" href="#">${customer.name}</a></li>`);
    });
}

$('#customer_menu').on('click', 'a', function (e) {
    e.preventDefault();
    const text = $(this).text();

    $('#customer-input').val(text);
});

export function loadItemMenu() {
    $('#item_menu').empty();
    items_db.forEach(item => {
        $('#item_menu').append(`<li><a class="dropdown-item" href="#">${item.name}</a></li>`);
    });
}

$('#item_menu').on('click', 'a', function (e) {
    e.preventDefault();
    const text = $(this).text();

    $('#item-input').val(text);
});

$('#order_save').on('click', function(){
    let id = $('#order-id-input').val().trim();
    let customer = $('#customer-input').val().trim();
    let item = $('#item-input').val().trim();
    let qty = $('#quantity-input').val().trim();

    let bId, bCustomer, bItem, bQty = false;

    if (id === '') {
        setErrorFor($('#order-id-input'), 'Id cannot be empty');
    } else {
        setSuccessFor($('#order-id-input'));
        bId = true;
    }

    if (customer === '') {
        setErrorFor($('#customer-input'), 'Customer cannot be empty');
    } else {
        setSuccessFor($('#customer-input'));
        bCustomer = true;
    }

    if (item === '') {
        setErrorFor($('#item-input'), 'Item cannot be empty');
    } else {
        setSuccessFor($('#item-input'));
        bItem = true;
    }

    if (qty === '') {
        setErrorFor($('#quantity-input'), 'Quantity cannot be empty');
    } else if(!checkQty(qty)){
        setErrorFor($('#quantity-input'), 'The Quantity is invalid');
    } else if(!checkStock(item, qty)){
        setErrorFor($('#quantity-input'), 'The Quantity exceeds the available amount!');
    } else {
        setSuccessFor($('#quantity-input'));
        bQty = true;
    }

    if(bId && bCustomer && bItem && bQty) {
        const index = items_db.findIndex(c => c.name === item);
        if (index !== -1) {
            let cart_data = new CartModel(items_db[index].id, item, qty, items_db[index].price);
            cart_db.push(cart_data);
        }

        loadCart();
        clear();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
    }
});

function checkQty(q) {
    return /^\d+$/.test(q);
}

function checkStock(i, q) {
    const index = items_db.findIndex(c => c.name === i);
    if (index !== -1) {
        return q <= items_db[index].qty;
    }
}

function loadCart() {
    $('#cart_tbody').empty();
    cart_db.map((item) => {
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

        $('#cart_tbody').append(data);
    })
}

function clear() {
    $('#item-input').val('');
    $('#quantity-input').val('');
}

function setErrorFor(input, msg) {
    const form = input.parent();
    const small = form.find('small')

    small.text(msg);
    form.removeClass('form_control success').addClass('form_control error');
}

function setSuccessFor(input) {
    const form = input.parent();
    form.removeClass('form_control error').addClass('form_control success');
}

$("#cart_tbody").on('click', 'tr', function(){
    let idx = $(this).index();
    let obj = cart_db[idx];

    let name = obj.name;
    let qty = obj.qty;

    $('#item-input').val(name);
    $("#quantity-input").val(qty);
});

// $('#item_delete').on('click', function(){
//     const index = items_db.findIndex(c => c.id === $('#item-id-input').val().trim());
//     if (index !== -1) {
//         Swal.fire({
//             title: "Are you sure?",
//             text: "You won't be able to revert this!",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             cancelButtonColor: "#d33",
//             confirmButtonText: "Yes, delete it!"
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 items_db.splice(index,1);
//                 loadItems();
//                 clear();
//                 Swal.fire({
//                     title: "Deleted!",
//                     text: "The item has been deleted.",
//                     icon: "success"
//                 });
//             }
//         });
//     } else {
//         Swal.fire({
//             title: 'Error!',
//             text: 'Please select an item!',
//             icon: 'error',
//             confirmButtonText: 'Ok'
//         })
//     }
// });
//
// $('#item_update').on('click', function(){
//     const index = items_db.findIndex(c => c.id === $('#item-id-input').val().trim());
//     if (index !== -1) {
//         let name = $('#item_name-input').val().trim();
//         let qty = $('#qty-input').val().trim();
//         let price = $('#price-input').val().trim();
//
//         let bName, bQty, bPrice = false;
//
//         if (name === '') {
//             setErrorFor($('#item_name-input'), 'Name cannot be empty');
//         } else if(!checkName(name)){
//             setErrorFor($('#item_name-input'), 'The name is invalid');
//         } else {
//             setSuccessFor($('#item_name-input'));
//             bName = true;
//         }
//
//         if (qty === '') {
//             setErrorFor($('#qty-input'), 'Quantity cannot be empty');
//         } else if(!checkQty(qty)){
//             setErrorFor($('#qty-input'), 'Quantity is invalid');
//         } else {
//             setSuccessFor($('#qty-input'));
//             bQty = true;
//         }
//
//         if (price === '') {
//             setErrorFor($('#price-input'), 'Price cannot be empty');
//         } else if(!checkPrice(price)){
//             setErrorFor($('#price-input'), 'Price is invalid');
//         } else {
//             setSuccessFor($('#price-input'));
//             bPrice = true;
//         }
//
//         if (bName && bQty && bPrice) {
//             items_db[index].name = name;
//             items_db[index].qty = qty;
//             items_db[index].price = price;
//
//             loadItems();
//             clear();
//
//             Swal.fire({
//                 title: "Updated Successfully!",
//                 icon: "success",
//                 draggable: true
//             });
//         }
//
//     } else {
//         Swal.fire({
//             title: 'Error!',
//             text: 'Please select a item!',
//             icon: 'error',
//             confirmButtonText: 'Ok'
//         })
//     }
// });
//
// $('#item_reset').on('click', function(){
//     clear();
// });