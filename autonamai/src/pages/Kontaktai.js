import React from "react";
import "../Indre.css";

const Kontaktai = () => {
    const mapsQuery = encodeURIComponent("Gedimino pr. 53, Vilnius");
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
    const embedMapsUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
    return (
        <div className="kontaktai">
            <div className="kontaktai-header">
                <h1>Kontaktai</h1>

            </div>
            <p>UAB "AutoNamai"</p>
            <p>El. paštas: <a href="mailto:info@autonamai.lt">info@autonamai.lt</a></p>
            <p>Telefonas: <a href="tel:+37060000000">+370 600 00000</a></p>
            <p>Adresas: Gedimino pr. 53, Vilnius</p>

            <div className="map-container">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    <iframe
                        title="AutoNamai Location"
                        src={embedMapsUrl}
                        width="600"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </a>
            </div>
        </div>

    );
}
export default Kontaktai;
