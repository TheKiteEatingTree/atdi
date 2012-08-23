<?php
include('tvshow.php');
include('episode.php');
include('zipper.php');

	// Get all of the info for a series
	$key = file_get_contents("key.txt");
	$mirror = $_GET['mirror'];
	$language = $_GET['language'];
	$seriesID = $_GET['seriesID'];
	$request =  $mirror.'/api/'.urlencode($key).'/series/'.urlencode($seriesID).
				'/all/'.urlencode($language).'.xml';
	$response = file_get_contents($request);
	
	// Parse series info
	$seriesData = new SimpleXMLElement($response);
	$series = $seriesData->Series;
	
	$tvshow = new tvshow();
	$tvshow->loadFromTVDB($series);
	$tvshow->saveAsNFO($seriesID,true,true,true,true,true,true);
	
	// Create Episode .nfo files
	$episodes = $seriesData->Episode;
	$i = 0;
	while (isset($episodes[$i]))
	{
		if ($episodes[$i]->SeasonNumber<1)
		{
			$i++;
			continue;
		}
		
		$episode = new episode();
		$episode->loadFromTVDB($episodes[$i]);
		$season = "";
		if ($season<10)
			$season .= '0';
		$season .= $episode->getSeason();
		$episode->saveAsNFO($seriesID.'/Season '.$season,"",
					   true,false,false,true,true,true,true);
		$i++;
	}
	
	// Zip em up
	$zip = new ZipArchive();
	$zip->open($tvshow->getTitle().'.zip',ZIPARCHIVE::CREATE | ZIPARCHIVE::OVERWRITE);
	addFolderToZip($seriesID,$zip);
	$zip->close();
	
	echo $tvshow->getTitle().'.zip';
?>