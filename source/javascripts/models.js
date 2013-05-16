// Models
var JobPosition = Backbone.Model.extend({
	initialize:function(){
		this.bind("add",this.check_description,this);
	},
	check_description:function(){
		value = this.get("description");
		value.length > 300 && (value = value.substring(0,297) + "...");
		this.set({description_parsed:value});
	}
});
var Skill = Backbone.Model.extend({});
var Proficiency = Backbone.Model.extend({});

//Collections
var JobPositions = Backbone.Collection.extend({
	initialize:function(){
		this.bind("reset",this.set_descriptions,this);
	},
	set_descriptions:function(){
		_.each(this.models,function(item){
			item.check_description();
		})
	},
	url: '/hr/job_positions',
	model: JobPosition
});
var Skills = Backbone.Collection.extend({
	url:'/hr/skills',
	model: Skill
})
var Proficiencies = Backbone.Model.extend({
	url: '/hr/proficiencies',
	model:Proficiency
});
