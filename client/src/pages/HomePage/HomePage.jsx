import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import web3 from "../../config/web3";
import contract from "../../config/contract";

const HomePage = () => {
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]); // Thêm trạng thái cho danh sách tất cả thuốc
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [tracking, setTracking] = useState([]);
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    async function fetchAccount() {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
    fetchAccount();
  }, []);

  const addMedicine = async () => {
    try {
      const receipt = await contract.methods
        .addMedicine(name, manufacturer, Date.now(), Date.now() + 365 * 24 * 60 * 60 * 1000)
        .send({ from: account, gas: 5000000 });

      const event = receipt.events.MedicineAdded;
      if (event) {
        const newId = event.returnValues.id;
        console.log("New Medicine ID:", newId);
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const updateStatus = async () => {
    await contract.methods.updateStatus(parseInt(id), status).send({ from: account, gas: 5000000 });
  };

  const getMedicine = async () => {
    try {
      if (!id) {
        console.error("❌ Medicine ID is required!");
        return;
      }
  
      const medicineId = parseInt(id, 10);
      if (isNaN(medicineId) || medicineId <= 0) {
        console.error("❌ Invalid Medicine ID!");
        return;
      }
  
      const result = await contract.methods.getMedicine(medicineId).call();
  
      // Chuyển đổi BigInt về Number
      const formattedResult = {
        id: Number(result[0]), 
        name: result[1],
        manufacturer: result[2],
        mfgDate: Number(result[3]), 
        expDate: Number(result[4]), 
        status: result[5],
        owner: result[6]
      };
  
      setMedicines([formattedResult]);
  
      // Tạo đường dẫn chứa ID thuốc để người dùng quét
      const qrURL = `${window.location.origin}/medicine/${formattedResult.id}`;
      setQrData(qrURL);
  
      console.log("📌 Medicine Data:", formattedResult);
      console.log("📌 QR Code URL:", qrURL);
    } catch (error) {
      console.error("⚠️ Error fetching medicine:", error);
    }
  };

  const getTrackingHistory = async () => {
    const result = await contract.methods.getTrackingHistory(parseInt(id)).call();
    setTracking(result);
  };

  // Hàm mới: Lấy tất cả các lô thuốc từ blockchain
  const getAllMedicines = async () => {
    try {
      const result = await contract.methods.getAllMedicine().call();

      // Định dạng kết quả trả về thành danh sách các đối tượng thuốc
      const formattedMedicines = result[0].map((_, index) => ({
        id: Number(result[0][index]),
        name: result[1][index],
        manufacturer: result[2][index],
        mfgDate: Number(result[3][index]),
        expDate: Number(result[4][index]),
        status: result[5][index],
        owner: result[6][index],
      }));

      setAllMedicines(formattedMedicines);
      console.log("📌 All Medicines:", formattedMedicines);
    } catch (error) {
      console.error("⚠️ Error fetching all medicines:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Pharma Supply Chain</h1>
      <h3>Connected Account: {account}</h3>

      <h2>Add Medicine</h2>
      <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} />
      <input type="text" placeholder="Manufacturer" onChange={e => setManufacturer(e.target.value)} />
      <button onClick={addMedicine}>Add Medicine</button>

      <h2>Update Status</h2>
      <input type="number" placeholder="Medicine ID" onChange={e => setId(e.target.value)} />
      <input type="text" placeholder="Status" onChange={e => setStatus(e.target.value)} />
      <button onClick={updateStatus}>Update</button>

      <h2>Get Medicine</h2>
      <input type="number" placeholder="Medicine ID" onChange={e => setId(e.target.value)} />
      <button onClick={getMedicine}>Fetch</button>

      {medicines.map((m, index) => (
        <div key={index}>
          <h3>ID: {m.id}</h3>
          <h3>Name: {m.name}</h3>
          <p>Manufacturer: {m.manufacturer}</p>
          <p>Status: {m.status}</p>

          {/* Mã QR chứa link đến trang chi tiết thuốc */}
          <QRCodeCanvas value={`${window.location.origin}/medicine/${m.id}`} size={150} />
          <p>Scan to view details</p>
        </div>
      ))}

      <h2>Tracking History</h2>
      <button onClick={getTrackingHistory}>Get Tracking</button>
      {tracking.map((t, index) => (
        <p key={index}>{t.location} - {new Date(parseInt(t.timestamp) * 1000).toLocaleString()}</p>
      ))}

      {/* Nút mới để lấy danh sách tất cả các thuốc */}
      <h2>All Medicines</h2>
      <button onClick={getAllMedicines}>Get All Medicines</button>

      {/* Hiển thị danh sách tất cả các thuốc */}
      {allMedicines.length > 0 && (
        <div>
          <h3>List of All Medicines:</h3>
          {allMedicines.map((m, index) => (
            <div key={index} style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
              <p><strong>ID:</strong> {m.id}</p>
              <p><strong>Name:</strong> {m.name}</p>
              <p><strong>Manufacturer:</strong> {m.manufacturer}</p>
              <p><strong>Status:</strong> {m.status}</p>
              <p><strong>Owner:</strong> {m.owner}</p>
              <p><strong>Mfg Date:</strong> {new Date(m.mfgDate * 1000).toLocaleDateString()}</p>
              <p><strong>Exp Date:</strong> {new Date(m.expDate * 1000).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
