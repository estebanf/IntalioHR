// Models
var ResultData = {
	parse:function(data){
		source = data
		if(data.result){
			source = data[this.data_key]
		}
		obj = {}
		for(name in source){
			obj[name] = source[name]
		}
		this.set(obj);
	}
}
var Experience = _.extend(Backbone.Model.extend({
	initialize: function(){
		this.data_key = "experience"
	}
}),ResultData);

var Education = _.extend(Backbone.Model.extend({
	initialize:function(){
		this.data_key = "education";
	}
}),ResultData);
var ResumeSkill = _.extend(Backbone.Model.extend({
	initialize:function(){
		this.data_key = "resume_skill"
	}
}),ResultData);
var Experiences = Backbone.Collection.extend({
	model:Experience
});
var Educations = Backbone.Collection.extend({
	model:Education
});
var ResumeSkills = Backbone.Collection.extend({
	model:ResumeSkill
});
var JobApplication = Backbone.Model.extend({});
var JobApplications = Backbone.Collection.extend({});

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
		job_applications = new JobPositions(data.job_applications);
		this.set({job_applications:job_applications})
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
