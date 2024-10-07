import { createContext, useEffect, useState } from 'react'
export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartLists, setCartLists] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    return (
        <CartContext.Provider value={{ cartLists, setCartLists, totalCount, setTotalCount }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider
