import {Link} from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import {useState} from 'react';
import { useContext } from 'react';

const Navbar = () => {
    const {user} = useAuthContext();
    const {logout} = useLogout();
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = (e) =>{
        logout()
    }
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }
    return 