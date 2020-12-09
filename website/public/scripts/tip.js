$(document).ready(function() {
    //initialize materialize js functions
    $('.tabs').tabs();
    $('.collapsible').collapsible();

});

$('#addMoreButton').on('click', function() {
    $(this).fadeOut();
    $('#formContainer').show();
});

$('#newQButton').on('click', function() {
    $(this).fadeOut();
    $('#qFormContainer').show();
});

// const addForm = document.getElementById('#addForm');
// console.log(addForm);
$("#addForm").on('submit', function (e) {
    e.preventDefault();

    console.log('submitted');
    const addForm = document.getElementById('addForm');

    var shorty = addForm['shortText'].value;
    console.log('short: ', shorty);

    var detail = addForm['det'].value;
    console.log('details: ', detail);

    var newItem = document.createElement('li');
    var colHeader = document.createElement('div');
    var colBody = document.createElement('div');
    var newLine = document.createElement('br');
    var disputeButton = document.createElement('button');
    
    colHeader.className = 'collapsible-header';
    colHeader.innerText = shorty;
    
    colBody.className = 'collapsible-body';
    colBody.innerText = detail;

    disputeButton.className = 'btn waves-effect waves-light purple darken-2';
    disputeButton.innerText = 'Dispute';

    $("#AQ .collapsible").append(newItem);
    newItem.append(colHeader);
    newItem.append(colBody);
    colBody.append(newLine);
    colBody.append(disputeButton);

    $("#formContainer").hide();
    $("#addMoreButton").fadeIn();
    $("#addForm")[0].reset();
  });

  $("#qForm").on('submit', function (e) {
    e.preventDefault();

    console.log('submitted');
    const qForm = document.getElementById('qForm');

    var shorty = qForm['qShortText'].value;
    console.log('short: ', shorty);

    var detail = qForm['qDet'].value;
    console.log('details: ', detail);

    var newItem = document.createElement('li');
    var colHeader = document.createElement('div');
    var colBody = document.createElement('div');
    var newLine = document.createElement('br');
    var answerButton = document.createElement('button');
    
    colHeader.className = 'collapsible-header';
    colHeader.innerText = shorty;
    
    colBody.className = 'collapsible-body';
    colBody.innerText = detail;

    answerButton.className = 'btn waves-effect waves-light purple darken-2';
    answerButton.innerText = 'Answer';

    $("#UAQ .collapsible").append(newItem);
    newItem.append(colHeader);
    newItem.append(colBody);
    colBody.append(newLine);
    colBody.append(disputeButton);

    $("#formContainer").hide();
    $("#addMoreButton").fadeIn();
    $("#addForm")[0].reset();
  });

  $("#AQ li button").on('click', function() {
    console.log('dispute clicked');
    console.log($(this).parent());
  });

  $("#cancelButton").on('click', function() {
    $("#formContainer").hide();
    $("#addMoreButton").fadeIn();
    $("#addForm")[0].reset();
  });

  function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }