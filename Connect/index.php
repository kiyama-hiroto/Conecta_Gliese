<html>
<head>
    <link rel="stylesheet" href="reset.css">
    <link rel="shortcut icon" href="./img/worldwide.png">
    <link rel="stylesheet" href="index.css">
    <script src="index.js"></script>
    <title>Conecta Gliese</title>


    <!-- ---------------        CHAT BOT       ---------------- -->
    <script src="/chatbot/script.js" type="module" defer></script>
    <script src="https://kit.fontawesome.com/67cdbd520c.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="/chatbot/style.css">
<!-- ----------------------------------------------------- -->

</head>
    <div class="header">
        <a id="logo" href="#"><span>C</span>onecta Gliese.</a>
        <ul>
            <li><a href="#Home">Home</a></li>
            <li><a href="#About Us">About Us</a></li>
            <li><a href="#Contacts">Contacts</a></li>
        </ul>
    </div>
    <div class="content">
        <p>Conetando tudo e todos.</p>
        <div class="text">Internet of Things</div>
        <div id="buttons">
            <button onclick="signIn()">Sign In</button>
            <a onclick="signUp()">Sign Up</a>
        </div>
    </div>
    <div class="background"></div>

    <button class="chat"></button>

    <section class="chat-bot">
        <header>
            <h2>Atendimento Virtual</h2>
            <button class="close-chat">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </header>
        <section class="chat-textarea">
            <div class="bot-msg">
                <p>Olá! Como posso ajudar?</p>
            </div>
           
        </section>
        <div class="bot-input">
            <input type="text" id="msg-input">
            <button id="send-msg">
                <i class="fa-solid fa-paper-plane" style="color: #ffffff;"></i>
            </button>
        </div>
    </section>


    <script>
        const chat = document.querySelector('.chat-bot');

        const openChat = document.querySelector('.chat');
        openChat.addEventListener('click', () => {
            chat.style.display = "flex";
            openChat.style.display = "none";
        });

        const closeChat = document.querySelector('.close-chat');
        closeChat.addEventListener('click', () => {
            openChat.style.display = "block";
            chat.style.display = "none";
        });
    </script>
</html>