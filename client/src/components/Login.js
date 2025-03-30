import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import IPConnectGanache from '../config/IPConnectGanache.js';
import contractABI from '../config/PharmaSupplyChainABI.js';
import contractAddr from '../config/ContractAddress.js';
import { MedicineContext } from './MedicineContext.js';
import {
  Container,
  LoginCard,
  Title,
  SelectBox,
  LoginButton,
  ErrorText,
  BackgroundOverlay
} from './LoginStyle';
import loginBg from '../assets/loginBg.jpg'; 

function Login() {
  const navigate = useNavigate();
  const [ganacheAccounts, setGanacheAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [error, setError] = useState('');
  const {
    setAccountList,
    setCurrentAccount,
    setMedicineBatchStatus,
    setMedicineBoxStatus
  } = useContext(MedicineContext);

  const accountList = [
    { role: 'ADMIN', name: 'Quản trị', address: '0x666c5d116063958e01b893392f021A24938e2078' },
    { role: 'SUPPLIER', name: 'Nhà cung cấp nguyên liệu', address: '0x76FBAAd666A640AAE1c73a95E6A885FE391f9cD3' },
    { role: 'MANUFACTURER', name: 'Nhà sản xuất thuốc', address: '0x3A700c1e1904BA7bab2B61BD029EFCEB7cBa40d0' },
    { role: 'DISTRIBUTOR', name: 'Nhà phân phối thuốc', address: '0xbfa6EFF7002937029ab2aD0B0089567F77e99C0A' },
    { role: 'PHARMACY', name: 'Nhà thuốc', address: '0xA2896fb041D6eF834494e67Ef100f391F345c6FC' },
    { role: 'DRUG_AUTHORITY', name: 'Cục quản lý dược', address: '0x7b6e2dC9D1B0a9B36e505E714d64104ACc637598' },
    { role: 'GMP_INSPECTOR', name: 'Thanh tra GMP', address: '0xCf81B5675e0CE66C532a6B77678a0f5e54f5479B' },
    { role: 'TRANSPORT_INSPECTOR', name: 'Kiểm định vận chuyển', address: '0xAE84Ed1b39745069dcf1FCA1bD6C41Ab87F8Baee' }
  ];

  const medicineBatchStatus = {
    0: "Tạo mới",
    1: "Đã được DRUG_AUTHORITY duyệt",
    2: "Đang sản xuất",
    3: "Hoàn tất sản xuất"
  };

  const medicineBoxStatus = {
    0: "Tạo mới",
    1: "Đã được GMP_INSPECTOR duyệt",
    2: "Đang vận chuyển",
    3: "Tại nhà thuốc",
    4: "Đã bán"
  };

  function fetchAccounts() {
    const web3 = new Web3(IPConnectGanache);
    web3.eth.getAccounts()
      .then((accounts) => setGanacheAccounts(accounts))
      .catch((err) => console.error('Lỗi khi lấy account từ Ganache:', err));
  }

  useEffect(() => {
    fetchAccounts();
    setAccountList(accountList);
  }, []);

  async function handleLogin() {
    setError('');
    if (!selectedAccount) {
      setError('Vui lòng chọn tài khoản!');
      return;
    }

    if (ganacheAccounts.includes(selectedAccount)) {
      const account = accountList.find(acc => acc.address === selectedAccount);
      setCurrentAccount(account);
      setMedicineBatchStatus(medicineBatchStatus);
      setMedicineBoxStatus(medicineBoxStatus);
      navigate('/master/trang-chu');
    } else {
      setError('Tài khoản không hợp lệ hoặc không khớp với Ganache.');
    }
  }

  return (
    <Container style={{ backgroundImage: `url(${loginBg})` }}>
      <BackgroundOverlay />
      <LoginCard>
        <Title>Đăng nhập hệ thống</Title>

        <SelectBox value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
          <option value="">Chọn tài khoản</option>
          {accountList.map((acc, index) => (
            <option key={index} value={acc.address}>
              {acc.name} - {acc.role}
            </option>
          ))}
        </SelectBox>

        <LoginButton onClick={handleLogin}>Đăng nhập</LoginButton>

        {error && <ErrorText>{error}</ErrorText>}
      </LoginCard>
    </Container>
  );
}

export default Login;
