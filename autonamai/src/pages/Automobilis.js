import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../Virgis.css";

export default function Automobilis() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCar, setEditedCar] = useState({});
  const [photo, setPhoto] = useState(null);
  const { user } = useContext(AuthContext);
  // Lightbox state for enlarging the car photo when clicked
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  // close lightbox on Escape key
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  useEffect(() => {
    if (user && user.role === "admin") setIsAdmin(true);
  }, [user]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`https://autonamai.onrender.com/api/Autonamai/automobiliai/${id}`);
        setCar(response.data);
        setEditedCar(response.data);
        console.log("Car data:", response?.data);
        console.log(car);
        // increment traffic counter (best-effort, ignore errors)
        try {
          await fetch(`https://autonamai.onrender.com/api/Autonamai/automobiliai/${id}/visit`, { method: 'PATCH' });
          window.dispatchEvent(new Event('carsUpdated'));
        } catch (e) {
          console.warn('Failed to increment traffic', e);
        }
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
      const response = await axios.patch(
        `https://autonamai.onrender.com/api/Autonamai/automobiliai/${id}`,
        editedCar
      );
      setCar(response.data); 
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
    // prevent adding reserved or sold cars
    if (car?.rezervuotas) {
      alert('Atsiprašome, automobilis šiuo metu rezervuotas.');
      return;
    }
    if (car?.parduotas) {
      alert('Atsiprašome, automobilis jau parduotas.');
      return;
    }
    try {
      const response = await fetch("https://autonamai.onrender.com/api/Autonamai/krepselis/add", {
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

  const handleDelete = async () => {
    if (!window.confirm("Ar tikrai norite ištrinti šį automobilį?")) return;
    try {
      const response = await axios.delete(`https://autonamai.onrender.com/api/Autonamai/automobiliai/${id}`);
      if (response.status === 200) {
        alert("Automobilis sėkmingai ištrintas.");
        window.location.href = "/automobiliai";
      } else {
        alert("Nepavyko ištrinti automobilio.");
      }
    } catch (error) {
      console.error("Klaida trinant automobilį:", error);
      alert("Klaida trinant automobilį.");
    }
  };

  if (loading) return <p>Kraunama...</p>;
  if (!car || !car.model) return <p>Automobilis nerastas.</p>;

  // compute badge state (map uzsakymoStatusas too)
  const statusStr = (car.uzsakymoStatusas || '').toString().toLowerCase();
  const isSold = car.parduotas === true || statusStr.includes('įvykd');
  const isReserved = !isSold && (car.rezervuotas === true || statusStr.includes('patvirt'));

  return (
    <div className="automobilis-page">

      <h2>Automobilio informacija</h2>

      {editMode ? (
        <div>
          <img
            src={car.photo}
            alt={car.model}
            className="car-photo"
            onClick={() => {
              setLightboxPhoto(car.photo);
              setLightboxOpen(true);
            }}
          />
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
          <button className="btn-primary" onClick={handleSave}>Išsaugoti</button>
          <button className="btn-secondary" onClick={() => setEditMode(false)}>Atšaukti</button>
        </div>
      ) : (
        <div className="car-card" style={{ position: 'relative' }}>
          <div className="car-detail">
            <div className="car-left">
              <img
                src={car.photo}
                alt={car.model}
                className="car-photo"
                onClick={() => {
                  setLightboxPhoto(car.photo);
                  setLightboxOpen(true);
                }}
              />
            </div>

            <div className="car-center">
              <h3 className="car-title">{car.model}</h3>

              <div className="car-specs">
                <div className="spec-line">
                  <div className="spec">
                    <div className="spec-label">Kaina</div>
                    <div className="spec-value">{car.price}</div>
                  </div>
                  <div className="spec">
                    <div className="spec-label">Metai</div>
                    <div className="spec-value">{car.year}</div>
                  </div>
                  <div className="spec">
                    <div className="spec-label">Kuro tipas</div>
                    <div className="spec-value">{car.fuelType}</div>
                  </div>
                  <div className="spec">
                    <div className="spec-label">Spalva</div>
                    <div className="spec-value">{car.color}</div>
                  </div>
                </div>
                <div className="spec-line">
                  <div className="spec">
                    <div className="spec-label">Pavarų dėžė</div>
                    <div className="spec-value">{car.gearBox}</div>
                  </div>
                  <div className="spec">
                    <div className="spec-label">Variklio tūris</div>
                    <div className="spec-value">{car.engine}</div>
                  </div>
                  <div className="spec">
                    <div className="spec-label">Galia</div>
                    <div className="spec-value">{car.power}</div>
                  </div>
                </div>
              </div>

              
            </div>
            <div className="car-actions">
              {user && (
                <button
                  onClick={() => addToCart(id)}
                  className="btn-primary"
                  disabled={isSold || isReserved}
                  style={isSold || isReserved ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                >
                  {isSold ? 'PARDUOTA' : isReserved ? 'REZERVUOTA' : 'Įdėti į krepšelį'}
                </button>
              )}
              {isAdmin && (
                <>
                  <button onClick={() => setEditMode(true)} className="btn-secondary">Redaguoti</button>
                  <button onClick={handleDelete} className="btn-secondary" >Ištrinti</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}


      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>×</button>
            <img src={lightboxPhoto} alt={car.model} />
          </div>
        </div>
      )}

    </div>
  );
}
