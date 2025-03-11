import React from "react";
import { useNavigate } from "react-router-dom";
import './CityCard.css';

function CityCard({ city }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/city/${city.cityName}`);
    };
    

    return (
        <div className="citycard" onClick={handleClick}>
            <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${city.imageUrl}`} alt={city.cityname} />
            <div className="citycard_details">
                <h5>{city.cityName}</h5>
                <p>{city.availableProperties} Properties</p>
            </div>
        </div>
    );
}

export default CityCard;
