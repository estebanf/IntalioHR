//= require modernizr-2.6.2-respond-1.1.0.min
//= require jquery-1.9.1.min
//= require underscore
//= require backbone
//= require bootstrap.min
//= require routes
//= require models
//= require views
//= require app

$(document).ready(function(){
  window.app = new App($("#index_container"),$("#resume_container"));
  $("#job_link").on("click",function(e){
  	window.app.go_index();
  })
  $("#resume_link").on("click",function(e){
  	window.app.go_resume();
  })
  window.app.init();                
})
