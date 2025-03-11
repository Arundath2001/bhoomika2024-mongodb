import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Schedules.css';
import { axiosInstance } from '../lib/axios';

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function Schedules({ setSelectedIds, dataChanged, searchQuery }) {
    const [schedules, setSchedules] = useState([]);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axiosInstance.get('/visitschedule');
                setSchedules(response.data.visitSchedule);                                
            } catch (error) {
                console.error('Error fetching schedules:', error);
            }
        };
        fetchSchedules();
    }, [dataChanged]);

    const handleCheckboxChange = (id) => {
        setSelectedCheckboxes(prevState => {
            const newState = prevState.includes(id) 
                ? prevState.filter(checkboxId => checkboxId !== id) 
                : [...prevState, id];
            setSelectedIds(newState);
            return newState;
        });
    };

    const filteredSchedules = schedules.filter(schedule => {
        const location_details = schedule.location_details?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        return location_details.includes(query);
    });

    return (
        <div className="Schedules">
            <h1>Schedules</h1>
            <div className="table_container">
                <div className="table_wrapper">
            <table className='table'>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Visit Date</th>
                        <th>Full Name</th>
                        <th>Location Details</th>
                        <th>Property Id</th>
                        <th>Description</th>
                        <th>Phone Number</th>
                        <th>Visit Time</th>
                        <th>Property Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSchedules.map((schedule) => (
                        <tr key={schedule._id}>
                            <td>
                                <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange(schedule._id)}
                                    checked={selectedCheckboxes.includes(schedule._id)}
                                />
                            </td>
                            <td>{formatDate(schedule.visitDate)}</td>
                            <td>{schedule.fullName}</td>
                            <td>{schedule.locationDetails}</td>
                            <td>{schedule.propertyNumber}</td>
                            <td>{schedule.description}</td>
                            <td>{schedule.phoneNumber}</td>
                            <td>{schedule.visitTime}</td>
                            <td>{schedule.propertyName}</td>
                            <td>{schedule.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            </div>
        </div>
    );
}

export default Schedules;
