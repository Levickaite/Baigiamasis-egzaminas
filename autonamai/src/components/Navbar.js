import {Link} from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import {useState} from 'react';
import { useContext } from 'react';

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
                <img src="/Image20251020205419.png" alt="AutoNamai Logo" />

                <Link to ="/" onClick={() => setIsOpen(false)}>
                    <h1>AutoNamai</h1>
                </Link>

                <nav className={isOpen ? 'open' : ''}>
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
                    <button className="menu-toggle" onClick={toggleMenu}>
                        <span className="hamburger"></span>
                        <span className="hamburger"></span>
                        <span className="hamburger"></span>
                        <span className="hamburger"></span>
                        

                    </button>
                </nav>

            </div>
        </header>
    )
}
export default Navbar;

