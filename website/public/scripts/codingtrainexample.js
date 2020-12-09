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
var ref = database.ref('fucks');

var data = {
  name: "JPB",
  score: 43
}
ref.push(data);

}());
