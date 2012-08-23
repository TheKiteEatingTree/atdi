<?php
// Function to recursively add a directory,
// sub-directories and files to a zip archive
// taken from D.Jann's post at http://www.php.net/manual/en/ziparchive.addemptydir.php
function addFolderToZip($dir, $zipArchive, $zipdir = ''){
	$dir = $dir.'/';
    if (is_dir($dir)) {
        if ($dh = opendir($dir)) {

            //Add the directory
            if(!empty($zipdir)) 
            	if (!$zipArchive->addEmptyDir($zipdir))
					echo $zipdir." failed<br />";
          
            // Loop through all the files
            while (($file = readdir($dh)) !== false) {
          
                //If it's a folder, run the function again!
                if(!is_file($dir . $file)){
                    // Skip parent and root directories
                    if( ($file !== ".") && ($file !== "..")){
                        addFolderToZip($dir . $file . "/", $zipArchive, $zipdir . $file . "/");
                    }
                  
                }else{
                    // Add the files
                    
                    if (!$zipArchive->addFile($dir . $file, $zipdir . $file))
						echo $file." failed<br />";
                  
                }
            }
        }
    }
}


?>