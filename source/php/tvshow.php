<?php
class tvshow
{
	const xmlStart = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<tvshow>
</tvshow>
XML;

	private $title;
	private $plot;
	private $id;
	private $genre;
	private $actors;
	private $mpaa;
	
	public function __construct()
	{
		
	}
	
	public function getTitle()
	{
		return $this->title;
	}
	
	public function loadFromTVDB($series)
	{
		$this->title = $series->SeriesName;
		$this->plot = $series->Overview;
		$this->id = $series->id;
		
		// Get the first genre and make it all caps
		$genres = $series->Genre;
		$genres = ltrim($genres,'|');
		$genres = rtrim($genres,'|');
		$genres = explode('|',$genres);
		$this->genre = strtoupper($genres[0]);
		
		// Get the actors
		$actors = $series->Actors;
		$actors = ltrim($actors,'|');
		$actors = rtrim($actors,'|');
		$this->actors = explode('|',$actors);
		
		$this->mpaa = $series->ContentRating;
	}
	
	public function loadFromNFO($file)
	{
		$nfo = simplexml_load_file($file);
		
	}
	
	public function saveAsNFO($path,$title,$plot,$id,$genre,$actors,$mpaa)
	{
		$nfo = new SimpleXMLElement(self::xmlStart);
		if ($title)
			$nfo->title = $this->title;
		
		if ($plot)
			$nfo->plot = $this->plot;
		
		if ($id)
			$nfo->id = $this->id;
		
		if ($genre)
			$nfo->genre = $this->genre;
		
		if ($actors)
		{
			foreach ($this->actors as $actor)
			{
				$tvActor = $nfo->addChild('actor');
				$tvActor->name = $actor;
				$tvActor->addChild('role');
				$tvActor->addChild('thumb');
			}
		}
		
		if ($mpaa)
			$nfo->mpaa = $this->mpaa;
		
		if (!is_dir($path))
			mkdir($path);
		
		$dom = new DOMDocument('1.0');
		$dom->preserveWhiteSpace = false;
		$dom->formatOutput = true;
		$dom->loadXML($nfo->asXML());
		$dom->save($path.'/tvshow.nfo');
	}
}
?>