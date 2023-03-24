import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
      }
  });

const chats = [];

io.on("connection", async socket => {    

    socket.to(socket.id).emit('chat-id');

    socket.on("init", async (id ,msg) => {
        
    });

    socket.on("client-conn", async (id, msg) => {

        //r =========================================================
        const client_id = 9;
        //r =========================================================

        
        const request = await fetch('http://localhost:8080/chatbot/api/create.php', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
            body: `{"client_id": ${client_id}, "type": "client"}`        
        });
        const json = await request.json();
        
        const chatId = json.id;


        chats.push({
            id: chatId,
            client_id: socket.id,
            attendant_id: null
        });

    });

    socket.on("attendant-conn", async (msg) => {

        //r =========================================================
        const attendant_id = 10;
        //r =========================================================
        
        const request = await fetch('http://localhost:8080/chatbot/api/create.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: `{"attendant_id": ${attendant_id}, "chat_id": ${msg.chat_id}, "type": "attendant"}`        
        });
        const json = await request.json();
        console.log('json - ',json);
        // const chatId = json.id;
        const chatId = msg.chat_id;
        let client_sock = null;
        
        chats.forEach(chat => {
            if(chat.id == chatId) {
                client_sock = chat.client_id;
                chat.attendant_id = socket.id;
                socket.to(chat.client_id).emit("init", {
                    chat_id: chatId
                });
                socket.to(chat.attendant_id).emit("init", {
                    chat_id: chatId
                });
            }
        });


        console.log('chats -',chats);
    });

    socket.on("finish", async (msg) => {
        chats.forEach(chat => {
            if(chat.id == msg.chat_id) {
                socket.to(chat.client_id).emit("finish", msg);
            }
        });
    });

    socket.on("message", async (msg) => {
        chats.forEach(chat => {
            if(chat.id == msg.chat_id) {
                console.log("CHAT ATUAL -> ",chat);
                console.log("MENSAGEM -> ",msg);
                if(msg.from == 'client') {
                    console.log("cliente ->",chat);
                    socket.to(chat.attendant_id).emit("message", {text: msg.text});
                } else {
                    console.log("atendente -> ",chat);
                    socket.to(chat.client_id).emit("message", {text: msg.text});
                }
            }
        });
    });

});



httpServer.listen(3000, () => {
    console.log("server is running");
});