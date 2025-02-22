import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import contract from "../../config/contract";

const MedicineDetail = () => {
    const { id } = useParams();
    const [medicine, setMedicine] = useState(null);
  
    useEffect(() => {
      async function fetchMedicine() {
        if (!id) return;
  
        try {
          const medicineData = await contract.methods.getMedicine(parseInt(id)).call();
  
          const formattedResult = {
            id: Number(medicineData[0]), 
            name: medicineData[1],
            manufacturer: medicineData[2],
            mfgDate: new Date(Number(medicineData[3]) * 1000).toLocaleDateString(),
            expDate: new Date(Number(medicineData[4]) * 1000).toLocaleDateString(),
            status: medicineData[5],
            owner: medicineData[6]
          };
  
          setMedicine(formattedResult);
        } catch (error) {
          console.error("Error fetching medicine details:", error);
        }
      }
  
      fetchMedicine();
    }, [id]);
  
    return medicine ? (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Medicine Details</h2>
        <h3>ID: {medicine.id}</h3>
        <h3>Name: {medicine.name}</h3>
        <p>Manufacturer: {medicine.manufacturer}</p>
        <p>Manufacturing Date: {medicine.mfgDate}</p>
        <p>Expiry Date: {medicine.expDate}</p>
        <p>Status: {medicine.status}</p>
      </div>
    ) : (
      <p>Loading...</p>
    );
}

export default MedicineDetail