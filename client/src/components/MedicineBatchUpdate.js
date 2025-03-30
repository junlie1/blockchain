import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useSearchParams, useNavigate } from 'react-router-dom';
import contractABI from '../config/PharmaSupplyChainABI.js';
import contractAddr from '../config/ContractAddress.js';
import IPConnectGanache from '../config/IPConnectGanache.js';
import { MedicineContext } from './MedicineContext.js';

const contractAddress = contractAddr;

const MedicineBatchUpdate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const batchId = searchParams.get('batchId');

  const { currentAccount } = useContext(MedicineContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập';

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [batchName, setBatchName] = useState('');
  const [productionDate, setProductionDate] = useState('');
  const [quantity, setQuantity] = useState('');
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
    if (contract && batchId) {
      fetchBatchDetails();
    }
  }, [contract, batchId]);

  const fetchBatchDetails = async () => {
    try {
      const batch = await contract.methods.medicineBatches(batchId).call({ from: accountAddress });
      if (parseInt(batch.status) !== 0) {
        setError('Lô thuốc đã được duyệt. Không thể cập nhật.');
        return;
      }
      setBatchName(batch.batchName);
      setProductionDate(batch.productionDate);
      setQuantity(batch.quantity);
    } catch (err) {
      setError('Không thể lấy thông tin lô thuốc: ' + err.message);
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

    if (!currentAccount || currentAccount.role !== 'SUPPLIER') {
      setError('Chỉ SUPPLIER mới được phép cập nhật lô thuốc.');
      return;
    }

    try {
      const supplier = currentAccount.address;
      const data = contract.methods.updateMedicineBatch(batchId, batchName, productionDate, quantity).encodeABI();
      const gas = await contract.methods.updateMedicineBatch(batchId, batchName, productionDate, quantity).estimateGas({ from: supplier });
      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: supplier,
        to: contractAddress,
        data: data,
        gas: gas,
        gasPrice: gasPrice
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      setMessage('Lô thuốc đã được cập nhật thành công. Tx Hash: ' + receipt.transactionHash);
    } catch (err) {
      setError('Lỗi khi cập nhật lô thuốc: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Cập nhật Lô Thuốc</h2>
      {batchId && <p><strong>Mã Lô:</strong> {batchId}</p>}
      <form onSubmit={handleUpdate} style={{ marginTop: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Tên Lô Thuốc:</label><br />
          <input
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            placeholder="Nhập tên lô"
            style={{ padding: '0.5rem', width: '400px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Ngày Sản Xuất:</label><br />
          <input
            type="text"
            value={productionDate}
            onChange={(e) => setProductionDate(e.target.value)}
            placeholder="dd/mm/yyyy"
            style={{ padding: '0.5rem', width: '200px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Số lượng:</label><br />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Nhập số lượng"
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
        <button type="button" onClick={() => navigate('/master/lo-thuoc-list')} style={{ padding: '0.5rem 1rem' }}>
          Quay lại danh sách
        </button>
      </form>

      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default MedicineBatchUpdate;
