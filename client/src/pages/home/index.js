import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import { useRoomContext } from '../../context/RoomContext';

const Home = ({
    username,
    setUsername,
    room,
    setRoom,
    socket
}) => {
    const [newRoom, setNewRoom] = useState('')
    const { rooms, fetchRooms, createRooms, joinRoom } = useRoomContext();
    useEffect(() => {
        console.log('rooms from home', rooms)
        fetchRooms()
    }, [])
    const [isModal, OpenModel] = useState(false);
    const navigate = useNavigate();
    const joinRooms = async () => {

        if (room !== '' && username !== '') {
            socket.emit('join_room', { username, room });
        }
        await joinRoom(room);

        navigate(`/chat/${username}/${room}`, { replace: true });
    }
    useEffect(() => {
        socket.on('receive_message', (data) => {
            console.log(data)
        })
    }, [socket])

    const createRoom = () => {
        OpenModel(true)
    }

    const closeModal = () => {
        OpenModel(false)
    }


    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 style={{ color: 'blue' }}>{`<>DevRooms</>`}</h1>
                {
                    isModal ? (
                        <>
                            <input
                                className={styles.input}
                                placeholder='Room Name...'
                                onChange={(e) => setNewRoom(e.target.value)} // Add this
                            />
                            <button
                                className='btn btn-secondary'
                                style={{ width: '100%', backgroundColor: 'green', color: 'white' }}
                                onClick={async () => {
                                    await createRooms({ roomName: newRoom })

                                    await fetchRooms();
                                    closeModal()
                                }}
                            >
                                Create Room
                            </button></>
                    ) :
                        <>
                            <input
                                className={styles.input}
                                placeholder='Username...'
                                onChange={(e) => setUsername(e.target.value)} // Add this
                            />

                            <select
                                className={styles.input}
                                onChange={(e) => setRoom(e.target.value)} // Add this
                            >
                                <option value=''>Select Room</option>
                                {Array.isArray(rooms) &&
                                    rooms?.map((room) => (
                                        <option value={room._id}>{room.roomName}</option>
                                    ))
                                }
                            </select>
                        </>

                }

                {
                    isModal ? (
                        <button
                            className='btn btn-secondary'
                            style={{ width: '100%', backgroundColor: 'red', color: 'white' }}
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    ) : <div style={{ display: 'flex', gap: '2px' }}>
                        <button
                            className='btn btn-secondary'
                            style={{ width: '100%', backgroundColor: 'green', color: 'white' }}
                            onClick={joinRooms}
                        >
                            Join Room
                        </button>
                        <button
                            className='btn btn-secondary'
                            style={{ width: '100%', backgroundColor: 'orange', color: 'white' }}
                            onClick={() => {
                                OpenModel(true)
                            }}
                        >
                            Create Room
                        </button>
                    </div>
                }



            </div>

        </div>
    );
};

export default Home; 
