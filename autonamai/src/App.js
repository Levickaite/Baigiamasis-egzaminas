import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Skelbimai from './pages/Automobiliai';
import Skelbimas from './pages/Skelbimas';
import Uzsakymai from './pages/ManoUzsakymai';
import Krepselis from './pages/Krepselis';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Automobilis from './pages/Automobilis';
import Kontaktai from './pages/Kontaktai';

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
                  path="/automobiliai"
                  element={
                    <>
                      <Skelbimai /> <Skelbimas />

                    </>
                  }
                />
            {/* jei turėsi dar puslapį su konkretaus automobilio informacija */}
            <Route path="/automobiliai/:id" element={<><Automobilis/> </>} />
            <Route path="/mano-uzsakymai" element={<Uzsakymai />} />
            <Route path="/krepselis" element={<Krepselis />} />
            <Route path="/kontaktai" element={<Kontaktai />} />
            <Route path="/Prisijungti" element={<Login />} />
            <Route path="/Registruotis" element={<Signup />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;