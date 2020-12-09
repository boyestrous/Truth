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


//  var correctionRef = database.ref('corrections');
var correctionRef = firebase.database().ref("corrections");
// console.log("correctionRefs: " + correctionRef);
var hostnameMatches = [];
var filteredArray = [];
var currentUser = {};


correctionRef.on('value', gotData, errData)

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

function errData(err) {
  console.log("error: ", err);
}
//   snap => {
//   hostnameMatches.push({key: snap.key, highlight: snap.child('highlight').val(), hostname: snap.child('hostname').val()});
//   console.log("host matches: ",hostnameMatches);
//   console.log('snap k: ', snap.val());
// });


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
      correctionRef.push(request.data);
      sendResponse({confirm: "data pushed: " + request.data});
      return true;
    }

    if (request.command == 'update'){
      console.log('data from update request: ',request.data);
      updateData = {
        dateTime: request.data.dateTime,
        details: request.data.details,
        id: request.data.id + request.data.dateTime,
        short: request.data.short,
        user: currentUser['email']
      }
      console.log('updateData', updateData);
      complaintsCount = request.data.numComplaints;
      preppedUpdate = {};      
      preppedUpdate['/'+request.data.id+'/complaints/'+complaintsCount+'/'] = updateData; 
      console.log("PU: ",preppedUpdate); 
      correctionRef.update(preppedUpdate);
      sendResponse({confirm: "update command confirm"});
      return true;
    }

    //check for records with the same url/hostname in the DB, return an array of sentences for matching against the current page
    if (request.command == 'match') {
      var respSentences = [];
      
      filteredArray = hostnameMatches.filter(function( obj ) {
        // console.log("obj host: ", obj.hostname);
        // console.log('req data: ', request.data);
        return obj.hostname === request.data;
      });
        // console.log("filteredArray: ", filteredArray);
        filteredArray.forEach(item => respSentences.push({key: item.key, highlight: item.highlight}));
        // console.log("filtered sentences only: ", respSentences);
        sendResponse({confirm: respSentences});
        return true;
    };

    //return amount of matches for the current hostname. Used to display on the user_popup
    if (request.command == 'countMatches') {
      filteredArray = hostnameMatches.filter(function( obj ) {
        return obj.hostname === request.data;
      })
      sendResponse({confirm: filteredArray.length});
      return true;
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
      console.log('current hostnameMatches variable: ', hostnameMatches);

      var found = searchForId(request.id, hostnameMatches)
      console.log("found: ", found.complaints.length)
      sendResponse({confirm: 'fetch confirmed', complaints: found.complaints});
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

function searchForId(nameKey, myArray){
  for (var i=0; i < myArray.length; i++) {
      if (myArray[i].key === nameKey) {
          return myArray[i];
      }
  }
}
