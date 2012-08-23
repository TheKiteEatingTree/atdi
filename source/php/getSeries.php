<?php
	$mirror = $_GET['mirror'];
	$language = $_GET['language'];
	$series = $_GET['seriesname'];
	$request =  $mirror.'/api/GetSeries.php?seriesname='.urlencode($series).
				'&language='.urlencode($language);
	$response = file_get_contents($request);
	header('Content-type: text/xml');
	echo $response;
?>