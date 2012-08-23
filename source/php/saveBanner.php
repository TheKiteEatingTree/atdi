<?php
	$mirror = $_GET['mirror'];
	$posterLoc = $_GET['banner'];
	$id = $_GET['id'];
	$location = "banners/".$id.".jpg";
	if (!is_dir("banners"))
		mkdir("banners");
	if (!file_exists($location))
	{
		$request =  $mirror.'/banners/'.$posterLoc;
		copy($request,"banners/".$id.".jpg");
	}
?>