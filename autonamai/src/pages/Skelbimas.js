import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Skelbimas() {
  const { user } = useContext(AuthContext);

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
  const [fileLabel, setFileLabel] = useState("Nepasirinktas joks failas");
  const [loading, setLoading] = useState(false);

  // Inputų valdymas
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
  };

  // Failų įkėlimas
  const handleFileChange = (e) => {
    const files = e.target.files;
    setImages(files);

    if (!files || files.length === 0) {
      setFileLabel("Nepasirinktas joks failas");
      return;
    }
    setFileLabel(files.length === 1 ? files[0].name : `${files.length} failai pasirinkti`);
  };

  // Submit funkcija
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(newCar).forEach(([key, value]) => formData.append(key, value));

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/Autonamai/automobiliai`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Naujas skelbimas sėkmingai sukurtas!");
      
      // Išvalome formą
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
      setFileLabel("Nepasirinktas joks failas");

      console.log("Sukurta:", res.data);
    } catch (error) {
      console.error("Klaida kuriant skelbimą:", error);
      alert("Nepavyko sukurti skelbimo.");
    } finally {
      setLoading(false);
    }
  };

  // Jei user nėra adminas, nerodome formos
  if (!user || user.role === "user") {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Neturite teisės kurti skelbimo.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="skelbimas-title">Sukurti naują skelbimą</h2>
      <form className="skelbimas-form" onSubmit={handleSubmit}>
        {/* Modelis */}
        <input
          className="model-field"
          type="text"
          name="model"
          placeholder="Modelis"
          value={newCar.model}
          onChange={handleChange}
          required
        />

        {/* Kaina */}
        <input
          className="price-field"
          type="number"
          name="price"
          placeholder="Kaina"
          value={newCar.price}
          onChange={handleChange}
          required
        />

        {/* Spalva */}
        <select
          className="color-field"
          name="color"
          value={newCar.color}
          onChange={handleChange}
          required
        >
          <option value="">Pasirinkite spalvą</option>
          <option value="Raudona">Raudona</option>
          <option value="Mėlyna">Mėlyna</option>
          <option value="Juoda">Juoda</option>
          <option value="Balta">Balta</option>
          <option value="Pilka">Pilka</option>
        </select>

        {/* Variklis */}
        <input
          className="engine-field"
          type="text"
          name="engine"
          placeholder="Variklis"
          value={newCar.engine}
          onChange={handleChange}
          required
        />

        {/* Metai */}
        <select
          className="year-field"
          name="year"
          value={newCar.year}
          onChange={handleChange}
          required
        >
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
        <select
          className="gearbox-field"
          name="gearBox"
          value={newCar.gearBox}
          onChange={handleChange}
          required
        >
          <option value="">Pasirinkite pavarų dėžę</option>
          <option value="Automatinė">Automatinė</option>
          <option value="Mechaninė">Mechaninė</option>
        </select>

        {/* Kuro tipas */}
        <select
          className="fuel-field"
          name="fuelType"
          value={newCar.fuelType}
          onChange={handleChange}
          required
        >
          <option value="">Pasirinkite kuro tipą</option>
          <option value="Benzinas">Benzinas</option>
          <option value="Dyzelinas">Dyzelinas</option>
          <option value="Elektromobilis">Elektromobilis</option>
          <option value="Hibridas">Hibridas</option>
        </select>

        {/* Galia */}
        <input
          className="power-field"
          type="number"
          name="power"
          placeholder="Galia (AG)"
          value={newCar.power}
          onChange={handleChange}
          required
        />

        {/* Nuotraukos */}
        <label className="file-input">
          <span className="file-btn">Įkelti nuotrauką</span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            data-testid="file-input"
          />
          <span className="file-name">{fileLabel}</span>
        </label>

        {/* Submit mygtukas */}
        <button className="btn-primary" type="submit">
          {loading ? "Kuriama..." : "Sukurti skelbimą"}
        </button>
      </form>
    </div>
  );
}
