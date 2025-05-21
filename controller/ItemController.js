import {items_db} from "../db/DB.js";
import ItemModel from "../model/ItemModel.js";
import {loadItemMenu} from "./OrderController.js";

function loadItems() {
    $('#item-tbody').empty();
    items_db.map((item) => {
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

        $('#item-tbody').append(data);
    })
}

$('#item_save').on('click', function(){
    let id = $('#item-id-input').val().trim();
    let name = $('#item_name-input').val().trim();
    let qty = $('#qty-input').val().trim();
    let price = $('#price-input').val().trim();

    let bId, bName, bQty, bPrice = false;

    if (id === '') {
        setErrorFor($('#item-id-input'), 'Id cannot be empty');
    } else {
        setSuccessFor($('#item-id-input'));
        bId = true;
    }

    if (name === '') {
        setErrorFor($('#item_name-input'), 'Name cannot be empty');
    } else if(!checkName(name)){
        setErrorFor($('#item_name-input'), 'The name is invalid');
    } else {
        setSuccessFor($('#item_name-input'));
        bName = true;
    }

    if (qty === '') {
        setErrorFor($('#qty-input'), 'Quantity cannot be empty');
    } else if(!checkQty(qty)){
        setErrorFor($('#qty-input'), 'Quantity is invalid');
    } else {
        setSuccessFor($('#qty-input'));
        bQty = true;
    }

    if (price === '') {
        setErrorFor($('#price-input'), 'Price cannot be empty');
    } else if(!checkPrice(price)){
        setErrorFor($('#price-input'), 'Price is invalid');
    } else {
        setSuccessFor($('#price-input'));
        bPrice = true;
    }

    if(bId && bName && bQty && bPrice) {

        let item_data = new ItemModel(id, name, qty, price);

        items_db.push(item_data);

        loadItems();
        clear();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });

        loadItemMenu();
    }
});

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

function checkQty(q) {
    return /^\d+$/.test(q);
}

function checkName(nm) {
    return /^[A-Za-z ]+$/.test(nm);
}

function checkPrice(p) {
    return /^\d+(\.\d{1,2})?$/.test(p);
}

$("#item-tbody").on('click', 'tr', function(){
    let idx = $(this).index();
    let obj = items_db[idx];

    let id = obj.id;
    let name = obj.name;
    let qty = obj.qty;
    let price = obj.price;

    $('#item-id-input').val(id);
    $('#item_name-input').val(name);
    $('#qty-input').val(qty);
    $("#price-input").val(price);

    $('#item-id-input').prop('readonly', true);
});

$('#item_delete').on('click', function(){
    const index = items_db.findIndex(c => c.id === $('#item-id-input').val().trim());
    if (index !== -1) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                items_db.splice(index,1);
                loadItems();
                clear();
                Swal.fire({
                    title: "Deleted!",
                    text: "The item has been deleted.",
                    icon: "success"
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

function clear() {
    $('#item-id-input').val('');
    $('#item_name-input').val('');
    $('#qty-input').val('');
    $("#price-input").val('');
    $("#item_name").val('');

    $('#item-id-input').prop('readonly', false);
}

$('#item_update').on('click', function(){
    const index = items_db.findIndex(c => c.id === $('#item-id-input').val().trim());
    if (index !== -1) {
        let name = $('#item_name-input').val().trim();
        let qty = $('#qty-input').val().trim();
        let price = $('#price-input').val().trim();

        let bName, bQty, bPrice = false;

        if (name === '') {
            setErrorFor($('#item_name-input'), 'Name cannot be empty');
        } else if(!checkName(name)){
            setErrorFor($('#item_name-input'), 'The name is invalid');
        } else {
            setSuccessFor($('#item_name-input'));
            bName = true;
        }

        if (qty === '') {
            setErrorFor($('#qty-input'), 'Quantity cannot be empty');
        } else if(!checkQty(qty)){
            setErrorFor($('#qty-input'), 'Quantity is invalid');
        } else {
            setSuccessFor($('#qty-input'));
            bQty = true;
        }

        if (price === '') {
            setErrorFor($('#price-input'), 'Price cannot be empty');
        } else if(!checkPrice(price)){
            setErrorFor($('#price-input'), 'Price is invalid');
        } else {
            setSuccessFor($('#price-input'));
            bPrice = true;
        }

        if (bName && bQty && bPrice) {
            items_db[index].name = name;
            items_db[index].qty = qty;
            items_db[index].price = price;

            loadItems();
            clear();

            Swal.fire({
                title: "Updated Successfully!",
                icon: "success",
                draggable: true
            });
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

$('#item_reset').on('click', function(){
    clear();
});

$('#item_search').on('click', function(e){
    e.preventDefault();
    const index = items_db.findIndex(c => c.name.toLowerCase() === $('#item_name').val().trim().toLowerCase());
    if (index !== -1) {
        let obj = items_db[index];

        let id = obj.id;
        let name = obj.name;
        let qty = obj.qty;
        let price = obj.price;

        $('#item-id-input').val(id);
        $('#item_name-input').val(name);
        $('#qty-input').val(qty);
        $("#price-input").val(price);

        $('#item-id-input').prop('readonly', true);
        $('#item_name').val('')

    } else {
        Swal.fire({
            title: 'Error!',
            text: 'The item does not exist!',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
        $('#item_name').val('')
    }
});