import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './Gerda.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import axios from "axios";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <App />

);


reportWebVitals();
