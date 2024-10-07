import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';
import Cart from './components/cart'
import ProductDetails from './components/productDetails';
import CartProvider from './components/cartContext';
import Product from './components/product';

function App() {
    const token = JSON.parse(localStorage.getItem('x-access-token'));
    return (
        <BrowserRouter>
            <CartProvider>
                <Routes>
                    <Route path='/home' element={<Home token={token} />} />
                    <Route path='/product' element={<Product token={token} />} />
                    <Route path='/' element={<Login />} />
                    <Route path='/cart' element={<Cart token={token} />} />
                    <Route path='/productDetails' element={<ProductDetails />} />
                </Routes>
            </CartProvider>
        </BrowserRouter>
    );
}

export default App;
