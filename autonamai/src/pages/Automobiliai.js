import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 

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
  const navigate = useNavigate();

  // Fetch cars from backend
  
    const fetchCars = useCallback (async () => {
      try {
        const res = await fetch("http://localhost:4000/api/Autonamai/automobiliai");
        const data = await res.json();
        // Remove or comment out unnecessary console.log statements
        data.forEach(c=>console.log(c._id, 'parduotas=', c.parduotas, 'rezervuotas=', c.rezervuotas, 'uzsakymoStatusas=', c.uzsakymoStatusas))
        setCars(data);
        setFilteredCars(data);
        

        const prices = data.map(car => car.price);
        if(prices.length) setPriceRange([0, Math.max(...prices)]);
      } catch (err) {
        console.error("Error fetching cars:", err);
      }
    }, []);
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

    // auto-refresh when tab becomes visible (useful after redirects) and on custom event
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchCars();
    };
    const onCarsUpdated = () => fetchCars();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("carsUpdated", onCarsUpdated);

    // expose for manual testing in console
    window.refreshCars = fetchCars;

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("carsUpdated", onCarsUpdated);
      delete window.refreshCars;
    };
  }, [fetchCars]);

  const uniqueModels = [...new Set(cars.map(car => car.model))];
  const uniqueColors = [...new Set(cars.map(car => car.color))];
  const uniqueEngines = [...new Set(cars.map(car => car.engine))];
  const uniqueGearBoxes = [...new Set(cars.map(car => car.gearBox))];
  const uniqueFuelTypes = [...new Set(cars.map(car => car.fuelType))];
  const uniquePowers = [...new Set(cars.map(car => car.power))];

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
        car.model && car.model.toLowerCase().includes(search.toLowerCase())
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
      result = result.filter((car) => String(car.engine) === String(engine));
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
      result = result.filter((car) => String(car.power) === String(power));
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
  <div className="automobiliai-page">
      {/* Top filter bar: search, price, sort */}
      <div className="filter-top-bar">
        <input
          type="text"
          placeholder="Paieška"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="select-input"
        >
          <option value="">Nieko</option>
          <option value="asc">Maž → Didž</option>
          <option value="desc">Didž → Maž</option>
        </select>
      </div>

      <div className="uzsakymai-page">
        {/* Sidebar for filters including price */}
        <div className="filters-sidebar">
          {/* Price label and filter with other filters */}
          <div className="filter-group">
            <label className="filter-label">Didžiausia suma: {priceRange[1]}€</label>
            <input
              type="range"
              min="0"
              max={Math.max(...cars.map((car) => car.price), 100000)}
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="price-range"
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Modelis:</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="select-input"
            >
              <option value="">Visi</option>
              {uniqueModels.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Spalva:</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="select-input"
            >
              <option value="">Visos</option>
              {uniqueColors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Pavarų dėžė:</label>
            <select
              value={gearBox}
              onChange={(e) => setGearBox(e.target.value)}
              className="select-input"
            >
              <option value="">Visos</option>
              {uniqueGearBoxes.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Kuro tipas:</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="select-input"
            >
              <option value="">Visi</option>
              {uniqueFuelTypes.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Variklio tūris:</label>
            <select
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              className="select-input"
            >
              <option value="">Visi</option>
              {uniqueEngines.map((en) => (
                <option key={en} value={en}>{en}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Variklio galingumas:</label>
            <select
              value={power}
              onChange={(e) => setPower(e.target.value)}
              className="select-input"
            >
              <option value="">Visi</option>
              {uniquePowers.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          {/* Reset Filters at the bottom */}
          <div className="filter-reset" style={{ marginTop: "2rem" }}>
            <button
              onClick={() => {
                setSearch("");
                setPriceRange([0, Math.max(...cars.map((car) => car.price), 100000)]);
                setSort("");
                setEngine("");
                setModel("");
                setColor("");
                setGearBox("");
                setFuelType("");
                setPower("");
              }}
              className="reset-button"
            >
              Išvalyti filtrus
            </button>
          </div>
        </div>

        {/* Cars list */}
        <div className="cars-grid">
          {currentCars.map((car) => {
            // normalize status (backend may send boolean or string)
            // map order-related field to badge: 'įvykdyta' -> sold, 'patvirtinta' -> reserved
            const s = (car.uzsakymoStatusas || "").toString().toLowerCase();
            const isSold = car.parduotas === true || car.parduotas === "true" || s.includes("įvykd");
            const isReserved = !isSold && (car.rezervuotas === true || car.rezervuotas === "true" || s.includes("patvirt"));

            return (
              <div
                key={car._id}
                className={`car-card ${car.parduotas ? "parduotas" : car.rezervuotas ? "rezervuotas" : ""}`}
                onClick={() => navigate(`/automobiliai/${car._id}`)}
                style={{ position: "relative", opacity: car.parduotas ? 0.6 : car.rezervuotas ? 0.85 : 1, cursor: "pointer" }}
              >
                {car.photo ? (
                  <img src={car.photo} alt={car.model} className="car-image" />
                ) : (
                  <p className="no-photo">No photo</p>
                )}

                {(isSold || isReserved) ? (
                  <div
                    className="status-badge"
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      backgroundColor: isSold ? "red" : "orange",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      zIndex: 9999,
                    }}
                  >
                    {isSold ? "PARDUOTA" : "REZERVUOTA"}
                  </div>
                ) : null}

                <h3 className="car-model">{car.model}</h3>
                <p className="car-year">Metai: {car.year}</p>
                <p className="car-fuel">Kuro tipas: {car.fuelType}</p>
                <p className="car-power">Galia: {car.power} kW</p>
                <p className="car-gearbox">Pavarų dėžė: {car.gearBox}</p>
                <p className="car-price"><strong>Kaina: €{car.price} </strong></p>
                
              </div>
            );
          })}
        </div>
      </div>
      <div className="pagination-container">
        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="page-button"
          >
            Prieš
          </button>
          <span className="page-info">
            Puslapis {currentPage} iš {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="page-button"
          >
            Kitas
          </button>
        </div>
      </div>
    </div>
    
 );
}

export default Skelbimai;
