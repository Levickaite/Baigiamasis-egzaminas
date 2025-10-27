import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Uzsakymai() {
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

  // Fetch data based on role (user/admin)
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          console.error("User not found in localStorage.");
          return;
        }

        let url = "http://localhost:4000/api/Autonamai/uzsakymai";

        // Fetch logic based on role
        if (user.role === "user") {
          // Only user's own cars
          url += `?email=${encodeURIComponent(user.email)}`;
        } else if (user.role === "admin") {
          // Admin sees all cars except those with status "Laisvas"
          url += "?notStatus=Laisvas";
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        // If admin, also filter out status "Laisvas" in frontend (safety net)
        const filteredData =
          user.role === "admin"
            ? data.filter((car) => car.status !== "Laisvas")
            : data;

        setCars(filteredData);
        setFilteredCars(filteredData);
      } catch (err) {
        console.error("Error fetching uzsakymai:", err);
      }
    };

    fetchCars();
  }, []);

  // Filtering + sorting + search
  useEffect(() => {
    let result = [...cars];

    // Filter by price
    result = result.filter(
      (car) => car.price >= priceRange[0] && car.price <= priceRange[1]
    );

    // Search by model
    if (search.trim()) {
      result = result.filter((car) =>
        car.model?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filters
    if (model) result = result.filter((car) => car.model === model);
    if (color) result = result.filter((car) => car.color === color);
    if (engine) result = result.filter((car) => car.engine === engine);
    if (gearBox) result = result.filter((car) => car.gearBox === gearBox);
    if (fuelType) result = result.filter((car) => car.fuelType === fuelType);
    if (power) result = result.filter((car) => car.power === power);

    // Sorting
    if (sort === "asc") result.sort((a, b) => a.price - b.price);
    if (sort === "desc") result.sort((a, b) => b.price - a.price);

    setFilteredCars(result);
    setCurrentPage(1);
  }, [search, priceRange, sort, engine, model, color, gearBox, fuelType, power, cars]);

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

      {/* Filters */}
      <div>
        <label>Modelis:</label>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="">Visi</option>
        </select>
      </div>

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

      <div>
        <label>Pavarų dėžė:</label>
        <select value={gearBox} onChange={(e) => setGearBox(e.target.value)}>
          <option value="">Visos</option>
          <option value="Manual">Mechaninė</option>
          <option value="Automatic">Automatinė</option>
        </select>
      </div>

      <div>
        <label>Kuro tipas:</label>
        <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
          <option value="">Visi</option>
          <option value="Diesel">Dyzelis</option>
          <option value="Petrol">Benzinas</option>
        </select>
      </div>

      <div>
        <label>Variklio tūris:</label>
        <select value={engine} onChange={(e) => setEngine(e.target.value)}>
          <option value="">Visi</option>
        </select>
      </div>

      <div>
        <label>Variklio galingumas:</label>
        <select value={power} onChange={(e) => setPower(e.target.value)}>
          <option value="">Visi</option>
        </select>
      </div>

      {/* Cars / Uzsakymai list */}
      <div>
        {currentCars.length === 0 ? (
          <p>Nerasta užsakymų.</p>
        ) : (
          currentCars.map((car) => (
            <div
              key={car._id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
                borderRadius: "8px",
              }}
            onClick={() => navigate(`/automobiliai/${car._id}`)} 
            onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f5f5f5")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "white")
            }
            >
              <h3>{car.model}</h3>
              <p>Kaina: €{car.price}</p>
              <p>Statusas: {car.status || "Nežinomas"}</p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prieš
        </button>
        <span>
          {" "}
          Puslapis {currentPage} iš {totalPages}{" "}
        </span>
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

export default Uzsakymai;
