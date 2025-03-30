import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useSearchParams, useNavigate } from 'react-router-dom';
import contractABI from '../config/PharmaSupplyChainABI.js';
import contractAddr from '../config/ContractAddress.js';
import IPConnectGanache from '../config/IPConnectGanache.js';
import { MedicineContext } from './MedicineContext.js';

const MedicineBoxUpdate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serialNumber = searchParams.get('serialNumber');

  const { currentAccount } = useContext(MedicineContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập';

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [boxName, setBoxName] = useState('');
  const [manufacturingDate, setManufacturingDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddr);
    setContract(contractInstance);
  }, []);

  useEffect(() => {
    if (contract && serialNumber) {
      fetchBoxDetails();
    }
  }, [contract, serialNumber]);

  const fetchBoxDetails = async () => {
    try {
      const box = await contract.methods.getMedicineBoxDetails(serialNumber).call({ from: accountAddress });
      if (box.productionApproved) {
        setError('Hộp thuốc đã được duyệt sản xuất. Không thể cập nhật.');
        return;
      }
      setBoxName(box.boxName);
      setManufacturingDate(box.manufacturingDate);
      setExpirationDate(box.expirationDate);
    } catch (err) {
      setError('Không thể lấy thông tin hộp thuốc: ' + err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!privateKey || privateKey.trim() === '') {
      setError('Vui lòng nhập private key.');
      return;
    }

    if (!currentAccount || currentAccount.role !== 'MANUFACTURER') {
      setError('Chỉ MANUFACTURER mới được phép cập nhật hộp thuốc.');
      return;
    }

    try {
      const sender = currentAccount.address;
      const data = contract.methods.updateMedicineBox(
        serialNumber,
        boxName,
        manufacturingDate,
        expirationDate
      ).encodeABI();

      const gas = await contract.methods.updateMedicineBox(
        serialNumber,
        boxName,
        manufacturingDate,
        expirationDate
      ).estimateGas({ from: sender });

      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: sender,
        to: contractAddr,
        data: data,
        gas: gas,
        gasPrice: gasPrice
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      setMessage('Hộp thuốc đã được cập nhật thành công. Tx Hash: ' + receipt.transactionHash);
    } catch (err) {
      setError('Lỗi khi cập nhật hộp thuốc: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Cập nhật Hộp Thuốc</h2>
      {serialNumber && <p><strong>Mã Serial:</strong> {serialNumber}</p>}
      <form onSubmit={handleUpdate} style={{ marginTop: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Tên hộp thuốc:</label><br />
          <input
            type="text"
            value={boxName}
            onChange={(e) => setBoxName(e.target.value)}
            placeholder="Nhập tên hộp"
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
          <label>Private Key:</label><br />
          <input
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Nhập private key"
            style={{ padding: '0.5rem', width: '500px' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
          Cập nhật
        </button>
        <button type="button" onClick={() => navigate('/master/hop-thuoc-list')} style={{ padding: '0.5rem 1rem' }}>
          Quay lại danh sách
        </button>
      </form>

      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default MedicineBoxUpdate;
