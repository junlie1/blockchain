import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useSearchParams, useNavigate } from 'react-router-dom';
import contractABI from '../config/PharmaSupplyChainABI.js';
import contractAddr from '../config/ContractAddress.js';
import IPConnectGanache from '../config/IPConnectGanache.js';
import { MedicineContext } from './MedicineContext.js';

const contractAddress = contractAddr;

const MedicineBoxApproval = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serialNumber = searchParams.get('serialNumber');
  const boxName = searchParams.get('boxName');

  const { currentAccount } = useContext(MedicineContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập';

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

    // Kiểm tra đầu vào
    if (!serialNumber) {
      setError('Serial Number không hợp lệ.');
      return;
    }

    if (!privateKey || privateKey.trim() === '') {
      setError('Vui lòng nhập private key.');
      return;
    }

    // ✅ Kiểm tra vai trò
    if (!currentAccount || currentAccount.role !== 'GMP_INSPECTOR') {
      setError('Chỉ GMP_INSPECTOR mới được phép xét duyệt hộp thuốc.');
      return;
    }

    try {
      const authority = currentAccount.address;
      const data = contract.methods.approveProductionBox(serialNumber).encodeABI();
      const gas = await contract.methods.approveProductionBox(serialNumber).estimateGas({ from: authority });
      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: authority,
        to: contractAddress,
        data: data,
        gas: gas,
        gasPrice: gasPrice
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      setMessage('Hộp thuốc đã được duyệt thành công. Tx Hash: ' + receipt.transactionHash);
    } catch (err) {
      let errorMessage = 'Lỗi khi xét duyệt hộp thuốc.';
      try {
        if (err.message && err.message.includes('revert')) {
          const match = err.message.match(/revert\s(.+?)(\\n|$)/);
          if (match && match[1]) {
            errorMessage = 'Smart contract từ chối: ' + match[1];
          } else {
            errorMessage = err.message;
          }
        } else if (err?.data && typeof err.data === 'object') {
          const reason = Object.values(err.data)[0]?.reason;
          if (reason) errorMessage = 'Smart contract từ chối: ' + reason;
        } else if (err?.reason) {
          errorMessage = 'Smart contract từ chối: ' + err.reason;
        } else if (err?.message) {
          errorMessage = err.message;
        }
      } catch (extractErr) {
        console.warn("Không thể phân tích lỗi:", extractErr);
      }

      setError(errorMessage);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Xét duyệt Hộp Thuốc</h2>
      <br />
      <p><strong>Serial Number:</strong> {serialNumber}</p>
      <p><strong>Tên hộp thuốc:</strong> {boxName}</p>
      <br />
      <form onSubmit={handleApproval} style={{ marginTop: '1rem' }}>
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
          Xét duyệt
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

export default MedicineBoxApproval;
