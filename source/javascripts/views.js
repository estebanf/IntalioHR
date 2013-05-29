_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};
var SkillItemVIew = Backbone.View.extend({
	initialize:function(model){
		this.$el = $("<tr>");
		this.model = model;
		this.template = _.template($("#SkillItem").html());
	},
	events:{
		"click .btn-danger":"remove"
	},
	remove: function(){
		this.model.destroy();
		this.$el.remove();
	},
	render:function(){
		content = this.template(this.model.toJSON());
		this.$el.attr("id",this.model.get("id"));
		this.$el.html(content);
		return this;
	}
});
var ExperienceItemVIew = Backbone.View.extend({
	initialize:function(model){
		this.$el = $("<tr>");
		this.model = model;
		this.template = _.template($("#ExperienceItem").html());
	},
	render:function(){
		content = this.template(this.model.toJSON());
		this.$el.attr("id",this.model.get("id"));
		this.$el.html(content);
		return this;
	}
});
var EducationItemVIew = Backbone.View.extend({
	initialize:function(model){
		this.$el = $("<tr>");
		this.model = model;
		this.template = _.template($("#EducationItem").html());
	},
	render:function(){
		content = this.template(this.model.toJSON());
		this.$el.attr("id",this.model.get("id"));
		this.$el.html(content);
		return this;
	}
});
var ResumeFormView = Backbone.View.extend({
	initialize: function(container,resume,skills,proficiencies,app){
		this.skills = skills;
		this.proficiencies = proficiencies;
		this.app = app;
		this.$el = container;
		this.container= $("<div />").addClass("row").attr("id","ResumeFormView");
		this.template = _.template($("#ResumeForm").html());
		this.resume = resume;
		this.app.on("login",this.render,this);
		this.createEducation = _.partial(this.createItem,EducationItemVIew,"#educationContainer");
		this.createExperience = _.partial(this.createItem,ExperienceItemVIew,"#experienceContainer");
		this.createSkill = _.partial(this.createItem,SkillItemVIew,"#skillContainer");
		this.resume.get("educations").on("add",this.createEducation,this)
		this.resume.get("experiences").on("add",this.createExperience,this)
		this.resume.get("skills").on("add",this.createSkill,this)

	},
	events: {
		"click #btnAddEducation":"add_education",
		"click #btnAddResumeSkill":"add_skill",
		"click #btnAddExperience":"add_experience",

	},
	add_education:function(){
		ctrlInstitute = $("#txtInstitute");
		ctrlDegree = $("#txtDegree");
		ctrlStart_date = $("#txtEducationStartDate");
		ctrlEnd_date = $("#txtEducationEndDate");
		if(ctrlInstitute.val() != '' &&
			ctrlDegree.val() != '' &&
			ctrlStart_date.val() != '' &&
			ctrlEnd_date.val() != ''){

			this.resume.get("educations").create({
				institute:ctrlInstitute.val(),
				degree:ctrlDegree.val(),
				start_date:ctrlStart_date.val(),
				end_date:ctrlEnd_date.val()
			})
			ctrlInstitute.val('');
			ctrlDegree.val('');
			ctrlStart_date.val('');
			ctrlEnd_date.val('');
		}
	},
	add_skill:function(){
		ctrlSkills = $("#dropSkills");
		ctrlProficiency = $("#dropProficiency");
		skill_id = ctrlSkills.val();
		skill_name = ctrlSkills.children("option:selected").text();
		proficiency_id = ctrlProficiency.val();
		proficiency_name = ctrlProficiency.children("option:selected").text();

		this.resume.get("skills").create({proficiency_id:proficiency_id,proficiency_name:proficiency_name,skill_id:skill_id,skill_name:skill_name});
	},
	add_experience:function(){
		ctrlCompany = $("#txtCompany");
		ctrlPosition = $("#txtPosition");
		ctrlStart_date = $("#txtExperienceStartDate");
		ctrlEnd_date = $("#txtExperienceEndDate");
		if(ctrlCompany.val() != '' &&
			ctrlPosition.val() != '' &&
			ctrlStart_date.val() != '' &&
			ctrlEnd_date.val() != ''){

			this.resume.get("experiences").create({
				company:ctrlCompany.val(),
				position:ctrlPosition.val(),
				start_date:ctrlStart_date.val(),
				end_date:ctrlEnd_date.val()
			})
			ctrlCompany.val('');
			ctrlPosition.val('');
			ctrlStart_date.val('');
			ctrlEnd_date.val('');
		}	
	},
	createItem:function(viewClass,container,model){
		itemView = new viewClass(model);
		$(container).children(".info").before(itemView.render().$el);
	},
	render:function(){
		item_create = _.bind(function(collection_key,fn){
			_.each(this.resume.get(collection_key).models,function(model){
				fn(model);
			});
		},this);
		content = this.template(this.resume.toJSON());
		this.container.html(content);
		($("#ResumeFormView").length == 0) && this.$el.append(this.container);

		item_create("educations",this.createEducation);
		item_create("experiences",this.createExperience);
		item_create("skills",this.createSkill);

		_.each(this.skills.models,function(skill){
			$("#dropSkills")
				.append($("<option></option>")
					.attr("value",skill.get("id"))
					.text(skill.get("name")))
		})
		_.each(this.proficiencies.models,function(proficiency){
			$("#dropProficiency")
				.append($("<option></option>")
					.attr("value",proficiency.get("id"))
					.text(proficiency.get("name")))
		})
		return this;
	}
});
var AuthFormView = Backbone.View.extend({
	initialize: function(container,register,login,app){
		this.$el = container;
		this.register_cb = register;
		this.login_cb = login;
		this.container= $("<div />").addClass("row").attr("id","AuthFormView");
		this.content = $("#AuthForm").html();
		this.app = app;
		this.app.on("login",this.close,this);
	},
	events:{
		"click #btnRegister":"register",
		"click #btnLogin":"login"	
	},
	close:function(){
		this.container.remove();
	},
	render: function(){
		this.container.html(this.content);
		($("#AuthFormView").length == 0) && this.$el.append(this.container);
		this.error_register = $("#errorRegister");
		this.error_login = $("#errorLogin");
		this.error_register.hide();
		this.error_login.hide();

		return this;
	},
	register: function(){
		name = $("#registerName").val();
		email = $("#registerEmail").val();
		password = $("#registerPassword").val();
		if(name && email && password && name != "" && email != "" && password != ""){
			this.register_cb({name:name,email:email,password:password},_.bind(function(){
				this.error_register.show();
			},this));
		}
	},
	login: function(){
		email = $("#loginEmail").val();
		password = $("#loginPassword").val();
		if(email && password && email != "" && password != ""){
			this.login_cb({email:email,password:password},_.bind(function(){
				this.error_login.show();
			},this));
		}
	}
});

