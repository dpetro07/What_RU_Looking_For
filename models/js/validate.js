$(document).ready(function(){
  $("#loginform").validate({
    rules: {
    username: {
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
      name: "Required Field"
    }
  });

});