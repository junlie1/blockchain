import HomePage from "../pages/HomePage/HomePage";
import MedicineDetail from "../pages/MedicineDetail/MedicineDetail";

export const routes = [
    {
        path: '',
        page: HomePage
    },
    {
        path: '/medicine/:id',
        page: MedicineDetail
    }
]