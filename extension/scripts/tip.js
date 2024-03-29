$(document).ready(function() {
    //initialize materialize js functions
    $('.tabs').tabs();
    $('.collapsible').collapsible();

    var currentComplaintID = '';

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

    // console.log('submitted');
    const addForm = document.getElementById('addForm');

    var shorty = addForm['shortText'].value;
    // console.log('short: ', shorty);

    var detail = addForm['det'].value;
    // console.log('details: ', detail);

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

    
    //need DateTime,details, short version, ID, user for complaint update
    var updateData = {};
    updateData['short'] = addForm['shortText'].value;
    updateData['details'] = addForm['det'].value;
    updateData['dateTime'] = Date.now();
    updateData['correction_id'] = currentComplaintID;
    // updateData['numComplaints'] = currentComplaintListLength;
    currentComplaintListLength = currentComplaintListLength + 1;
    chrome.runtime.sendMessage({command: "new_complaint", data: updateData});

    $("#formContainer").hide();
    $("#addMoreButton").fadeIn();
    $("#addForm")[0].reset();
  });

  $("#qForm").on('submit', function (e) {
    e.preventDefault();

    // console.log('submitted');
    const qForm = document.getElementById('qForm');

    var shorty = qForm['qShortText'].value;
    // console.log('short: ', shorty);

    var detail = qForm['qDet'].value;
    // console.log('details: ', detail);

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

  $("#cancelButton").on('click', function() {
    $("#formContainer").hide();
    $("#addMoreButton").fadeIn();
    $("#addForm")[0].reset();
  });

  // $(".card-tabs .tab").on('click', function() {
  //   // console.log('tab clicked');

  //   setTimeout(() => {
  //     var current_height =  document.getElementById('cardContainer').getBoundingClientRect().height;
  //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //       chrome.tabs.sendMessage(tabs[0].id, {command: "change_tabs", height: current_height});
  //     });
  //   }, 350);
  // });

  $(".collapsible,.card-tabs .tab, #addMoreButton, #cancelButton, #submitButton").on('click', function() {
    //when changing tabs or opening a collapsible, tell the content script to resize the iframe
    //delay is necessary so the transition events have time to complete before checking the size
    setTimeout(() => {
      sendHeight();
    }, 350);

  });

  function sendHeight() {
      var current_height =  document.getElementById('cardContainer').getBoundingClientRect().height;
      // console.log('current height from tip: ', current_height);

      //this goes from iframe to content script because the content script can't capture click events on tip.html
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "tip_height", height: current_height});
      });
  }
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command == "complaints") {
      //clear example list
      $("#AQ ul").empty();
      currentComplaintID = request.id;
      currentComplaintListLength = request.complaints.length;
      //fill with values
      for (let index = 0; index < request.complaints.length; index++) {
        // console.log("short: ",request.complaints[index].short);
        // console.log("details: ",request.complaints[index].details);
        
        var p = document.createElement('li');
        p.id = "complaint" + index;
        var colHeader = document.createElement('div');
        colHeader.className = 'collapsible-header';
        colHeader.innerText = request.complaints[index].short;
        // console.log('col Header: ',colHeader);


        var colBody = document.createElement('div');
        colBody.className = 'collapsible-body';
        colBody.innerText = request.complaints[index].details;

        var commentButton = document.createElement('button');

        $('#AQ ul').append(p);
        p.append(colHeader);
        p.append(colBody);

        // <li>
        //   <div class="collapsible-header"><i class="material-icons purple-text text-darken-2">undo</i>This statement was later recanted</div>
        //   <div class="collapsible-body"></div>
        // </li>
      }

    }

    if (request.command == "card_height") {
      var current_height =  document.getElementById('cardContainer').getBoundingClientRect().height;
      // console.log('current height from tip: ', current_height);
      sendResponse({height: current_height})
    }
  });
});