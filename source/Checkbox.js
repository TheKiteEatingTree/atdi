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
        	onchange: "checkClicked"
        },
        {name: "label", classes: "atdi-checkbox-label", content: ""}
	],
	rendered: function() {
		this.inherited(arguments);
		this.$.check.setChecked(this.checked);
		this.$.label.setContent(this.label);
	},
	checkClicked: function(inSender, inEvent){
		if (inSender.checked)
			this.checked = 1;
		else
			this.checked = 0;
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
