<?php
header('Access-Control-Allow-Origin: *');

/*
// for historical reasons - how the displaying of results started
$isBefore = date('Ymd', time() - 60*60) < '20200925';
$eci = $isBefore ? '012' : '014';
$testStatement = '"en":"This way the ECI signature counts will be displayed. This example uses data from another ECI - Stop Finning – Stop the Trade - which you may want also sign (the link redirects you there). But since 25 Sept 20 we automatically start displaying own ECI stats",';
$testStatement .= '"et":"Niisugune hakkab välja nägema toetusavalduste statistika. See näidis kasutab andmeid kodanikualgatusest Ei uimepüügile ja -kaubandusele, millele võite ka alla kirjutada (link viib praegu sinna). 25. septembril 2020 aga lülitub süsteem automaatselt ümber meie algatuse lainele.",';
*/

$lnJson = file_get_contents("languages.json");

$language = $_GET['language'] ? $_GET['language'] : 'en';

$signUrl = "https://eci.ec.europa.eu/014/public/?lg=$language";

$langResource = file_get_contents("https://eci.ec.europa.eu/014/public/assets/i18n/$language.json");
$countryNames = json_decode($langResource)->common->country;
$countriesJson = json_encode($countryNames);

$eciSrc = file_get_contents("https://eci.ec.europa.eu/014/public/api/report/progression");

$eciCountries = file_get_contents("https://eci.ec.europa.eu/014/public/api/report/map");

$eciCountriesParsed = json_decode($eciCountries);

$threeDaysAgo = date_create(date('Y-m-d'))->modify('-3 days')->format('Ymd');
$eciDayData = file_get_contents("https://myaspserver.nl/eci/2020/json-ubi20.asp?l=$threeDaysAgo");
$dAll = json_decode($eciDayData);

$eciTodayData = array_pop($dAll->rows);
$eciYesterdayData = array_pop($dAll->rows);
$eciDayBeforeYdData = array_pop($dAll->rows);

$newData = [];
$todaySumValues = [];
$yesterdaySumValues = [];

$eciTodayEE = 0;
$eciYesterdayEE = 0;

foreach($dAll->cols as $key => $value)
{
	if ($key > 0)
	{
		$cc = strtolower($value->id);
		$newData[$cc]['today'] = $eciTodayData->c[$key]->v != null ? $eciTodayData->c[$key]->v - $eciYesterdayData->c[$key]->v : 0;
		$todaySumValues[] = $newData[$cc]['today'];
		$newData[$cc]['yesterday'] = $eciYesterdayData->c[$key]->v != null ? $eciYesterdayData->c[$key]->v - $eciDayBeforeYdData->c[$key]->v : 0;
		$yesterdaySumValues[] = $newData[$cc]['yesterday'];
		
	}
}

$eciTodayEE = $newData['ee']['today'];
$eciYesterdayEE = $newData['ee']['yesterday'];

$signatureTableData = json_decode(file_get_contents('signatures.json'))->table;

foreach ($signatureTableData as $row)
{
	$newRow = [];
	unset($row[2],$row[3],$row[5],$row[7],$row[8],$row[9],$row[10],$row[11],$row[13],$row[14]);
	
	foreach ($row as $key => $unit)
	{
		$newRow[$signatureTableData[0][$key]] = $unit;
		$newData[strtolower($newRow['Code'])][$signatureTableData[0][$key]] = $newRow[$signatureTableData[0][$key]];
	}
}

$proportion = $newData['all']['Target'] / $newData['all']['Inhabitants'];

$level1SumValues = [];
$level2SumValues = [];
$level3SumValues = [];

foreach ($newData as $key => $row)
{
	if ($key == 'code')
	{
		$newData[$key]['TargetMEP'] = 'TargetMEP';
		$newData[$key]['TargetPop'] = 'TargetPop';
		$newData[$key]['Level1'] = [
			['type'=> 'Type 1', 'value' => 'Level 1']
		];
		$newData[$key]['Level2'] = [
			['type'=> 'Type 2', 'value' => 'Level 2']
		];
		$newData[$key]['Level3'] = [
			['type'=> 'Type 3', 'value' => 'Level 3']
		];
	}
	else
	{
		$newData[$key]['TargetMEP'] = round($newData[$key]['Target'], 0, PHP_ROUND_HALF_UP);
		$newData[$key]['TargetPop'] = $newData[$key]['Inhabitants'] * $proportion;
		$newData[$key]['TargetPop'] = round($newData[$key]['TargetPop'], 0, PHP_ROUND_HALF_UP);
		$targetLevel = [
			['type'=> 'THR', 'value' => $newData[$key]['threshold']],
			['type'=> 'MEP', 'value' => $newData[$key]['TargetMEP']],
			['type'=> 'POP', 'value' => $newData[$key]['TargetPop']]
		];
	}
	
	unset($newData[$key]['Target']);
	
	
	$sortValue = array_column($targetLevel, 'value');
	
	array_multisort($sortValue, SORT_ASC, $targetLevel);
	
	if (!in_array($key, ['code','all']))
	{
		$newData[$key]['Level1'] = $targetLevel[0];
		$newData[$key]['Level2'] = $targetLevel[1];
		$newData[$key]['Level3'] = $targetLevel[2];
		
		$level1SumValues[] = $targetLevel[0]['value'];
		$level2SumValues[] = $targetLevel[1]['value'];
		$level3SumValues[] = $targetLevel[2]['value'];
	}
}

