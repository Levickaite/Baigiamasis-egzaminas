
import React, {useEffect, useState, useContext} from "react";
import { AuthContext } from "../context/AuthContext";

const Krepselis = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchCart = async () => {
        if (!user) {
            setError("Turite būti prisijungęs, kad peržiūrėtumėte krepšelį.");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch("http://localhost:4000/api/Autonamai/krepselis/", {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (!res.ok) {
                throw new Error("Nepavyko gauti krepšelio duomenų");
            }
            const data = await res.json();
            setCart(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    const removeItem = async (automobilisId) => {
        if (!user) return;
        await fetch("http://localhost:4000/api/Autonamai/krepselis/remove", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ automobilisId }),
        });
        fetchCart();
    }
    useEffect(() => {
        fetchCart();
    }, [user]);

    if (loading) return <p>Kraunama...</p>;
    if (error) return <p>Error: {error}</p>;

    const handlePay = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/Autonamai/uzsakymas/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            });
            const data = await res.json();
            if (res.ok) {
                alert("Užsakymas sėkmingai sukurtas!");
                fetchCart();
            } else {
                alert("Klaida kuriant užsakymą: " + data.error);
            }
        } catch (err) {
            alert("Klaida kuriant užsakymą: " + err.message);
        }
    };

    return (
        <div>
            <h1>Jūsų Krepšelis</h1>
            {cart && cart.prekes.length === 0 ? (
                <p>Krepšelyje nieko nėra</p>
            ) : (
                <div>
                    {cart.prekes.map((item) => (
                        <div key={item.automobilis._id}>
                            <img src={item.automobilis.photo} alt={item.automobilis.model}  />
                            <h2>{item.automobilis.model}</h2>
                            <p>Kaina: {item.automobilis.price} EUR</p>
                            <p>Kiekis: {item.kiekis}</p>
                            <button onClick={() => removeItem(item.automobilis._id)}>Pašalinti</button>
                        </div>
                    ))}
                    <h2>Iš viso mokėti: {cart.visoMoketi} EUR</h2>
                    <button onClick={handlePay}>Apmokėti</button>
                </div>
            )}
        </div>
    );
}

export default Krepselis;