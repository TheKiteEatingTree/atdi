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
			{name: "banner", kind: "Image"},
			{name: "plot", kind: "Control", tag: "p"},
	        {name: "titleCheck", kind: "atdi.checkbox", label: "title" },
	        {name: "idCheck", kind: "atdi.checkbox", label: "id" },
	        {name: "plotCheck", kind: "atdi.checkbox", label: "plot" },
	        {name: "genreCheck", kind: "atdi.checkbox", label: "genre" },
	        {name: "mpaaCheck", kind: "atdi.checkbox", label: "mpaa" },
	        {name: "actorsCheck", kind: "atdi.checkbox", label: "actors" },
	        {kind: "onyx.InputDecorator", components: [
	            {kind: "onyx.Input"}
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
