//Navbar drop down
$(".dropdown-button").dropdown();


//Carousel initiator
$(document).ready(function(){
  $('.carousel').carousel();
});

$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });

$(document).ready(function(){
  $('.parallax').parallax();
});

//Filter initiator
$(document).ready(function() {
  $('input#input_text, textarea#textarea1').characterCounter();
});