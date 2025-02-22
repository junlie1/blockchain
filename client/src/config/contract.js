import web3 from "./web3";
import PharmaSupplyChain from "./PharmaSupplyChain.json";

const contractAddress = "0x6cF669308C7965d122501e3FF1662b46b92F7bDC";
const contract = new web3.eth.Contract(PharmaSupplyChain.abi, contractAddress);

export default contract;
