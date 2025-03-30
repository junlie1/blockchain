import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { MedicineContext } from './MedicineContext';

function Master() {
  const { currentAccount } = useContext(MedicineContext);
  const role = currentAccount ? currentAccount.role : 'Chưa đăng nhập';
  const name = currentAccount ? currentAccount.name : '';
  const navigate = useNavigate();

  const handleNavigateLogin = () => {
   navigate('/');
  }
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#00CCFF'
      }}>
        <img
          src={require('./images/icon.jpg')}
          alt="Chuỗi cung ứng thuốc"
          style={{ height: "50px", borderRadius: '20px'}}
        />
        <h1 style={{ margin: 0, color: "#00008b" }}>Chuỗi cung ứng thuốc</h1>
        <div>
          <div style={{ fontWeight: 'bold', textAlign: 'right', cursor: 'pointer' }} onClick={handleNavigateLogin}>Đăng nhập:</div>
          <div>{name} - {role}</div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div style={{ display: 'flex', minHeight: '80vh' }}>
        {/* Sidebar */}
        <div style={{
          width: '220px',
          backgroundColor: '#e8f5e9',
          borderRight: '1px solid #ddd',
          padding: '1rem'
        }}>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/trang-chu">🏠 Trang chủ</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/thanh-phan-tham-gia">👥 Thành phần tham gia</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/lo-thuoc-list">📦 Lô thuốc</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/hop-thuoc-list">💊 Hộp thuốc</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/cap-nhat-nha-thuoc">🏪 Nhà phân phối cập nhật hộp thuốc</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/kiem-dinh-van-chuyen">🚚 Kiểm định vận chuyển</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/cap-nhat-trang-thai-hop-thuoc">📥Nhà thuốc cập nhật trạng thái hộp thuốc</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/master/truy-xuat-thuoc">🔍 Truy xuất nguồn gốc</Link>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '1rem' }}>
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '0.5rem',
        backgroundColor: '#cce5ff',
        fontWeight: 'bold',
        color: '#5a6461',
        fontSize: "50px"
      }}>
        Nhóm 02 - Blockchain | Thầy Hồ Văn Quí | Tiểu luận
      </div>
    </div>
  );
}

export default Master;
