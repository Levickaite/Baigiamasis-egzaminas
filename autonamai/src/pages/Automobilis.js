import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "*\src\components\Footer.js"
import Header from "*\src\components\Header.js"

export default function Automobilis() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/Autonamai/automobiliai/${id}`);
        setCar(response.data);
      } catch (error) {
        console.error("Klaida gaunant automobilio duomenis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <p style={{ textAlign: "center", padding: 40 }}>Kraunama...</p>
        <Footer />
      </>
    );
  }

  if (!car) {
    return (
      <>
        <Header />
        <p style={{ textAlign: "center", padding: 40 }}>Automobilis nerastas</p>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
        {/* Viršus: nuotrauka + modelis + kaina */}
        <div
          className="car-header"
          style={{
            display: "flex",
            gap: 40,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <img
            src={`https://via.placeholder.com/500x300?text=${car.model}`}
            alt={car.model}
            style={{
              width: "100%",
              maxWidth: 450,
              borderRadius: 12,
              boxShadow: "0 0 8px rgba(0,0,0,0.2)",
            }}
          />
          <div>
            <h2 style={{ marginBottom: 10 }}>{car.model}</h2>
            <p style={{ fontSize: 26, fontWeight: "bold", color: "#b91c1c" }}>${car.price}</p>
            <button
              style={{
                backgroundColor: "#b91c1c",
                color: "white",
                border: "none",
                padding: "10px 24px",
                borderRadius: 8,
                cursor: "pointer",
                marginTop: 10,
              }}
            >
              Į krepšelį
            </button>
          </div>
        </div>

        {/* Specifikacijos */}
        <section className="specs" style={{ marginTop: 50 }}>
          <h3 style={{ marginBottom: 20, fontSize: 20 }}>Specifikacijos</h3>
          <div
            className="specs-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
              lineHeight: 1.8,
            }}
          >
            <div><b>Spalva:</b> {car.color}</div>
            <div><b>Variklio tūris:</b> {car.engine} cm³</div>
            <div><b>Metai:</b> {car.year}</div>
            <div><b>Pavarų dėžė:</b> {car.gearBox}</div>
            <div><b>Kuro tipas:</b> {car.fuelType}</div>
            <div><b>Variklio galingumas:</b> {car.power} AG</div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}