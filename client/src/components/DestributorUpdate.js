import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from '../config/PharmaSupplyChainABI.js';
import contractAddr from '../config/ContractAddress.js';
import IPConnectGanache from '../config/IPConnectGanache.js';
import { MedicineContext } from './MedicineContext.js';

const contractAddress = contractAddr;

const DistributorUpdate = () => {
  const { currentAccount, accountList } = useContext(MedicineContext);
  const navigate = useNavigate();

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [medicineBox, setMedicineBox] = useState(null);
  const [distributorList, setDistributorList] = useState([]);
  const [pharmacyList, setPharmacyList] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);

  useEffect(() => {
    if (accountList.length > 0) {
      const distributors = accountList.filter(acc => acc.role === "DISTRIBUTOR");
      const pharmacies = accountList.filter(acc => acc.role === "PHARMACY");
      setDistributorList(distributors);
      setPharmacyList(pharmacies);
    }
  }, [accountList]);

  const fetchMedicineBox = async () => {
    if (!serialNumber.trim()) {
      setError('Vui lòng nhập Serial Number.');
      return;
    }
    if (!contract) return;

    setError('');
    setMedicineBox(null);

    try {
      const details = await contract.methods.getMedicineBoxDetails(serialNumber).call();
      if (parseInt(details.boxStatus) === 1) {
        setMedicineBox(details);
      } else {
        setError('Hộp thuốc không ở trạng thái Approved.');
      }
    } catch (err) {
      setError('Lỗi khi tìm kiếm hộp thuốc: ' + err.message);
    }
  };

  const handleUpdateDistributor = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!medicineBox) {
      setError('Vui lòng tìm kiếm hộp thuốc trước.');
      return;
    }
    if (!privateKey.trim()) {
      setError('Vui lòng nhập private key.');
      return;
    }
    if (!selectedDistributor.trim()) {
      setError('Vui lòng chọn nhà phân phối.');
      return;
    }
    if (!selectedPharmacy.trim()) {
      setError('Vui lòng chọn nhà thuốc làm chủ sở hữu mới.');
      return;
    }

    try {
      const distributor = currentAccount.address;

      const data = contract.methods.updateDistributor(serialNumber, selectedDistributor, selectedPharmacy).encodeABI();
      const gas = await contract.methods.updateDistributor(serialNumber, selectedDistributor, selectedPharmacy).estimateGas({ from: distributor });
      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: distributor,
        to: contractAddress,
        data: data,
        gas: gas,
        gasPrice: gasPrice
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      setMessage(`Hộp thuốc ${serialNumber} đã được cập nhật thành công. Tx Hash: ${receipt.transactionHash}`);
      setMedicineBox(null);
    } catch (err) {
      setError(`Lỗi khi cập nhật hộp thuốc: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Nhà phân phối cập nhật thông tin hộp thuốc</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>Serial Number (mã hộp thuốc):</label><br />
        <input
          type="text"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          placeholder="Nhập Serial Number"
          style={{ padding: '0.5rem', width: '300px', marginRight: '10px' }}
        />
        <button onClick={fetchMedicineBox} style={{ padding: '0.5rem 1rem' }}>
          Tìm kiếm
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {medicineBox && (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h3>Thông tin hộp thuốc</h3>
          <p><strong>Serial Number:</strong> {medicineBox.serialNumber}</p>
          <p><strong>Tên sản phẩm:</strong> {medicineBox.boxName}</p>
          <p><strong>Ngày sản xuất:</strong> {medicineBox.manufacturingDate}</p>
          <p><strong>Ngày hết hạn:</strong> {medicineBox.expirationDate}</p>
          <p><strong>Trạng thái:</strong> Approved</p>

          <form onSubmit={handleUpdateDistributor}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Nhà phân phối:</label><br />
              <select value={selectedDistributor} onChange={(e) => setSelectedDistributor(e.target.value)}
                  style={{ width: '320px', padding: '0.5rem' }} required>
                <option value="">-- Chọn nhà phân phối --</option>
                {distributorList.map((distributor, index) => (
                  <option key={index} value={distributor.address}>
                    {distributor.name} ({distributor.address})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Nhà thuốc nhận (chủ sở hữu mới):</label><br />
              <select value={selectedPharmacy} onChange={(e) => setSelectedPharmacy(e.target.value)}
                style={{ width: '320px', padding: '0.5rem' }} required>
                <option value="">-- Chọn nhà thuốc --</option>
                {pharmacyList.map((pharmacy, index) => (
                  <option key={index} value={pharmacy.address}>
                    {pharmacy.name} ({pharmacy.address})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Private Key:</label><br />
              <input
                type="password"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="Nhập private key"
                style={{ padding: '0.5rem', width: '400px' }}
                required
              />
            </div>

            <button type="submit" style={{ padding: '0.5rem 1rem' }}>
              Cập nhật trạng thái
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DistributorUpdate;
