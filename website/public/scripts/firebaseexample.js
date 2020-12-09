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

//get elements
const preObject = document.getElementById('object');
const ulList = document.getElementById('list');

const dbRefObject = firebase.database().ref().child('object');
const dbRefList = dbRefObject.child('Hobbies');

dbRefObject.on('value', snap => {
  preObject.innerText = JSON.stringify(snap.val(), null, 3);
});

  //sync list changes
  dbRefList.on('child_added', snap => {
  const li = document.createElement('li');
  li.innerText = snap.val();
  li.id = snap.key;
  ulList.appendChild(li);
  });

  dbRefList.on('child_changed', snap =>{
    const liChanged = document.getElementById(snap.key);
    liChanged.innerText = snap.val();

  });

  dbRefList.on('child_removed', snap =>{
    const liToRemove = document.getElementById(snap.key);
    liToRemove.remove();

  });
}());
