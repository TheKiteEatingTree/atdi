enyo.kind({
	name: "atdi.checkbox",
	kind: "FittableColumns",
	classes: "atdi-checkbox",
	published: {
		checked: true,
		label: ""
	},
	components: [
        {
        	name: "check", 
        	kind: "onyx.Checkbox", 
        	classes: "atdi-checkbox-check", 
        	checked: true,
        	onChange: "checkClicked"
        },
        {name: "label", classes: "atdi-checkbox-label", content: ""}
	],
	rendered: function() {
		this.inherited(arguments);
		this.$.check.setChecked(this.checked);
		this.$.label.setContent(this.label);
	},
	checkClicked: function(inSender, inEvent){
		this.checked = this.$.check.checked;
	},
	labelChanged: function()
	{
		this.$.label.setContent(this.label);
	},
	checkedChanged: function()
	{
		this.$.check.setChecked(this.check);
	}
})
