import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer"
import Header from "../components/Navbar"

export default function Automobilis() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCar, setEditedCar] = useState({});

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole === "admin") setIsAdmin(true);
  }, []);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/Autonamai/automobiliai/${id}`);
        setCar(response.data);
        setEditedCar(response.data);
      } catch (error) {
        console.error("Klaida gaunant duomenis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
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

  return (
    <>
      <Header />

      <h2>Automobilio informacija</h2>

      {editMode ? (
        <div>
          <label>
            Modelis:
            <input type="text" name="model" value={editedCar.model} onChange={handleChange} />
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
          <p>Modelis: {car.model}</p>
          <p>Kaina: {car.price}</p>
          <p>Spalva: {car.color}</p>
          <p>Variklio tūris: {car.engine}</p>
          <p>Metai: {car.year}</p>
          <p>Pavarų dėžė: {car.gearBox}</p>
          <p>Kuro tipas: {car.fuelType}</p>
          <p>Galia: {car.power}</p>

          {isAdmin && <button onClick={() => setEditMode(true)}>Redaguoti</button>}
        </div>
      )}

      <Footer />
    </>
  );
}