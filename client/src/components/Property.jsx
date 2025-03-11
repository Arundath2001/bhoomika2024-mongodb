import React, { useState, useEffect } from "react";
import "./Property.css";
import PropertyForm from "./PropertyForm";
import axios from "axios";
import { axiosInstance } from "../lib/axios";

function Property({
  isFormOpen,
  formMode,
  setIsFormOpen,
  selectedIds,
  setSelectedIds,
  dataChanged,
  searchQuery,
}) {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, [dataChanged]);

  const fetchProperties = async () => {
    try {
      const response = await axiosInstance.get("/properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties", error);
    }
  };

  const handleFormSubmit = async (propertyDetails) => {

    try {
      if (formMode === "edit") {
        if (!propertyDetails._id) {
          console.error("Property ID is missing for update:", propertyDetails);
          return;
        }

        await axiosInstance.put(
          `/properties/${propertyDetails._id}`,
          propertyDetails
        );

        setProperties((prevProperties) =>
          prevProperties.map((prop) =>
            prop._id === propertyDetails._id
              ? { ...prop, ...propertyDetails }
              : prop
          )
        );
      } else {
        const response = await axiosInstance.post(
          "/properties",
          propertyDetails
        );
        setProperties((prevProperties) => [...prevProperties, response.data]);
      }
    } catch (error) {
      console.error(
        formMode === "edit"
          ? "Error updating property"
          : "Error adding property",
        error
      );
    } finally {
      setIsFormOpen(false);
      fetchProperties();
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  const filteredProperties = properties.filter((property) => {
    const propertyName = property.propertyname?.toLowerCase() || "";
    const fullName = property.fullname?.toLowerCase() || "";
    const id = String(property.propertyNumber).toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      propertyName.includes(query) ||
      fullName.includes(query) ||
      id.includes(query)
    );
  });

  const selectedProperty =
    properties.find((p) => selectedIds.includes(p._id)) || {};

  return (
    <div className="Property">
      <h1>Property</h1>

      {isFormOpen && (
        <div className="form_popup">
          <PropertyForm
            mode={formMode}
            setIsFormOpen={setIsFormOpen}
            propertyData={selectedProperty}
            onSubmit={handleFormSubmit}
            setSelectedIds={setSelectedIds}
            submitUrl={`${import.meta.env.VITE_API_URL}/properties`}
            showImageUpload={true}
            span="Add"
            heading="a New Property"
            setRequired={true}
            showPropertyName={true}
            showContactMessage={false}
            setName={true}
          />
        </div>
      )}

      {filteredProperties.length > 0 && (
        <div className="table_container">
          <div className="table_wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Propert Id</th>
                  <th>Property Type</th>
                  <th>Property Holder Name</th>
                  <th>Phone Number</th>
                  <th>Rental Type</th>
                  <th>Commercial Type</th>
                  <th>Number of Bed Rooms</th>
                  <th>Number of Villa Rooms</th>
                  <th>Property Name</th>
                  <th>Number of Rooms</th>
                  <th>Number of Toilets</th>
                  <th>Location Details</th>
                  <th>Size of Plot</th>
                  <th>Budget</th>
                  <th className="table_description">Description</th>
                  <th>Images</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(property._id)}
                        onChange={() => handleCheckboxChange(property._id)}
                      />
                    </td>
                    <td>{property.propertyNumber || "N/A"}</td>
                    <td>{property.propertyType || "N/A"}</td>
                    <td>{property.fullName || "N/A"}</td>
                    <td>{property.phoneNumber || "N/A"}</td>
                    <td>{property.rentalType || "N/A"}</td>
                    <td>{property.commercialType || "N/A"}</td>
                    <td>{property.numOfBedRooms || "N/A"}</td>
                    <td>{property.villaRooms || "N/A"}</td>
                    <td>{property.propertyName || "N/A"}</td>
                    <td>
                      {property.numOfRooms !== null &&
                      property.numOfRooms !== undefined
                        ? property.numOfRooms
                        : "N/A"}
                    </td>
                    <td>
                      {property.numOfToilets !== null &&
                      property.numOfToilets !== undefined
                        ? property.numOfToilets
                        : "N/A"}
                    </td>
                    <td>{property.locationDetails || "N/A"}</td>
                    <td>{property.plotSize || "N/A"}</td>
                    <td>{property.budget || "N/A"}</td>
                    <td className="table_description">
                      {property.description || "N/A"}
                    </td>
                    <td className="table_images">
                      {property.imageUrls && property.imageUrls.length > 0
                        ? property.imageUrls.map((url, index) => (
                            <img
                              src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${url}`}
                              alt="City"
                              className="city-image"
                            />
                          ))
                        : "No images"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Property;
