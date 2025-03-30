import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from '../config/PharmaSupplyChainABI.js';
import contractAddr from '../config/ContractAddress.js';
import IPConnectGanache from '../config/IPConnectGanache.js';
import { MedicineContext } from './MedicineContext.js';

const contractAddress = contractAddr;

const MedicineBoxList = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [medicineBoxes, setMedicineBoxes] = useState([]);
  const [error, setError] = useState('');
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [serialNumberSearch, setSerialNumberSearch] = useState('');
  const navigate = useNavigate();
  console.log('medicineBoxes',medicineBoxes);

  const { currentAccount, medicineBoxStatus } = useContext(MedicineContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập';
  const medicineBoxStatusEnum = medicineBoxStatus;

  useEffect(() => {
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);

  const fetchMedicineBoxes = async () => {
    if (!contract) return;
    setError('');
    try {
      const serial = serialNumberSearch.trim();
      if (!serial) {
        setError('Vui lòng nhập serial number hợp lệ.');
        return;
      }

      const details = await contract.methods.getMedicineBoxDetails(serial).call({ from: accountAddress });
      setMedicineBoxes([details]);
    } catch (err) {
      setError('Lỗi khi lấy thông tin hộp thuốc: ' + err.message);
      console.error(err);
    }
  };

  const handleEdit = (serial) => {
    navigate(`/master/update-hop-thuoc?serialNumber=${serial}`);
  };

  const handleApprove = (serial, boxName) => {
    navigate(`/master/duyet-hop-thuoc?serialNumber=${serial}&boxName=${boxName}`);
  };

  const handleCreateNew = () => {
    navigate('/master/tao-hop-thuoc');
  };

  return (
    <div style={{ padding: '0px' }}>
      <h2>Danh sách hộp thuốc</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '1rem', marginBottom: "5px" }}>
        <label>Serial Number (Mã hộp thuốc):</label><br />
        <input
          type="text"
          value={serialNumberSearch}
          onChange={(e) => setSerialNumberSearch(e.target.value)}
          style={{ padding: '0.5rem', width: '200px', marginRight: "10px" }}
          required
        />
        <button onClick={fetchMedicineBoxes} style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
          Tìm hộp thuốc
        </button>
        <button onClick={handleCreateNew} style={{ padding: '0.5rem 1rem' }}>
          Tạo mới hộp thuốc
        </button>
      </div>

      {medicineBoxes.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: "#aecfd3" }}>
            <tr>
              <th>Serial Number</th>
              <th>ID Lô thuốc</th>
              <th>Tên hộp thuốc</th>
              <th>Ngày sản xuất</th>
              <th>Ngày hết hạn</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {medicineBoxes.map((box, index) => (
              <tr key={index}>
                <td>{box.serialNumber}</td>
                <td style={{ textAlign: "center" }}>{box.batchId}</td>
                <td>{box.boxName}</td>
                <td>{box.manufacturingDate}</td>
                <td>{box.expirationDate}</td>
                <td>{medicineBoxStatusEnum[box.boxStatus] || ""}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button onClick={() => handleEdit(box.serialNumber)} style={{ marginRight: '5px', padding: "3px", width: "45px" }}>
                    Sửa
                  </button>
                  <button onClick={() => handleApprove(box.serialNumber, box.boxName)} style={{ padding: "3px", width: "45px" }}>
                    Duyệt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có hộp thuốc nào.</p>
      )}
    </div>
  );
};

export default MedicineBoxList;
