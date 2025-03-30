import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from '../config/PharmaSupplyChainABI.js';
import contractAddr from '../config/ContractAddress.js';
import IPConnectGanache from '../config/IPConnectGanache.js';
import { MedicineContext } from './MedicineContext.js';

const contractAddress = contractAddr;

const MedicineBatchList = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  console.log('batches',batches);
  
  const { currentAccount, medicineBatchStatus } = useContext(MedicineContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập';
  const batchStatusEnum = medicineBatchStatus;

  useEffect(() => {
    async function init() {
      const web3Instance = new Web3(IPConnectGanache);
      setWeb3(web3Instance);
      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contractInstance);
    }
    init();
  }, []);

  // Lấy danh sách lô thuốc từ contract
  const fetchBatches = async () => {
    if (!contract) return;
    setError('');
    try {
      const nextBatchId = await contract.methods.nextBatchId().call({ from: accountAddress });
      let batchList = [];
      for (let i = 1; i < Number(nextBatchId); i++) {
        const batch = await contract.methods.medicineBatches(i).call({ from: accountAddress });
        batchList.push(batch);
      }
      setBatches(batchList);
    } catch (err) {
      setError('Lỗi khi lấy danh sách lô thuốc: ' + err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [contract]);

  const handleEdit = (batchId) => {
    navigate(`/master/update-lo-thuoc?batchId=${batchId}`);
  };

  const handleApprove = (batchId, batchName) => {
    navigate(`/master/duyet-lo-thuoc?batchId=${batchId}&batchName=${batchName}`);
  };

  const handleCreateNew = () => {
    navigate('/master/tao-lo-thuoc');
  };

  return (
    <div style={{ padding: '0px' }}>
      <h2>Danh sách lô thuốc</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: '10px', marginBottom: "4px" }}>
        <button onClick={fetchBatches} style={{ padding: '4px 8px', marginRight: '1rem' }}>
          Lấy danh sách
        </button>
        <button onClick={handleCreateNew} style={{ padding: '4px 8px' }}>
          Tạo mới
        </button>
      </div>

      {batches.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: "#aecfd3" }}>
            <tr>
              <th>ID</th>
              <th>Tên lô thuốc</th>
              <th>Ngày sản xuất</th>
              <th>Sản lượng</th>
              <th>Nhà cung cấp</th>
              <th>Cơ quan phê duyệt</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center" }}>{batch.batchId}</td>
                <td>{batch.batchName}</td>
                <td>{batch.productionDate}</td>
                <td>{batch.quantity}</td>
                <td>{batch.supplier}</td>
                <td>{batch.approvedBy}</td>
                <td>
                  {batchStatusEnum
                    ? batchStatusEnum[Number(batch.status)]
                    : "Đang tải..."}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {parseInt(batch.status) === 0 && (
                    <button onClick={() => handleEdit(batch.batchId)} style={{ marginRight: '5px', padding: "3px", width: "45px" }}>
                      Sửa
                    </button>
                  )}
                  <button onClick={() => handleApprove(batch.batchId, batch.batchName)} style={{ padding: "3px", width: "45px" }}>
                    Duyệt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: "#FF0000" }}>Không có lô thuốc nào.</p>
      )}
    </div>
  );
};

export default MedicineBatchList;
