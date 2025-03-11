import React, { useState, useEffect } from "react";
import './Properties.css';
import MainHead from "./MainHead";
import PropNav from "./PropNav";
import PropertyCard from "./PropertyCard";
import axios from "axios";
import LinkIcon from "./LinkIcon";
import AlertBox from './AlertBox';
import SearchBar from './SearchBar';  
import { axiosInstance } from "../lib/axios";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("All Properties");
  const [searchTerm, setSearchTerm] = useState(""); 
  useEffect(() => {
    axiosInstance.get('/properties')
      .then(response => {
        setProperties(response.data);
        setLoading(false);
        
      })
      .catch(error => {
        setError("Error fetching properties");
        setLoading(false);
      });
  }, []);

  if (loading) return <AlertBox text='Loading...' />;

  if (error) return <p>{error}</p>;
  

  const filteredProperties = properties.filter(property => 
    (selectedType === "All Properties" || property.propertyType === selectedType) &&
    property.locationDetails.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const propertiesToDisplay = filteredProperties.slice(0, 6);

  return (
    <div className="properties">
      <MainHead 
        maintext="Available Properties" 
        subtext="Explore a diverse selection of properties to find the perfect fit for your needs and budget." 
      />
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <PropNav selectedType={selectedType} onSelect={setSelectedType} />

      <div className="properties_cont">
        <div className="properties_cards">
          {propertiesToDisplay.length > 0 ? (
            propertiesToDisplay.map(property => (
              <PropertyCard
                key={property._id}
                propertyName={property.propertyName}
                propertyType={property.propertyType}
                commercialType={property.commercialType}
                rentalType={property.rentalType}
                numOfRooms={property.numOfRooms}
                fullName={property.fullName}
                locationDetails={property.locationDetails}
                plotSize={property.plotSize}
                budget={property.budget}
                imageUrls={property.imageUrls} 
                updateddate={property.updateddate}
                numOfBedRooms={property.numOfBedRooms}
                numOfToilets={property.numOfToilets}
                description={property.description}
                villaRooms={property.villaRooms}
                propertyNumber={property.propertyNumber}
              />
            ))
          ) : (
            <p>No properties available</p>
          )}
        </div>
        <LinkIcon link="/properties" text="View More" svg2={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="m220.24 132.24l-72 72a6 6 0 0 1-8.48-8.48L201.51 134H40a6 6 0 0 1 0-12h161.51l-61.75-61.76a6 6 0 0 1 8.48-8.48l72 72a6 6 0 0 1 0 8.48"/></svg>} />
      </div>
    </div>
  );
}

export default Properties;
