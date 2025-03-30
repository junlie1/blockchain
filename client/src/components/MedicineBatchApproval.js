import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useSearchParams, useNavigate } from 'react-router-dom';
import contractABI from '../config/PharmaSupplyChainABI.js';
import contractAddr from '../config/ContractAddress.js';
import IPConnectGanache from '../config/IPConnectGanache.js';
import { MedicineContext } from './MedicineContext.js';

const contractAddress = contractAddr;

const MedicineBatchApproval = () => {
  const { currentAccount } = useContext(MedicineContext);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const batchId = searchParams.get('batchId');
  const batchName = searchParams.get('batchName');

  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  
  useEffect(() => {
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);
  
  const handleApproval = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!batchId) {
      setError('Batch ID không hợp lệ.');
      return;
    }
    if (!privateKey || privateKey.trim() === '') {
      setError('Vui lòng nhập private key.');
      return;
    }

    // Kiểm tra quyền
    if (!currentAccount || currentAccount.role !== 'DRUG_AUTHORITY') {
      setError('Chỉ Cục Quản lý Dược (DRUG_AUTHORITY) mới được phê duyệt lô thuốc.');
      return;
    }
    
    try {
      const approverName = currentAccount.name || "";
      const approverAddress = currentAccount.address;

      const data = contract.methods.approveMedicineBatch(batchId, approverName).encodeABI();
      const gas = await contract.methods.approveMedicineBatch(batchId, approverName).estimateGas({ from: approverAddress });
      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: approverAddress,
        to: contractAddress,
        data: data,
        gas: gas,
        gasPrice: gasPrice
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      setMessage('Lô thuốc đã được duyệt thành công. Tx Hash: ' + receipt.transactionHash);
    } catch (err) {
      setError('Lỗi khi duyệt lô thuốc: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '0px' }}>
      <h2>Phê duyệt lô thuốc</h2>
      <br />
      <p><strong>ID lô thuốc:</strong> {batchId}</p>
      <p><strong>Tên lô thuốc:</strong> {batchName}</p>
      <br />
      
      <form onSubmit={handleApproval}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Private Key:</label><br />
          <input
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Nhập private key"
            style={{ padding: '0.5rem', width: '500px' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
          Xác nhận duyệt
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

export default MedicineBatchApproval;
