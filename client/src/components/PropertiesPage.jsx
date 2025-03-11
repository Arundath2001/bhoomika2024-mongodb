import React, { useState, useEffect } from "react";
import './PropertiesPage.css';
import MainHead from "./MainHead";
import PropNav from "./PropNav";
import PropertyCard from "./PropertyCard";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AlertBox from "./AlertBox";
import SearchBar from './SearchBar';  
import { axiosInstance } from "../lib/axios";


function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("All Properties");
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage, setPropertiesPerPage] = useState(9);
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

    const updatePropertiesPerPage = () => {
      if (window.innerWidth <= 768) {
        setPropertiesPerPage(10);
      } else {
        setPropertiesPerPage(9);
      }
    };

    updatePropertiesPerPage();
    window.addEventListener('resize', updatePropertiesPerPage);

    return () => window.removeEventListener('resize', updatePropertiesPerPage);
  }, []);

  if (loading) return <AlertBox text = 'Loading...' />;
  if (error) return <p>{error}</p>;

  const filteredProperties = properties.filter(property => 
    (selectedType === "All Properties" || property.propertyType === selectedType) &&
    property.locationDetails.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pageNumbers.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="propertiespage">
      <div className="properties">
        <Navbar />
      <div className="propertiespage_cont">
      <MainHead 
        maintext="All Properties" 
        subtext="Explore a diverse selection of properties to find the perfect fit for your needs and budget." 
      />

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <PropNav selectedType={selectedType} onSelect={setSelectedType} />
      <div className="properties_cont">
        <div className="properties_cards">
          {currentProperties.length > 0 ? (
            currentProperties.map(property => (
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
                id={property._id}
              />
            ))
          ) : (
            <p>No properties available</p>
          )}
        </div>
        <div className="pagination">
          {currentPage > 1 && (
            <button onClick={() => paginate(currentPage - 1)}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z"/></svg></button>
          )}
          {getPageNumbers().map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={number === currentPage ? "active" : ""}
            >
              {number}
            </button>
          ))}
          {currentPage < totalPages && (
            <button onClick={() => paginate(currentPage + 1)}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z"/></svg></button>
          )}
        </div>
      </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default PropertiesPage;
