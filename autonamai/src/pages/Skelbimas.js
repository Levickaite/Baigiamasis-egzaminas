import React, { useState, useEffect } from "react";
import axios from "axios";


export default function Skelbimas() {
  const [newCar, setNewCar] = useState({
    model: "",
    price: "",
    color: "",
    engine: "",
    year: "",
    gearBox: "",
    fuelType: "",
    power: "",
  });
  const [images, setImages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  // Patikrinam, ar prisijungęs administratorius
  useEffect(() => {
  const fetchUser = async () => {
    const res = await fetch("/api/Autonamai/useriai"); // your backend endpoint
    const data = await res.json();
    localStorage.setItem("role", data.role);

    if (data.role === "admin") {
      setIsAdmin(true);
    } else {
      alert("Tik administratorius gali kurti naujus skelbimus.");
    }
  };

  fetchUser();
}, []);

  // Duomenų įvedimo valdymas
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
  };

  // Nuotraukų įkėlimas (kelios nuotraukos)
  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  // Skelbimo išsaugojimas
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    Object.entries(newCar).forEach(([key, value]) => {
      formData.append(key, value);
    });

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    // 🔑 Gauti token iš localStorage
    const token = localStorage.getItem("token");
console.log("Token:", token);
    // ✅ Įtraukti Authorization header
    const res = await axios.post(
      "http://localhost:4000/api/Autonamai/automobiliai",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Naujas skelbimas sėkmingai sukurtas!");
    setNewCar({
      model: "",
      price: "",
      color: "",
      engine: "",
      year: "",
      gearBox: "",
      fuelType: "",
      power: "",
    });
    setImages([]);
    console.log("Sukurta:", res.data);
  } catch (error) {
    console.error("Klaida kuriant skelbimą:", error);
    alert("Nepavyko sukurti skelbimo.");
  } finally {
    setLoading(false);
  }
};
  if (!isAdmin) {
    return (
      <>
         <div style={{ padding: "40px", textAlign: "center" }}>
          <h3>Prieiga ribota – tik administratoriai gali kurti skelbimus.</h3>
        </div>
      </>
    );
  }


  return (
    <>
      <div className="new-listing" style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
        <h2>Naujo automobilio skelbimas</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label>
            Modelis:
            <input type="text" name="model" value={newCar.model} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Kaina (€):
            <input type="number" name="price" value={newCar.price} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Spalva:
            <input type="text" name="color" value={newCar.color} onChange={handleChange} />
          </label>
          <br />
          <label>
            Variklio tūris (l):
            <input type="text" name="engine" value={newCar.engine} onChange={handleChange} />
          </label>
          <br />
          <label>
            Metai:
            <input type="text" name="year" value={newCar.year} onChange={handleChange} />
          </label>
          <br />
          <label>
            Pavarų dėžė:
            <input type="text" name="gearBox" value={newCar.gearBox} onChange={handleChange} />
          </label>
          <br />
          <label>
            Kuro tipas:
            <input type="text" name="fuelType" value={newCar.fuelType} onChange={handleChange} />
          </label>
          <br />
          <label>
            Variklio galingumas (kW):
            <input type="text" name="power" value={newCar.power} onChange={handleChange} />
          </label>
          <br />
          <label>
            Nuotraukos:
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          </label>
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Keliama..." : "Sukurti skelbimą"}
          </button>
        </form>
      </div>
    </>
  );
}
