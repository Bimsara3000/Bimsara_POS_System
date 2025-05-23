import {orders_db, cart_db, history_db, customers_db, items_db} from "../db/DB.js";
import OrderModel from "../model/OrderModel.js";
import CartModel from "../model/CartModel.js";
import {loadItems} from "./ItemController.js";
import {loadOrders} from "./HistoryController.js";

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
        const idx = cart_db.findIndex(c => c.name === item);
        if (idx !== -1) {
            let preQty = parseFloat(cart_db[idx].qty);
            cart_db[idx].qty = preQty + parseFloat((qty));
        } else {
            const index = items_db.findIndex(c => c.name === item);
            if (index !== -1) {
                let cart_data = new CartModel(items_db[index].id, item, qty, items_db[index].price);
                cart_db.push(cart_data);
            }
        }

        loadCart();
        clear();
        setTotal();

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
    const idx = cart_db.findIndex(c => c.name === i);
    if (idx !== -1) {
        const index = items_db.findIndex(c => c.name === i);
        if (index !== -1) {
            return q <= (parseFloat(items_db[index].qty) - parseFloat(cart_db[idx].qty));
        }
    } else {
        const index = items_db.findIndex(c => c.name === i);
        if (index !== -1) {
            return q <= items_db[index].qty;
        }
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
    $('#btn_item').prop('disabled', true);
});

$('#order_delete').on('click', function(){
    const index = cart_db.findIndex(c => c.name === $('#item-input').val().trim());
    if (index !== -1) {
        Swal.fire({
            title: "Are you sure?",
            text: "This item will be removed from the cart!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                cart_db.splice(index,1);
                loadCart();
                clear();
                setTotal();
                Swal.fire({
                    title: "Deleted!",
                    text: "The item has been removed from the cart!"
                });
            }
        });
    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Please select an item!',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    }
});

$('#order_update').on('click', function(){
    const index = cart_db.findIndex(c => c.name === $('#item-input').val().trim());
    if (index !== -1) {
        let item = $('#item-input').val().trim();
        let qty = $('#quantity-input').val().trim();

        let bQty = false;

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

        if (bQty) {
            cart_db[index].qty = qty;

            loadCart();
            clear();
            setTotal();

            Swal.fire({
                title: "Updated Successfully!",
                icon: "success",
                draggable: true
            });

            $('#btn_item').prop('disabled', false);
            $('#myBtn').prop('disabled', false);
        }

    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Please select a item!',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    }
});

$('#order_reset').on('click', function(){
    Swal.fire({
        title: "Are you sure?",
        text: "The cart will be emptied!!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, reset it!"
    }).then((result) => {
        if (result.isConfirmed) {
            clear();
            cart_db.length = 0;
            loadCart();
            $('#customer-input').val('');
            $('#order-id-input').val('');
            $('#tot').val('');
            $('#myBtn').prop('disabled', false);
            Swal.fire({
                title: "Reset!",
                text: "The page has been Reset!"
            });
        }
    });
});

function setTotal() {
    let total = 0;
    cart_db.map((item) => {
        let qty = item.qty;
        let price = item.price;

        total = total + (parseFloat(qty)*parseFloat(price));

        $('#tot').val(`Rs. ${total}`);
    })
}

$('#button-addon2').on('click', function(){
    let id = $('#order-id-input').val().trim();
    let customer = $('#customer-input').val().trim();

    let bId, bCustomer, bCart = false;

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

    if (!cart_db.length > 0) {
        setErrorFor($('#item-input'), 'The cart cannot be empty');
        setErrorFor($('#quantity-input'), 'The cart cannot be empty');
    } else {
        setSuccessFor($('#item-input'));
        setSuccessFor($('#quantity-input'));
        bCart = true;
    }

    if(bId && bCustomer && bCart) {
        cart_db.map((item) => {
            let qty = item.qty;
            let name = item.name;

            const index = items_db.findIndex(c => c.name === name);
            if (index !== -1) {
                let quantity = items_db[index].qty;
                items_db[index].qty = (parseFloat(quantity) - parseFloat(qty));
            }
        })

        history_db.push(cart_db);

        let order = new OrderModel($('#order-id-input').val(), $('#customer-input').val(), new Date().toISOString().split('T')[0], (history_db.length-1), $('#tot').val());
        orders_db.push(order);

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });

        cart_db.length = 0;
        clear();
        loadCart();
        $('#customer-input').val('');
        $('#order-id-input').val('');
        $('#tot').val('');
        $('#myBtn').prop('disabled', false);
        loadItems();
    }
});

$('#btn_history').on('click', function(){
    let customer = $('#customer-input').val().trim();

    let bCustomer = false;

    if (customer === '') {
        setErrorFor($('#customer-input'), 'Customer cannot be empty');
    } else {
        setSuccessFor($('#customer-input'));
        bCustomer = true;
    }

    if (bCustomer) {
        const index = customers_db.findIndex(c => c.name === customer);
        if (index !== -1) {
            loadOrders(customer);
            $('#customer-input').val('');
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Please select a customer!',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        }
    }
});






