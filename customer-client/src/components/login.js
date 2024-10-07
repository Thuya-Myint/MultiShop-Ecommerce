import { React, useRef, useState } from 'react'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import Loading from './loading'

const Login = () => {
    const [signIn, setSignIn] = useState(true);
    const [description, setDescription] = useState('New User, ');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const [indRef, setIndRef] = useState(1);
    const navigate = useNavigate();
    const toastforfail = (why) => {
        toast.error(why, {
            position: 'top-center'
        })
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            signIn ? Signin() : Signup();
        }
    }
    const toastforSuccess = (why) => {
        toast.success(why);
    }
    const userAction = () => {
        if (name.trim() === '' || pass.trim() === '') return toastforfail('Invalid Input!');

        signIn ? Signin() : Signup();
    }
    const Signup = async () => {
        setLoading(true);
        try {
            const token = await axios.post('http://localhost:8090/api/customer/new', {
                username: name,
                password: pass,
                imgSrc: 'default'
            })
            localStorage.setItem('x-access-token', JSON.stringify(token.data))
            localStorage.setItem('username', name)
            toastforSuccess(`Excited you're Here!`);
            setTimeout(() => {
                setLoading(false);
            }, 2000)
            navigate('/home')
        } catch (error) {
            console.error(error);
            toastforfail(error.response.data.message)
        }
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }
    const Signin = async () => {
        setLoading(true);
        try {
            const token = await axios.post('http://localhost:8090/api/customer/old', {
                username: name,
                password: pass,
            })
            localStorage.setItem('x-access-token', JSON.stringify(token.data))
            localStorage.setItem('username', name)
            toastforSuccess('User Authorized!');
            setTimeout(() => {
                setLoading(false);
            }, 2000)
            navigate('/home');
        } catch (error) {
            console.log(error.response.data.message);
            toastforfail(error.response.data.message)
        }
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }
    const toggleMethod = () => {
        setSignIn(!signIn);
        signIn ? setDescription('New User, ') : setDescription('Old User, ')
    }
    const divClick = (index) => {
        setIndRef(index)
    }
    return (
        <div className='w-[100vw] h-[100vh] bg-img1 flex justify-center items-center '>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className='w-full h-screen bg-obsidian absolute bg-opacity-40'></div>


            {
                loading ?
                    <Loading isLoad={loading} value={'Authorizing User! . . .'} />
                    : <div className='xl:w-1/3 xl:h-2/5 sm:h-[50%] sm:w-[95%] bg-obsidian rounded-md bg-glass-morph1 bg-opacity-0 text-whitev1'>
                        <div className='bg-whitev1 bg-opacity-45 mb-2 text-black text-center text-lg wel-font font-semibold p-2 rounded-md'>{signIn ? 'sign in' : 'sign up'}</div>
                        <div className='w-full flex flex-col items-center mt-4'>
                            <div className='w-2/3 mb-1'>username</div>
                            <input value={name} type="text" className={` transition-all text-black duration-[100ms] w-2/3 bg-transparent bg-white ${indRef === 1 ? "bg-opacity-60" : "bg-opacity-20"}  outline-none p-2 rounded-sm`} onChange={(e) => setName(e.target.value)} onClick={() => divClick(1)} autoFocus />
                        </div>
                        <div className='w-full flex flex-col items-center mt-4' >
                            <div className='w-2/3 mb-1'>password</div>
                            <input value={pass} type="password" className={` transition-all duration-[100ms] w-2/3 bg-transparent bg-white text-black ${indRef === 2 ? "bg-opacity-60" : "bg-opacity-20"}  outline-none p-2 rounded-sm`} onChange={(e) => setPass(e.target.value)} onClick={() => divClick(2)} onKeyDown={(e) => handleKeyPress(e)} />
                        </div>
                        <div className='text-center mt-2 cursor-pointer hover:underline' onClick={toggleMethod}>{description}{signIn ? 'Sign Up' : 'Sing In'}</div>
                        <div className='transition-all duration-[200ms] w-full flex justify-center mt-4'><button className='bg-white text-obsidian py-2 px-4 rounded-sm active:scale-[0.9] active:shadow-md active:shadow-obsidian' onClick={userAction}>{signIn ? 'sign in' : 'sign up'}</button></div>
                    </div>
            }
        </div>
    )
}

export default Login
