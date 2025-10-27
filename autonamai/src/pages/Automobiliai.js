import React, { useEffect, useState } from "react";
import Footer from "../components/Footer"
import Header from "../components/Navbar"

function Skelbimai() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sort, setSort] = useState("");
  const [engine, setEngine] = useState(""); 
  const [model, setModel] = useState(""); 
  const [color, setColor] = useState(""); 
  const [gearBox, setGearBox] = useState(""); 
  const [fuelType, setFuelType] = useState(""); 
  const [power, setPower] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);

  const carsPerPage = 6;

  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/Autonamai/automobiliai");
        const data = await res.json();
        setCars(data);
        setFilteredCars(data);
      } catch (err) {
        console.error("Error fetching cars:", err);
      }
    };
    fetchCars();
  }, []);

  // Filtering + sorting + search + transmission
  useEffect(() => {
    let result = [...cars];

    // Filter by price range
    result = result.filter(
      (car) => car.price >= priceRange[0] && car.price <= priceRange[1]
    );

    // Search by model
    if (search.trim()) {
      result = result.filter((car) =>
        car.model.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by model
    if (model) {
      result = result.filter((car) => car.model === model);
    }
    // Filter by color
    if (color) {
      result = result.filter((car) => car.color === color);
    }
    // Filter by engine
    if (engine) {
      result = result.filter((car) => car.engine === engine);
    }
    // Filter by gearBox
    if (gearBox) {
      result = result.filter((car) => car.gearBox === gearBox);
    }
    // Filter by fuelType
    if (fuelType) {
      result = result.filter((car) => car.fuelType === fuelType);
    }
    // Filter by power
    if (power) {
      result = result.filter((car) => car.power === power);
    }

    // Sorting
    if (sort === "asc") result.sort((a, b) => a.price - b.price);
    if (sort === "desc") result.sort((a, b) => b.price - a.price);

    setFilteredCars(result);
    setCurrentPage(1);
  }, [search, priceRange, sort,engine,model,color, gearBox, fuelType, power, cars]);

  // Pagination
  const indexOfLast = currentPage * carsPerPage;
  const indexOfFirst = indexOfLast - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  return (
    <div>
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Paieška"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Price Filter */}
      <div>
        <label>Didžiausia suma: {priceRange[1]}€</label>
        <input
          type="range"
          min="0"
          max="100000"
          step="100"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
        />
      </div>

      {/* Sort */}
      <div>
        <label>Rūšiuoti pagal kainą:</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Nieko</option>
          <option value="asc">Maž → Didž</option>
          <option value="desc">Didž → Maž</option>
        </select>
      </div>

      {/* Model Dropdown */}
      <div>
        <label>Modelis:</label>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="">Visi</option>
          {/* <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option> */}
        </select>
      </div>
      {/* Color Dropdown */}
      <div>
        <label>Spalva:</label>
        <select value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="">Visos</option>
          <option value="Silver">Sidabrinė</option>
          <option value="Black">Juoda</option>
          <option value="White">Balta</option>
          <option value="Red">Raudona</option>
        </select>
      </div>
      {/* Gear box Dropdown */}
      <div>
        <label>Pavarų dėžė:</label>
        <select value={gearBox} onChange={(e) => setGearBox(e.target.value)}>
          <option value="">Visos</option>
          <option value="Manual">Mechaninė</option>
          <option value="Automatic">Automatinė</option>
        </select>
      </div>
      {/* Fuel Type Dropdown */}
      <div>
        <label>Kuro tipas:</label>
        <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
          <option value="">Visi</option>
          <option value="Diesel">Dyzelis</option>
          <option value="Petrol">Benzinas</option>
        </select>
      </div>
      {/* Engine Dropdown */}
      <div>
        <label>Variklio tūris:</label>
        <select value={engine} onChange={(e) => setEngine(e.target.value)}>
          <option value="">Visi</option>
          {/* <option value=""></option>
          <option value=""></option> */}
        </select>
      </div>
      {/* Power Dropdown */}
      <div>
        <label>Variklio galingumas:</label>
        <select value={power} onChange={(e) => setPower(e.target.value)}>
          <option value="">Visi</option>
          {/* <option value=""></option>
          <option value=""></option> */}
        </select>
      </div>

      {/* Cars list */}
      <div>
        {currentCars.map((car) => (
          <div key={car._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{car.model}</h3>
            <p>Kaina: €{car.price}</p>
            {/* {car.photo?.data ? (
              <img
                src={`data:${car.photo.contentType};base64,${car.photo.data}`}
                alt={car.model}
                style={{ width: "200px" }}
              />
            ) : (
              <p>No photo</p>
            )} */}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div>
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          Prieš
        </button>

        <span> Puslapis {currentPage} iš {totalPages} </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
            Kitas
        </button>
      </div>
    </div>
  );
}

export default Skelbimai;