var JobPositionDetailModalView = Backbone.View.extend({
	initialize:function(model,container){
		this.model = model;
		this.$el = container;
		this.template = _.template($("#JobPositionDetailModal").html());
	},
	render:function(){
		content = this.template(this.model.toJSON());
		this.$el.html(content);
		return this;
	}
})
var JobPositionItemView = Backbone.View.extend({
	initialize:function(item,parent_element,containers){
		this.model = item;
		this.containers = containers;
		this.$el = this.containers.item("JobPositionItem-" + this.model.get("id"));
		parent_element.append(this.$el);
		this.template = _.template($("#JobPositionItemTemplate").html());
		this.listenTo(this.model,"change",this.render);
	},
	events:{
		"click .btn":"open_modal"
	},
	open_modal:function(){
		this.trigger("detail_clicked",this.model);
	},
	render:function(){
		content = this.template(this.model.toJSON());
		this.$el.html(content);
		return this;
	}
});
var JobPositionRowView = Backbone.View.extend({
	initialize:function(models,parent_element,containers){
		this.models = items;
		this.containers = containers;
		this.$el = this.containers.row();
		parent_element.append(this.$el);
		this.items = [];

	},
	render:function(){
		var self = this;
		_.each(this.models,function(item,index,list){
			currentItem = new JobPositionItemView(item,self.$el,self.containers);
			currentItem.on("detail_clicked",function(model){
				self.trigger("detail_clicked",model);
			})
			self.items.push(currentItem);
			currentItem.render();
		});
		return this;
	}
});
var JobPositionsView = Backbone.View.extend({
	initialize:function(collection,containers){
		this.collection = collection;
		this.containers = containers;
		this.$el = this.containers.view;
		this.listenTo(this.collection,"reset",this.render);
		this.rows = [];
	},
	render: function(){
		var self = this;
		this.$el.empty();
		render_this = function(item_array,size){
			if((size && item_array.length == size) || (!size && item_array.length > 0)){
				currentRow = new JobPositionRowView(item_array,self.$el,self.containers);
				currentRow.on("detail_clicked",function(model){
					self.show_modal(model);
				})
				self.rows.push(currentRow);
				currentRow.render();
				return [];
			}
			return item_array;
		}
		items = [];
		_.each(this.collection.models,function(element,index,list){
			items.push(element);
			items = render_this(items,3);
		})
		render_this(items);
		return this;
	},
	show_modal:function(model){
		if(!this.modal_view){
			this.containers.view.append(this.containers.modal);
			this.modal_view = new JobPositionDetailModalView(model,this.containers.modal);
		}
		else{
			this.modal_view.model = model;
		}
		this.modal_view.render().$el.modal('show');
	}
})