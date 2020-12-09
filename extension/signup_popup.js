//buttons on the popup screen (login or signup)
const signupButton = document.querySelector('#signupButton');
const signupForm = document.querySelector('#signup-form');

const loginInstead = document.querySelector('#loginInstead');

//login
signupForm.addEventListener('submit',(e) => {
    e.preventDefault();

    //get user fields
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const firstname = signupForm['signup-firstname'].value;
    const lastname = signupForm['signup-lastname'].value;
    console.log(firstname, ", ", lastname);

    chrome.runtime.sendMessage({command: "signup", email: email, password: password, firstname: firstname, lastname: lastname}, (response) => {
        console.log("response: ", response.confirm);
        window.close()
    });

});

//create account
loginInstead.addEventListener('click', (e) => {
    e.preventDefault();

    window.location.href="login_popup.html";

    //chrome.browserAction.setPopup({popup: 'signup_popup.html'}, () => {
    //    console.log("switching to signup popup");
    //    window.close()
    //  })
});
