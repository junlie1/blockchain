// SPDX-License-Identifier: FIT
pragma solidity ^0.8.13;

contract PharmaSupplyChain {
    enum BatchStatus { Created, ApprovedByDrugAuthority, ManufacturerProcessing, Processed }
    enum MedicineBoxStatus { Created, Approved, InTransit, ArrivedAtPharmacy, Sold }

    struct Participant {
        string name;
        string location;
        string phone;
        string role; // SUPPLIER, MANUFACTURER, DISTRIBUTOR, PHARMACY, DRUG_AUTHORITY, GMP_INSPECTOR, TRANSPORT_INSPECTOR
        bool isActive;
    }

    struct ParticipantWithAddress {
    address participantAddress;
    string name;
    string location;
    string phone;
    string role;
    bool isActive;
}

    mapping(address => Participant) public participants;
    address[] public participantAddresses;
    mapping(address => bool) public participantRegistered;

    function getAllParticipantsWithAddress() public view returns (ParticipantWithAddress[] memory) {
    uint256 len = participantAddresses.length;
    ParticipantWithAddress[] memory result = new ParticipantWithAddress[](len);
    
    for (uint256 i = 0; i < len; i++) {
        address addr = participantAddresses[i];
        Participant memory p = participants[addr];
        result[i] = ParticipantWithAddress({
            participantAddress: addr,
            name: p.name,
            location: p.location,
            phone: p.phone,
            role: p.role,
            isActive: p.isActive
        });
    }

    return result;
}

    function setParticipant(
        address _participant,
        string memory _name,
        string memory _location,
        string memory _phone,
        string memory _role,
        bool _isActive
    ) public {
        if (!participantRegistered[_participant]) {
            participantAddresses.push(_participant);
            participantRegistered[_participant] = true;
        }
        participants[_participant] = Participant(_name, _location, _phone, _role, _isActive);
    }

    function getParticipants() public view returns (Participant[] memory) {
        uint256 len = participantAddresses.length;
        Participant[] memory result = new Participant[](len);
        for (uint256 i = 0; i < len; i++) {
            result[i] = participants[participantAddresses[i]];
        }
        return result;
    }

    struct MedicineBatch {
        uint256 batchId;
        string batchName;
        string productionDate;
        uint256 quantity;
        string supplier;
        string approvedBy;
        BatchStatus status;
    }
    mapping(uint256 => MedicineBatch) public medicineBatches;
    uint256 public nextBatchId = 1;

    struct MedicineBox {
        string serialNumber;
        uint256 batchId;
        bool productionApproved;
        bool transportApproved;
        string distributor;
        string pharmacyAddress;
        MedicineBoxStatus status;
        string owner;
        string manufacturer;
        string boxName;
        string manufacturingDate;
        string expirationDate;
    }
    mapping(string => MedicineBox) public medicineBoxes;

    event MedicineBatchCreated(uint256 batchId, string batchName, string productionDate, uint256 quantity);
    event MedicineBatchApproved(uint256 batchId);
    event MedicineBoxCreated(string serialNumber, uint256 batchId);
    event ProductionBoxApproved(string serialNumber);
    event DistributorUpdated(string serialNumber, string distributor);
    event TransportBoxApproved(string serialNumber);
    event BoxStatusUpdated(string serialNumber, MedicineBoxStatus status);

    function createMedicineBatch(
        string memory _batchName,
        string memory _productionDate,
        uint256 _quantity,
        string memory _supplier,
        string memory _approvedBy
    ) public {
        require(participants[msg.sender].isActive, "Participant inactive");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("SUPPLIER")),
            "Only SUPPLIER allowed"
        );

        uint256 currentBatchId = nextBatchId++;

        medicineBatches[currentBatchId] = MedicineBatch({
            batchId: currentBatchId,
            batchName: _batchName,
            productionDate: _productionDate,
            quantity: _quantity,
            supplier: _supplier,
            approvedBy: _approvedBy,
            status: BatchStatus.Created
        });
        emit MedicineBatchCreated(currentBatchId, _batchName, _productionDate, _quantity);
    }

    function updateMedicineBatch(
        uint256 _batchId,
        string memory _batchName,
        string memory _productionDate,
        uint256 _quantity
    ) public {
        require(participants[msg.sender].isActive, "Participant inactive");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("SUPPLIER")),
            "Only SUPPLIER allowed"
        );
        require(medicineBatches[_batchId].batchId != 0, "Batch not found");

        MedicineBatch storage batch = medicineBatches[_batchId];
        require(batch.status == BatchStatus.Created, "Cannot update after approval");

        batch.batchName = _batchName;
        batch.productionDate = _productionDate;
        batch.quantity = _quantity;
    }

    function deleteMedicineBatch(uint256 _batchId) public {
    require(participants[msg.sender].isActive, "Participant inactive");
    require(
        keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("SUPPLIER")),
        "Only SUPPLIER can delete"
    );
    require(medicineBatches[_batchId].batchId != 0, "Batch not found");
    require(medicineBatches[_batchId].status == BatchStatus.Created, "Cannot delete after approval");

    delete medicineBatches[_batchId];
}

    function approveMedicineBatch(uint256 _batchId, string memory _approvedBy) public {
        require(participants[msg.sender].isActive, "Participant inactive");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("DRUG_AUTHORITY")),
            "Only DRUG_AUTHORITY allowed"
        );
        require(medicineBatches[_batchId].batchId != 0, "Batch not found");

        MedicineBatch storage batch = medicineBatches[_batchId];
        batch.approvedBy = _approvedBy;
        batch.status = BatchStatus.ApprovedByDrugAuthority;
        emit MedicineBatchApproved(_batchId);
    }

    function createMedicineBox(
        uint256 _batchId,
        string memory _serialNumber,
        string memory _boxName,
        string memory _manufacturingDate,
        string memory _expirationDate,
        string memory _manufacturer,
        string memory _distributor,
        string memory _pharmacyAddress
    ) public {
        require(participants[msg.sender].isActive, "Participant inactive");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("MANUFACTURER")),
            "Only MANUFACTURER allowed"
        );
        require(medicineBatches[_batchId].batchId != 0, "Batch not found");
        require(
            medicineBatches[_batchId].status == BatchStatus.ApprovedByDrugAuthority,
            "Batch not approved yet"
        );
        require(bytes(medicineBoxes[_serialNumber].serialNumber).length == 0, "Box already exists");

        medicineBoxes[_serialNumber] = MedicineBox({
            serialNumber: _serialNumber,
            batchId: _batchId,
            productionApproved: false,
            transportApproved: false,
            distributor: _distributor,
            pharmacyAddress: _pharmacyAddress,
            status: MedicineBoxStatus.Created,
            owner: _manufacturer,
            manufacturer: _manufacturer,
            boxName: _boxName,
            manufacturingDate: _manufacturingDate,
            expirationDate: _expirationDate
        });
        emit MedicineBoxCreated(_serialNumber, _batchId);
    }

    function updateMedicineBox(
    string memory _serialNumber,
    string memory _boxName,
    string memory _manufacturingDate,
    string memory _expirationDate
    ) public {
        require(participants[msg.sender].isActive, "Participant inactive");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("MANUFACTURER")),
            "Only MANUFACTURER allowed"
        );
        require(bytes(medicineBoxes[_serialNumber].serialNumber).length != 0, "Box not found");

        MedicineBox storage box = medicineBoxes[_serialNumber];
        require(box.productionApproved == false, "Cannot update after production approval");

        box.boxName = _boxName;
        box.manufacturingDate = _manufacturingDate;
        box.expirationDate = _expirationDate;
    }

    function deleteMedicineBox(string memory _serialNumber) public {
    require(participants[msg.sender].isActive, "Participant inactive");
    require(
        keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("MANUFACTURER")),
        "Only MANUFACTURER allowed"
    );
    require(bytes(medicineBoxes[_serialNumber].serialNumber).length != 0, "Box not found");
    require(medicineBoxes[_serialNumber].status == MedicineBoxStatus.Created, "Cannot delete after approval or transit");

    delete medicineBoxes[_serialNumber];
}

    function approveProductionBox(string memory _serialNumber) public {
        require(participants[msg.sender].isActive, "Participant inactive");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("GMP_INSPECTOR")),
            "Only GMP_INSPECTOR allowed"
        );
        require(bytes(medicineBoxes[_serialNumber].serialNumber).length != 0, "Box not found");

        medicineBoxes[_serialNumber].productionApproved = true;
        medicineBoxes[_serialNumber].status = MedicineBoxStatus.Approved;
        emit ProductionBoxApproved(_serialNumber);
    }

    function updateDistributor(string memory _serialNumber, string memory _distributor, string memory _owner) public {
        require(participants[msg.sender].isActive, "Participant inactive");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("DISTRIBUTOR")),
            "Only DISTRIBUTOR allowed"
        );
        require(bytes(medicineBoxes[_serialNumber].serialNumber).length != 0, "Box not found");

        medicineBoxes[_serialNumber].distributor = _distributor;
        medicineBoxes[_serialNumber].owner = _owner;
        medicineBoxes[_serialNumber].status = MedicineBoxStatus.InTransit;
        emit DistributorUpdated(_serialNumber, _owner);
    }

    function approveTransportBox(string memory _serialNumber) public {
        require(participants[msg.sender].isActive, "Participant inactive");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("TRANSPORT_INSPECTOR")),
            "Only TRANSPORT_INSPECTOR allowed"
        );
        require(bytes(medicineBoxes[_serialNumber].serialNumber).length != 0, "Box not found");

        medicineBoxes[_serialNumber].transportApproved = true;
        emit TransportBoxApproved(_serialNumber);
    }

    function updateBoxStatusAtPharmacy(string memory _serialNumber, MedicineBoxStatus _newStatus) public {
        require(participants[msg.sender].isActive, "Participant inactive");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("PHARMACY")),
            "Only PHARMACY allowed"
        );
        require(bytes(medicineBoxes[_serialNumber].serialNumber).length != 0, "Box not found");

        medicineBoxes[_serialNumber].status = _newStatus;
        emit BoxStatusUpdated(_serialNumber, _newStatus);
    }

    struct MedicineBoxDetail {
        string serialNumber;
        uint256 batchId;
        bool productionApproved;
        bool transportApproved;
        string distributor;
        string pharmacyAddress;
        uint8 boxStatus;
        string owner;
        string manufacturer;
        string boxName;
        string manufacturingDate;
        string expirationDate;
        string batchName;
        string productionDate;
        uint256 quantity;
        string supplier;
        string approvedBy;
        uint8 batchStatus;
    }

    function getMedicineBoxDetails(string memory _serialNumber) public view returns (MedicineBoxDetail memory) {
        MedicineBox memory box = medicineBoxes[_serialNumber];
        require(bytes(box.serialNumber).length != 0, "Box not found");
        MedicineBatch memory batch = medicineBatches[box.batchId];
        return MedicineBoxDetail({
            serialNumber: box.serialNumber,
            batchId: box.batchId,
            productionApproved: box.productionApproved,
            transportApproved: box.transportApproved,
            distributor: box.distributor,
            pharmacyAddress: box.pharmacyAddress,
            boxStatus: uint8(box.status),
            owner: box.owner,
            manufacturer: box.manufacturer,
            boxName: box.boxName,
            manufacturingDate: box.manufacturingDate,
            expirationDate: box.expirationDate,
            batchName: batch.batchName,
            productionDate: batch.productionDate,
            quantity: batch.quantity,
            supplier: batch.supplier,
            approvedBy: batch.approvedBy,
            batchStatus: uint8(batch.status)
        });
    }
}
