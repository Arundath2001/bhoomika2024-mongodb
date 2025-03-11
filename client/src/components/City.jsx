import React, { useEffect, useState } from "react";
import './City.css';
import CityForm from "./CityForm";
import axios from 'axios';
import { axiosInstance } from "../lib/axios";

function City({ isFormOpen, formMode, setIsFormOpen, selectedIds, setSelectedIds, dataChanged, searchQuery }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axiosInstance.get('/cities');
                setData(response.data.cities);
            } catch (error) {
                console.error("Error fetching cities", error);
            }
        };

        fetchCities();
    }, [isFormOpen, dataChanged]);

    const handleCheckboxChange = (city) => {
        setSelectedIds((prevIds) => {
            const cityId = city._id.toString();  
            if (prevIds.includes(cityId)) {
                return prevIds.filter(id => id !== cityId);
            } else {
                return [...prevIds, cityId];
            }
        });
    };
    

    const filteredData = data.filter(item => {
        const cityname = item.cityname?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        return cityname.includes(query);
    });

    return (
        <div className="City">
            <h1>City</h1>

            {isFormOpen && (
                <div className="form_popup">
                    <CityForm 
                        setIsFormOpen={setIsFormOpen} 
                        mode={formMode} 
                        cityData={data.find(item => item._id === selectedIds[0])} 
                        setSelectedIds={setSelectedIds}
                    />
                </div>
            )}
            <div className="table_container">
            <div className="table_wrapper">
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>City Name</th>
                        <th>Available No of Properties</th>
                        <th>Updated Date</th>
                        <th>Image / Video</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item._id}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.includes(item._id.toString())}
                                    onChange={() => handleCheckboxChange(item)}
                                />
                            </td>
                            <td>{item.cityName}</td>
                            <td>{item.availableProperties}</td>
                            <td>{new Date(item.updatedDate).toLocaleDateString()}</td>
                            <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${item.imageUrl}`} alt="City" className="city-image" />
                            </tr>
                    ))}
                </tbody>
            </table>
            </div>
            </div>
        </div>
    );
}

export default City;
