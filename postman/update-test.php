<?php
$entityBody = file_get_contents('php://input');
$sentBody = $entityBody;

$dbconn = pg_connect("host='/var/run/postgresql' dbname='gadza_demotesting' user='gadza_demotesting' password='qwertyurl123'")
    or die('Не удалось соединиться: ' . pg_last_error());

$query = $sentBody;

$result = pg_query($dbconn,$query) or die('Ошибка запроса: ' . pg_last_error());

$resultAffect = pg_affected_rows($result);
echo $resultAffect;

?>
