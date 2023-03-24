<?php

$pdo = new PDO("mysql:host=localhost;dbname=gliese", 'root', '');

$body = file_get_contents('php://input');
$json = json_decode($body,true);
// dd($json);
if(isset($json['type'])) {
    if($json['type'] == 'client') {
        $client_id = $json['client_id'];
        
        $sql = "INSERT INTO chat(`client_id`) VALUES(?)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(1, $client_id);
        $stmt->execute();
        
        $sql = "SELECT id from chat order by id desc limit 1;";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        // dd($data);
        echo json_encode($data);
        die;
    } else {
        $attendant_id = $json['attendant_id'];
        $chat_id = $json['chat_id'];
        
        // echo $chat_id;

        $sql = "UPDATE chat SET func = ?,status='atendendo' WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(1, $attendant_id);
        $stmt->bindParam(2, $chat_id);
        $stmt->execute();
        
        $sql = "SELECT id from chat where id = ?;";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(1, $chat_id);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        // dd($data);
        echo json_encode($data);
        die;
    }
}


function dd($obj) {
    var_dump($obj);
    die;
}