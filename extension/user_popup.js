const logoutButton = document.querySelector('#logout-button');
const navDiv = document.querySelector('.nav-wrapper');
const userLink = document.querySelector('#user-link');
const collectionUrl = document.querySelector('#collectionUrl');

//grab user email address and display next to logout button on nav
window.onload = (e) => {  
    console.log('page created, get username');
    chrome.runtime.sendMessage({command: "getUsername"}, (response) => {
        console.log("username response: ", response.confirm);
        userLink.innerHTML = response.first;
    });
}

//when clicking username - redirect to (local) user homepage
userLink.addEventListener('click', (e) => {
    e.preventDefault;
    console.log('opening user page');
    chrome.tabs.create({url: 'user_page.html'}, function (tabs) {
        console.log('tabs: ', tabs);
    });
});

//logout and close window
logoutButton.addEventListener('click', (e) => {
    e.preventDefault;
    console.log('logout');
    chrome.runtime.sendMessage({command: "logout"}, (response) => {
        console.log("logout response: ", response.confirm);
        window.close();
    })

});

//get hostname for displaying the list of qualities about the domain
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url)
    var domain = url.hostname
      //get count of collection entries with a matching domain
    chrome.runtime.sendMessage({command: 'countMatches', data: domain}, (response) => {
        console.log('count response: ', response.confirm);
        collectionUrl.innerHTML = 
        `
        ${domain}<span class="badge" data-badge-caption="corrections">${response.confirm}</span>
        `
    });
})
