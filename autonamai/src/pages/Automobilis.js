import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";


export default function Automobilis() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCar, setEditedCar] = useState({});
  const [photo, setPhoto] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.role === "admin") setIsAdmin(true);
  }, [user]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/Autonamai/automobiliai/${id}`);
        setCar(response.data);
        setEditedCar(response.data);
        console.log("Car data:", response?.data);
        console.log(car);
        
      } catch (error) {
        console.error("Klaida gaunant duomenis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
    console.log("Fetching car with ID:", id);
    
    
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
 

      const response = await axios.put(
        `http://localhost:4000/api/Autonamai/automobiliai/${id}`,
        editedCar
      );
      setCar(response.data.updatedCar);
      setEditMode(false);
      alert("Automobilio duomenys atnaujinti sėkmingai.");
    } catch (error) {
      console.error("Klaida išsaugant duomenis:", error);
      alert("Nepavyko atnaujinti duomenų.");
    }
  };

  const addToCart = async (automobilisId) => {
    if (!user) {
      alert("Turite būti prisijungęs, kad pridėtumėte į krepšelį.");
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/api/Autonamai/krepselis/add", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ automobilisId, kiekis: 1 }),
      });
      if (response.ok) {
        alert("Automobilis pridėtas į krepšelį!");
      } else {
        alert("Nepavyko pridėti į krepšelį.");
      }
    } catch (error) {
      console.error("Klaida pridedant į krepšelį:", error);
      alert("Klaida pridedant į krepšelį.");
    }
  };

  if (loading) return <p>Kraunama...</p>;
  if (!car) return <p>Automobilis nerastas.</p>;

  return (
    <>

      <h2>Automobilio informacija</h2>

      {editMode ? (
        <div>
          <img src={car.photo} alt={car.model} style={{ width: "200px" }} ></img>
          <label>
            Modelis:
            <input type="text" name="model" value={editedCar.model || ""} onChange={handleChange} />
          </label>
          <br />
          <label>
            Kaina:
            <input type="text" name="price" value={editedCar.price} onChange={handleChange} />
          </label>
          <br />
          <label>
            Spalva:
            <input type="text" name="color" value={editedCar.color} onChange={handleChange} />
          </label>
          <br />
          <label>
            Variklio tūris:
            <input type="text" name="engine" value={editedCar.engine} onChange={handleChange} />
          </label>
          <br />
          <label>
            Metai:
            <input type="text" name="year" value={editedCar.year} onChange={handleChange} />
          </label>
          <br />
          <label>
            Pavarų dėžė:
            <input type="text" name="gearBox" value={editedCar.gearBox} onChange={handleChange} />
          </label>
          <br />
          <label>
            Kuro tipas:
            <input type="text" name="fuelType" value={editedCar.fuelType} onChange={handleChange} />
          </label>
          <br />
          <label>
            Galia:
            <input type="text" name="power" value={editedCar.power} onChange={handleChange} />
          </label>
          <br />
          <button onClick={handleSave}>Išsaugoti</button>
          <button onClick={() => setEditMode(false)}>Atšaukti</button>
        </div>
      ) : (
        <div>
          <img src={car.photo} alt={car.model} style={{ width: "200px" }} ></img>
          <p>Modelis: {car.model}</p>
          <p>Kaina: {car.price}</p>
          <p>Spalva: {car.color}</p>
          <p>Variklio tūris: {car.engine}</p>
          <p>Metai: {car.year}</p>
          <p>Pavarų dėžė: {car.gearBox}</p>
          <p>Kuro tipas: {car.fuelType}</p>
          <p>Galia: {car.power}</p>

          {user && <button onClick={() => addToCart(id)}>Įdėti į krepšelį</button>}
          {isAdmin && <button onClick={() => setEditMode(true)}>Redaguoti</button>}
        </div>
      )}


    </>
  );
}