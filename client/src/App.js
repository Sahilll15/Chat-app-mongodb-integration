import './App.css';
import { useState } from 'react';
import Home from './pages/home';
import Chat from './pages/chat';
import Game from './pages/game';
import Startgame from './pages/game/Startgame';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import { useRoomContext } from './context/RoomContext'

const socket = io.connect('http://localhost:4000');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const { currentRoom, setCurrentRoom } = useRoomContext();

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          {/* Add this */}
          <Route
            path='/game'
            element={<Game username={username} room={room} socket={socket} />}
          />
          <Route
            path='/chat/:user/:roomId'
            element={<Chat username={username} room={room} socket={socket} />}
          />

          <Route

            path='/startgame'
            element={<Startgame socket={socket} />}
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;