<?php

$threeDaysAgo = date_create(date('Y-m-d'))->modify('-3 days')->format('Ymd');
$lastTime = (int) file_get_contents("time");
$eciDayData = null;
$robirohi = "https://myaspserver.nl/eci/2020/json-ubi20.asp?l=$threeDaysAgo";

if (empty($lastTime))
{
	file_put_contents('time', time());
}

if (time() - $lastTime >= 600 && get_headers($robirohi) && !empty(file_get_contents($robirohi)))
{
	$eciDayData = file_get_contents($robirohi);
	file_put_contents('threedays.json', $eciDayData);
	file_put_contents('time', time());
}

echo file_get_contents('threedays.json');

?>