<?php

$pdo = new PDO("mysql:host=localhost;dbname=gliese", 'root', '');

$sql = "SELECT * FROM chat WHERE status = 'pendente';";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>


<html>
<head>
    <link rel="stylesheet" href="../reset.css">
    <link rel="shortcut icon" href="../img/worldwide.png">
    <link rel="stylesheet" href="style.css">
    <title>Conecta Gliese</title>
    <script src="https://kit.fontawesome.com/67cdbd520c.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="/chatbot/style.css">
</head>
    <div class="header">
        <a id="logo" href="#"><span>C</span>onecta Gliese.</a>
        <a id="log" onclick="log()">Logout</a>
    </div>
    <div class="content">
        <div class="text">
            <p><?= count($data) ?></p><span>Clientes em espera</span>
        </div>
        <div class="chamados">
            <?php
                foreach($data as $atendimento):
            ?>
                <div class="block">
                    <p>Id do Atendimento: <span>#<?= $atendimento['id'] ?></span></p>
                    <button data-id="<?= $atendimento['id'] ?>">Iniciar Atendimento</button>
                </div>

            <?php endforeach ?>
        </div>
    </div>
    <!-- <div class="chat"></div> -->

    <section class="chat-bot" style="display: flex;">
        <header>
            <h2>Atendimento Virtual</h2>
            <button class="close-chat">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </header>
        <section class="chat-textarea"></section>
        <div class="bot-input">
            <input type="text" id="msg-input">
            <button id="send-msg">
                <i class="fa-solid fa-paper-plane" style="color: #ffffff;"></i>
            </button>
        </div>
    </section>


    <script>
        const log = () => {
            location.href = '../index.php'
        }
    </script>

    
    <script type="module">
        import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

        const chat = document.querySelector('.chat-textarea');

        let socket = null;
        let currentChat = null;
        let chat_id = null;

        function startSocket(chatId) {
            chat_id = chatId;

            if(socket != null) {
                socket.emit("finish", {
                    chat_id: chat_id,
                });
                socket.close();
            }

            chat.innerHTML = `
                <p>ATENDIMENTO ${chat_id}</p>
            `;
            socket = io("ws://localhost:3000");

            socket.emit("attendant-conn", {
                chat_id: chat_id,
            });
            
            socket.on("init", (msg) => {
                chat_id = msg.chat_id;
                console.log("chat - >",chat_id);
            });

            socket.on("message", async (msg) => {
                const chatInputElement = document.createElement('div');
                const inputTextElement = document.createElement('p');
                inputTextElement.innerText = msg.text;
                chatInputElement.appendChild(inputTextElement);
                chatInputElement.classList.add('bot-msg');

                chat.appendChild(chatInputElement);
                chat.scrollTo(chat.scrollHeight,chat.scrollHeight);
            });
        }

        function sendMessage(input) {
            const chatInputElement = document.createElement('div');
            const inputTextElement = document.createElement('p');
            inputTextElement.innerText = input;
            chatInputElement.appendChild(inputTextElement);
            chatInputElement.classList.add('usr-msg');
            
            console.log(chat_id);

            chat.appendChild(chatInputElement);
            socket.emit("message", {
                from: "attendant",
                chat_id,
                text: input
            });
            chat.scrollTo(chat.scrollHeight,chat.scrollHeight);
        }

        const msgInput = document.getElementById("msg-input");
        const sendBtn = document.getElementById("send-msg");
        sendBtn.removeEventListener("click", () => {});
        sendBtn.addEventListener("click", () => {
            sendMessage(msgInput.value)
        });

        const clients = document.querySelectorAll('.block > button');
        clients.forEach(client => {
            client.addEventListener("click", () => {
                startSocket(client.dataset.id);
                client.innerText = "Finalizar atendimento";
                client.addEventListener("click", () => {
                    if(socket != null) {
                        socket.emit("finish", {
                            chat_id: chat_id,
                        });
                        socket.close();
                    }
                });
            });
        });

    </script>
</html>