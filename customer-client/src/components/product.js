import React, { useState, useEffect, useContext } from 'react'
import NavBar from './navbar'
import { FaSortAmountDown, FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import { ImSortNumbericDesc, ImSortNumericAsc } from "react-icons/im";
import axios from 'axios';
import Loading from './loading';
import { useNavigate, useLocation } from 'react-router-dom';
import CartProvider, { CartContext } from './cartContext';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
const Product = () => {
    const token = JSON.parse(localStorage.getItem('x-access-token'));
    const [sort, setSort] = useState('Sort Product');
    const active = 1;
    const [loading, setLoading] = useState(false);
    const [expand, setExpand] = useState(false);
    const [icon, setIcon] = useState(<FaSortAmountDown />);
    const [productLists, setProductLists] = useState([]);
    const sortLists = ['a-z by name', 'z-a by name', 'low-high by price', 'high-low by price'];
    const sortIcons = [<FaSortAlphaDown />, <FaSortAlphaDownAlt />, <ImSortNumericAsc />, <ImSortNumbericDesc />];
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [product, setProduct] = useState();
    const { cartLists, totalCount, setTotalCount } = useContext(CartContext);
    const location = useLocation();
    const { shopLists, shopId } = location.state || {};
    const [sLists, setsLists] = useState(shopLists);
    const [sid, setSid] = useState(shopId);
    const [sshopLists, setSShopLists] = useState([]);
    let totalItems = productLists.length;
    let itemsPerPage = 8
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    let currentItems = productLists.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    useEffect(() => {
        if (!token) navigate('/')
        fetchProducts(500);
        fetchAllShop();
    }, [shopLists]);

    useEffect(() => {
        setTotalCount(cartLists.reduce((acc, cartItem) => acc + cartItem.count, 0))
    }, [cartLists])

    const fetchAllShop = async () => {
        try {
            const allShop = await axios.get('http://localhost:8090/api/user/all', {
                headers: {
                    'x-access-token': token
                }
            })

            const shopData = allShop?.data?.map((item) => ({
                shopId: item.id,
                shopName: item.shopName,
                shopLogo: item.shopLogo,
            }))
            setSShopLists(shopData)

        } catch (error) {
            console.log(error);
        }
    }
    const fetchProducts = async (tv) => {
        setLoading(true);
        try {
            const products = await axios.get('http://localhost:8090/api/product/all')
            let allProducts = Object.values(products.data);
            if (sid) {
                allProducts = allProducts.filter(product => product.shopId === sid)
                setProductLists(allProducts)
            } else {
                setProductLists(allProducts);
            }
            totalItems = productLists.length;
            totalPages = Math.ceil(totalItems / itemsPerPage);
            currentItems = productLists.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



        } catch (error) {
            console.log(error);
        }
        setTimeout(() => {
            setLoading(false);
        }, tv)
    }
    const showSort = () => {
        setExpand(!expand);
    }
    const setSortItem = (i) => {
        setSort(sortLists[i]);
        setIcon(sortIcons[i]);
        setExpand(!expand);
        sortProduct(i);
    }
    const handlePageChange = (index) => {
        setCurrentPage(index);
    }
    const sortProduct = (way) => {
        let sortedData;
        switch (way) {
            case 0: {
                sortedData = [...productLists].sort((a, b) => a.productname.localeCompare(b.productname));
                setProductLists(sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                break;
            }
            case 1: {
                sortedData = [...productLists].sort((a, b) => b.productname.localeCompare(a.productname));
                setProductLists(sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                break;
            }
            case 2: {
                sortedData = [...productLists].sort((a, b) => a.price - (b.price));
                setProductLists(sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                break;
            }
            case 3: {
                sortedData = [...productLists].sort((a, b) => b.price - (a.price));
                setProductLists(sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                break;
            }
        }
        setProductLists(sortedData);
        setCurrentPage(1);
    }
    const storeProduct = (stored) => {
        setProduct(stored);
        navigate('/productDetails', { state: { stored, sLists, sid, sshopLists, shopId } })
    }
    return (
        loading ?
            <Loading isLoad={loading} value={'fetching Data . . .'} />
            :

            <CartProvider>

                {/* {
                    currentItems.length > 0 ? */}
                <div className='w-[100vw] h-[100vh] pb-10 rela'>
                    <div className='h-[10vh] w-full'>
                        <div className='fixed w-full h-[60px] z-50'>
                            <NavBar scroll={true} actInd={active} prpTotal={totalCount} />
                        </div>
                    </div>
                    {
                        currentItems.length > 0 ?
                            <>
                                <div className='w-full h-[8%] flex justify-between items-center px-2'>
                                    <div className='relative'>
                                        <div className='w-[190px] border-obsidian border-2 px-4 py-2 flex items-center justify-between rounded-sm' onClick={showSort}>
                                            {sort}
                                            {icon}
                                        </div>
                                        <div className='absolute px-2 bg-whitev1 w-full rounded-md mt-1 z-40'>
                                            {
                                                expand ?
                                                    sortLists.map((sort, index) => (
                                                        <div key={index} className={`transition-all duration-[300ms] flex  items-center justify-between py-2 ${index !== sortLists.length - 1 ? 'border-b-[1px] border-obsidian' : ''} cursor-pointer hover:bg-obsidian hover:bg-opacity-25 hover:px-2 active:transition-none active:bg-obsidian active:text-white`}
                                                            onClick={() => setSortItem(index)}
                                                        >{sort}{sortIcons[index]}</div>
                                                    )) : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-wrap w-full p-4 justify-center'>
                                    {
                                        currentItems?.map((product, index) => (
                                            (product.initialstock !== 0 && product.shopId === sid) || !sid ?
                                                < div key={index} className={`sm:w-[85%] xl:w-[20.5%] h-[360px] card-main transition-all mb-4 duration-[200ms] active:scale-[0.95] active:opacity-85 rounded-md flex cursor-pointer flex-col bg-whitev1 p-1 items-center hover:bg-obsidian ${(index + 1) % 4 == 0 ? "" : "mr-2"} relative`}
                                                    onClick={() => storeProduct(product)}
                                                >
                                                    <div className='w-[80%] h-[60%] flex items-center justify-center'>
                                                        <img src={product.imgSrcs} alt="" className='w-full h-full rounded-t-sm' />
                                                    </div>
                                                    <div className='w-full h-[40%] bg-obsidian p-2 text-whitev1 bg-opacity-55'>
                                                        <div className='flex justify-around pb-2'>
                                                            <div className='w-1/3 text-start'>Product</div>
                                                            <div className='w-2/3 text-end'>{product.productname.length > 10 ? product.productname.slice(0, 10) + '...' : product.productname}</div>
                                                        </div>
                                                        <div className='flex justify-around pb-2'>
                                                            <div className='w-1/3 text-start'>description</div>
                                                            <div className='w-2/3 text-end'>{product.description.length > 18 ? product.description.slice(0, 18) + "..." : product.description}</div>
                                                        </div>
                                                        <div className='flex justify-around pb-2'>
                                                            <div className='w-1/3 text-start'>Price</div>
                                                            <div className='w-2/3 text-end'>{product.price}MMK</div>
                                                        </div>
                                                        <div className='flex justify-around pb-2'>
                                                            <div className='w-1/3 text-start'>Net weight</div>
                                                            <div className='w-2/3 text-end'>{product.size[0]}</div>
                                                        </div>
                                                        <div className='flex justify-center absolute top-[2.5%] bg-obsidian rounded-full p-1 bg-opacity-40'>
                                                            {
                                                                sshopLists?.map((shop) => (
                                                                    shop.shopId === product.shopId &&
                                                                    <img src={shop.shopLogo} alt="" className='w-[50px] h-[50px] rounded-full' />
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='transition-all opacity-0 top-[48%] duration-[500ms] absolute bg-whitev1 bg-opacity-70 py-1 px-2 rounded-full text-obsidian wel-font hover:bg-opacity-100 active:scale-[1.1] see-details'
                                                        onClick={() => storeProduct(product)}
                                                    >See details</div>
                                                </div> : ''
                                        ))
                                    }
                                </div>
                                <div className='w-full h-[10%] flex justify-end p-4'>
                                    <button className='cursor-pointer w-[40px] h-full flex items-center justify-center bg-customBluishPurple text-white text-[1.1rem]' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                        <IoIosArrowBack className='opacity-60' />
                                        <IoIosArrowBack />
                                    </button>
                                    {
                                        Array.from({ length: totalPages }, (_, index) => (
                                            <button
                                                key={index}
                                                className={`${index === 0 ? 'ml-1' : ''} ${index === totalPages - 1 ? 'mr-1' : 'mr-1'}  cursor-pointer wel-font transition-all duration-[200ms] xl:w-[30px] w-[40px] xl:h-[40px] ${index + 1 === currentPage ? 'bg-obsidian bg-opacity-50' : ' bg-slate-200'}  h-full rounded-sm hover:bg-obsidian hover:bg-opacity-45`}
                                                onClick={() => setCurrentPage(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        ))
                                    }
                                    <button className='cursor-pointer w-[40px] flex items-center justify-center  h-full bg-cherry text-white' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                        <IoIosArrowForward />
                                        <IoIosArrowForward className='opacity-60' />
                                    </button>
                                </div>
                            </> :
                            <div className='w-full h-[50vh] text-[1.5rem] font-light italic flex items-center justify-center'>
                                No Products for this shop!
                            </div>
                    }

                </div >


            </CartProvider>

    )
}

export default Product
