import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from '../config/PharmaSupplyChainABI.js';
import contractAddr from '../config/ContractAddress.js';
import IPConnectGanache from '../config/IPConnectGanache.js';
import { MedicineContext } from './MedicineContext.js';

const contractAddress = contractAddr;

const TransportInspectorApproval = () => {
  const { currentAccount } = useContext(MedicineContext);
  const navigate = useNavigate();

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [medicineBox, setMedicineBox] = useState(null);
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);

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
      if (parseInt(details.boxStatus) === 2) { // 2 = InTransit
        setMedicineBox(details);
      } else {
        setError('Hộp thuốc không ở trạng thái InTransit.');
      }
    } catch (err) {
      setError('Lỗi khi tìm kiếm hộp thuốc: ' + err.message);
    }
  };

  const handleApproveTransport = async (e) => {
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

    // ✅ Kiểm tra quyền
    if (!currentAccount || currentAccount.role !== 'TRANSPORT_INSPECTOR') {
      setError('Chỉ TRANSPORT_INSPECTOR mới được phép phê duyệt vận chuyển.');
      return;
    }

    try {
      const authority = currentAccount.address;

      const data = contract.methods.approveTransportBox(serialNumber).encodeABI();
      const gas = await contract.methods.approveTransportBox(serialNumber).estimateGas({ from: authority });
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

      setMessage(`✅ Hộp thuốc ${serialNumber} đã được phê duyệt vận chuyển. Tx Hash: ${receipt.transactionHash}`);
      setMedicineBox(null);
    } catch (err) {
      let errorMessage = 'Lỗi khi phê duyệt vận chuyển.';
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
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Phê duyệt vận chuyển - Kiểm định</h2>

      {/* Nhập Serial Number */}
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

      {/* Hiển thị thông tin nếu tìm thấy */}
      {medicineBox && (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h3>Thông tin hộp thuốc</h3>
          <p><strong>Serial Number:</strong> {medicineBox.serialNumber}</p>
          <p><strong>Tên sản phẩm:</strong> {medicineBox.boxName}</p>
          <p><strong>Ngày sản xuất:</strong> {medicineBox.manufacturingDate}</p>
          <p><strong>Ngày hết hạn:</strong> {medicineBox.expirationDate}</p>
          <p><strong>Trạng thái:</strong> InTransit</p>

          <form onSubmit={handleApproveTransport}>
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
              ✅ Phê duyệt vận chuyển
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TransportInspectorApproval;
