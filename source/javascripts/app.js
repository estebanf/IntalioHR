var App = function(index_container,resume_container){
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
	this.router = new IntalioRoutes({index_container: index_container,resume_container: resume_container});
}
App.prototype.create_job_position_row_container = function() {
	return $("<div />").addClass("row");
};
App.prototype.create_job_position_item_container = function(id) {
	return $("<div />").addClass("span4").attr("id",id);
};
App.prototype.go_index = function() {
	this.router.navigate("index",{trigger:true});
};
App.prototype.go_resume = function() {
	this.router.navigate("resume",{trigger:true});
};
App.prototype.init = function(done_callback) {
	var self = this;
	Backbone.history.start({pushState: false});
	this.router.navigate("index",{trigger:true});
	self.proficiencies.fetch({
		success:function(){
			self.skills.fetch({
				success:function(){
					self.job_positions.fetch({
						reset:true,
						success:function(){
							done_callback && done_callback();
						}
					})
				}
			})
		}
	});
};
