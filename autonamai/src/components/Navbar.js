import {Link} from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import {useState} from 'react';
import React from 'react';
import '../Indre.css';


const Navbar = () => {
    const {user} = useAuthContext();
    const {logout} = useLogout();
    const [isOpen, setIsOpen] = useState(false);
    const handleLogout = () =>{
        logout()
        setIsOpen(false);
    }
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }
    return (
        <header>
            <div className="navigation">
                <div className="logo">

                <Link to ="/" onClick={() => setIsOpen(false)}>
                <img src="/Image20251020205419.png" alt="AutoNamai Logo" />

                </Link>
                </div>
                <button className="menu-toggle" onClick={toggleMenu}>
                    <span className="hamburger"></span>
                    <span className="hamburger"></span>
                    <span className="hamburger"></span>
                    <span className="hamburger"></span>


                </button>
                <nav className={isOpen ? 'active' : ''}>
                    {user && (
                        <div>
                            <Link to="/" onClick={() => setIsOpen(false)}>Pagrindinis</Link>
                            <Link to="/automobiliai" onClick={() => setIsOpen(false)}>Automobiliai</Link>
                            <Link to="/mano-uzsakymai" onClick={() => setIsOpen(false)}>Mano užsakymai</Link>
                            <Link to="/krepselis" onClick={() => setIsOpen(false)}>Krepšelis</Link>
                            <Link to="/kontaktai" onClick={() => setIsOpen(false)}>Kontaktai</Link>
                            <span className="user-email">{user.email}</span>
                            <button onClick={handleLogout}>Atsijungti</button>
                        </div>

                    )}
                    {!user && (
                        <div>
                            <Link to="/" onClick={() => setIsOpen(false)}>Pagrindinis</Link>
                            <Link to="/automobiliai" onClick={() => setIsOpen(false)}>Automobiliai</Link>
                            <Link to="/mano-uzsakymai" onClick={() => setIsOpen(false)}>Mano užsakymai</Link>
                            <Link to="/krepselis" onClick={() => setIsOpen(false)}>Krepšelis</Link>
                            <Link to="/kontaktai" onClick={() => setIsOpen(false)}>Kontaktai</Link>
                            <Link to="/prisijungti" onClick={() => setIsOpen(false)}>Prisijungti</Link>
                            <Link to="/registruotis" onClick={() => setIsOpen(false)}>Registruotis</Link>
                        </div>
                    )}
                </nav>

            </div>
        </header>
    )
}
export default Navbar;

