$(document).ready(function() {
//splits each <p> into 1 <span> per word
/*
  $( "p" ).each( function(){
  	var words= $( this ).text().split( /\s+/ );
    var text = words.join( "</span> <span>" );
    $( this ).html( "<span>" + text + "</span>" );
  });
*/

//test to add class to a span after double-clicked
/*
  $( "span" ).on( "dblclick", function() {
    $( this ).addClass('hello');
 });
*/

//adds tooltip after the currently selected span (still hidden) - not needed
/* $( "span" ).on( "dblclick", function() {
    $( ".tooltip").insertAfter(this);
 });
*/
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

//splits each p into one <span> per sentence
$( "p" ).each( function(){
  console.log($(this).text());
  var words= $( this ).text().match( /[^\.!\?]+[\.!\?]+/g );
  console.log(words);
  if (words != null) {
    var text = words.join( "</span> <span>" );
    $( this ).html( "<p><span>" + text + "</span></p>" );
  } else {
    $( this ).html( "<p><span>" + $(this).text() + "</span></p>" );
  }
});

var holder = "";
var selection = "";
var hostname = "hostname";

//reveals the tooltip after double clicking 10px down and right of the clicks
  $("p").on("dblclick", function(event) {
    if (event.pageX < 81) {
        $("div.tooltip").css({
          top: event.pageY + 25 + "px",
          left: event.pageX + "px",
        }).fadeIn();
      } else {
        $("div.tooltip").css({
            top: event.pageY + 25 + "px",
            left: event.pageX + -81 + "px"
          }).fadeIn();
      }

  });

  $("span").on("dblclick", function() {
    holder = $(this);
  });

  $("span").on("dblclick", function() {
    console.log(this);
  });

  $('.myButton').on('click',function(){
    //alert($(holder).text());
    $(holder).addClass("correction");
  });

  $('#falsehoods').change(function(){
    selection = $('#falsehoods option:selected').val();
    //console.log($('#falsehoods option:selected').text());
  });

  $('#falsehoods').change(function(){
    //selection = $('#falsehoods option:selected').text();
    console.log($('#falsehoods option:selected').val());
  });

  $('.myButton').on('click',function(){
    var data = {
      sentence: $(holder).text(),
      url: "www.breitbart.com",
      reason: $('#falsehoods option:selected').val()
    }
    console.log(data);
    ref.push(data);
  });

  $('.myButton').on('click',function(){
    var words= $(holder).text();
    //console.log(words);
    $( holder ).html( "<div class='tip'>" + words + "<span class='tiptext'>A factual claim has been submitted about this section. Read with caution</span></div>" );
  });

  $('.myButton').on('click',function(){
    $("div.tooltip").fadeOut();
  });


/*
  $('span').on("mouseover", function(){
    if ($(this).hasClass("correction")) {
      $("div.correctionTip").css({
          top: event.pageY + 25 + "px",
          left: event.pageX + -81 + "px"
    }).fadeIn();
    }
  });
*/
  $('.close').on('click', function(){
    $("div.tooltip").fadeOut();
  });
  $('.close').on('click', function(){
    $("div.correctionTip").fadeOut();
  });
});
