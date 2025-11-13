import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import '../Indre.css';

function Home(){
    const navigate = useNavigate();
    const [topCars, setTopCars] = useState([]);
    useEffect(() => {
        const fetchTopCars = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/Autonamai/automobiliai/top");
                const data = await response.json();
                const top3 = Array.isArray(data) ? data.slice(0, 3) : data;
                setTopCars(top3);
                console.log("Fetched top cars (trimmed to 3):", top3);
            } catch (error) {
                console.error("Error fetching top cars:", error);
            }
        };
        fetchTopCars();
    }, []);

    const handleCarClick = (id) => {
        navigate(`/automobiliai/${id}`);
        console.log('Car clicked:', id);
    }
    return (
        <div className="home-page">
            
            <div className="home-content">
                <h1>AutoNamai</h1>
                <p>Tavo automobilio pirmieji namai</p>
                <img src="/2025-G-SUV-HERO-DR.webp" alt="MainImage" className="main-image" />
            </div>
            <div className="favoriteSection">
                <h2>Mėgstamiausi automobiliai</h2>
                <div className="favoriteCars">
                {topCars.length === 0 ? (
                    <p>Kraunama...</p>
                ) : (
                    topCars.map((car) => (
                    <div key={car._id} className="car-card" onClick={() => handleCarClick(car._id)}>
                        <img src={car.photo} alt={car.model} />
                        <h3>{car.model}</h3>
                        <p className="car-year">Metai: {car.year}</p>
                        <p className="car-fuel">Kuro tipas: {car.fuelType}</p>
                        <p className="car-power">Galia: {car.power} kW</p>
                        <p className="car-gearbox">Pavarų dėžė: {car.gearBox}</p>
                        <p className="car-price" ><strong>Kaina: €{car.price} </strong></p>
                        
                    </div>
                    ))
                )}


                </div>
                <button className="view-more-button" onClick={()=> navigate('/automobiliai')}>Visi automobiliai</button>
                <div className="about-us">
                    <h2>Apie mus</h2>
                    <p>AutoNamai yra oficialus Mercedes-Benz importuotojas Baltijos šalyse. AutoNamai jau ilgą laiką bendradarbiauja su pirmaujančiu pasaulyje automobilių gamintoju Mercedes-Benz - bendradarbiavimas prasidėjo nuo 2005 m. Per kelis dešimtmečius įmonė prisidėjo prie klientų lojalumo didinimo ir geriausių paslaugų teikimo. Lietuvoje AutoNamai Mercedes-Benz salonai yra Vilniuje, Kaune ir Klaipėdoje. AutoNamai taip pat yra oficialus Mercedes-Benz serviso atstovas ir atsarginių dalių importuotojas. </p>
                </div>
            </div>
            
        </div>
    );
}


export default Home;
