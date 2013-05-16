_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

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