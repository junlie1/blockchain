import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login.js';
import Master from './components/Master';
import Home from './components/Home.js';
import ParticipantsList from './components/ParticipantsList';
import MedicineBatchList from './components/MedicineBatchList';
import MedicineBatchForm from './components/MedicineBatchForm';
import MedicineBatchApproval from './components/MedicineBatchApproval';
import MedicineBoxForm from './components/MedicineBoxForm';
import MedicineBoxList from "./components/MedicineBoxList.js";
import MedicineBoxApproval from "./components/MedicineBoxApproval.js";
import TraceMedicineProduct from './components/TraceMedicineProduct';
import TransportInspectorApproval from './components/TransportInspectorApproval.js';
import PharmacyBoxStatusUpdate from './components/PharmacyBoxStatusUpdate.js';
import DestributorUpdate from './components/DestributorUpdate.js';
import MedicineBatchUpdate from './components/MedicineBatchUpdate.js';
import MedicineBoxUpdate from './components/MedicineBoxUpdate.js';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/master" element={<Master />}>
        {/* Các route con hiển thị trong <Outlet> của Master */}
        <Route path="trang-chu" element={<Home />} />
        <Route path="thanh-phan-tham-gia" element={<ParticipantsList />} />
        <Route path="lo-thuoc-list" element={<MedicineBatchList />} />
        <Route path="tao-lo-thuoc" element={<MedicineBatchForm />} />
        <Route path="update-lo-thuoc" element={<MedicineBatchUpdate />} />
        <Route path="duyet-lo-thuoc" element={<MedicineBatchApproval />} />
        <Route path="tao-hop-thuoc" element={<MedicineBoxForm />} />
        <Route path="hop-thuoc-list" element={<MedicineBoxList />} />
        <Route path="duyet-hop-thuoc" element={<MedicineBoxApproval />} />
        <Route path="update-hop-thuoc" element={<MedicineBoxUpdate />} />
        <Route path="truy-xuat-thuoc" element={<TraceMedicineProduct />} />
        <Route path="cap-nhat-nha-thuoc" element={<DestributorUpdate />} />
        <Route path="kiem-dinh-van-chuyen" element={<TransportInspectorApproval />} />
        <Route path="cap-nhat-trang-thai-hop-thuoc" element={<PharmacyBoxStatusUpdate />} />
      </Route>
    </Routes>
  );
}

export default App;
