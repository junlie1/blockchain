// MedicineContext.js
import React, { createContext, useState } from 'react';

// Tạo Context mới cho hệ thống chuỗi cung ứng thuốc
export const MedicineContext = createContext();

// Provider để bọc toàn bộ ứng dụng
export function MedicineProvider({ children }) {
  // Lưu danh sách các tài khoản trong mạng blockchain
  const [accountList, setAccountList] = useState([]);
  // Lưu tài khoản hiện tại đang đăng nhập
  const [currentAccount, setCurrentAccount] = useState(null);
  // Trạng thái của lô thuốc (MedicineBatch)
  const [medicineBatchStatus, setMedicineBatchStatus] = useState(null);
  // Trạng thái của hộp thuốc (MedicineBox)
  const [medicineBoxStatus, setMedicineBoxStatus] = useState(null);

  return (
    <MedicineContext.Provider value={{
      accountList,
      setAccountList,
      currentAccount,
      setCurrentAccount,
      medicineBatchStatus,
      setMedicineBatchStatus,
      medicineBoxStatus,
      setMedicineBoxStatus
    }}>
      {children}
    </MedicineContext.Provider>
  );
}
