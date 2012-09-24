<?php
class episode
{
	const xmlStart = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<episodedetails>
</episodedetails>
XML;

	private $title;
	private $id;
	private $rating;
	private $season;
	private $episode;
	private $plot;
	private $aired;
	
	public function __construct()
	{

	}
	
	public function getSeason()
	{
		return $this->season;
	}
	
	public function loadFromTVDB($episode)
	{
		$this->title = $episode->EpisodeName;
		$this->id = $episode->id;
		$this->rating = $episode->Rating;
		$this->season = $episode->SeasonNumber;
		$this->episode = $episode->EpisodeNumber;
		$this->plot = $episode->Overview;
		$this->aired = $episode->FirstAired;
	}
	
	public function saveAsNFO($path,$format,$tvShow,$title,$id,$plot,$rating,$season,$episode,$aired)
	{
		$nfo = new SimpleXMLElement(self::xmlStart);
		if ($title)
			$nfo->title = $this->title;
		
		if ($id)
			$nfo->id = $this->id;
		
		if ($rating)
			$nfo->rating = $this->rating;
		
		if ($season)
			$nfo->season = $this->season;
		
		if ($episode)
			$nfo->episode = $this->episode;
		
		if ($plot)
			$nfo->plot = $this->plot;
		
		if ($aired)
			$nfo->aired = $this->aired;
		
		$fileName = $this->getFileName($format,$tvShow);
		
		if (!is_dir($path))
			mkdir($path);

		$dom = new DOMDocument('1.0');
		$dom->preserveWhiteSpace = false;
		$dom->formatOutput = true;
		$dom->loadXML($nfo->asXML());
		$dom->save($path.'/'.$fileName);
	}
	
	private function getFileName($format,$tvShow)
	{
		/*
		 * Keywords:
		 * 
		 * %V -> tv show title with periods separating words Doctor.Who
		 * %v -> tv show title with normal spaces
		 * %T -> title with periods separating words What.A.Knight.For.A.Knight
		 * %t -> title with normal spaces
		 * %i  -> id
		 * %S -> season
		 * %s -> season with leading zero
		 * %e  -> episode with leading zero
		 * %y  -> year
		 * %m  -> month with leading zero
		 * %d  -> day of month with leading zero
		 * 
		 * %%  -> %
		 * 
		 * Illegal Characters:
		 *  [/ ? < > \ : * | " ^]
		 * 
		 * For now illegal characters will just be removed.
		 */
		 
		$filename = "";
		
		// Parse format string and create filename
		for($i=0;$i<strlen($format);$i++)
		{
			if ($format[$i]=='%')
			{
				$i++;
				switch($format[$i])
				{
					case 'V':
						$filename .= str_replace(' ','.',$tvShow);
						break;
					case 'v':
						$filename .= $tvShow;
						break;
					case 'T':
						$filename .= str_replace(' ','.',$this->title);
						break;
					case 't':
						$filename .= $this->title;
						break;
					case 'i':
						$filename .= $this->id;
						break;
					case 'S':
						$filename .= $this->season;
						break;
					case 's':
						if ($this->season<10)
							$filename .= '0';
						$filename .= $this->season;
						break;
					case 'e':
						if ($this->episode<10)
							$filename .= '0';
						$filename .= $this->episode;
						break;
					case 'y':
						$filename .= substr($this->aired,0,4);
						break;
					case 'm':
						$filename .= substr($this->aired,5,2);
						break;
					case 'd':
						$filename .= substr($this->aired,8,2);
						break;
					case '%':
						$filename .= '%';
						break;
				}
			}
			else 
			{
				$filename.=$format[$i];
			}
		}
		
		// remove any illegal characters
		$illegal = array("/","?","<",">","\\",":","\"","*","|","^");
		$replace = array("","","","","","","","","","");
		$filename = str_replace($illegal,$replace,$filename);
		
		return $filename.'.nfo';
	}
}
?>