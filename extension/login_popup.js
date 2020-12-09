//buttons on the popup screen (login or signup)
const loginButton = document.querySelector('#loginButton');
const loginForm = document.querySelector('#login-form');

const createAccount = document.querySelector('#createAccount');

//login
loginForm.addEventListener('submit',(e) => {
    e.preventDefault();

    //get user fields
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    chrome.runtime.sendMessage({command: "login", email: email, password: password}, (response) => {
        if (response.error) {
            M.toast({html: response.error, displayLength: 1000})
        } else {
            M.toast({html: "Welcome!", displayLength: 900})
            console.log("response: ", response.confirm);
            setTimeout(function () { window.close();}, 1000);
        }
    });

});

//confirmation message before closing
// window.close()

//create account
createAccount.addEventListener('click', (e) => {
    e.preventDefault();

    window.location.href="signup_popup.html";

    //chrome.browserAction.setPopup({popup: 'signup_popup.html'}, () => {
    //    console.log("switching to signup popup");
    //    window.close()
    //  })
});
