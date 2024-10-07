import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import sort from '../assets/image/swap-vertical-outline.svg';
import search from '../assets/image/search-circle-outline.svg'
import notFound from '../assets/image/notFoundAnimated.png';
const PaginationProduct = ({ itemsPerPage, items, passDragSrc, drgOverSrc, clrImg }) => {
    const token = JSON.parse(localStorage.getItem('x-access-token'));
    const [currentPage, setCurrentPage] = useState(1);
    const [selectSort, setSelectSort] = useState('Sort By')
    const sortLists = ['By Name A-Z', 'By Name Z-A', 'Price (high - low)', 'Price (low - high)'];
    const [expand, setExpand] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [productlists, setProductlists] = useState([]);
    const [clickIndex, setClickIndex] = useState(null);
    const dragRef = useRef();
    const searchRef = useRef('');

    useEffect(() => {
        setProductlists(items)
    }, [items])
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = productlists.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSelectSort = (item) => {
        setSelectSort(item);
        setExpand(false);
        sortProduct(item);
    }
    const handlePageChange = (index) => {
        setCurrentPage(index);
    }
    const handleDragStart = (index, item) => {
        passDragSrc(null)
        dragRef.current = index;
        setDragging(true);
        setClickIndex(item._id);
    }
    const handleDragEnd = (item) => {
        dragRef.current = null;
        if (drgOverSrc === 'details') {
            passDragSrc(item);
        }
        else setClickIndex(null)
        setDragging(false);

    }
    const handlekeypress = (event) => {
        if (event.key === 'Enter') searchProduct();
    }
    const sortProduct = (way) => {
        let sortedData;
        switch (way) {
            case 'By Name A-Z': {
                sortedData = [...productlists].sort((a, b) => a.productname.localeCompare(b.productname));
                setProductlists(sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                break;
            }
            case 'By Name Z-A': {
                sortedData = [...productlists].sort((a, b) => b.productname.localeCompare(a.productname));
                setProductlists(sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                break;
            }
            case 'Price (high - low)': {
                sortedData = [...productlists].sort((a, b) => b.price - (a.price));
                setProductlists(sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                break;
            }
            case 'Price (low - high)': {
                sortedData = [...productlists].sort((a, b) => a.price - (b.price));
                setProductlists(sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                break;
            }
        }
        setProductlists(sortedData);
        setCurrentPage(1);
    }
    const searchProduct = () => {
        let searchLists = items.filter((product) =>
            product.productname.toLowerCase().includes(searchRef.current.toLowerCase())
        )
        setCurrentPage(1);
        const paginatedResults = searchLists.slice(0, itemsPerPage);
        setProductlists(paginatedResults);

        if (searchRef.current === '') {
            setProductlists(items)
        }
    }
    const handleSearchEnter = (e) => {
        searchRef.current = e.target.value
        searchProduct();
    }
    const handleClick = (drgItm) => {
        passDragSrc(drgItm);
        clrImg(null);
        setClickIndex(drgItm._id);
        console.log(drgItm._id);
    }
    return (

        <div className='w-full h-full'>

            <div className='h-[6%] w-full flex justify-between'>
                {/* sort start */}
                <div className='h-full '>
                    <div className='cursor-pointer w-[200px] bg-white h-full custom-shadow  px-2  rounded-sm flex justify-between items-center' onClick={() => setExpand(!expand)}>
                        <div>{selectSort}</div>
                        <img src={sort} alt="sort" className='w-9 bg-white bg-opacity-50 p-1 px-2 border-l-2 border-opacity-40 border-obsidian' />
                    </div>
                    {
                        expand ?
                            <div className='absolute bg-slate-100 w-[200px] p-2 rounded-b-md bg-opacity-100 shadow-md custom-shadow'>
                                {
                                    sortLists.map((item, index) => (
                                        <div key={index} className={`transition-all w-full duration-[200ms] hover:bg-obsidian hover:bg-opacity-40 hover:px-4 cursor-pointer p-2 ${index !== sortLists.length - 1 ? "border-b-[1px] mb-1" : ""}`} onClick={() => handleSelectSort(item)}>{item}</div>
                                    ))
                                }
                            </div> : ""
                    }
                </div>
                {/* sort end */}
                {/* search start */}
                <div className='h-full w-1/3 flex justify-end  items-center'>
                    <input value={searchRef.current} type="text" placeholder='Search' className='outline-none p-2 w-3/4 bg-transparent border-b-2 border-obsidian border-opacity-30'
                        onChange={(e) => handleSearchEnter(e)}
                        onKeyDown={(e) => handlekeypress(e)}
                    />
                    {/* <div className='mx-2 p-1 rounded-md bg-obsidian bg-opacity-15 cursor-pointer' onClick={() => searchProduct()}>
                        <img src={search} alt="search" className='w-8 ' />
                    </div> */}
                </div>
                {/* search end */}
            </div>
            {/* table start */}
            <div className='w-full h-[7%] bg-obsidian bg-opacity-65 mt-6 rounded-t-md flex text-whitev1 wel-font items-center text-center'>
                <div className='w-[10%]'>No</div>
                <div className='w-[30%] text-start'>Product name</div>
                <div className='w-[20%]'>Stock</div>
                <div className='w-[20%]'>Price</div>
                <div className='w-[20%] text-end me-4'>Size</div>
            </div>
            <div className='w-full h-[75%] bg-whitev1 px-2 py-1 rounded-b-md'>
                {
                    currentItems.map((product, index) => (
                        <div key={product._id} className={`transition-all duration-[200ms] cursor-pointer w-full h-[9%]  mt-1 rounded-sm flex text-whitev1 hover:bg-opacity-80  items-center text-center ${dragging && dragRef.current === index ? 'scale-125 opacity-0 cursor-grabbing justify-center' : ''} ${clickIndex === product._id ? 'bg-obsidian bg-opacity-95' : 'bg-obsidian bg-opacity-55'}
                        active:scale-[0.9]
                        `}
                            draggable
                            onDragStart={() => handleDragStart(index, product)}
                            onDragEnd={() => handleDragEnd(product)}
                            onClick={() => handleClick(product)}

                        >
                            <div className={`w-[10%] sig-font ${dragging && dragRef.current === index ? 'hidden' : ''}`}>{index + 1}</div>
                            <div className={`w-[30%] text-start font-semibold wel-font ${dragging && dragRef.current === index ? 'flex justify-center' : ''}`}>{product.productname}</div>
                            <div className={`w-[20%] sig-font ${dragging && dragRef.current === index ? 'hidden' : ''}`}>{product.initialstock}</div>
                            <div className={`w-[20%] wel-font ${dragging && dragRef.current === index ? 'hidden' : ''}`}>
                                <span className='sig-font'>{product.price ? product.price : ''}_{product.price ? '$' : ''}</span>


                            </div>
                            <div className={`w-[20%] text-end ${dragging && dragRef.current === index ? 'hidden' : ''} mr-2 font-semibold italic wel-font`}>{product.size.length > 1 ? product.size[0] + "..." : product.size}</div>
                        </div>
                    ))
                }
            </div>
            {/* table end */}
            {/* pagination start */}
            <div className='h-[5%] w-full flex justify-end mt-4'>
                <button className='cursor-pointer w-[60px] h-full bg-customBluishPurple text-white' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Prev
                </button>
                {
                    Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={`${index === 0 ? 'ml-1' : ''} ${index === totalPages - 1 ? 'mr-1' : ''} cursor-pointer wel-font transition-all duration-[200ms] w-[50px] ${index + 1 === currentPage ? 'bg-obsidian bg-opacity-50' : ' bg-slate-200'}  h-full rounded-sm hover:bg-obsidian hover:bg-opacity-45`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))
                }
                <button className='cursor-pointer w-[60px] h-full bg-cherry text-white' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
            {/* pagination end */}
        </div >

    )
}

export default PaginationProduct
