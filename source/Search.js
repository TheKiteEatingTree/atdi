enyo.kind({
	name: "atdi.search",
	kind: "FittableRows",
	style: "width: 400px;",
	published: {
		mirror: "",
		language: ""
	},
	events: {
		onTitleTapped: ""
	},
	components: [
		{kind: "FittableColumns", noStretch: true, components: [
			{kind: "onyx.InputDecorator", components: [
	    		{name: "searchInput", kind: "onyx.Input", placeholder: "ex. Community"}
			]},
			{kind: "onyx.Button", content: "Search", classes: "search", ontap: "searchTapped"}
		]},
		{kind: "List", classes: "list", onSetupItem: "setSeriesInfo", 
		 ontap: "titleTapped", fit: true, components: [
			{name: "item", tag: "div", classes: "list-item", components: [
				{name: "title", kind: "Control", tag: "h4"},
				{name: "overview", kind: "Control", tag: "p"}
			]}
		]},
		{
			name: "getSeries",
			kind: "enyo.WebService", 
			url: "source/php/getSeries.php",
			method: "GET",
			handleAs: "xml",
			onResponse: "gotSeries",
			onError: "ughSeries"
		}
	],
	searchTapped: function(inSender, inEvent) {
		this.$.getSeries.send({
			mirror: this.mirror,
			language: this.language,
			seriesname: this.$.searchInput.getValue()
		});
	},
	gotSeries: function(inSender, inEvent){
		var data = enyo.xml2json(inEvent.data,"");
		this.searchResults = new Array();
		if (data.Data != null)
		{
			this.searchResults = this.searchResults.concat(data.Data.Series);
			enyo.log(this.searchResults.length);
			this.$.list.setCount(this.searchResults.length);
			this.$.list.reset();
		}
	},
	ughSeries: function(inSender, inEvent){
		enyo.log("ugh");
	},
	setSeriesInfo: function(inSender, inEvent){
		var index = inEvent.index;
	    this.$.title.setContent(this.searchResults[index].SeriesName);
	    var plot = this.searchResults[index].Overview;
	    if (plot!=undefined && plot != null)
	    {
		    var briefPlot = plot;
		    var max = Math.min(100,plot.length);
		    briefPlot = briefPlot.substring(0,max);
		    var i;
		    for (i=100;i<plot.length;i++)
		    {
		    	if (plot[i]==' ')
		    		break;
		    	else
		    		briefPlot+=plot[i];
		    }
		    if (briefPlot.length<plot.length)
		    	briefPlot += "...";
		    this.$.overview.setContent(briefPlot);
		}
		else
			this.$.overview.setContent("");
	    return true;
	},
	titleTapped: function(inSender, inEvent){
		this.doTitleTapped({
			title: this.searchResults[inEvent.index].SeriesName,
			plot: this.searchResults[inEvent.index].Overview,
			id: this.searchResults[inEvent.index].seriesid,
			banner: this.searchResults[inEvent.index].banner
		});
		this.current = inEvent.index;
	}
});