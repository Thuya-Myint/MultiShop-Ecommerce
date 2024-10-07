import React, { useEffect, useState } from 'react';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Unit from './components/unit';
import Product from './components/product';
import Order from './components/order';
import Status from './components/status';
import Store from './components/store';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function App() {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [id, setId] = useState('');
    const token = JSON.parse(localStorage.getItem('x-access-token'));
    useEffect(() => {

        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.username);
                setRole(decoded.role);
                setId(decoded.id);
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('x-access-token');
            }
        }
    }, [token]);
    return (
        <div className="">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Login setid={setId} setusername={setUsername} setrole={setRole} />} />
                    <Route path='/dashboard' element={<Dashboard token={token} id={id} username={username} role={role} />} />
                    <Route path='/unit' element={<Unit token={token} id={id} username={username} role={role} />} />
                    <Route path='/product' element={<Product token={token} id={id} username={username} role={role} />} />
                    <Route path='/order' element={<Order token={token} id={id} username={username} role={role} />} />
                    <Route path='/status' element={<Status token={token} id={id} username={username} role={role} />} />
                    <Route path='/store' element={<Store tokenx={token} id={id} username={username} role={role} />} />
                </Routes>
            </BrowserRouter>
        </div >
    );
}

export default App;
