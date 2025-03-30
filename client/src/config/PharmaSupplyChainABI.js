const PharmaSupplyChainABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "serialNumber",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "enum PharmaSupplyChain.MedicineBoxStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "BoxStatusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "serialNumber",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "distributor",
        "type": "string"
      }
    ],
    "name": "DistributorUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      }
    ],
    "name": "MedicineBatchApproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "batchName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "productionDate",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      }
    ],
    "name": "MedicineBatchCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "serialNumber",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      }
    ],
    "name": "MedicineBoxCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "serialNumber",
        "type": "string"
      }
    ],
    "name": "ProductionBoxApproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "serialNumber",
        "type": "string"
      }
    ],
    "name": "TransportBoxApproved",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "medicineBatches",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "batchName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "productionDate",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "supplier",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "approvedBy",
        "type": "string"
      },
      {
        "internalType": "enum PharmaSupplyChain.BatchStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "medicineBoxes",
    "outputs": [
      {
        "internalType": "string",
        "name": "serialNumber",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "productionApproved",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "transportApproved",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "distributor",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "pharmacyAddress",
        "type": "string"
      },
      {
        "internalType": "enum PharmaSupplyChain.MedicineBoxStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "owner",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturer",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "boxName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturingDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "expirationDate",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "nextBatchId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "participantAddresses",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "participantRegistered",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "participants",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "phone",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "role",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getAllParticipantsWithAddress",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "participantAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "phone",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "role",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "internalType": "struct PharmaSupplyChain.ParticipantWithAddress[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_participant",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_phone",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_role",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "_isActive",
        "type": "bool"
      }
    ],
    "name": "setParticipant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getParticipants",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "phone",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "role",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "internalType": "struct PharmaSupplyChain.Participant[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_batchName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_productionDate",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_quantity",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_supplier",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_approvedBy",
        "type": "string"
      }
    ],
    "name": "createMedicineBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_batchId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_batchName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_productionDate",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_quantity",
        "type": "uint256"
      }
    ],
    "name": "updateMedicineBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_batchId",
        "type": "uint256"
      }
    ],
    "name": "deleteMedicineBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_batchId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_approvedBy",
        "type": "string"
      }
    ],
    "name": "approveMedicineBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_batchId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_serialNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_boxName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_manufacturingDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_expirationDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_manufacturer",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_distributor",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_pharmacyAddress",
        "type": "string"
      }
    ],
    "name": "createMedicineBox",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_serialNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_boxName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_manufacturingDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_expirationDate",
        "type": "string"
      }
    ],
    "name": "updateMedicineBox",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_serialNumber",
        "type": "string"
      }
    ],
    "name": "deleteMedicineBox",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_serialNumber",
        "type": "string"
      }
    ],
    "name": "approveProductionBox",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_serialNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_distributor",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_owner",
        "type": "string"
      }
    ],
    "name": "updateDistributor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_serialNumber",
        "type": "string"
      }
    ],
    "name": "approveTransportBox",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_serialNumber",
        "type": "string"
      },
      {
        "internalType": "enum PharmaSupplyChain.MedicineBoxStatus",
        "name": "_newStatus",
        "type": "uint8"
      }
    ],
    "name": "updateBoxStatusAtPharmacy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_serialNumber",
        "type": "string"
      }
    ],
    "name": "getMedicineBoxDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "serialNumber",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "batchId",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "productionApproved",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "transportApproved",
            "type": "bool"
          },
          {
            "internalType": "string",
            "name": "distributor",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "pharmacyAddress",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "boxStatus",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "owner",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "manufacturer",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "boxName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "manufacturingDate",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "expirationDate",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "batchName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "productionDate",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "quantity",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "supplier",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "approvedBy",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "batchStatus",
            "type": "uint8"
          }
        ],
        "internalType": "struct PharmaSupplyChain.MedicineBoxDetail",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

export default PharmaSupplyChainABI;