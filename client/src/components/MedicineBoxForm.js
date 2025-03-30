import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate, useSearchParams } from 'react-router-dom';
import contractABI from '../config/PharmaSupplyChainABI.js';
import contractAddr from '../config/ContractAddress.js';
import IPConnectGanache from '../config/IPConnectGanache.js';
import { MedicineContext } from './MedicineContext.js';

const contractAddress = contractAddr;

const MedicineBoxForm = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [batchId, setBatchId] = useState('');
  const [boxName, setBoxName] = useState('');
  const [manufacturingDate, setManufacturingDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedDistributor, setSelectedDistributor] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serialQuery = searchParams.get('serialNumber');

  const { currentAccount, accountList } = useContext(MedicineContext);
  const manufacturerAddress = currentAccount ? currentAccount.address : '';

  useEffect(() => {
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!contract) return;

    if (!currentAccount || currentAccount.role !== 'MANUFACTURER') {
      setError('Chỉ tài khoản có vai trò MANUFACTURER mới được phép tạo hộp thuốc.');
      return;
    }

    try {
      await contract.methods.createMedicineBox(
        batchId,
        serialNumber,
        boxName,
        manufacturingDate,
        expirationDate,
        selectedManufacturer,
        selectedDistributor,
        selectedPharmacy
      ).send({ from: manufacturerAddress, gas: 500000 });

      setMessage('Hộp thuốc đã được tạo thành công.');

      // Reset form
      setSerialNumber('');
      setBatchId('');
      setBoxName('');
      setManufacturingDate('');
      setExpirationDate('');
      setSelectedManufacturer('');
      setSelectedDistributor('');
      setSelectedPharmacy('');
    } catch (err) {
      setError('Lỗi khi tạo hộp thuốc: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '0px' }}>
      <h2>{serialQuery ? 'Chỉnh sửa hộp thuốc' : 'Tạo hộp thuốc mới'}</h2>
      {error && <p style={{ color: 'red', marginTop: "30px" }}>{error}</p>}
      {message && <p style={{ color: 'green', marginBottom: "10px" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Batch ID (lô thuốc):</label><br />
          <input
            type="number"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            style={{ padding: '0.5rem', width: '200px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Serial Number (mã hộp thuốc):</label><br />
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            style={{ padding: '0.5rem', width: '200px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Tên hộp thuốc:</label><br />
          <input
            type="text"
            value={boxName}
            onChange={(e) => setBoxName(e.target.value)}
            style={{ padding: '0.5rem', width: '400px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Ngày sản xuất:</label><br />
          <input
            type="text"
            value={manufacturingDate}
            onChange={(e) => setManufacturingDate(e.target.value)}
            placeholder="dd/mm/yyyy"
            style={{ padding: '0.5rem', width: '200px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Hạn sử dụng:</label><br />
          <input
            type="text"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            placeholder="dd/mm/yyyy"
            style={{ padding: '0.5rem', width: '200px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nhà sản xuất:</label><br />
          <select
            value={selectedManufacturer}
            onChange={(e) => setSelectedManufacturer(e.target.value)}
            style={{ width: '320px', padding: '0.5rem' }}
            required
          >
            <option value="">-- Chọn nhà sản xuất --</option>
            {accountList
              .filter(acc => acc.role === 'MANUFACTURER')
              .map((acc, index) => (
                <option key={index} value={acc.address}>
                  {acc.name}
                </option>
              ))}
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nhà phân phối:</label><br />
          <select
            value={selectedDistributor}
            onChange={(e) => setSelectedDistributor(e.target.value)}
            style={{ width: '320px', padding: '0.5rem' }}
            required
          >
            <option value="">-- Chọn nhà phân phối --</option>
            {accountList
              .filter(acc => acc.role === 'DISTRIBUTOR')
              .map((acc, index) => (
                <option key={index} value={acc.address}>
                  {acc.name}
                </option>
              ))}
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nhà thuốc nhận:</label><br />
          <select
            value={selectedPharmacy}
            onChange={(e) => setSelectedPharmacy(e.target.value)}
            style={{ width: '320px', padding: '0.5rem' }}
            required
          >
            <option value="">-- Chọn nhà thuốc --</option>
            {accountList
              .filter(acc => acc.role === 'PHARMACY')
              .map((acc, index) => (
                <option key={index} value={acc.address}>
                  {acc.name}
                </option>
              ))}
          </select>
        </div>

        <button type="submit" style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
          {serialQuery ? 'Cập nhật hộp thuốc' : 'Tạo hộp thuốc'}
        </button>
        <button type="button" onClick={() => navigate('/master/hop-thuoc-list')} style={{ padding: '0.5rem 1rem' }}>
          Quay lại danh sách
        </button>
      </form>
    </div>
  );
};

export default MedicineBoxForm;
