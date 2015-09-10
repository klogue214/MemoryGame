<?php
//open file for reading
$file = fopen('storage.dat', 'r');
while($row = fgetcsv($file)) {
	$times[$row[0]] = $row[1];
}
$times[$_POST['name']] = $_POST['time'];
fclose($file);

//sort array by value
asort($times);

//open file for writing
$file = fopen('storage.dat', 'w');
foreach($times as $name => $time) {
	fwrite($file, $name.','.$time.PHP_EOL);
}
fclose($file);

//return response back to frontend
echo json_encode(array_slice($times,0,5));
