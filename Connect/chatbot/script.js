import situations from './config.js';
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
        
const inputArea = document.querySelector('.bot-input');        
const chat = document.querySelector('.chat-textarea');
const sendBtn = document.getElementById("send-msg");
const msgInput = document.getElementById("msg-input");

let socket = null;
let chat_id = null;

const ChatBot = {
    getOptions(input) {
        const options = [];
        const words = input.split(' ');

        situations.forEach((situation, index) => {
            let push = false;
            words.forEach((word, w_index) => {
                situation.keywords.forEach((keyword, kw_index) => {
                    if(keyword.toLowerCase().includes(word.toLowerCase())) push = true;
                    if(word.toLowerCase().includes(keyword.toLowerCase())) push = true;
                });
            });
            
            if(push) options.push(situation);
        });

        if(options.length > 0) this.showOptions(options);
        else 
            setTimeout(() => {
                this.botAnswer("Desculpe, não entendi o seu problema. Tente me explicar novamente com mais detalhes.");
            }, 300);
    },
    userInput(input) {
        const chatInputElement = document.createElement('div');
        const inputTextElement = document.createElement('p');
        inputTextElement.innerText = input;
        chatInputElement.appendChild(inputTextElement);
        chatInputElement.classList.add('usr-msg');

        chat.appendChild(chatInputElement);

        if(chat_id != null) sendMessage(input);
        else this.getOptions(input);

        chat.scrollTo(chat.scrollHeight,chat.scrollHeight);
    },
    botAnswer(msg, options) {
        const chatInputElement = document.createElement('div');
        const inputTextElement = document.createElement('p');
        inputTextElement.innerText = msg;
        chatInputElement.appendChild(inputTextElement);
        chatInputElement.classList.add('bot-msg');

        chat.appendChild(chatInputElement);
        chat.scrollTo(chat.scrollHeight,chat.scrollHeight);
    },
    showOptions(options) {
        setTimeout(() => {
            this.botAnswer("Vamos resolver seu problema o quanto antes.");
            setTimeout(() => {
                this.botAnswer("Selecione uma das opções abaixo:");

                const optionsWrapper = document.createElement('div');
                optionsWrapper.classList.add('chat-options');
                
                setTimeout(() => {
                    options.forEach((option, index) => {
                        const optionElement = document.createElement('button');
                        optionElement.innerText = option.name;
                        optionElement.classList.add('chat-option');
                        
                        optionElement.addEventListener("click", () => {
                            ChatBot.showSolution(option);
                        });

                        setTimeout(() => {
                            optionsWrapper.appendChild(optionElement);
                        }, 300);
                    });
                }, 300)
                
                chat.insertAdjacentElement('beforeend', optionsWrapper);

            }, 300)
        }, 300)

        
    },
    showSolution(option) {
        setTimeout(() => {
            ChatBot.botAnswer(option.solution);
            setTimeout(() => {
                ChatBot.botAnswer("Seu problema foi resolvido?");

                const optionsWrapper = document.createElement('div');
                optionsWrapper.classList.add('chat-options');

                setTimeout(() => {
                    ['Sim', 'Não'].forEach((option, index) => {
                        const optionElement = document.createElement('button');
                        optionElement.innerText = option;
                        optionElement.classList.add('chat-option');
                        
                        optionElement.addEventListener("click", () => {
                            if(option == "Sim") {
                                setTimeout(() => {
                                    this.botAnswer("Fico feliz em ter ajudado. Até mais🤗.");
                                    setTimeout(() => this.finishChat(), 300);
                                }, 300);
                            } else {
                                setTimeout(() => {
                                    this.botAnswer("Gostario de conversar com um atendente para solucionar seu problema?");
                                    setTimeout(() => {
                                        const wrapper = document.createElement('div');
                                        wrapper.classList.add('chat-options');
                                        ['Sim', 'Não'].forEach((_option, index) => {
                                            const opt = document.createElement('button');
                                            opt.innerText = _option;
                                            opt.classList.add('chat-option');
                                            
                                            opt.addEventListener("click", () => {
                                                if(_option == "Sim") {
                                                    startSocket();
                                                    inputArea.style.display = 'none';
                                                    setTimeout(() => {
                                                        this.botAnswer("Aguarde até um atendente iniciar o atendiemtno");
                                                    }, 300);
                                                } else {
                                                    setTimeout(() => {
                                                        this.botAnswer("Finalizando atendimento");
                                                        setTimeout(() => {
                                                            this.finishChat();
                                                        }, 300);
                                                    }, 300);
                                                }
                                            });
                                            console.log(opt);
                                            setTimeout(() => {
                                                chat.appendChild(wrapper);
                                                wrapper.appendChild(opt);
                                                chat.scrollTo(chat.scrollHeight,chat.scrollHeight);
                                            }, 300);
                                        });
                                    }, 300);
                                }, 300);
                            }
                        });
                        console.log(optionElement);
                        setTimeout(() => {
                            chat.appendChild(optionsWrapper);
                            optionsWrapper.appendChild(optionElement);
                            chat.scrollTo(chat.scrollHeight,chat.scrollHeight);
                        }, 300);
                    });
                }, 300)

            }, 300)
        }, 300)
       
    },
    finishChat() {
        inputArea.style.display = 'none';

        chat.innerHTML += `
            <div class="rating">
                    <p>Avalie o Atendimento:</p>
                    <div class="rating-stars">
                        <button>1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>4</button>
                        <button>5</button>
                    </div>
                </div>
        `
        const btn = document.querySelectorAll(".rating-stars button");
        btn.forEach(btn => {
            btn.addEventListener("click", () => {
                chat.innerHTML += `
                <hr/>
                <p>OBRIGADO!</p>
            ` 
            });
        }); 
        chat.scrollTo(chat.scrollHeight,chat.scrollHeight);
    }
}

sendBtn.addEventListener("click", () => {
    ChatBot.userInput(msgInput.value);
});


function startSocket() {
    socket = io("ws://localhost:3000");
    socket.emit("client-conn");
    
    socket.on("init", (msg) => {
        chat_id = msg.chat_id;

        inputArea.style.display = 'flex';
        chat.innerHTML += `
            <p>ATENDIMENTO ${chat_id}</p>
        `;
    });

    socket.on("message", async (msg) => {
        console.log(msg);
        const chatInputElement = document.createElement('div');
        const inputTextElement = document.createElement('p');
        inputTextElement.innerText = msg.text;
        chatInputElement.appendChild(inputTextElement);
        chatInputElement.classList.add('bot-msg');

        chat.appendChild(chatInputElement);
        chat.scrollTo(chat.scrollHeight,chat.scrollHeight);
    });

    socket.on("finish", async (msg) => {
        finishChat();
    });
}

function sendMessage(input) {
    socket.emit("message", {
        from: "client",
        chat_id,
        text: input
    });
}

// ChatBot.getOptions("sites demorando para carregar");
// ChatBot.getOptions("Gostaria de comprar um bolo");
