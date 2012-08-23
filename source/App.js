enyo.kind({
	name: "App",
	kind: "FittableColumns",
	classes: "onyx enyo-fit",
	components:[
		{name: "search", kind: "atdi.search", onTitleTapped: "titleTapped" },
		{name: "main", kind: "Panels", classes: "main-panels", fit: true, components: [
			{name: "intro", tag: "div", content: "At the Drive-In NFO Generator"},
			{name: "download", kind: "atdi.download"}
		]},
		{
			name:"popupSpinner", 
			kind: "onyx.Popup", 
			centered: true, 
			floating: true, 
			onHide: "popupHidden", 
			scrim: true, 
			components: [ 
				{kind: "onyx.Spinner"}
			]
		},
		{
			name: "getMirrors",
			kind: "enyo.WebService", 
			url: "source/php/mirrors.php",
			method: "GET",
			handleAs: "xml",
			onResponse: "gotMirrors",
			onError: "ughMirrors"
		}
	],
	create: function() {
		this.inherited(arguments);
		this.$.getMirrors.send();
		this.language = 'en';
	},
	rendered: function() { 
		this.inherited(arguments);
		this.$.popupSpinner.show();
	},
	gotMirrors: function(inSender, inEvent){
		this.$.popupSpinner.hide();
		var data = inEvent.data;
		var mirrors = data.getElementsByTagName('Mirror');
		
		//select a random mirror that can do everything
		var done = false;
		var mirror = 0;
		while (!done)
		{
			mirror = Math.floor(Math.random()*mirrors.length);
			if (mirrors[mirror].getElementsByTagName('typemask')[0].textContent == 7)
				done = true;
		}
		this.mirror = mirrors[mirror].getElementsByTagName('mirrorpath')[0].textContent;
		this.$.search.mirror = this.mirror;
		this.$.search.language = this.language;
		this.$.download.setMirror(this.mirror);
		this.$.download.setLanguage(this.language);
		enyo.log(this.mirror);
	},
	ughMirrors: function(inSender, inEvent){
		enyo.log("ugh");
	},
	titleTapped: function(inSender, inEvent){
		this.$.main.setIndex(1);
		this.$.download.setSeries(inEvent.title,inEvent.plot,inEvent.id,inEvent.banner);
	}
});
