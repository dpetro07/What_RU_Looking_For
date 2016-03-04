$(document).ready(function(){

  $("reviewform").validate({
    rules: {
      description: {
        required: true,
        minlength: 2
      },
      stars: {
        required: true,
        maxlength: 1,
        digits: true,
        range: [1,5]
      },      
      price: {
        required: false,
        maxlength: 1,
        digits: true,
        range: [1,5]
      }
    },
    messages: {
      "stars" : {
        required: "You must enter a rating",
        maxlength: "You must enter a number between 1 and 5",
        digits: "You may only enter digits",
        range: "You must enter a number between 1 and 5"
      },      
      "price" : {
        maxlength: "You must enter a number between 1 and 5",
        digits: "You may only enter digits",
        range: "You must enter a number between 1 and 5"
      },
      "description": {
        required: "You must enter a description",
        minlength: "You must use at least 2 characters",
        maxlength: "You cannot use more than 500 characters"
      }
    }
  });
  
  $("#registerform").validate({
    rules: {
      username: {
        required: true,
        minlength: 2
      },
      firstname: {
        required: true,
        minlength: 2
      },
      lastname: {
        required: true,
        minlength: 2
      },
      password: {
        required: true,
        minlength: 7
      },
      email: {
        required: true,
        email: true,
        minlength: 6
      }
    },
    messages: {
      "username": {
        required: "You must enter a username",
        minlength: "You must use at least 2 characters"
      },      
      "firstname": {
        required: "You must enter a first name",
        minlength: "You must use at least 2 characters"
      },
      "lastname": {
        required: "You must enter a last name",
        minlength: "You must use at least 2 characters"
      },      
      "password": {
        required: "You must enter a password",
        minlength: "You must use at least 7 characters"
      },
      "email": {
        required: "You must enter a email",
        minlength: "You must use at least 6 characters",
        email: "You must enter a valid email"
      }
    }
  });


  $("#placeform").validate({
    rules: {
      category: {
        required: true
      },
      address: {
        required: true
      },
      price: {
        required: false,
        maxlength: 1,
        digits: true,
        range: [1,5]
      },
      telephone: {
        required: false,
        maxlength: 11,
        digits: true
      },
      stars: {
        required: true,
        maxlength: 1,
        digits: true,
        range: [1,5]
      },
      description: {
        required: true,
        minlength: 2,
        maxlength: 500
      }
    },
    messages: {
      "category": {
        required: "You must select a category"
      },      
      "address": {
        required: "You must enter an address"
      },
      "stars" : {
        required: "You must enter a rating",
        maxlength: "You must enter a number between 1 and 5",
        digits: "You may only enter digits",
        range: "You must enter a number between 1 and 5"
      },      
      "price" : {
        maxlength: "You must enter a number between 1 and 5",
        digits: "You may only enter digits",
        range: "You must enter a number between 1 and 5"
      },
      "telephone": {
        maxlength: "The number cannot have more than 11 digits",
        digits: "Please provide digits only"
      },
      "description": {
        required: "You must enter a description",
        minlength: "You must use at least 2 characters",
        maxlength: "You cannot use more than 500 characters"
      }
    }
  });
});