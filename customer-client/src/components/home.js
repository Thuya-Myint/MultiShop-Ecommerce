import React, { useEffect, useState, useContext } from 'react'
import NavBar from './navbar'
import { useNavigate } from 'react-router-dom';
import CartProvider, { CartContext } from './cartContext';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem('x-access-token'));
    const [isScrolled, setIsScrolled] = useState(false);
    const { totalCount } = useContext(CartContext);
    const [shopLists, setShopLists] = useState([]);
    const active = 0;

    useEffect(() => {
        if (!token) navigate('/')
        fetchAllShop();
        window.addEventListener('scroll', handleScroll);
    }, [token]);
    const handleScroll = () => {
        const position = window.pageYOffset;

        if (position > 100) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };
    const fetchAllShop = async () => {
        try {
            const allShop = await axios.get('https://multishop-ecommerce.onrender.com/api/user/all', {
                headers: {
                    'x-access-token': token
                }
            })
            const shopData = allShop?.data?.map((item) => ({
                shopId: item.id,
                shopName: item.shopName,
                shopLogo: item.shopLogo,
            }))
            setShopLists(shopData)

        } catch (error) {
            console.log(error);
        }
    }
    const handleProductShop = (shopId) => {
        navigate('/product', { state: { shopLists, shopId } })
    }
    return (
        <CartProvider>
            <div className='w-[100vw] h-[100vh] relative flex flex-col items-center'>
                <div className='h-[50vh] w-full  bg-img2'>
                    <div className='fixed w-full h-[60px] z-50'>
                        <NavBar scroll={isScrolled} actInd={active} prpTotal={totalCount} />
                    </div>
                </div>

                <div className=' w-full p-2 absolute top-[50%] rounded-md overflow-auto gap-2 '>

                    <div className='w-full grid xl:grid-cols-6 sm:grid-cols-2 xl:gap-2 sm:gap-1'>
                        {
                            shopLists?.map((shop, index) => (
                                shop?.shopName?.length > 0 &&
                                <div key={index} className='transition-all duration-[200ms] sm:w-full xl:w-[230px] xl:h-[250px] sm:h-[200px] cursor-pointer bg-obsidian rounded-sm bg-opacity-25 active:scale-[0.95] hover:shadow-md hover:shadow-black' onClick={() => handleProductShop(shop.shopId)}>
                                    <div className='transition-all duration-[200ms] w-full h-[85%] rounded-sm'>
                                        <img src={shop.shopLogo} alt="" className='w-full h-full rounded-t-sm' />
                                    </div>
                                    <div className='sig-font h-[15%] flex items-center rounded-b-sm bg-whitev1 bg-opacity-100 p-2 text-obsidian capitalize text-opacity-75 text-center'>
                                        {shop.shopName}
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </div>

            </div >
        </CartProvider>
    )
}

export default Home
