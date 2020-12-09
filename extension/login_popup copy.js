//buttons on the popup screen (login or signup)
const signUpButton = document.querySelector('#signupButton');
const loginButton = document.querySelector('#loginButton');
const authChoice = document.querySelector('#authChoice');
const loggedInUserPopup = document.querySelector('#loggedInUserPopup');

//containers for signup and login forms
const signUpDiv = document.querySelector(".signUpDiv");
const loginDiv = document.querySelector(".loginDiv");

//the actual forms
const signUpForm = document.querySelector("#signup-form");
const loginForm = document.querySelector('#login-form');

//auth choice
loginButton.addEventListener('click', (e) => {
    e.preventDefault;
    console.log('clicked LOGIN');
    authChoice.style.display = 'none';
    loginDiv.style.display = 'block';
})
signUpButton.addEventListener('click', (e) => {
    e.preventDefault;
    console.log('clicked Sign Up');
    authChoice.style.display = 'none';
    signUpDiv.style.display = 'block';
})

//signup
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user fields
    const email = signUpForm['signup-email'].value;
    const password = signUpForm['signup-password'].value;
    const bio = signUpForm['signup-bio'].value;

    chrome.runtime.sendMessage({command: "signup", email: email, password: password, bio: bio}, (response) => {
            console.log("response: ", response.confirm);
        });
    //auth.createUserWithEmailAndPassword(email,password).then(cred => {
    //    console.log(cred);
    //});

});

//login
loginForm.addEventListener('submit',(e) => {
    e.preventDefault();

    //get user fields
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    chrome.runtime.sendMessage({command: "login", email: email, password: password}, (response) => {
        console.log("response: ", response.confirm);
    });

});
