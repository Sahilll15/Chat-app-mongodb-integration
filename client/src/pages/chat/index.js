import styles from './styles.module.css';
import MessagesReceived from './messages';
import SendMessage from './send-message';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Chat = ({ username, room, socket }) => {

    const { roomId, user } = useParams();



    useEffect(() => {
        console.log('chat', roomId)
        console.log('user', user)
    }, [roomId])
    return (
        <div className={styles.chatContainer}>
            <div>
                <MessagesReceived socket={socket} room={roomId} />
                <SendMessage socket={socket} username={user} room={roomId} />
            </div>
        </div>
    );
};

export default Chat;