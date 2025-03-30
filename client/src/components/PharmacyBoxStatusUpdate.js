import React, { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import contractABI from "../config/PharmaSupplyChainABI.js";
import contractAddr from "../config/ContractAddress.js";
import IPConnectGanache from "../config/IPConnectGanache.js";
import { MedicineContext } from "./MedicineContext.js";

const contractAddress = contractAddr;

const PharmacyBoxStatusUpdate = () => {
  const { currentAccount } = useContext(MedicineContext);
  const navigate = useNavigate();

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [medicineBox, setMedicineBox] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("4"); // Mặc định chọn trạng thái Sold (4)
  const [privateKey, setPrivateKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  console.log('medicineBox',medicineBox);
  

  useEffect(() => {
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);

  const fetchMedicineBox = async () => {
    if (!serialNumber.trim()) {
      setError("Vui lòng nhập Serial Number.");
      return;
    }
    if (!contract) return;

    setError("");
    setMedicineBox(null);

    try {
      const details = await contract.methods.getMedicineBoxDetails(serialNumber).call();
      setMedicineBox(details);
    } catch (err) {
      setError("Lỗi khi tìm kiếm hộp thuốc: " + err.message);
    }
  };

  const updateStatusToArrived = async () => {
    if (!privateKey.trim()) {
      setError("Vui lòng nhập Private Key trước khi duyệt.");
      return;
    }

    try {
      setError("");
      setMessage("");

      const pharmacy = currentAccount.address;
      const arrivedStatus = 3; // 3 = ArrivedAtPharmacy

      const data = contract.methods.updateBoxStatusAtPharmacy(serialNumber, arrivedStatus).encodeABI();
      const gas = await contract.methods.updateBoxStatusAtPharmacy(serialNumber, arrivedStatus).estimateGas({ from: pharmacy });
      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: pharmacy,
        to: contractAddress,
        data: data,
        gas: gas,
        gasPrice: gasPrice
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      setMessage(`Hộp thuốc ${serialNumber} đã được cập nhật thành \"ArrivedAtPharmacy\".`);
      fetchMedicineBox();
    } catch (err) {
      setError(`Lỗi khi cập nhật trạng thái: ${err.message}`);
    }
  };

  const handleUpdatePharmacyStatus = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!medicineBox) {
      setError("Vui lòng tìm kiếm hộp thuốc trước.");
      return;
    }
    if (!privateKey.trim()) {
      setError("Vui lòng nhập Private Key.");
      return;
    }
    if (!selectedStatus.trim()) {
      setError("Vui lòng chọn trạng thái mới.");
      return;
    }

    try {
      const pharmacy = currentAccount.address;

      const data = contract.methods.updateBoxStatusAtPharmacy(serialNumber, selectedStatus).encodeABI();
      const gas = await contract.methods.updateBoxStatusAtPharmacy(serialNumber, selectedStatus).estimateGas({ from: pharmacy });
      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: pharmacy,
        to: contractAddress,
        data: data,
        gas: gas,
        gasPrice: gasPrice
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      setMessage(`Hộp thuốc ${serialNumber} đã được cập nhật trạng thái thành công. Tx Hash: ${receipt.transactionHash}`);
      fetchMedicineBox();
    } catch (err) {
      setError(`Lỗi khi cập nhật trạng thái: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Nhà thuốc - Cập nhật trạng thái hộp thuốc</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>Serial Number (mã hộp thuốc):</label>
        <br />
        <input
          type="text"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          placeholder="Nhập Serial Number"
          style={{ padding: "0.5rem", width: "300px", marginRight: "10px" }}
        />
        <button onClick={fetchMedicineBox} style={{ padding: "0.5rem 1rem" }}>
          Tìm kiếm
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {medicineBox && (
        <div style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
          <h3>Thông tin hộp thuốc</h3>
          <p><strong>Serial Number:</strong> {medicineBox.serialNumber}</p>
          <p><strong>Tên sản phẩm:</strong> {medicineBox.boxName}</p>
          <p><strong>Ngày sản xuất:</strong> {medicineBox.manufacturingDate}</p>
          <p><strong>Ngày hết hạn:</strong> {medicineBox.expirationDate}</p>
          <p><strong>Trạng thái:</strong> {
              parseInt(medicineBox.boxStatus) === 3
                ? "Đã đến nhà thuốc"
                : parseInt(medicineBox.boxStatus) === 4
                ? "Đã bán"
                : "Chưa đến nhà thuốc"
            }</p>
          <label>Private Key:</label><br />
          <input
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Nhập Private Key"
            style={{ padding: "0.5rem", width: "400px", marginBottom: "10px" }}
            required
          /><br />

            {parseInt(medicineBox.boxStatus) === 4 ? (
              <p style={{ color: "gray", fontStyle: "italic", marginTop: "10px" }}>
                Hộp thuốc này đã được bán. Không thể cập nhật thêm.
              </p>
            ) : parseInt(medicineBox.boxStatus) !== 3 ? (
              <button onClick={updateStatusToArrived} style={{ padding: "0.5rem 1rem", marginTop: "10px" }}>
                Duyệt thành "ArrivedAtPharmacy"
              </button>
            ) : (
              <form onSubmit={handleUpdatePharmacyStatus}>
                <label>Chọn trạng thái mới:</label><br />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{ width: "320px", padding: "0.5rem" }}
                  required
                >
                  <option value="4">Sold</option>
                </select><br />
                <button type="submit" style={{ padding: "0.5rem 1rem" }}>
                  Cập nhật trạng thái
                </button>
              </form>
            )}
        </div>
      )}
    </div>
  );
};

export default PharmacyBoxStatusUpdate;
