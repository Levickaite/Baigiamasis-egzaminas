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
  const [error, setError] = useState(null);

  // Patikrinam, ar prisijungęs administratorius
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Turite būti prisijungęs.");
        setIsAdmin(false);
        return;
      }

      const res = await axios.get("http://localhost:4000/api/Autonamai/useriai", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.role === "admin") setIsAdmin(true);
      else {
        setIsAdmin(false);
        setError("Tik administratorius gali kurti naujus skelbimus.");
      }
    } catch (err) {
      setIsAdmin(false);
      setError("Nepavyko patikrinti vartotojo rolės: " + err.message);
    }
  };

  useEffect(() => {
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

      const token = localStorage.getItem("token");

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
      <div style={{ padding: "40px", textAlign: "center" }}>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sukurti naują skelbimą</h2>
      <form onSubmit={handleSubmit}>
        {/* Modelis */}
        <input
          type="text"
          name="model"
          placeholder="Modelis"
          value={newCar.model}
          onChange={handleChange}
          required
        />

        {/* Kaina */}
        <input
          type="number"
          name="price"
          placeholder="Kaina"
          value={newCar.price}
          onChange={handleChange}
          required
        />

        {/* Spalva */}
        <select name="color" value={newCar.color} onChange={handleChange} required>
          <option value="">Pasirinkite spalvą</option>
          <option value="Raudona">Raudona</option>
          <option value="Mėlyna">Mėlyna</option>
          <option value="Juoda">Juoda</option>
          <option value="Balta">Balta</option>
          <option value="Pilka">Pilka</option>
        </select>

        {/* Variklis */}
        <input
          type="text"
          name="engine"
          placeholder="Variklis"
          value={newCar.engine}
          onChange={handleChange}
          required
        />

        {/* Metai */}
        <select name="year" value={newCar.year} onChange={handleChange} required>
          <option value="">Pasirinkite metus</option>
          {Array.from({ length: 30 }, (_, i) => {
            const year = 2025 - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>

        {/* Pavarų dėžė */}
        <select name="gearBox" value={newCar.gearBox} onChange={handleChange} required>
          <option value="">Pasirinkite pavarų dėžę</option>
          <option value="Automatinė">Automatinė</option>
          <option value="Mechaninė">Mechaninė</option>
        </select>

        {/* Kuro tipas */}
        <select name="fuelType" value={newCar.fuelType} onChange={handleChange} required>
          <option value="">Pasirinkite kuro tipą</option>
          <option value="Benzinas">Benzinas</option>
          <option value="Dyzelinas">Dyzelinas</option>
          <option value="Elektromobilis">Elektromobilis</option>
          <option value="Hibridas">Hibridas</option>
        </select>

        {/* Galia */}
        <input
          type="number"
          name="power"
          placeholder="Galia (AG)"
          value={newCar.power}
          onChange={handleChange}
          required
        />

        {/* Nuotraukos */}
        <input type="file" multiple onChange={handleFileChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Kuriama..." : "Sukurti skelbimą"}
        </button>
      </form>
    </div>
  );
}
