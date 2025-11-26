import React, {useEffect, useState, useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import "../Indre.css";

const Krepselis = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [payLoading, setPayLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const [removingId, setRemovingId] = useState(null);

    const fetchCart = async () => {
        if (!user) {
            setError("Turite būti prisijungęs, kad peržiūrėtumėte krepšelį.");
            setCart({ prekes: [], visoMoketi: 0 });
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/Autonamai/krepselis/`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (!res.ok) {
                throw new Error("Nepavyko gauti krepšelio duomenų");
            }
            const data = await res.json();
            const normalized={
              ...data,
              prekes: Array.isArray(data.prekes) ? data.prekes : [],
              visoMoketi: data.visoMoketi || 0
            }
            setCart(normalized);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setCart({ prekes: [], visoMoketi: 0 });
            setLoading(false);
        }
    }

    const removeItem = async (automobilisId) => {
        if (!user) return;
        const confirmDelete = window.confirm("Ar tikrai norite pašalinti šią prekę iš krepšelio?");
        if (!confirmDelete) return;
        
        setRemovingId(automobilisId);
        try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/Autonamai/krepselis/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ automobilisId }),
        });
        if(!res.ok){
            throw new Error("Nepavyko pašalinti prekės iš krepšelio");
        }

        await fetchCart();
        } catch (err) {
            alert("Klaida pašalinant prekę: " + err.message);
        } finally {
            setRemovingId(null);
        }
    }
    useEffect(() => {
        fetchCart();
    }, [user]);

    if (loading) return <p>Kraunama...</p>;
    if (error) return <p>Error: {error}</p>;

const handlePay = async () => {
  if (!user) {
    alert('Turite būti prisijungęs, kad galėtumėte apmokėti.');
    return;
  }

  setPayLoading(true);

 try {
     

      const newOrder = {
        prekes: cart.prekes
    .filter(item => item.automobilis) 
    .map(item => ({
      photo: item.automobilis.photo,
      model: item.automobilis.model,
      price: item.automobilis.price,
      color: item.automobilis.color,
      year: item.automobilis.year,
      kiekis: item.kiekis,
    })),
  email: user.email,
        status: 'Nepatvirtinta'
     };

    const res = await fetch(`${process.env.REACT_APP_API_URL}/Autonamai/uzsakymas/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(newOrder)
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }

        if (res.ok) {
      // Update each car's status to 'rezervuotas'
      await Promise.all(
        cart.prekes.map(item =>
          fetch(`${process.env.REACT_APP_API_URL}/Autonamai/automobiliai/${item.automobilis._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ uzsakymoStatusas: 'rezervuotas' })
          })
        )
      );

      // notify other pages to refresh listings
      window.dispatchEvent(new Event('carsUpdated'));
      alert("✅ Užsakymas sėkmingai sukurtas!");
      await fetchCart();
    } else {
      console.error('❌ Order creation failed:', res.status, data);
      alert("Klaida kuriant užsakymą: " + (data.error || data.message || res.statusText));
    }
  } catch (err) {
    console.error('❌ Network or unexpected error creating order:', err);
    alert("Klaida kuriant užsakymą: " + err.message);
  } finally {
    setPayLoading(false);
  }
};

    return (
        <div className="krepselis-container">
            <h1>Jūsų Krepšelis</h1>
            {cart && cart.prekes.length === 0 ? (
                <p className="empty-cart">Krepšelyje nieko nėra</p>
            ) : (
                <>
                <div className="krepselis-items">
                    {cart.prekes.map((item) => (
                      item.automobilis ? (
                        <div key={item.automobilis._id}>
                          <img src={item.automobilis.photo} alt={item.automobilis.model} />
                          <h2>{item.automobilis.model}</h2>
                          <p>Kaina: {item.automobilis.price} EUR</p>
                          <p>Kiekis: {item.kiekis}</p>
                          <button onClick={() => removeItem(item.automobilis._id)}>Pašalinti</button>
                        </div>
                      ) : null
                    ))}
                </div>
                <div className="total-section">
                    <h2>Iš viso mokėti: {cart.visoMoketi} EUR</h2>
                    <button onClick={handlePay} disabled={payLoading}>{payLoading ? 'Apmokėjimas...' : 'Apmokėti'}</button>
                </div>
                </>
            )}
        </div>
    );
}

export default Krepselis;