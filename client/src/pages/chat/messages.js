import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { useMessage } from '../../context/MessagesContext'
import { useParams } from 'react-router-dom';


const Messages = ({ socket, room }) => {
    const [messagesRecieved, setMessagesReceived] = useState([]);

    console.log(room)

    const { messages, setMessages, fetchMessages } = useMessage();

    useEffect(() => {
        fetchMessages(room)
    }, [room])

    useEffect(() => {
        socket.on('receive_message', (data) => {
            console.log(data);
            setMessages((state) => [
                ...state,
                {
                    message: data.message,
                    username: data.username,
                    __createdtime__: data.__createdtime__,
                },
            ]);
        });



        return () => {
            socket.off('receive_message');
            socket.off('send_message')
        }

    }, [socket]);

    // dd/mm/yyyy, hh:mm:ss
    function formatDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <div className={styles.messagesColumn}>
            {messages.map((msg, i) => (
                <div className={styles.message} key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className={styles.msgMeta}>{msg.username}</span>
                        <span className={styles.msgMeta}>
                            {formatDateFromTimestamp(msg.__createdtime__)}
                        </span>
                    </div>
                    <p className={styles.msgText}>{msg.message}</p>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default Messages;