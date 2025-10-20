import React, { useEffect, useState } from "react";

function CarListingPage() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const carsPerPage = 6;

  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/automobiliai");
        const data = await res.json();
        setCars(data);
        setFilteredCars(data);
      } catch (err) {
        console.error("Error fetching cars:", err);
      }
    };
    fetchCars();
  }, []);

  // Filtering + sorting + search
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

    // Sorting
    if (sort === "asc") result.sort((a, b) => a.price - b.price);
    if (sort === "desc") result.sort((a, b) => b.price - a.price);

    setFilteredCars(result);
    setCurrentPage(1);
  }, [search, priceRange, sort, cars]);

  // Pagination
  const indexOfLast = currentPage * carsPerPage;
  const indexOfFirst = indexOfLast - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  return (
    <div>
      <h2>Car Listings</h2>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Price Filter */}
      <div>
        <label>Max price: €{priceRange[1]}</label>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
        />
      </div>

      {/* Sort */}
      <div>
        <label>Sort by price:</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">None</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
      </div>

      {/* Cars list */}
      <div>
        {currentCars.map((car) => (
          <div key={car._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{car.model}</h3>
            <p>Price: €{car.price}</p>
            {car.photo?.data ? (
              <img
                src={`data:${car.photo.contentType};base64,${car.photo.data}`}
                alt={car.model}
                style={{ width: "200px" }}
              />
            ) : (
              <p>No photo</p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div>
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          Prev
        </button>

        <span> Page {currentPage} of {totalPages} </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CarListingPage;
