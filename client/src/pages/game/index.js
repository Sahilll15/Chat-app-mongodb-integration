import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Game = ({

    socket
}) => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');

    const joinGame = () => {
        socket.emit('joinGame', { username });
        navigate('/startgame', {
            replace: true,
            state: { username: username }
        });
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '50%',
            height: '50%',
            border: '1px solid black',
            margin: 'auto',

        }}>
            <h1>{`<>DevRooms</>`}</h1>
            <input
                style={{
                    width: '100%',
                    height: '50px',
                    fontSize: '20px',
                    textAlign: 'center'
                }}
                placeholder='Username...'
                onChange={(e) => setUsername(e.target.value)}
            >
            </input>
            <h1 onClick={joinGame}>Join game</h1>
        </div>
    )
}

export default Game
