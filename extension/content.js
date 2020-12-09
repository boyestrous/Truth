$(document).ready(function() {
  //init variables
  var holder = "";
  var selection = "";
  var hostname = window.location.hostname;
  var dbMatches = [];
  var user = '';
  var highlightedText = '';
  var fullText = '';
  var parent = '';
  const detailedExplanationText = document.querySelector('#details');
  var posY = 0;
  var posX = 0;

  //INITIALIZE PAGE
  //inject correctionBubble div to the bottom of the page (hidden)
  bubbleAdder();
  
  // cardAdder();


  //grab hostname matches from the DB for highlighting
  pullHostnameMatchesFromDB(hostname);
  stripNewlines();

  //listen for the context menu click event (chrome right-click)
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.command == "start") {
        highlightedText = getSelectionText();
        fullText = getSelectionParentElement().textContent;
        hostname = window.location.hostname;
        user = getUsername();
        parent = getSelectionParentElement();
        sendResponse({confirm: "Bubble Added"});
        return true;
      }

      if (request.command == 'new_match') {
        console.log('request data: ', request.data.hostname)
        if (request.data.hostname == hostname) {
          preCorrection(request.data);
          sendResponse({confirm: "new match received"}); 
          return true;
        } else {
          sendResponse({confirm: "NO MATCH!"});
          return true;
        }
               
      }

      
  });

  function stripNewlines() {
    $('p').each(function() {
      this.innerHTML = this.innerHTML.replace(/[\r\n]+/gm, ' ');
    });
  }

  //pull Hostname matches from DB, so we can compare against the current page and highlight
  function pullHostnameMatchesFromDB(hostname){
    var hostname = hostname;
    chrome.runtime.sendMessage({command: "match", data: hostname}, function(response) {
      //console.log(response.confirm);
      dbMatches = response.confirm;
      console.log(dbMatches); 
      matchFinder();
    });
  };

  function matchFinder() {
    // console.log(dbMatches);
    dbMatches.forEach(preCorrection);

    
    // tipAdder();
  }
  function preCorrection(item, index) {
    if($('*:contains(' + item.highlight + ')').length > 0){
      $('*:contains(' + item.highlight + ')').last().html(function(_, html) {
        return html.replace(item.highlight, '<span class="correction effect-shine" id="'+item.key+'">'+item.highlight+'</span>');
      });
      
    }
    // console.log('post-replace');
  }

  function getUsername(){
    var username = '';
    chrome.runtime.sendMessage({command: "getUsername"}, (response) => {
      console.log("username response: ", response.email);
      console.log('response: ', response);
      user = {uid: response.uid, email: response.email};
      console.log(user);
      // console.log('uid: ', response.uid + Date.now());
    });
  }
  function tipAdder() {
    const newTip = `
      <div class='tip'>
        <span class='tiptext'>A factual claim has been submitted about this section. Read with caution</span>
      </div>
    `
    $(".correction").wrapInner("<div class='tip'></div>");
    $(".correction").children().append("<span class='tiptext'>A factual claim has been submitted about this section. Read with caution</span>");
  }


  
  $(document).on('click', '.correction', function (e) {
    e.preventDefault();
    
    correctionID = this.id;
    console.log(correctionID);

    chrome.runtime.sendMessage({command: "fetch", id: correctionID}, function(response) {
      console.log(response.confirm);
      complaintFiller(response.complaints, correctionID);
      // console.log('found complaints: ', response.complaints)
    });

    $('#tipFrameContainer').addClass('centered');
    $('#tipFrameContainer').css('display','flex');

  });

  function complaintFiller(complaintArray, correctionID) {
    //clear out examples
    comparr = complaintArray;
    //send message to tip.js with complaints
    chrome.runtime.sendMessage({command: "complaints", complaints: comparr, id: correctionID}, function(response) {
      //console.log("data sent");
      //console.log("background sentence: " + data.hostname);
      console.log(response.confirm);
    });

  }


  function dropAdder() {
    tipURL = chrome.extension.getURL('tip.html');
    const newDrop = `
    <div id='tipFrameContainer'>
    <span id="closeTipFrame">x</span>
    <iframe src="${tipURL}" style="width: 100%; height: 100%" frameborder="0" id="tipFrame"></iframe>
    </div>
    `;
    var newDropBubble = newDrop;
    $("body").append(newDropBubble);
    
  }
 
  

  function bubbleAdder() {
    //inject correctionBubble div to the bottom of the page (hidden)
    const newLocal = `
    <div id="correctionBubble">
      <span class="close">x</span>
      <h3>Submit a correction</h3>
      <form class="col s12">
          <div class="row">
              <div class="input-field col s12">
                  <label>What's wrong with this text?</label>
              </div>
          </div>
          <div class="row">
            <label for="short"> Short Version (5-7 words)</label>
            <input id="short" placeholder="Short Version"></input>
          </div>
          <div class="row">
              <div class="input-field col s12" style="margin-top: 10px;">
              <label for="details" >Please explain in detail (as much as possible)</label>
              <textarea id="details" class="materialize-textarea" style="width: 90%; height: 100px"></textarea>
          </div>
          <div class="row">
              <button class="myButton">Submit</button>
          </div>
      </form>
    </div>`;
    var correctionBubble = newLocal;
    $("body").append(correctionBubble);
    dropAdder();
  }
  const correctionBub = document.querySelector("#correctionBubble");

  function getSelectionText() {
    var text = "";
      if (window.getSelection) {
          text = window.getSelection().toString();
          if (posX < 81) {
            $("#correctionBubble").css({
              top: posY + 8 + "px",
              left: posX + "px",
            }).fadeIn();
          } else {
            $("#correctionBubble").css({
                top: posY + 8 + "px",
                left: posX + "px"
              }).fadeIn();
          }
      } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
      }
    return text;
    }

  //grab the parent element that houses the text that has been selected
  function getSelectionParentElement() {
    var parentEl = null, sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
                sel = sel.getRangeAt(0).startContainer.parentNode.classList.add("tempSelected");
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
    return parentEl;
  }

  //get the position of the mouse after highlighting, used to place the correctionbubble
  document.onmouseup = function(event) {
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    // Get cursor position
    posX = event.clientX - 110;
    posY = event.clientY + 20 + scrollTop;
  }

  $(document).on('click','.myButton',function(e){
    e.preventDefault();
        var data = {
        complaints: [{id: user.uid+Date.now(),dateTime: Date.now(),user: user.email, short: $('#short').val(), details: $('#details').val()}],
        fullText: fullText,
        highlight: highlightedText,
        hostname: hostname,
        url: window.location.href
      }
    //console.log(data);
    chrome.runtime.sendMessage({command: "push", data: data}, function(response) {
      //console.log("data sent");
      //console.log("background sentence: " + data.hostname);
      console.log(response.confirm);
    $("#correctionBubble").fadeOut();
    $(".tempSelected").removeClass('tempSelected');
    $("#correctionBubble").find('form').trigger('reset');
    });
  });

  $('.close').on('click', function(e) {
    e.preventDefault();
    $(".tempSelected").removeClass('tempSelected');
    console.log($('.tempSelected'));
  });

 $("body").on('click','#closeTipFrame', function(e) {
    e.preventDefault();
    $("#tipFrameContainer").css('display','none');
  });
});