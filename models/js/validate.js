$(document).ready(function(){
  
  $("#loginform").validate({
    rules: {
    username: {
      required: true,
      minlength: 2
    },
    firstname: {
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


  $("#reviewform").validate({
    rules: {
      category: {
        required: true
      },
      address: {
        required: true
      },
      price: {
        required: true
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
      "price": {
        required: "You must select a price"
      },
      "description": {
        required: "You must enter a description",
        minlength: "You must use at least 2 characters",
        maxlength: "You cannot use more than 500 characters"
      }
    }
});