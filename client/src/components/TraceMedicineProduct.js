import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import contractABI from '../config/PharmaSupplyChainABI.js';
import contractAddr from '../config/ContractAddress.js';
import IPConnectGanache from '../config/IPConnectGanache.js';
import { MedicineContext } from './MedicineContext.js';
import { QRCodeCanvas } from 'qrcode.react';

const contractAddress = contractAddr;

const TraceMedicineProduct = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [traceResult, setTraceResult] = useState(null);
  const [error, setError] = useState('');

  const { currentAccount, accountList, batchStatus, medicineBoxStatus } = useContext(MedicineContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập';

  useEffect(() => {
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);

  const handleTrace = async (e) => {
    e.preventDefault();
    setError('');
    setTraceResult(null);
    if (!contract || serialNumber.trim() === '') {
      setError('Vui lòng nhập Serial Number hợp lệ.');
      return;
    }
    try {
      const details = await contract.methods.getMedicineBoxDetails(serialNumber).call({ from: accountAddress });
      setTraceResult(details);
    } catch (err) {
      setError('Lỗi khi truy xuất: ' + err.message);
      console.error(err);
    }
  };

  function stringifyWithBigInt(obj) {
    return JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
  }
  
  return (
    <div style={{ padding: '0px' }}>
      <h2>Truy xuất nguồn gốc sản phẩm thuốc</h2>
      <br></br>
      <form onSubmit={handleTrace}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Serial Number (mã hộp thuốc):</label><br />
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="Serial Number (mã hộp thuốc):"
            style={{ padding: '0.5rem', width: '200px' }}
            required
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: "10px" }}>
            Truy xuất
          </button>
        </div>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      {traceResult && (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h3 style={{ color: "blue" }}>Kết quả</h3>

          <p><strong>Serial Number (mã hộp thuốc):</strong> {traceResult.serialNumber}</p>
          <p><strong>Sản phẩm:</strong> {traceResult.boxName}</p>
          <p><strong>Ngày sản xuất:</strong> {traceResult.manufacturingDate}</p>
          <p><strong>Ngày hết hạn:</strong> {traceResult.expirationDate}</p>
          <p>
            <div><strong>Phê duyệt sản xuất (GMP):</strong>{' '}</div>
            {traceResult.productionApproved ? <img
              src={require('./images/gmp.jpg')}
              alt="GMP Inspector"
              style={{ maxWidth: '100%', margin: '1rem 20px', width: "150px", height: "150px" }}
            /> : 'Chưa phê duyệt'}
          </p>
          <p><strong>Trạng thái hộp thuốc:</strong> {medicineBoxStatus?.[parseInt(traceResult.boxStatus)] || ""}</p>

          <hr style={{width: "400px", margin: "10px 0px 10px 0px"}}></hr>
          <p><strong>Lô thuốc:</strong> {traceResult.batchId}</p>
          <p>
            <div><strong>Phê duyệt vận chuyển:</strong>{' '}</div>
            {traceResult.transportApproved ? <img
              src={require('./images/transport_authority.png')}
              alt="Transport Inspector"
              style={{ maxWidth: '100%', margin: '1rem 20px', width: "150px", height: "150px" }}
            /> : 'Chưa phê duyệt'}
          </p>
          <p><strong>Nhà phân phối:</strong> {traceResult.distributor}</p>
          <p><strong>Nhà thuốc nhận:</strong> {traceResult.pharmacyAddress}</p>
          <p><strong>Tên lô:</strong> {traceResult.batchName}</p>
          <p><strong>Ngày sản xuất lô:</strong> {traceResult.productionDate}</p>
          <p><strong>Số lượng:</strong> {traceResult.quantity}</p>
          <p><strong>Nhà cung cấp nguyên liệu:</strong> {traceResult.supplier}</p>
          <p>
            <div><strong>Phê duyệt (Cơ quan quản lý dược):</strong> {traceResult.approvedBy}</div>
            {traceResult.approvedBy ? <img
              src={require('./images/drug_authority.png')}
              alt="Drug Authority"
              style={{ maxWidth: '100%', margin: '1rem 20px', width: "150px", height: "150px" }}
            /> : 'Chưa phê duyệt'}
          </p>
          <p><strong>Trạng thái lô thuốc:</strong> {batchStatus?.[parseInt(traceResult.batchStatus)] || ""}</p>
          <div style={{ marginTop: '1rem' }}>
          <h4>Mã QR truy xuất thông tin thuốc</h4>
          <QRCodeCanvas value={stringifyWithBigInt({
            serialNumber: traceResult.serialNumber,
            boxName: traceResult.boxName,
            manufacturingDate: traceResult.manufacturingDate,
            expirationDate: traceResult.expirationDate,
            batchId: traceResult.batchId,
            pharmacy: traceResult.pharmacyAddress
          })} size={200} />
        </div>
        </div>
      )}
    </div>
  );
};

export default TraceMedicineProduct;
