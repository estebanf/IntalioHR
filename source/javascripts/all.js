//= require modernizr-2.6.2-respond-1.1.0.min
//= require jquery-1.9.1.min
//= require underscore
//= require backbone
//= require bootstrap.min
//= require models
//= require views
//= require app

$(document).ready(function(){
  window.app = new App($("#container"));
  window.app.init();                
})
