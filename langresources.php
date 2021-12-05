<?php
header('Access-Control-Allow-Origin: *');
$language = $_GET['language'] ? $_GET['language'] : 'en';

$signUrl = "https://eci.ec.europa.eu/014/public/?lg=$language";

$langResource = file_get_contents("https://eci.ec.europa.eu/014/public/assets/i18n/$language.json");
$allDescriptions = file_get_contents("https://eci.ec.europa.eu/014/public/api/initiative/alldescriptions");
$fromJsonLangResource = json_decode($langResource); //->common->country;
$toJsonLangResource = json_encode($fromJsonLangResource->common->country);
$fromJsonAllDescriptions = json_decode($allDescriptions);
$arrayOfDescriptions = array_column($fromJsonAllDescriptions->descriptions, null, 'languageCode');
unset($fromJsonAllDescriptions->descriptions);
$fromJsonAllDescriptions->description = $arrayOfDescriptions[$language];


//echo "{\"country\":$toJson}";
echo "<pre>";
print_r($fromJsonLangResource->common->country);
print_r($fromJsonAllDescriptions);
echo "</pre>";

?>