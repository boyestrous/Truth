$(document).ready(function(){
  
});

// M.AutoInit();

function resizeIFrameToFitContent( iFrame ) {

  iFrame.width  = iFrame.contentWindow.document.body.scrollWidth;
  iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
}

window.addEventListener('DOMContentLoaded', function(e) {

  var iFrame = document.getElementById( 'tipFrame' );
  resizeIFrameToFitContent( iFrame );

  // or, to resize all iframes:
  var iframes = document.querySelectorAll("iframe");
  for( var i = 0; i < iframes.length; i++) {
      resizeIFrameToFitContent( iframes[i] );
  }
} );

(function(){

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
console.log(firebase);

var database = firebase.database();
var ref = database.ref('corrections');

const table = document.getElementById('correctionTable');
// Create a reference with an initial file path and name
var storageRef = firebase.storage();

// Create a reference to the file we want to download
var pathReference = storageRef.ref('Extension/extension.zip');

$("#download-button").on('click', () => {
    console.log('button clicked');
    // Get the download URL
    pathReference.getDownloadURL().then(function(url) {
      console.log("url: ", url);
      window.open(url, "_blank");
      // window.location.href = 'getting_started.html';
      // var xhr = new XMLHttpRequest();
      // xhr.responseType = 'blob';
      // xhr.onload = function(event) {
      //   var blob = xhr.response;
      // };
      // xhr.open('GET', url);
      // xhr.send();
    }).catch(function(error) {
    
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
    
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
    
        case 'storage/canceled':
          // User canceled the upload
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });

});


  //sync list changes
  ref.on('child_added', snap => {
    //console.log('added');
    console.log(snap.child('sentence').val());
    var row = table.insertRow(-1);
    row.id = snap.key;
    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);
    cell1.innerText = '\"' + snap.child('highlight').val() + '\"';
    var cell2 = row.insertCell(1);
    cell2.innerText = snap.child('explanation').val();
    var cell3 = row.insertCell(2);
    cell3.innerText = snap.child('hostname').val();
    var cell4 = row.insertCell(3);
    cell4.innerText = snap.child('user').val();
    });

  ref.on('child_changed', snap =>{
    const row = document.getElementById(snap.key);
    //liChanged.innerText = snap.child('reason').val();
    row.id = snap.key;
    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    row.cells[0].innerText = snap.child('reason').val()
    row.cells[1].innerText = snap.child('sentence').val()
    //var cell1 = row.insertCell(0);
    //cell1.innerText = snap.child('reason').val();
    //var cell2 = row.insertCell(1);
    //cell2.innerText = snap.child('sentence').val();
  });

  ref.on('child_removed', snap =>{
    const liToRemove = document.getElementById(snap.key);
    liToRemove.remove();
    console.log('removed');
    console.log(liToRemove);
  });

}());
