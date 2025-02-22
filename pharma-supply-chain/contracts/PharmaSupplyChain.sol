// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract PharmaSupplyChain {
    // Lô thuốc
    struct Medicine {
        uint id;
        string name;
        string manufacturer;
        uint256 mfgDate;
        uint256 expDate;
        string status;
        address owner;
    }

    // Thông tin để theo dõi
    struct TrackingInfo {
        string location;
        uint256 timestamp;
    }

    // Khai báo mapping lưu trữ data
    mapping(uint => Medicine) public medicines;
    mapping(uint => TrackingInfo[]) public trackingHistory;
    uint public medicineCount;

    event MedicineAdded(uint id, string name, address owner);
    event StatusUpdated(uint id, string status);
    event TrackingUpdated(uint id, string location, uint256 timestamp);

    function addMedicine(
        string memory _name,
        string memory _manufacturer,
        uint256 _mfgDate,
        uint256 _expDate
    ) public {
        medicineCount++;
        medicines[medicineCount] = Medicine(
            medicineCount, 
            _name, 
            _manufacturer, 
            _mfgDate, 
            _expDate, 
            "Manufactured", 
            msg.sender
        );
        
        trackingHistory[medicineCount].push(TrackingInfo("Manufactured", block.timestamp));

        emit MedicineAdded(medicineCount, _name, msg.sender);
    }

    function updateStatus(uint _id, string memory _status) public {
        require(_id > 0 && _id <= medicineCount, "Invalid medicine ID");
        require(msg.sender == medicines[_id].owner, "Only owner can update status");

        medicines[_id].status = _status;
        emit StatusUpdated(_id, _status);
    }

    function addTrackingInfo(uint _id, string memory _location) public {
        require(_id > 0 && _id <= medicineCount, "Invalid medicine ID");

        trackingHistory[_id].push(TrackingInfo(_location, block.timestamp));
        emit TrackingUpdated(_id, _location, block.timestamp);
    }

    function getMedicine(uint _id) public view returns (
        uint, string memory, string memory, uint256, uint256, string memory, address
    ) {
        require(_id > 0 && _id <= medicineCount, "Invalid medicine ID");

        Medicine memory m = medicines[_id];
        return (m.id, m.name, m.manufacturer, m.mfgDate, m.expDate, m.status, m.owner);
    }

    function getTrackingHistory(uint _id) public view returns (TrackingInfo[] memory) {
        require(_id > 0 && _id <= medicineCount, "Invalid medicine ID");
        return trackingHistory[_id];
    }

    // Hàm mới: Lấy danh sách tất cả các lô thuốc
    function getAllMedicine() public view returns (
        uint[] memory, string[] memory, string[] memory, uint256[] memory, uint256[] memory, string[] memory, address[] memory
    ) {
        uint[] memory ids = new uint[](medicineCount);
        string[] memory names = new string[](medicineCount);
        string[] memory manufacturers = new string[](medicineCount);
        uint256[] memory mfgDates = new uint256[](medicineCount);
        uint256[] memory expDates = new uint256[](medicineCount);
        string[] memory statuses = new string[](medicineCount);
        address[] memory owners = new address[](medicineCount);

        for (uint i = 1; i <= medicineCount; i++) {
            Medicine memory m = medicines[i];
            ids[i - 1] = m.id;
            names[i - 1] = m.name;
            manufacturers[i - 1] = m.manufacturer;
            mfgDates[i - 1] = m.mfgDate;
            expDates[i - 1] = m.expDate;
            statuses[i - 1] = m.status;
            owners[i - 1] = m.owner;
        }

        return (ids, names, manufacturers, mfgDates, expDates, statuses, owners);
    }
}
