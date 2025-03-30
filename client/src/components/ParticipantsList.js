import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from '../config/PharmaSupplyChainABI.js';
import contractAddr from '../config/ContractAddress.js';
import IPConnectGanache from '../config/IPConnectGanache.js';
import { MedicineContext } from './MedicineContext.js';

// Thay bằng địa chỉ contract triển khai của bạn
const contractAddress = contractAddr;

const ParticipantsList = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Lấy địa chỉ của tài khoản hiện tại
  const { currentAccount, accountList } = useContext(MedicineContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập'
  console.log('accountAddress',accountAddress);

  useEffect(() => {
    // Khởi tạo web3 sử dụng provider của Ganache
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);

    // Tạo instance contract từ ABI và địa chỉ contract
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);

  // Hàm gọi smart contract để lấy toàn bộ dữ liệu Participant.
  const fetchParticipants = async () => {
    setError('');
    try {
      // Gọi hàm getParticipants() không cần tham số, sử dụng hardcodedAccount.
      const result = await contract.methods.getParticipants().call({ from: accountAddress });
      console.log('result',result);
      // result là mảng các struct Participant: mỗi phần tử có các trường: name, location, phone, role, isActive
      setParticipants(result);
    } catch (err) {
      setError('Lỗi khi lấy dữ liệu: ' + err.message);
      console.error(err);
    }
  };

  const activateParticipant = async (participant) => {
    setError('');
    try {
      if (!contract) {
        setError('Hợp đồng chưa được khởi tạo!');
        return;
      }
      // Sử dụng tài khoản hiện tại (hoặc tài khoản admin nếu có) làm người gửi giao dịch.
      // Lưu ý: Thông thường chỉ ADMIN mới được phép cập nhật thông tin, 
      // nên nếu cần bạn có thể chỉ định một tài khoản ADMIN cụ thể.
      await contract.methods.setParticipant(
        participant.address,  // Địa chỉ của participant cần cập nhật
        participant.name,
        participant.location,
        participant.phone,
        participant.role,
        true // Đặt isActive = true
      ).send({ from: accountAddress });
      
      alert(`Tài khoản ${participant.name} đã được kích hoạt!`);
      // Sau khi gọi thành công, làm mới danh sách thành phần
      fetchParticipants();
    } catch (err) {
      setError('Lỗi khi kích hoạt tài khoản: ' + err.message);
      console.error(err);
    }
  };

  
  // Hàm chuyển sang trang Trang chủ
  const backHome = () => {
    navigate('/master/trang-chu');
  };

  return (
    <div style={{ padding: '0px' }}>
      <h2>Danh sách thành phần tham gia</h2>
      <button onClick={fetchParticipants} style={{ padding: '4px 8px', marginTop: "5px" }}>
        Làm mới dữ liệu
      </button>
      <button onClick={backHome} style={{ padding: '4px 8px 4px 8px', marginTop: "5px", marginLeft: "10px" }}>
        Trở về
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {participants.length > 0 && (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: '2px', width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{backgroundColor: "#aecfd3"}}>
            <tr>
              <th style={{padding: "3px"}}>Tên thành phần</th>
              <th style={{padding: "3px"}}>Địa chỉ</th>
              <th style={{padding: "3px"}}>Điện thoại</th>
              <th style={{padding: "3px"}}>Quyền</th>
              <th style={{padding: "3px"}}>Active</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, index) => (
              <tr key={index}>
                <td style={{ padding: "2px" }}>{p.name}</td>
                <td style={{ padding: "2px" }}>{p.location}</td>
                <td style={{ padding: "2px" }}>{p.phone}</td>
                <td style={{ padding: "2px" }}>{p.role}</td>
                <td style={{ padding: "2px", textAlign: "center" }}>
                  {p.isActive ? 'Yes' : 'No'}
                </td>
                <td style={{ padding: "2px", textAlign: "center" }}>
                  {!p.isActive && (
                    <button onClick={() => activateParticipant(p)} style={{ padding: "4px 8px" }}>
                      Kích hoạt
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ParticipantsList;
