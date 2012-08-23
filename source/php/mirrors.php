<?php
	$key = rtrim(file_get_contents("key.txt"));
	$request =  'http://www.thetvdb.com/api/'.$key.'/mirrors.xml';
	$response = file_get_contents($request);
	header('Content-type: text/xml');
	echo $response;
?>
