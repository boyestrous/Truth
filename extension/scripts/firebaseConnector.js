const firebaseConfig = {
    apiKey: "AIzaSyBb5tBXAnh2iyMk0Xlax-n7_AX4c9ElTmc",
    authDomain: "test-90735.firebaseapp.com",
    databaseURL: "https://test-90735.firebaseio.com/",
    projectId: "test-90735",
    storageBucket: "test-90735.appspot.com",
    messagingSenderId: "524573174328",
    appId: "1:524573174328:web:245490f30bbb87757e14cd"
  };
  firebase.initializeApp(firebaseConfig);
  // console.log('firebase');
  // console.log(firebase);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const database = firebase.database();



var correctionRef = firebase.database().ref("corrections");
var dbRef = db.collection('complaints');
var hostname = '';
var hostnameMatches = [];
var filteredArray = [];
var currentUser = {};

function queryForHostname() {
  var idsForComplaints = [];
  db.collection("corrections").where("hostname", "==", hostname)
      .onSnapshot(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var docData = doc.data();
              //append ID to the object, so it can be attached to created HTML objects in content.js
              docData['id'] = doc.id;
              hostnameMatches.push(docData);
          });
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: "new_match", data: hostnameMatches});
          });
      });
}    

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined && tab.active == true && !tab.url.startsWith('chrome')) {
    // console.log('tab url: ', tab.url);
    tabURL = new URL(tab.url);
    hostname = tabURL.hostname;
    console.log('tab hostname from listener: ', hostname);
    queryForHostname();
  }
});

// var newPostKey = firebase.database().ref().child('posts').push().key;

function gotData(data) {
  hostnameMatches = [];
  correction = data.val();
  console.log('correction from gotData: ', correction);
  var keys = Object.keys(correction);

  // console.log('keys: ', keys);

  for (let index = 0; index < keys.length; index++) {
    var k = keys[index]
    hostnameMatches.push({key: k, highlight: correction[k].highlight, hostname: correction[k].hostname, complaints: correction[k].complaints})
  }
  if (!tab.url.startsWith('chrome')) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {command: "new_match", data: hostnameMatches[hostnameMatches.length-1]}, function(response) {
        console.log("newmatch: ",response.confirm);
      });
    });
  }
  
}

//listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    //change popup to show user details and logout button, if user is logged in
    chrome.browserAction.setPopup({popup: 'user_popup.html'}, () => {
      console.log("User: ", user.email, " logged in, popup changed");
    })
    //set currentUser object uid and email
    currentUser['uid'] = user.uid;
    currentUser['email'] = user.email;
    //use UID to lookup the user details (stored in separate DB from auth information)
    db.collection('users').doc(user.uid).get().then(function(doc) {
      if (doc.exists) {
        //currentUser = doc.data();           
        var person = doc.data(); 
        currentUser['firstName'] = person.first;
        currentUser['lastName'] = person.last;
        console.log("current user: ", currentUser);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such user exists!");
      }
    }).catch(function(error) {
      //user doesn't have details other than AUTH information
      console.log("Error getting document:", error);
    });
  //space
  } else {
    //no user detected, set popup window to show login form
    chrome.browserAction.setPopup({popup: 'login_popup.html'}, () => {
      console.log("User: logged out, popup changed");
    })
    //reset currentUser variable for later 
    currentUser = {};
  }
});

//listen for requests for DB access from other scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
     //send data to DB
    if (request.command == "push"){
      db.collection('corrections').add(request.correction)
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          //get newly created DOC ID, then create corresponding complaint record
          newComplaint = request.complaint;
          newComplaint['correction_id'] = docRef.id;
          db.collection('complaints').add(newComplaint)
          .then(function(docCompRef) {
              console.log("Document written with ID: ", docCompRef.id);
          })
          .catch(function(error) {
              console.error("Error adding document: ", error);
          });;
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });;
      
      sendResponse({confirm: "data pushed: " + request.data});
      return true;
    }

    if (request.command == 'new_complaint'){
      // console.log('data from new complaint request: ',request.data);
      newComplaintData = {
        dateTime: request.data.dateTime,
        details: request.data.details,
        correction_id: request.data.correction_id,
        short: request.data.short,
        user: currentUser['uid']
      }
      // console.log('new_complaint Data', newComplaintData);
      db.collection('complaints').add(newComplaintData)
          .then(function(docCompRef) {
              // console.log("Document written with ID: ", docCompRef.id);
          })
          .catch(function(error) {
              console.error("Error adding document: ", error);
          });;
    }

    //submit signup details to auth
    if (request.command == 'signup') {
      first = request.firstname;
      last = request.lastname;
      auth.createUserWithEmailAndPassword(request.email,request.password).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
          first: first,
          last: last
        });
      });
      sendResponse({confirm: "first and last added?"});
      return true;
    }
    
    //login
    if (request.command == 'login') {
      auth.signInWithEmailAndPassword(request.email, request.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("code: ", errorCode);// ...
        console.log("message: ", errorMessage);// ...
        if (errorCode) {
          sendResponse({error: errorCode});
        }
      }).then(cred => {
        // console.log("cred: ", cred);          
        sendResponse({confirm: cred.email});   
      });         
      return true;
    }

    //fetch
    if(request.command =='fetch') {
      console.log('fetch command');
      var complaints = [];
      db.collection("complaints").where("correction_id", "==", request.id)
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  // doc.data() is never undefined for query doc snapshots
                  var iterdata = doc.data();
                  iterdata.id = doc.id;
                  complaints.push(iterdata);
              });
              console.log("matching complaints: ", complaints);
              sendResponse({confirm: 'fetch confirmed', complaints: complaints});
          })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });    
      return true;
    }

    //retrieve first name of current user for display on the user_popup
    if(request.command == 'getUsername') {
      // console.log('username requested');
      // console.log("email: ", currentUser['email']);
      sendResponse({email: currentUser['email'], first: currentUser['firstName'], uid: currentUser['uid']});
      return true;
    }
    
    //logout
    if (request.command == 'logout') {
      auth.signOut();
      sendResponse({confirm: "signed out"});
    }
});