import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'


const MessageContext = createContext();


const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log('messages from messageContext', messages)
    }, [messages])

    // const token = localStorage.getItem('token');
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGVmODFiOGZhZmNlNjA4NzViMmY0ZiIsImVtYWlsIjoic2FoaWxAMTIzIiwiaWF0IjoxNzAzODY4NDYxLCJleHAiOjE3MDM5NTQ4NjF9.HpNbak7sDVJvs7OJiIFUONgjGl6CV-eI3HjypgDTYz0`;


    const addMessage = async (roomId, message) => {
        try {
            const response = await axios.post(`http://localhost:4000/api/messages/create/${roomId}`, { message: message }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            if (response.status === 200) {
                console.log(response.data.newMessage)
                // setMessages([...messages, response.data.newMessage.message])
            }


        } catch (error) {
            console.log(error);
        }


    }


    const fetchMessages = async (roomId) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/messages/getMessages/${roomId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {

                const messagesData = response.data.messages;

                const formattedMessages = messagesData.map((message) => ({
                    message: message.message,
                    username: message.sender.username,
                    __createdtime__: message.createdAt,
                }));

                console.log(formattedMessages)


                setMessages((prevMessages) => [...prevMessages, ...formattedMessages]);
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <MessageContext.Provider value={{ messages, addMessage, setMessages, fetchMessages }}>
            {children}
        </MessageContext.Provider>
    )
}

const useMessage = () => useContext(MessageContext)

export { MessageProvider, useMessage };