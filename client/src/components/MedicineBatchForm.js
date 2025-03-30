import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import contractABI from '../config/PharmaSupplyChainABI.js';
import contractAddr from '../config/ContractAddress.js';
import IPConnectGanache from '../config/IPConnectGanache.js';
import { MedicineContext } from './MedicineContext.js';

const contractAddress = contractAddr;

const MedicineBatchForm = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [batchName, setBatchName] = useState('');
  const [manufacturingDate, setManufacturingDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedAuthority, setSelectedAuthority] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { currentAccount, accountList } = useContext(MedicineContext);
  const accountAddress = currentAccount ? currentAccount.address : '';
  console.log('selectedSupplier',selectedSupplier);
  

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

    if (!currentAccount || currentAccount.role !== 'SUPPLIER') {
      setError('Chỉ tài khoản có vai trò SUPPLIER mới được phép tạo hộp thuốc.');
      return;
    }

    try {
      await contract.methods.createMedicineBatch(
        batchName,
        manufacturingDate,
        Number(quantity),
        selectedSupplier,
        selectedAuthority
      ).send({ from: accountAddress, gas: 500000 });

      setMessage('Lô thuốc đã được tạo thành công.');
      setBatchName('');
      setManufacturingDate('');
      setQuantity('');
      setSelectedSupplier('');
      setSelectedAuthority('');
    } catch (err) {
      setError('Lỗi khi tạo lô thuốc: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Tạo / Chỉnh sửa Lô Thuốc</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Tên lô thuốc:</label><br />
          <input
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            style={{ padding: '0.5rem', width: '300px' }}
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
            style={{ padding: '0.5rem', width: '300px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Số lượng (đơn vị):</label><br />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ padding: '0.5rem', width: '300px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nhà cung cấp nguyên liệu:</label><br />
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            style={{ width: '320px', padding: '0.5rem' }}
            required
          >
            <option value="">-- Chọn nhà cung cấp --</option>
            {accountList
              .filter((acc) => acc.role === 'SUPPLIER')
              .map((acc, index) => (
                <option key={index} value={acc.address}>
                  {acc.name}
                </option>
              ))}
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Cơ quan phê duyệt (Cục Quản lý Dược):</label><br />
          <select
            value={selectedAuthority}
            onChange={(e) => setSelectedAuthority(e.target.value)}
            style={{ width: '320px', padding: '0.5rem' }}
            required
          >
            <option value="">-- Chọn cơ quan duyệt --</option>
            {accountList
              .filter((acc) => acc.role === 'DRUG_AUTHORITY')
              .map((acc, index) => (
                <option key={index} value={acc.address}>
                  {acc.name}
                </option>
              ))}
          </select>
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Tạo Lô Thuốc
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default MedicineBatchForm;
