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
        status: car.status || "Laukiama",
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

  // 🟢 ADMIN: Change status
  const handleStatusChange = async (carId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:4000/api/Autonamai/uzsakymas/${carId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();
      setCars((prev) =>
        prev.map((car) => (car._id === updated._id ? updated : car))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Nepavyko pakeisti statuso");
    }
  };

  // Filtering + sorting + search
  useEffect(() => {
    let result = [...cars];
    result = result.filter(
      (car) => car.price >= priceRange[0] && car.price <= priceRange[1]
    );

    if (search.trim()) {
      result = result.filter((car) =>
        car.model?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (model) result = result.filter((car) => car.model === model);
    if (color) result = result.filter((car) => car.color === color);
    if (engine) result = result.filter((car) => car.engine === engine);
    if (gearBox) result = result.filter((car) => car.gearBox === gearBox);
    if (fuelType) result = result.filter((car) => car.fuelType === fuelType);
    if (power) result = result.filter((car) => car.power === power);

    if (sort === "asc") result.sort((a, b) => a.price - b.price);
    if (sort === "desc") result.sort((a, b) => b.price - a.price);
    if (status) result = result.filter((car) => car.status === status);
    if (sort === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sort === "oldest") result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    setFilteredCars(result);
    setCurrentPage(1);
  }, [search, priceRange, sort, engine, model, color, gearBox, fuelType, power, cars, status]);

  // Pagination
  const indexOfLast = currentPage * carsPerPage;
  const indexOfFirst = indexOfLast - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  
  // Helper for colored statuses
  const getStatusColor = (status) => {
    switch (status) {
      case "Patvirtinta":
        return "green";
      case "Atmesta":
        return "red";
      case "Įvykdyta":
        return "blue";
      case "Laukiama":
        return "gray";
    }
  };

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
      {/* Status Filter */}
      <div>
        <label>Statusas: </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Visi</option>
          <option value="Laukiama">Laukiama</option>
          <option value="Patvirtinta">Patvirtinta</option>
          <option value="Atmesta">Atmesta</option>
          <option value="Įvykdyta">Įvykdyta</option>
        </select>
      </div>
      {/* Sort */}
      <div>
        <label>Rūšiuoti:</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Nieko</option>
          <option value="asc">Maž → Didž</option>
          <option value="desc">Didž → Maž</option>
          <option value="newest">Naujausi</option>
          <option value="oldest">Seniausi</option>
        </select>
      </div>

      {/* Cars list */}
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
                backgroundColor: "#fff",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9f9f9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fff")
              }
            >
              <h3>{car.model}</h3>
              <p>Kaina: €{car.price}</p>
              <p>Užsakymo data: {new Date(car.createdAt).toLocaleDateString()}</p>

              {user?.role === "admin" ? (
                
                <div>
                  <p>El. paštas: {car.email}
                  </p>
                  <label>Statusas: </label>
                  <select
                    value={car.status}
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
                    {car.status || "Nežinomas"}
                  </span>
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: "1rem" }}>
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
