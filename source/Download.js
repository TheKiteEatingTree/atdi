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
	        {name: "titleCheck", kind: "atdi.checkbox", label: "title" },
	        {name: "idCheck", kind: "atdi.checkbox", label: "id" },
	        {name: "plotCheck", kind: "atdi.checkbox", label: "plot" },
	        {name: "genreCheck", kind: "atdi.checkbox", label: "genre" },
	        {kind: "onyx.InputDecorator", components: [
	            {kind: "onyx.Input"}
	        ]},
			{kind: "onyx.Button", content: "Download", ontap: "downloadTapped"},
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
	setSeries: function(title, id)
	{
		this.title = title;
		this.seriesid = id;
		this.$.show.setContent(title);
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
