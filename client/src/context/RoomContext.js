import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
    const [rooms, setRoom] = useState('');
    const [currentRoom, setCurrentRoom] = useState('')


    const fetchRooms = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/room/`);

            if (response.status === 200) {
                setRoom(response.data.rooms)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const createRooms = async (roomName) => {
        try {
            await axios.post('http://localhost:4000/api/room/create', roomName).then((res) => {
                console.log(res)
            }).catch((error) => {
                console.log(error)

            })
        } catch (error) {
            console.log(error)
        }
    }

    // const token = localStorage.getItem('token');

    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGVmODFiOGZhZmNlNjA4NzViMmY0ZiIsImVtYWlsIjoic2FoaWxAMTIzIiwiaWF0IjoxNzAzODY4NDYxLCJleHAiOjE3MDM5NTQ4NjF9.HpNbak7sDVJvs7OJiIFUONgjGl6CV-eI3HjypgDTYz0`;

    // const joinRoom = async (roomId) => {
    //     try {
    //         const response = await axios.post(
    //             `http://localhost:4000/api/room/join/${roomId}`,
    //             {},
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );

    //         if (response.status === 200) {
    //             alert(response.data.message);
    //         }


    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const joinRoom = async (roomId) => {
        console.log(roomId);
    };

    useEffect(() => {
        fetchRooms()
    }, [])

    console.log(rooms)

    return (
        <RoomContext.Provider value={{ rooms, setRoom, fetchRooms, createRooms, joinRoom, currentRoom, setCurrentRoom }}>
            {children}
        </RoomContext.Provider>
    );
};


const useRoomContext = () => {
    return useContext(RoomContext)
}

export { RoomProvider, useRoomContext };