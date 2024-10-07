import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import menu from '../assets/image/logo-apple-ar.svg';
import profile from '../assets/image/person-circle-outline.svg';
import ruler from '../assets/image/rule-svgrepo-com.svg';
import dashboard from '../assets/image/bar-chart-outline.svg'
import axios from 'axios';
import product from '../assets/image/cube-outline.svg';
import store from '../assets/image/storefront-outline.svg';
import status from '../assets/image/barcode-outline.svg';
import order from '../assets/image/deliver-svgrepo-com.svg'
import { jwtDecode } from 'jwt-decode';


const Sidebar = ({ actInd }) => {
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem('x-access-token'));
    const [expand, setExpand] = useState(false);
    const [user, setUser] = useState({});
    const navItems1 = [dashboard, ruler, product, order, status, store];
    const navTexts = ['dashboard', 'units', 'product', 'orders', 'status', 'store'];
    const [active, setActive] = useState(0);
    const pages = ['/dashboard', '/unit', '/product', '/order', '/status', '/store'];
    const forSupAdm = [dashboard, ruler, order, store, status];
    const forShpAdm = [dashboard, product, order, status];
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
        checkTokenExists();
        findUser();
        setActive(actInd);
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.username);
                setRole(decoded.role);
                setId(decoded.id);
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, [token]);


    const checkTokenExists = () => {
        console.log('checking token')
        if (!token) {
            navigate('/')
        };
    }
    const findUser = async () => {
        if (username) {
            const data = await axios.get(`https://multishop-ecommerce.onrender.com/api/user/findUser/${username}`);
            setUser(data.data);
        }
    }
    const handleNavItemOnClick = (index) => {
        setActive(index);
        navigate(pages[index], { state: { active: index } });
    }
    return (
        <div className={`relative transition-all z-50 p-1 duration-[200ms] hover: justify-between ${expand ? 'w-[200px] items-start bg-opacity-100' : ' w-[60px] items-center'} flex flex-col bg-gray-200 bg-opacity-70 shadow-lg  h-full`}>

            <div className={`w-full flex`}>
                <div className={`w-full flex items-center px-2 py-2 border-b-[1px] border-slate-400 cursor-pointer relative icn ${expand ? 'hover:bg-black hover:bg-opacity-30 justify-between hover:rounded-md' : 'justify-center'}`} onClick={() => setExpand(!expand)}>
                    <img src={menu} alt="expand" className={` transition-all duration-200 w-7 `} />
                    {
                        expand ?
                            <div className='mr-4 font-medium'>Expand</div> : ""
                    }
                </div>

            </div>
            <div className='w-full'>
                {
                    navItems1.map((item, index) => (
                        (role === 'super admin' ? forSupAdm : forShpAdm).includes(item) &&
                        <div key={index} className={`w-full px-2 py-2 mt-4 flex ${!expand ? 'justify-center' : 'hover:bg-black hover:bg-opacity-30 hover:rounded-md'} ${expand && active === index ? ' bg-black bg-opacity-30 rounded-md' : ''}`} onClick={() => handleNavItemOnClick(index)}>
                            <div className={`transition-all duration-[300ms] cursor-pointer relative icn w-full flex justify-between items-center`}>
                                <img src={item} alt="expand" className={`${active === index && !expand ? 'scale-150 bg-black bg-opacity-30 p-1 rounded-sm ' : ''} transition-all duration-200 w-7 ${!expand ? 'hover:scale-125 ' : ''}`} />
                                <div className={` top-[6px] text-end left-[150%] ${expand ? 'block ' : 'hidden absolute bg-slate-300'} text px-2 font-semibold text-sm`}>{navTexts[index]}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className={` w-full px-2 py-2 border-t-[1px] border-slate-400 flex ${!expand ? 'justify-center' : 'hover:bg-black hover:bg-opacity-30 hover:rounded-md'}`}>
                <div className={`transition-all duration-[300ms] cursor-pointer relative icn w-full flex justify-between items-center`}>
                    <img src={profile} alt="expand" className={`transition-all duration-200 w-8 ${!expand ? 'hover:scale-125' : ''}`} />
                    <div className={` top-[6px] text-end  left-[150%] ${expand ? 'block ' : 'hidden absolute bg-slate-300'} text px-2 font-semibold text-sm`}>profile</div>
                </div>
            </div>

        </div >
    )
}

export default Sidebar