$newData['all']['today'] = array_sum($todaySumValues);
$newData['all']['yesterday'] = array_sum($yesterdaySumValues);
$newData['all']['Level1'] = ['type'=> 'ALL1', 'value' => array_sum($level1SumValues)];
$newData['all']['Level2'] = ['type'=> 'ALL2', 'value' => array_sum($level2SumValues)];
$newData['all']['Level3'] = ['type'=> 'ALL3', 'value' => array_sum($level3SumValues)];

$goalSumValues = [];

//$allGoal = ($newData['all']['TargetMEP'] + $newData['all']['TargetPop']) /2;
$allGoal = 1000000;

$propRemainingAfterThreshold = ($allGoal - $newData['all']['threshold']) / $allGoal;

$newData['all']['LevelGoal'] = ['type'=> 'ALL', 'value' => $allGoal];


foreach ($newData as $key => $nd)
{
    //$goal = ($newData[$key]['TargetMEP'] + $newData[$key]['TargetPop'])/2; 
    $goal = $newData[$key]['threshold'] + ($propRemainingAfterThreshold * $newData[$key]['TargetPop']); 
    
    $newData[$key]['LevelGoal']['value'] = $key == 'code' ? 'Goal' : round($goal, 0, PHP_ROUND_HALF_UP);
    $newData[$key]['LevelGoal']['type'] = 'ALL';
    
    if ($key != 'code' && $key != 'all') $goalSumValues[] = $goal;
}

$newData['all']['LevelGoal']['calc'] = round(array_sum($goalSumValues), 0, PHP_ROUND_HALF_UP);

$eciCountriesParsed->sortedBy = $_GET['sort'] ? $_GET['sort'] : null;
foreach($eciCountriesParsed->signatureCountryCount as $key => $statistics)
{
    switch ($eciCountriesParsed->sortedBy)
    {
        case 'signatureCount': 
            $sortValue = $statistics->totalCount;
            break;
        case 'today':
            $sortValue = $newData[$statistics->countryCode]['today'];
            break;
        case 'yesterday':
            $sortValue = $newData[$statistics->countryCode]['yesterday'];
            break;
        case 'targetPopPercentage':
            $sortValue = $statistics->totalCount / $newData[$statistics->countryCode]['TargetPop'];
            break;
        case 'thresholdPercentage':
            $sortValue = $statistics->percentage;
            break;
        case 'level1Percentage':
            $sortValue = $statistics->totalCount / $newData[$statistics->countryCode]['Level1']['value'];
            break;
        case 'level2Percentage':
            $sortValue = $statistics->totalCount / $newData[$statistics->countryCode]['Level2']['value'];
            break;
        case 'levelGoalPercentage':
            $sortValue = $statistics->totalCount / $newData[$statistics->countryCode]['LevelGoal']['value'];
            break;
        case 'level3Percentage':
            $sortValue = $statistics->totalCount / $newData[$statistics->countryCode]['Level3']['value'];
            break;
        case 'targetMEPPercentage':
            $sortValue = $statistics->totalCount / $newData[$statistics->countryCode]['TargetMEP'];
            
        default:
            $sortValue = $statistics->percentage;
    }
    
    $statistics->sortValue = $sortValue;
}

$sortCol = array_column($eciCountriesParsed->signatureCountryCount, 'sortValue');
$sortDir = $_GET['asc'] == true ? SORT_ASC : SORT_DESC;
array_multisort($sortCol, $sortDir, $eciCountriesParsed->signatureCountryCount);

echo '{';
if ($isBefore)
{
    echo $testStatement;
}
echo '"signUrl":"' . $signUrl . '",';
echo '"when":"' . date('d.m.Y H:i', time()) . '",';
echo '"totalVotes":';
echo $eciSrc . ',';
echo '"estoniaToday":';
echo $eciTodayEE . ',';
echo '"estoniaYesterday":';
echo $eciYesterdayEE . ',';
echo '"countryVotes":';
echo json_encode($eciCountriesParsed) . ',';
echo '"targets":';
echo json_encode($newData) . ',';
echo '"countryNames":';
echo $countriesJson;
echo '}';