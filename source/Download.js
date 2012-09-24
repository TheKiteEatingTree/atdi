enyo.kind({
	name: "atdi.download",
	kind: "Scroller",
	published: {
		mirror: "",
		language: ""
	},
	components: [
		{kind: "FittableRows", components: [
			{name: "show", kind: "Control", tag: "h1"},
			{name: "banner", kind: "Image", style: "max-width: 100%;"},
			{name: "plot", kind: "Control", tag: "p"},
			{name: "tvshowDiv", classes:"atdi-tags-div", kind: "Control", tag: "div",
			 style: "width: 225px;", components: [
				{tag: "h3", classes: "atdi-tags-h3", content: "tvshow.nfo tags"},
				{name: "tvtitleCheck", kind: "atdi.checkbox", label: "title" },
		        {name: "tvidCheck", kind: "atdi.checkbox", label: "id" },
		        {name: "tvplotCheck", kind: "atdi.checkbox", label: "plot" },
		        {name: "tvgenreCheck", kind: "atdi.checkbox", label: "genre" },
		        {name: "tvmpaaCheck", kind: "atdi.checkbox", label: "mpaa" },
		        {name: "tvactorsCheck", kind: "atdi.checkbox", label: "actors" }
			]},
			{name: "episodeDiv", classes:"atdi-tags-div", kind: "Control", tag: "div", 
			 style: "width: 225px; vertical-align: top;", components: [
				{tag: "h3", classes: "atdi-tags-h3", content: "episode tags"},
				{name: "titleCheck", kind: "atdi.checkbox", label: "title" },
		        {name: "idCheck", kind: "atdi.checkbox", label: "id" },
		        {name: "plotCheck", kind: "atdi.checkbox", label: "plot" },
		        {name: "ratingCheck", kind: "atdi.checkbox", label: "rating" },
		        {name: "seasonCheck", kind: "atdi.checkbox", label: "season" },
		        {name: "episodeCheck", kind: "atdi.checkbox", label: "episode" },
		        {name: "airedCheck", kind: "atdi.checkbox", label: "aired" },
			]},
			{content: "Episode Filename Format: "},
	        {kind: "onyx.InputDecorator", style: "margin: 5px 0px 5px 0px; display: block", components: [
	            {name: "formatInput", kind: "onyx.Input", placeholder: "Filename format"},
	        ]},
			{kind: "onyx.Button", content: "Boxee Default", style: "margin-right: 5px;",
			 ontap: "boxeeDefaultTapped"},
			{kind: "onyx.Button", content: "Boxee w/ x's", style: "margin-right: 5px;",
		 	 ontap: "boxeeXTapped"},
			{kind: "onyx.Button", content: "episode - title", style: "margin-right: 5px;",
			 ontap: "episodeTapped"},
			{name: "helpPopup", modal: true, floating: true, centered: true, 
			 kind: "onyx.Popup", style: "padding: 20px", components: [
				{kind: "Control", tag:"div", allowHtml: true, content:
					"Uncheck the check boxes to remove specific tags from either<br />"+
					"the tvshow.nfo file or specific episode nfo files.<br /><br />"+
					"Click a shortcut button or enter a custom filename format<br />"+
					"specifier for episode nfo files.<br /><br />"+
					"The %e specifier must be used.<br /><br />"+
					"Filename Format Keywords:<br /><br />"+
					"%V  ->  tv show title with periods separating words Doctor.Who<br />"+
		  		  	"%v  ->  tv show title with normal spaces<br />"+
		  		  	"%T  ->  title with periods separating words What.A.Knight.For.A.Knight<br />"+
		  		  	"%t  ->  title with normal spaces<br />"+
		  		  	"%i  ->  id<br />"+
		  		  	"%S  ->  season<br />"+
		  		  	"%s  ->  season with leading zero<br />"+
		  		  	"%e  ->  episode with leading zero<br />"+
		  		  	"%y  ->  year<br />"+
		  		  	"%m  ->  month with leading zero<br />"+
		  		  	"%d  ->  day of month with leading zero<br /><br />"+
		  		  	"%%  ->  %<br /><br />"+
		  		  	"Illegal Characters:<br />"+
		   		 	"[/ ? < > \\ : * | \" ^]<br /><br />"+
		  		  	"For now illegal characters will just be removed."
				}
			]},
			{kind: "onyx.Button", content: "Help", ontap: "helpTapped"},
			{kind: "onyx.Button", content: "Download", style: "display: block; margin-top: 20px", 
			 ontap: "downloadTapped"},
			{
				name: "saveBanner",
				kind: "enyo.WebService", 
				url: "source/php/saveBanner.php",
				method: "GET",
				handleAs: "text",
				onResponse: "gotBanner",
				onError: "ughBanner"
			},
			{
				name: "downloadNFO",
				kind: "enyo.WebService", 
				url: "source/php/download.php",
				method: "GET",
				handleAs: "text",
				onResponse: "gotDownload",
				onError: "ughDownload"
			}
		]}
	],
	setSeries: function(title, plot, id, banner)
	{
		this.title = title;
		this.plot = plot;
		this.seriesid = id;
		this.banner = banner;
		this.$.show.setContent(title);
		this.$.plot.setContent(plot);
		this.$.banner.setSrc("");
		this.$.saveBanner.send({
			mirror: this.mirror,
			banner: this.banner,
			id: this.seriesid
		});
		this.scrollTo(0,0);
	},
	gotBanner: function(inSender, inEvent){
		enyo.log(inEvent.data);
		this.$.banner.setSrc("source/php/banners/"+this.seriesid+".jpg");
	},
	ughBanner: function(inSender, inEvent){
		enyo.log("ugh");
	},
	gotDownload: function(inSender, inEvent){
		enyo.log(inEvent.data);
		this.downloadURL('source/php/'+inEvent.data);
	},
	ughDownload: function(inSender, inEvent){
		enyo.log("ugh");
	},
	boxeeDefaultTapped: function(inSender, inEvent){
		this.$.formatInput.setValue('%V.S%sE%e');
	},
	boxeeXTapped: function(inSender, inEvent){
		this.$.formatInput.setValue('%V.%Sx%e');
	},
	episodeTapped: function(inSender, inEvent){
		this.$.formatInput.setValue('%e - %t');
	},
	helpTapped: function(inSender, inEvent){
		this.$.helpPopup.show();
	},
	downloadTapped: function(inSender, inEvent){
		this.$.downloadNFO.send({
			mirror: this.mirror,
			language: this.language,
			seriesID: this.seriesid,
			format: this.$.formatInput.value,
			tvtitleCheck: this.$.tvtitleCheck.checked,			 
			tvidCheck: this.$.tvidCheck.checked,
			tvplotCheck: this.$.tvplotCheck.checked,
			tvgenreCheck: this.$.tvgenreCheck.checked,
			tvmpaaCheck: this.$.tvmpaaCheck.checked,
			tvactorsCheck: this.$.tvactorsCheck.checked,
			titleCheck: this.$.titleCheck.checked,
	        idCheck: this.$.idCheck.checked,
	        plotCheck: this.$.plotCheck.checked,
	        ratingCheck: this.$.ratingCheck.checked,
	        seasonCheck: this.$.seasonCheck.checked,
	        episodeCheck: this.$.episodeCheck.checked,
	        airedCheck: this.$.airedCheck.checked
		});
	},
	/*
	 * Function taken from answer by Andrew Dunn at 
	 * http://stackoverflow.com/questions/3749231/download-file-using-javascript-jquery
	 */
	downloadURL: function downloadURL(url)
	{
	    var iframe;
	    iframe = document.getElementById("hiddenDownloader");
	    if (iframe === null)
	    {
	        iframe = document.createElement('iframe');  
	        iframe.id = "hiddenDownloader";
	        iframe.style.visibility = 'hidden';
	        document.body.appendChild(iframe);
	    }
	    iframe.src = url;   
	}
});
