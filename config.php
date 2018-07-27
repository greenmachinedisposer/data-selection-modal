<?php
    $groupArray= $_POST['groups'];
    $page= $_POST['page'];

    define("GROUP",$groupArray[0]);

    $arr = array(
        'host' => 'localhost',
        'username' => 'root',
    );

    echo json_encode($arr);

?>