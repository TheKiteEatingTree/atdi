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
			{name: "tvshowDiv", classes:"atdi-tags-div", kind: "Control", tag: "div", components: [
				{tag: "h3", classes: "atdi-tags-h3", content: "tvshow.nfo tags"},
				{name: "tvtitleCheck", kind: "atdi.checkbox", label: "title" },
		        {name: "tvidCheck", kind: "atdi.checkbox", label: "id" },
		        {name: "tvplotCheck", kind: "atdi.checkbox", label: "plot" },
		        {name: "tvgenreCheck", kind: "atdi.checkbox", label: "genre" },
		        {name: "tvmpaaCheck", kind: "atdi.checkbox", label: "mpaa" },
		        {name: "tvactorsCheck", kind: "atdi.checkbox", label: "actors" }
			]},
			{name: "tvshowDiv", classes:"atdi-tags-div", kind: "Control", tag: "div", 
			 style: "width: 300px;", components: [
				{tag: "h3", classes: "atdi-tags-h3", content: "episode tags"},
				{name: "titleCheck", kind: "atdi.checkbox", label: "title" },
		        {name: "idCheck", kind: "atdi.checkbox", label: "id" },
		        {name: "plotCheck", kind: "atdi.checkbox", label: "plot" },
		        {name: "ratingCheck", kind: "atdi.checkbox", label: "rating" },
		        {name: "seasonCheck", kind: "atdi.checkbox", label: "season" },
		        {name: "episodeCheck", kind: "atdi.checkbox", label: "episode" },
		        {name: "airedCheck", kind: "atdi.checkbox", label: "aired" },
		        {kind: "onyx.InputDecorator", components: [
		            {kind: "onyx.Input"}
		        ]}
			]},
			{kind: "onyx.Button", content: "Download", ontap: "downloadTapped"},
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
		})
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
	downloadTapped: function(inSender, inEvent){
		this.$.downloadNFO.send({
			mirror: this.mirror,
			language: this.language,
			seriesID: this.seriesid
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
