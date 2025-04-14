import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [stompClient, setStompClient] = useState<any>(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/chat');
        const client = Stomp.over(socket);
        client.connect({}, () => {
            client.subscribe('/topic/messages', (response: { body: string }) => {
                const newMessage = response.body;
                setMessages(prevMessages => [...prevMessages, newMessage]);
            });
        });

        setStompClient(client);

        return () => {
            if (client) {
                client.disconnect();
            }
        };
    }, []);

    const handleSendMessage = () => {
        if (stompClient) {
            stompClient.send('/app/sendMessage', {}, JSON.stringify({ message }));
        }
        setMessage('');
    };

    return (
        <div>
            <h2>Chat con Administradores</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <span>{msg}</span>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
            />
            <button onClick={handleSendMessage}>Enviar</button>
        </div>
    );
};

export default Chat;
