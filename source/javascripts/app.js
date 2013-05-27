var App = function(index_container,resume_container){
	_.extend(this,Backbone.Events);
	this.resume_container = resume_container;
	this.job_positions = new JobPositions();
	this.skills = new Skills();
	this.proficiencies = new Proficiencies();
	modal_container =  $("<div />")
		.addClass("modal")
		.addClass("hide")
		.addClass("fade")
		.attr("id","JobItemModal")
		.attr("tabIndex","-1")
		.attr("role","dialog");
	containers = {
		view:index_container,
		row:this.create_job_position_row_container,
		item:this.create_job_position_item_container,
		modal: modal_container
	}	
	this.job_positions_view = new JobPositionsView(this.job_positions,containers);
	this.auth_form_view = new AuthFormView(resume_container,_.bind(this.register,this),_.bind(this.login,this),this);
	this.router = new IntalioRoutes({index_container: index_container,resume_container: resume_container},this.job_positions);
}
App.prototype.setResume = function(data) {
	this.resume = new Resume(data,{parse:true});
	this.resume_form_view = new ResumeFormView(this.resume_container,this.resume,this);
	this.trigger("login");
};
App.prototype.login_register = function(url,data,fail_callback) {
	$.ajax({
		type:"POST",
		url: url,
		data:JSON.stringify(data),
		success:_.bind(function(data,status){
			if(data.result == true){
				this.setResume(data.resume);
			}
			else{
				fail_callback();
			}
		},this),
		error:function(){
			fail_callback();
		},
		dataType:"json"
	})
};
App.prototype.register = function(data,fail_callback) {
	this.login_register("/hr/resume",data,fail_callback)
};
App.prototype.login = function(data,fail_callback) {
	this.login_register("/hr/login",data,fail_callback)
};
App.prototype.create_job_position_row_container = function() {
	return $("<div />").addClass("row");
};
App.prototype.create_job_position_item_container = function(id) {
	return $("<div />").addClass("span4").attr("id",id);
};
App.prototype.go_index = function() {
  	$("#job_link").parent().addClass("active");
  	$("#resume_link").parent().removeClass("active");
	this.router.navigate("index",{trigger:true});
	this.job_positions.fetch({reset:true})

};
App.prototype.go_resume = function() {
  	$("#resume_link").parent().addClass("active");
  	$("#job_link").parent().removeClass("active");
	this.router.navigate("resume",{trigger:true});
	this.auth_form_view.render();
};
App.prototype.init = function() {
	var self = this;
	self.proficiencies.fetch({
		success:function(){
			self.skills.fetch({
				success:function(){
					Backbone.history.start({pushState: false});
					self.go_resume();
				}
			})
		}
	});
};
