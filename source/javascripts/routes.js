var IntalioRoutes = Backbone.Router.extend({
	initialize:function(options,job_positions){
		this.job_positions = job_positions;
		this.index_container = options.index_container;
		this.resume_container = options.resume_container;
	},
	routes:{
		"index":"index",
		"resume":"resume"
	},
	index:function(){
		this.resume_container.hide();
		this.index_container.show();
	},
	resume:function(){
		this.resume_container.show();
		this.index_container.hide();
	}
});
