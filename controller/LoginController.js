import {users_db} from "../db/DB.js";

$('#enter-button').on('click', function() {
    let user_name = $('#first-name-input');
    let password = $('#exampleInputPassword1');
    let un = user_name.val();
    let pw = password.val();

    if (un === '') {
        setErrorFor(user_name,'Username cannot be empty!')
    } else if (!checkUN(un)) {

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

function checkUN(user) {

}