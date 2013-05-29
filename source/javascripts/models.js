// Models
var Experience = Backbone.Model.extend({
	parse:function(data){
		source = data
		if(data.result){
			source = data.experience
		}
		obj = {}
		for(name in source){
			obj[name] = source[name]
		}
		this.set(obj);
	}
});
var Education = Backbone.Model.extend({
	parse:function(data){
		source = data
		if(data.result){
			source = data.education
		}
		obj = {}
		for(name in source){
			obj[name] = source[name]
		}
		this.set(obj);
	}	
});
var ResumeSkill = Backbone.Model.extend({
	parse:function(data){
		source = data
		if(data.result){
			source = data.resume_skill
		}
		obj = {}
		for(name in source){
			obj[name] = source[name]
		}
		this.set(obj);
	}	
});
var Experiences = Backbone.Collection.extend({
	model:Experience
});
var Educations = Backbone.Collection.extend({
	model:Education
});
var ResumeSkills = Backbone.Collection.extend({
	model:ResumeSkill
});

var Resume = Backbone.Model.extend({
	parse:function(data){
		this.set({id:data.id});
		this.set({name:data.name})
		this.set({email:data.email});
		educations = new Educations(data.educations);
		educations.url = "/hr/resume/" + data.id + "/education"
		this.set({educations: educations});
		experiences = new Experiences(data.experiences)
		experiences.url = "/hr/resume/" + data.id + "/experience"
		this.set({experiences:experiences});
		skills = new ResumeSkills(data.skills);
		skills.url = "/hr/resume/" + data.id + "/skill"
		this.set({skills:skills});
	}
})
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
var Proficiencies = Backbone.Collection.extend({
	url: '/hr/proficiencies',
	model:Proficiency
});
