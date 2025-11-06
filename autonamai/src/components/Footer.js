import {Link} from 'react-router-dom';
import React from 'react';
import '../Indre.css';

const Footer = () => {
    return (
        <footer className='footer'>
            <div className="footer-content">
                <div className="footer-links">
                <div className="footer-logo">
                    <img src="/Image20251020205419.png" alt="AutoNamai Logo" />
                    
                </div>
                    <div className="footer-column">
                        <h3>Navigacija</h3>
                        <Link to="/">Pagrindinis</Link>
                        <Link to="/automobiliai">Automobiliai</Link>
                        <Link to="/mano-uzsakymai">Mano užsakymai</Link>
                        <Link to="/krepselis">Krepšelis</Link>
                    </div>
                    <div className="footer-column">
                        <h3>Kontaktai</h3>
                        <p> UAB "AutoNamai</p>
                        <p>El. paštas: info@autonamai.lt</p>
                        <p>Telefonas: +370 600 00000</p>
                        <p>Gedimino pr. 53, Vilnius</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} AutoNamai. Visos teisės saugomos.</p>
                </div>
            </div>
        </footer>
    );
}
                    

export default Footer;