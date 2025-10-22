import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


function App() {
  return (
    <div className="App">
      <AuthContextProvider>
      <BrowserRouter>
      <Navbar/>
      <Home/>
      <Footer/>
      </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
