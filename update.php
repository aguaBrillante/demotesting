<?php
$entityBody = file_get_contents('php://input');
$sentBody = $entityBody;

$dbconn = pg_connect("host='/var/run/postgresql' dbname='gadza' user='gadza' password='1111111189Aa'")
    or die('Не удалось соединиться: ' . pg_last_error());

$query = $sentBody;

$result = pg_query($dbconn,$query) or die('Ошибка запроса: ' . pg_last_error());

$resultAffected = pg_affected_rows($result);
echo $resultAffected;

?>
