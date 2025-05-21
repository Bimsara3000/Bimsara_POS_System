import {customers_db} from "../db/DB.js";
import CustomerModel from "../model/CustomerModel.js";

function loadCustomers() {
    $('#customer-tbody').empty();
    customers_db.map((item) => {
        let id = item.id;
        let name = item.name;
        let email = item.email;
        let address = item.address;

        let data = `<tr>
                            <td>${id}</td>
                            <td>${name}</td>
                            <td>${address}</td>
                            <td>${email}</td>
                        </tr>`

        $('#customer-tbody').append(data);
    })
}

// save
$('#customer_save').on('click', function(){
    let form = $('#form');
    let id = $('#customer-id-input').val().trim();
    let name = $('#name-input').val().trim();
    let email = $('#email-input').val().trim();
    let address = $('#address').val().trim();

    let bId, bName, bEmail, bAddress = false;

    if (id === '') {
        setErrorFor($('#customer-id-input'), 'Id cannot be empty');
    } else {
        setSuccessFor($('#customer-id-input'));
        bId = true;
    }

    if (name === '') {
        setErrorFor($('#name-input'), 'Name cannot be empty');
    } else if(!checkName(name)){
        setErrorFor($('#name-input'), 'The name is invalid');
    } else {
        setSuccessFor($('#name-input'));
        bName = true;
    }

    if (email === '') {
        setErrorFor($('#email-input'), 'Email cannot be empty');
    } else if(!checkEmail(email)){
        setErrorFor($('#email-input'), 'Email is invalid');
    } else {
        setSuccessFor($('#email-input'));
        bEmail = true;
    }

    if (address === '') {
        setErrorFor($('#address'), 'Address cannot be empty');
    } else {
        setSuccessFor($('#address'));
        bAddress = true;
    }

    if(bId && bName && bEmail && bAddress) {

        let customer_data = new CustomerModel(id, name, address, email);

        customers_db.push(customer_data);

        loadCustomers();
        clear();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });
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

function checkEmail(em) {
    return /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(em);
}

function checkName(nm) {
    return /^[A-Za-z ]+$/.test(nm);
}

$("#customer-tbody").on('click', 'tr', function(){
    let idx = $(this).index();
    let obj = customers_db[idx];

    let id = obj.id;
    let name = obj.name;
    let email = obj.email;
    let address = obj.address;

    $('#customer-id-input').val(id);
    $('#name-input').val(name);
    $('#email-input').val(email);
    $("#address").val(address);

    $('#customer-id-input').prop('readonly', true);
});

$('#customer_delete').on('click', function(){
    const index = customers_db.findIndex(c => c.id === $('#customer-id-input').val().trim());
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
                customers_db.splice(index,1);
                loadCustomers();
                clear();
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });
    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Please select a customer!',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    }
});

function clear() {
    $('#customer-id-input').val('');
    $('#name-input').val('');
    $('#email-input').val('');
    $("#address").val('');

    $('#customer-id-input').prop('readonly', false);
}

$('#customer_update').on('click', function(){
    const index = customers_db.findIndex(c => c.id === $('#customer-id-input').val().trim());
    if (index !== -1) {
        let name = $('#name-input').val().trim();
        let email = $('#email-input').val().trim();
        let address = $('#address').val().trim();

        let bName, bEmail, bAddress = false;

        if (name === '') {
            setErrorFor($('#name-input'), 'Name cannot be empty');
        } else if(!checkName(name)){
            setErrorFor($('#name-input'), 'The name is invalid');
        } else {
            setSuccessFor($('#name-input'));
            bName = true;
        }

        if (email === '') {
            setErrorFor($('#email-input'), 'Email cannot be empty');
        } else if(!checkEmail(email)){
            setErrorFor($('#email-input'), 'Email is invalid');
        } else {
            setSuccessFor($('#email-input'));
            bEmail = true;
        }

        if (address === '') {
            setErrorFor($('#address'), 'Address cannot be empty');
        } else {
            setSuccessFor($('#address'));
            bAddress = true;
        }

        if (bName && bEmail && bAddress) {
            customers_db[index].name = name;
            customers_db[index].email = email;
            customers_db[index].address = address;

            loadCustomers();
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
            text: 'Please select a customer!',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    }
});

$('#customer_reset').on('click', function(){
    clear();
});

$('#customer_search').on('click', function(e){
    e.preventDefault();
    const index = customers_db.findIndex(c => c.name.toLowerCase() === $('#customer_name').val().trim().toLowerCase());
    if (index !== -1) {
        let obj = customers_db[index];

        let id = obj.id;
        let name = obj.name;
        let email = obj.email;
        let address = obj.address;

        $('#customer-id-input').val(id);
        $('#name-input').val(name);
        $('#email-input').val(email);
        $("#address").val(address);

        $('#customer-id-input').prop('readonly', true);
        $('#customer_name').val('')

    } else {
        Swal.fire({
            title: 'Error!',
            text: 'The customer does not exist!',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    }
});