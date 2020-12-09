$(document).ready(function() {

console.log(firebase);

var database = firebase.database();
var ref = database.ref('corrections');

  ref.on('child_added', snap => {
    $('span').each( function(){
      if (!$(this).hasClass("correction")) {
        if ($(this).text() === snap.child('sentence').val()) {
          //console.log("pre-match: " + $(this).text())
          var words= $(this).text();
          //console.log('words: ' + words);
          console.log(this);
          $(this).addClass('correction');
          $(this).html( "<div class='tip'>" + words + "<span class='tiptext'>A factual claim has been submitted about this section. Read with caution</span></div>" );
          //console.log('match: ' + $(this).text());
        } else {
          console.log('no match');
        }
      }
    });
  });
});
