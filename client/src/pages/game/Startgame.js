import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

const Startgame = ({
    socket
}) => {


    const location = useLocation();
    const { username } = location.state || {};

    const [users, setusers] = useState([])
    const [number, setNumber] = useState(null)
    useEffect(() => {
        socket.on('gameUser', (data) => {
            setusers(data)
            console.log(data)
        })

        socket.on('result', (data) => {
            alert(data)
            console.log(data)
        }
        )
    }, [socket])

    return (
        <div>
            <h1>Users of the game</h1>

            {
                users.length === 2 ? (
                    <>
                        <h1> play Now</h1>

                        <div>
                            <h1> {users[0]} vs {users[1]}</h1>
                        </div>

                        <div>
                            <input type="number"
                                onChange={(e) => setNumber(e.target.value)}
                                value={number}
                                placeholder='Guess a number '

                                style={{
                                    width: '100%',
                                    height: '50px',
                                    fontSize: '20px',
                                    textAlign: 'center'
                                }}

                            />

                            <button style={{
                                width: '50%',
                                height: '50px',
                                fontSize: '20px',
                                textAlign: 'center',
                                margin: 'auto',
                                marginTop: '10px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex'
                            }}
                                onClick={() => socket.emit('guess', { number: number, username: username })}
                            >
                                Guess
                            </button>
                        </div>

                    </>
                ) : (
                    <h1>Waiting for the other player.....</h1>
                )
            }

        </div>
    )
}

export default Startgame
