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
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");

  const carsPerPage = 6;
  const navigate = useNavigate();

  // normalizeStatus helper
  const normalizeStatus = (s) =>
    s === undefined || s === null || s === "" ? "Laukiama" : s;

  // Fetch data based on role (user/admin)
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
          console.error("User not found in localStorage.");
          return;
        }
        setUser(storedUser);

        let url = "http://localhost:4000/api/Autonamai/uzsakymas";
        if (storedUser.role === "user") {
          url += `?email=${encodeURIComponent(storedUser.email)}`;
        } else if (storedUser.role === "admin") {
          url += "?notStatus=Laisvas";
        }

        const token = localStorage.getItem("token");
        const res = await fetch(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        const carsWithStatus = data.map((car) => ({
          ...car,
          status: normalizeStatus(car.status),
        }));

        const filteredData =
          storedUser.role === "admin"
            ? carsWithStatus.filter((car) => car.status !== "Laisvas")
            : carsWithStatus;

        setCars(filteredData);
        setFilteredCars(filteredData);
      } catch (err) {
        console.error("Error fetching uzsakymai:", err);
      }
    };

    fetchCars();
  }, []);

  // 🟢 ADMIN: Change status + auto delete if Įvykdyta
  const handleStatusChange = async (carId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(
        `http://localhost:4000/api/Autonamai/uzsakymas/${carId}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      // normalize the updated status coming from backend
      const updatedNormalized = { ...updated, status: normalizeStatus(updated.status) };

  // update cars and filteredCars arrays
      setCars((prev) => prev.map((car) => (car._id === updatedNormalized._id ? updatedNormalized : car)));
      setFilteredCars((prev) => prev.map((car) => (car._id === updatedNormalized._id ? updatedNormalized : car)));
  // inform other pages (listings) to refresh their data
  window.dispatchEvent(new Event('carsUpdated'));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Nepavyko pakeisti statuso");
    }
  };

  // Filtering + sorting + search
  useEffect(() => {
    let result = [...cars];

    result = result.filter(
      (car) =>
        Number(car.price) >= priceRange[0] && Number(car.price) <= priceRange[1]
    );

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((car) =>
        (car.model || "").toLowerCase().includes(q)
      );
    }

    if (model) result = result.filter((car) => car.model === model);
    if (color) result = result.filter((car) => car.color === color);
    if (engine) result = result.filter((car) => car.engine === engine);
    if (gearBox) result = result.filter((car) => car.gearBox === gearBox);
    if (fuelType) result = result.filter((car) => car.fuelType === fuelType);
    if (power) result = result.filter((car) => car.power === power);

    if (status) {
      result = result.filter(
        (car) => normalizeStatus(car.status) === status
      );
    }

    if (sort === "asc") result.sort((a, b) => a.price - b.price);
    if (sort === "desc") result.sort((a, b) => b.price - a.price);
    if (sort === "newest")
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "oldest")
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    setFilteredCars(result);
    setCurrentPage(1);
  }, [search, priceRange, sort, engine, model, color, gearBox, fuelType, power, cars, status]);

  // Pagination
  const indexOfLast = currentPage * carsPerPage;
  const indexOfFirst = indexOfLast - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  // Helper for colored statuses
  const getStatusColor = (st) => {
    const s = normalizeStatus(st);
    switch (s) {
      case "Patvirtinta":
        return "green";
      case "Atmesta":
        return "red";
      case "Įvykdyta":
        return "blue";
      case "Laukiama":
      default:
        return "gray";
    }
  };

  return (
    <div className="automobiliai-page">
      <div className="filter-top-bar">
        <h1>Mano Užsakymai</h1>
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
          <option value="newest">Naujausi</option>
          <option value="oldest">Seniausi</option>
        </select>
      </div>

      <div className="uzsakymai-page">
        <div className="filters-sidebar">
          <div className="filter-group">
            <label className="filter-label">
              Didžiausia suma: {priceRange[1]}€
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              step="100"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([0, Number(e.target.value)])
              }
              className="price-range"
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Statusas: </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="select-input"
            >
              <option value="">Visi</option>
              <option value="Laukiama">Laukiama</option>
              <option value="Patvirtinta">Patvirtinta</option>
              <option value="Atmesta">Atmesta</option>
              <option value="Įvykdyta">Įvykdyta</option>
            </select>
          </div>
        </div>

        <div className="cars-grid">
          {currentCars.length === 0 ? (
            <p>Nerasta užsakymų.</p>
          ) : (
            currentCars.map((car) => (
              <div
                key={car._id}
                className="car-card"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9f9f9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fff")
                }
              >
                {car.photo ? (
                  <img src={car.photo} alt={car.model} className="car-image" />
                ) : (
                  <p className="no-photo">No photo</p>
                )}
                <h3 className="car-model">{car.model}</h3>
                <p className="car-price">Kaina: €{car.price}</p>
                <p>
                  Užsakymo data:{" "}
                  {new Date(car.createdAt).toLocaleDateString()}
                </p>
                {user?.role === "admin" ? (
                  <div>
                    <p>El. paštas: {car.email}</p>
                    <label>Statusas: </label>
                    <select
                      value={normalizeStatus(car.status)}
                      onChange={(e) =>
                        handleStatusChange(car._id, e.target.value)
                      }
                      style={{
                        border: "1px solid #ccc",
                        padding: "4px 8px",
                        color: getStatusColor(car.status),
                      }}
                    >
                      <option value="Laukiama">Laukiama</option>
                      <option value="Patvirtinta">Patvirtinta</option>
                      <option value="Atmesta">Atmesta</option>
                      <option value="Įvykdyta">Įvykdyta</option>
                    </select>
                  </div>
                ) : (
                  <p>
                    <strong>Statusas: </strong>
                    <span style={{ color: getStatusColor(car.status) }}>
                      {normalizeStatus(car.status)}
                    </span>
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pagination-container">
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

export default Uzsakymai;
