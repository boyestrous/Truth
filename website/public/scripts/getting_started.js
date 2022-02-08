const uxStep1 = document.getElementById('uxStep1');
const uxStep2 = document.getElementById('uxStep2');
const correctionBub = document.getElementById('correctionBubble');
const modal1 = document.getElementById('modal1');

$(document).ready(function(){
    $('.modal').modal();
    
  });

M.AutoInit();

console.log("step 1: ",uxStep1);

 // init the plugin with some optional properties
 var uxTour = new uxTour({frame: 'box', padding: '4'});

 // set the steps for the tour. This is where you forexample dynamically empty and add new steps for dynamic page loads
 var tour = {
     steps: [
         {element: 'uxStep1', text: 'Sometimes, there obvious falsehoods in plain sight. Highlight the text to activate the correction interface'},
     ]
 };
 console.log('tour: ', tour);


 // start the tour. Pack it into a function for re-opening the ux guide
 function uxStart(tour) {
    tour = tour;
    console.log('starting tour');
    uxTour.start(tour);
 }

 // start the tour when the page loads
 uxStart(tour);

 function getSelectionText(bubbleTour) {
    var tour = bubbleTour;
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
        if (event.pageX < 81) {
          $("#correctionBubble").css({
            top: event.pageY + 25 + "px",
            left: event.pageX + "px",
          }).fadeIn();
          uxStart(tour);
        } else {
          $("#correctionBubble").css({
              top: event.pageY + 25 + "px",
              left: event.pageX + -81 + "px"
            }).fadeIn();
            uxStart(tour);
        }
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
  }
  
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

 document.onmouseup = function(event) {
    console.log('mouseup detected');
    console.log('selection: ', window.getSelection());
    console.log('display: ',window.getComputedStyle(correctionBub, null).display);
    if (window.getSelection() != "" && window.getComputedStyle(correctionBub, null).display == "none") {
        var tour = {
            steps: [
                {element: 'correctionBubble', text: 'You can submit your own information to help make this more factual! Type a message in the box and hit submit when done.', direction: 'left'},
            ]
        };
      
      highlightedText = getSelectionText(tour);
      fullText = getSelectionParentElement().textContent;
      hostname = window.location.hostname;
      parent = getSelectionParentElement();
      console.log(parent);
      console.log("Parent Tag: ", parent.classList);
    }
  }

  $('.close').on('click',function(){
    $("#correctionBubble").fadeOut();
  });

  $('.myButton').on('click',function(){
    $("#correctionBubble").fadeOut();
    $('#modal1').modal('open');
  });

  $('.myButton, .close').on('click', function() {
    $(".tempSelected").removeClass('tempSelected');
    console.log($('.tempSelected'));
  });
    
