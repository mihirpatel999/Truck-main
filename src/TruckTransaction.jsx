
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// import CancelButton from './CancelButton';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckTransaction() {
//   const location = useLocation();

//   const [formData, setFormData] = useState({
//     transactionId: null, truckNo: '', transactionDate: '', cityName: '',
//     transporter: '', amountPerTon: '', truckWeight: '', deliverPoint: '', remarks: ''
//   });

//   const [plantList, setPlantList] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [newRow, setNewRow] = useState({
//     detailId: null, plantName: '', loadingSlipNo: '', qty: '',
//     priority: '', remarks: '', freight: 'To Pay'
//   });
//   const [message, setMessage] = useState('');

//   // Red asterisk for required fields
//   const requiredStar = <span style={{ color: 'red', marginLeft: 2 }}>*</span>;

//   useEffect(() => {
//     const truckNo = location?.state?.truckNo;
//     if (truckNo) fetchTruckDetails(truckNo);
//   }, [location?.state?.truckNo]);

//   useEffect(() => {
//     axios.get(`${API_URL}/api/plants`)
//       .then(res => setPlantList(res.data))
//       .catch(err => console.error('Error fetching plants:', err));
//   }, []);

//   const fetchTruckDetails = async (truckNo) => {
//     try {
//       const res = await axios.get(`${API_URL}/api/truck-transaction/${truckNo}`);
//       const { master, details } = res.data;
//       setFormData({
//         transactionId: master.transactionid,
//         truckNo: master.truckno,
//         transactionDate: master.transactiondate?.split('T')[0] || '',
//         cityName: master.cityname,
//         transporter: master.transporter,
//         amountPerTon: master.amountperton,
//         truckWeight: master.truckweight,
//         deliverPoint: master.deliverpoint,
//         remarks: master.remarks
//       });
//       setTableData(details.map(row => ({
//         detailId: row.detailid,
//         plantName: row.plantname,
//         loadingSlipNo: row.loadingslipno,
//         qty: row.qty,
//         priority: row.priority,
//         remarks: row.remarks,
//         freight: row.freight
//       })));
//     } catch (err) {
//       if (err.response?.status === 409) {
//         setMessage('🚫 Truck is already in transport. Please complete Check-Out first.');
//       } else if (err.response?.status === 404) {
//         setMessage('Truck not found. You can create a new transaction.');
//       } else {
//         console.error('Error loading truck details:', err);
//         setMessage('❌ Failed to load truck details.');
//       }
//     }
//   };

//   const handleChange = (e) => {
//     let { name, value } = e.target;

//     if (name === 'truckNo') {
//       value = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 11).toUpperCase();
//       setFormData({ ...formData, truckNo: value });
//     } else if (name === 'priority' || name === 'qty') {
//       value = value.replace(/[^0-9]/g, '');
//       if (name === 'priority') {
//         setTableData((prevData) => {
//           const updatedData = [...prevData];
//           updatedData[editingIndex][name] = value;
//           return updatedData;
//         });
//       } else {
//         setFormData({ ...formData, [name]: value });
//       }
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleNewRowChange = (e) => {
//     const { name, value } = e.target;
//     let cleanedValue = value;

//     if (name === 'priority' || name === 'qty') {
//       cleanedValue = value.replace(/[^0-9]/g, '');
//     }

//     setNewRow({ ...newRow, [name]: cleanedValue });
//   };

//   const handleRowChange = (idx, e) => {
//     const { name, value } = e.target;
//     let cleanedValue = value;

//     if (name === 'priority' || name === 'qty') {
//       cleanedValue = value.replace(/[^0-9]/g, '');
//     }

//     const updated = [...tableData];
//     updated[idx][name] = cleanedValue;
//     setTableData(updated);
//   };

//   const handleEditRow = (idx) => {
//     setEditingIndex(idx);
//   };

//   const handleUpdateRow = (idx) => {
//     const updatedPriority = tableData[idx].priority;
//     const duplicate = tableData.some((row, i) => i !== idx && row.priority === updatedPriority);
//     if (duplicate) {
//       setMessage(`❌ Priority ${updatedPriority} already exists in another row. Please choose a different priority.`);
//       return;
//     }
//     setEditingIndex(null);
//   };

//   const handleDeleteRow = (idx) => {
//     setTableData(tableData.filter((_, i) => i !== idx));
//     setEditingIndex(null);
//   };

//   const addOrUpdateRow = () => {
//     if (!newRow.plantName || !newRow.loadingSlipNo || !newRow.qty || !newRow.priority) {
//       setMessage("❌ Please fill all required fields in the new row.");
//       return;
//     }

//     const selectedPlants = tableData.map(r => r.plantName);
//     if (selectedPlants.includes(newRow.plantName)) {
//       setMessage(`❌ Plant ${newRow.plantName} is already selected.`);
//       return;
//     }

//     const existingPriorities = tableData.map(r => r.priority);
//     if (existingPriorities.includes(newRow.priority)) {
//       setMessage(`❌ Priority ${newRow.priority} already exists. Please choose a different priority.`);
//       return;
//     }

//     setTableData([...tableData, { ...newRow, detailId: null }]);
//     setNewRow({ detailId: null, plantName: '', loadingSlipNo: '', qty: '', priority: '', remarks: '', freight: 'To Pay' });
//     setMessage('');
//   };

//   // --- Validation logic for all required fields ---
//   const requiredFormFields = [
//     'truckNo', 'transactionDate', 'cityName', 'deliverPoint', 'truckWeight'
//   ];

//   const requiredTableFields = ['plantName', 'loadingSlipNo', 'qty', 'priority'];

//   const validateForm = () => {
//     for (const field of requiredFormFields) {
//       if (!formData[field] || formData[field].toString().trim() === '') {
//         setMessage(`❌ Please fill all mandatory fields.`);
//         return false;
//       }
//     }
//     for (const [i, row] of tableData.entries()) {
//       for (const field of requiredTableFields) {
//         if (!row[field] || row[field].toString().trim() === '') {
//           setMessage(`❌ Please fill all mandatory fields in the table (row ${i + 1}).`);
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   // const handleSubmit = async () => {
//   //   setMessage('');
//   //   if (!validateForm()) return;

//   //   let dataToSubmit = [...tableData];
//   //   const isNewRowFilled = newRow.plantName || newRow.loadingSlipNo || newRow.qty || newRow.priority || newRow.remarks;
//   //   if (isNewRowFilled) {
//   //     if (!newRow.plantName || !newRow.loadingSlipNo || !newRow.qty || !newRow.priority) {
//   //       setMessage("❌ Please fill all required fields in the new row before submitting.");
//   //       return;
//   //     }
//   //     const selectedPlants = tableData.map(r => r.plantName);
//   //     if (selectedPlants.includes(newRow.plantName)) {
//   //       setMessage(`❌ Plant ${newRow.plantName} is already selected.`);
//   //       return;
//   //     }
//   //     const existingPriorities = tableData.map(r => r.priority);
//   //     if (existingPriorities.includes(newRow.priority)) {
//   //       setMessage(`❌ Priority ${newRow.priority} already exists. Please choose a different priority.`);
//   //       return;
//   //     }
//   //     dataToSubmit.push({ ...newRow, detailId: null });
//   //   }

//   //   try {
//   //     const response = await axios.post(`${API_URL}/api/truck-transaction`, { formData, tableData: dataToSubmit });
//   //     if (response.data.success) {
//   //       setMessage('✅ Transaction saved successfully!');
//   //       setFormData({
//   //         transactionId: null, truckNo: '', transactionDate: '', cityName: '',
//   //         transporter: '', truckWeight: '', deliverPoint: '', remarks: ''
//   //       });
//   //       setTableData([]);
//   //       setNewRow({ detailId: null, plantName: '', loadingSlipNo: '', qty: '', priority: '', remarks: '', freight: 'To Pay' });
//   //     } else {
//   //       setMessage('❌ Error saving transaction.');
//   //     }
//   //   } catch (error) {
//   //     if (error.response?.status === 409) {
//   //       setMessage('🚫 Truck is already in transport. Please complete Check-Out first.');
//   //     } else {
//   //       console.error('Submit error:', error);
//   //       setMessage('❌ Server error while submitting data.');
//   //     }
//   //   }
//   // };


// const handleSubmit = async () => {
//   setMessage('');
//   if (!validateForm()) return;

//   // Ensure numeric fields are converted to null or 0 if empty
//   const sanitizedFormData = {
//     ...formData,
//     amountPerTon: formData.amountPerTon === "" ? null : formData.amountPerTon,
//     truckWeight: formData.truckWeight === "" ? null : formData.truckWeight
//   };

//   // Ensure table rows' numeric fields are sanitized
//   const sanitizedTableData = tableData.map(row => ({
//     ...row,
//     qty: row.qty === "" ? null : row.qty,
//     priority: row.priority === "" ? null : row.priority
//   }));

//   let dataToSubmit = [...sanitizedTableData];
//   const isNewRowFilled = newRow.plantName || newRow.loadingSlipNo || newRow.qty || newRow.priority || newRow.remarks;
//   if (isNewRowFilled) {
//     if (!newRow.plantName || !newRow.loadingSlipNo || !newRow.qty || !newRow.priority) {
//       setMessage("❌ Please fill all required fields in the new row before submitting.");
//       return;
//     }
//     const selectedPlants = tableData.map(r => r.plantName);
//     if (selectedPlants.includes(newRow.plantName)) {
//       setMessage(`❌ Plant ${newRow.plantName} is already selected.`);
//       return;
//     }
//     const existingPriorities = tableData.map(r => r.priority);
//     if (existingPriorities.includes(newRow.priority)) {
//       setMessage(`❌ Priority ${newRow.priority} already exists. Please choose a different priority.`);
//       return;
//     }
//     dataToSubmit.push({ ...newRow, detailId: null });
//   }

//   try {
//     const response = await axios.post(`${API_URL}/api/truck-transaction`, { formData: sanitizedFormData, tableData: dataToSubmit });
//     if (response.data.success) {
//       setMessage('✅ Transaction saved successfully!');
//       setFormData({
//         transactionId: null, truckNo: '', transactionDate: '', cityName: '',
//         transporter: '', truckWeight: '', deliverPoint: '', remarks: ''
//       });
//       setTableData([]);
//       setNewRow({ detailId: null, plantName: '', loadingSlipNo: '', qty: '', priority: '', remarks: '', freight: 'To Pay' });
//     } else {
//       setMessage('❌ Error saving transaction.');
//     }
//   } catch (error) {
//     if (error.response) {
//       console.error('Server response error:', error.response.data);
//       setMessage(`❌ ${error.response.data.message || 'Server error while submitting data.'}`);
//     } else {
//       console.error('Error:', error);
//       setMessage('❌ Server error while submitting data.');
//     }
//   }
// };


//   const selectedPlants = tableData.map((r, idx) => idx === editingIndex ? null : r.plantName);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-gray-50 py-8">
//       <CancelButton />
//       <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10">
//         <h1 className="text-3xl font-bold text-center text-slate-800 mb-8 tracking-wide">Truck Transaction</h1>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div>
//             <label className="font-medium text-slate-700 mb-1 block">
//               Truck No {requiredStar}
//             </label>
//             <input
//               type="text"
//               name="truckNo"
//               maxLength={11}
//               value={formData.truckNo}
//               onChange={handleChange}
//               placeholder="Enter Truck No"
//               className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//           </div>
//           {[
//             { field: 'transactionDate', label: 'Transaction Date', type: 'date', required: true },
//             { field: 'cityName', label: 'City Name', type: 'text', required: true },
//             { field: 'transporter', label: 'Transporter', type: 'text' }
//           ].map(({ field, label, type, required }) => (
//             <div key={field}>
//               <label className="font-medium text-slate-700 mb-1 block">
//                 {label}{required && requiredStar}
//               </label>
//               <input type={type}
//                 name={field} value={formData[field]} onChange={handleChange}
//                 className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
//             </div>
//           ))}
//         </div>

//         <div className="overflow-x-auto mb-6">
//           <table className="w-full text-sm text-left border shadow rounded-xl">
//             <thead className="bg-indigo-500 text-white">
//               <tr>
//                 <th className="p-2">Plant{requiredStar}</th>
//                 <th className="p-2">Slip No{requiredStar}</th>
//                 <th className="p-2">Qty{requiredStar}</th>
//                 <th className="p-2">Priority{requiredStar}</th>
//                 <th className="p-2">Remarks</th>
//                 <th className="p-2">Freight</th>
//                 <th className="p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tableData.map((row, idx) => (
//                 <tr key={idx} className="bg-white even:bg-slate-50">
//                   {editingIndex === idx ? (
//                     <>
//                       <td className="p-2">
//                         <select name="plantName" value={row.plantName} onChange={(e) => handleRowChange(idx, e)}
//                           className="w-full p-2 border border-slate-300 rounded-lg">
//                           <option value="">Select</option>
//                           {plantList
//                             .filter(p => !selectedPlants.includes(p.plantname) || p.plantname === row.plantName)
//                             .map((p, i) => (
//                               <option key={i} value={p.plantname}>{p.plantname}</option>
//                             ))}
//                         </select>
//                       </td>
//                       {['loadingSlipNo', 'qty', 'priority', 'remarks'].map(name => (
//                         <td key={name} className="p-2">
//                           <input name={name} value={row[name]} onChange={(e) => handleRowChange(idx, e)}
//                             className="w-full p-2 border border-slate-300 rounded-lg" />
//                         </td>
//                       ))}
//                       <td className="p-2">
//                         <select name="freight" value={row.freight} onChange={(e) => handleRowChange(idx, e)}
//                           className="w-full p-2 border border-slate-300 rounded-lg">
//                           <option value="To Pay">To Pay</option>
//                           <option value="Paid">Paid</option>
//                         </select>
//                       </td>
//                       <td className="p-2 text-center">
//                         <button onClick={() => handleUpdateRow(idx)}
//                           className="bg-green-400 text-green-900 px-3 py-1 rounded-full shadow hover:scale-105">Update</button>
//                       </td>
//                     </>
//                   ) : (
//                     <>
//                       <td className="p-2">{row.plantName}</td>
//                       <td className="p-2">{row.loadingSlipNo}</td>
//                       <td className="p-2">{row.qty}</td>
//                       <td className="p-2">{row.priority}</td>
//                       <td className="p-2">{row.remarks}</td>
//                       <td className="p-2">{row.freight}</td>
//                       <td className="p-2 flex gap-2 justify-center">
//                         <button onClick={() => handleEditRow(idx)}
//                           className="bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full shadow hover:scale-105">Edit</button>
//                         <button onClick={() => handleDeleteRow(idx)}
//                           className="bg-red-300 text-red-900 px-3 py-1 rounded-full shadow hover:scale-105">Delete</button>
//                       </td>
//                     </>
//                   )}
//                 </tr>
//               ))}
//               <tr className="bg-slate-100">
//                 <td className="p-2">
//                   <select name="plantName" value={newRow.plantName} onChange={handleNewRowChange}
//                     className="w-full p-2 border border-slate-300 rounded-lg">
//                     <option value="">Select</option>
//                     {plantList
//                       .filter(p => !selectedPlants.includes(p.plantname))
//                       .map((p, i) => (
//                         <option key={i} value={p.plantname}>{p.plantname}</option>
//                       ))}
//                   </select>
//                 </td>
//                 {['loadingSlipNo', 'qty', 'priority', 'remarks'].map(name => (
//                   <td key={name} className="p-2">
//                     <input name={name} value={newRow[name]} onChange={handleNewRowChange}
//                       className="w-full p-2 border border-slate-300 rounded-lg" />
//                   </td>
//                 ))}
//                 <td className="p-2">
//                   <select name="freight" value={newRow.freight} onChange={handleNewRowChange}
//                     className="w-full p-2 border border-slate-300 rounded-lg">
//                     <option value="To Pay">To Pay</option>
//                     <option value="Paid">Paid</option>
//                   </select>
//                 </td>
//                 <td className="p-2 text-center">-</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         <button onClick={addOrUpdateRow}
//           className="bg-yellow-400 text-yellow-900 font-semibold px-4 py-2 rounded-full shadow hover:scale-105 mb-6">
//           Add Row
//         </button>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           {[  
//             { field: 'amountPerTon', label: 'Amount Per Ton' },
//             { field: 'deliverPoint', label: 'Deliver Point', required: true },
//             { field: 'truckWeight', label: 'Truck Weight (In Ton)', required: true }
//           ].map(({ field, label, required }) => (
//             <div key={field}>
//               <label className="font-medium text-slate-700 mb-1 block">
//                 {label}{required && requiredStar}
//               </label>
//               <input name={field} value={formData[field]} onChange={handleChange}
//                 className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
//             </div>
//           ))}
//         </div>

//         <label className="font-medium text-slate-700 mb-1 block">Remarks</label>
//         <textarea name="remarks" value={formData.remarks} onChange={handleChange} rows="3"
//           className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"></textarea>

//         <button onClick={handleSubmit}
//           className="bg-green-500 text-white font-semibold px-6 py-2 rounded-full shadow hover:scale-105">
//           Submit
//         </button>

//         {message && <p style={{ color: message.startsWith('✅') ? 'green' : 'red', marginTop: 10 }}>{message}</p>}
//       </div>
//     </div>
//   );
// }////////////// working code 


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// import CancelButton from './CancelButton';
// import { FiEdit2, FiTrash2, FiPlus, FiSave, FiTruck } from 'react-icons/fi';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckTransaction() {
//   const location = useLocation();
//   const [formData, setFormData] = useState({
//     transactionId: null, truckNo: '', transactionDate: '', cityName: '',
//     transporter: '', amountPerTon: '', truckWeight: '', deliverPoint: '', remarks: ''
//   });
//   const [plantList, setPlantList] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [newRow, setNewRow] = useState({
//     detailId: null, plantName: '', loadingSlipNo: '', qty: '',
//     priority: '', remarks: '', freight: 'To Pay'
//   });
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const requiredStar = <span className="text-red-500 ml-1">*</span>;

//   useEffect(() => {
//     const truckNo = location?.state?.truckNo;
//     if (truckNo) fetchTruckDetails(truckNo);
//   }, [location?.state?.truckNo]);

//   useEffect(() => {
//     axios.get(`${API_URL}/api/plants`)
//       .then(res => setPlantList(res.data))
//       .catch(err => console.error('Error fetching plants:', err));
//   }, []);

//   const fetchTruckDetails = async (truckNo) => {
//     try {
//       const res = await axios.get(`${API_URL}/api/truck-transaction/${truckNo}`);
//       const { master, details } = res.data;
//       setFormData({
//         transactionId: master.transactionid,
//         truckNo: master.truckno,
//         transactionDate: master.transactiondate?.split('T')[0] || '',
//         cityName: master.cityname,
//         transporter: master.transporter,
//         amountPerTon: master.amountperton,
//         truckWeight: master.truckweight,
//         deliverPoint: master.deliverpoint,
//         remarks: master.remarks
//       });
//       setTableData(details.map(row => ({
//         detailId: row.detailid,
//         plantName: row.plantname,
//         loadingSlipNo: row.loadingslipno,
//         qty: row.qty,
//         priority: row.priority,
//         remarks: row.remarks,
//         freight: row.freight
//       })));
//     } catch (err) {
//       if (err.response?.status === 409) {
//         setMessage('🚫 Truck is already in transport. Please complete Check-Out first.');
//       } else if (err.response?.status === 404) {
//         setMessage('Truck not found. You can create a new transaction.');
//       } else {
//         console.error('Error loading truck details:', err);
//         setMessage('❌ Failed to load truck details.');
//       }
//     }
//   };

//   const handleChange = (e) => {
//     let { name, value } = e.target;

//     if (name === 'truckNo') {
//       value = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 11).toUpperCase();
//       setFormData({ ...formData, truckNo: value });
//     } else if (name === 'priority' || name === 'qty') {
//       value = value.replace(/[^0-9]/g, '');
//       if (name === 'priority') {
//         setTableData((prevData) => {
//           const updatedData = [...prevData];
//           updatedData[editingIndex][name] = value;
//           return updatedData;
//         });
//       } else {
//         setFormData({ ...formData, [name]: value });
//       }
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleNewRowChange = (e) => {
//     const { name, value } = e.target;
//     let cleanedValue = value;

//     if (name === 'priority' || name === 'qty') {
//       cleanedValue = value.replace(/[^0-9]/g, '');
//     }

//     setNewRow({ ...newRow, [name]: cleanedValue });
//   };

//   const handleRowChange = (idx, e) => {
//     const { name, value } = e.target;
//     let cleanedValue = value;

//     if (name === 'priority' || name === 'qty') {
//       cleanedValue = value.replace(/[^0-9]/g, '');
//     }

//     const updated = [...tableData];
//     updated[idx][name] = cleanedValue;
//     setTableData(updated);
//   };

//   const handleEditRow = (idx) => {
//     setEditingIndex(idx);
//   };

//   const handleUpdateRow = (idx) => {
//     const updatedPriority = tableData[idx].priority;
//     const duplicate = tableData.some((row, i) => i !== idx && row.priority === updatedPriority);
//     if (duplicate) {
//       setMessage(`❌ Priority ${updatedPriority} already exists in another row. Please choose a different priority.`);
//       return;
//     }
//     setEditingIndex(null);
//   };

//   const handleDeleteRow = (idx) => {
//     setTableData(tableData.filter((_, i) => i !== idx));
//     setEditingIndex(null);
//   };

//   const addOrUpdateRow = () => {
//     if (!newRow.plantName || !newRow.loadingSlipNo || !newRow.qty || !newRow.priority) {
//       setMessage("❌ Please fill all required fields in the new row.");
//       return;
//     }

//     const selectedPlants = tableData.map(r => r.plantName);
//     if (selectedPlants.includes(newRow.plantName)) {
//       setMessage(`❌ Plant ${newRow.plantName} is already selected.`);
//       return;
//     }

//     const existingPriorities = tableData.map(r => r.priority);
//     if (existingPriorities.includes(newRow.priority)) {
//       setMessage(`❌ Priority ${newRow.priority} already exists. Please choose a different priority.`);
//       return;
//     }

//     setTableData([...tableData, { ...newRow, detailId: null }]);
//     setNewRow({ detailId: null, plantName: '', loadingSlipNo: '', qty: '', priority: '', remarks: '', freight: 'To Pay' });
//     setMessage('');
//   };

//   const requiredFormFields = [
//     'truckNo', 'transactionDate', 'cityName', 'deliverPoint', 'truckWeight'
//   ];

//   const requiredTableFields = ['plantName', 'loadingSlipNo', 'qty', 'priority'];

//   const validateForm = () => {
//     for (const field of requiredFormFields) {
//       if (!formData[field] || formData[field].toString().trim() === '') {
//         setMessage(`❌ Please fill all mandatory fields.`);
//         return false;
//       }
//     }
//     for (const [i, row] of tableData.entries()) {
//       for (const field of requiredTableFields) {
//         if (!row[field] || row[field].toString().trim() === '') {
//           setMessage(`❌ Please fill all mandatory fields in the table (row ${i + 1}).`);
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     setMessage('');
//     if (!validateForm()) return;

//     const sanitizedFormData = {
//       ...formData,
//       amountPerTon: formData.amountPerTon === "" ? null : formData.amountPerTon,
//       truckWeight: formData.truckWeight === "" ? null : formData.truckWeight
//     };

//     const sanitizedTableData = tableData.map(row => ({
//       ...row,
//       qty: row.qty === "" ? null : row.qty,
//       priority: row.priority === "" ? null : row.priority
//     }));

//     let dataToSubmit = [...sanitizedTableData];
//     const isNewRowFilled = newRow.plantName || newRow.loadingSlipNo || newRow.qty || newRow.priority || newRow.remarks;
//     if (isNewRowFilled) {
//       if (!newRow.plantName || !newRow.loadingSlipNo || !newRow.qty || !newRow.priority) {
//         setMessage("❌ Please fill all required fields in the new row before submitting.");
//         return;
//       }
//       const selectedPlants = tableData.map(r => r.plantName);
//       if (selectedPlants.includes(newRow.plantName)) {
//         setMessage(`❌ Plant ${newRow.plantName} is already selected.`);
//         return;
//       }
//       const existingPriorities = tableData.map(r => r.priority);
//       if (existingPriorities.includes(newRow.priority)) {
//         setMessage(`❌ Priority ${newRow.priority} already exists. Please choose a different priority.`);
//         return;
//       }
//       dataToSubmit.push({ ...newRow, detailId: null });
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.post(`${API_URL}/api/truck-transaction`, { 
//         formData: sanitizedFormData, 
//         tableData: dataToSubmit 
//       });
//       if (response.data.success) {
//         setMessage('✅ Transaction saved successfully!');
//         setFormData({
//           transactionId: null, truckNo: '', transactionDate: '', cityName: '',
//           transporter: '', truckWeight: '', deliverPoint: '', remarks: ''
//         });
//         setTableData([]);
//         setNewRow({ detailId: null, plantName: '', loadingSlipNo: '', qty: '', priority: '', remarks: '', freight: 'To Pay' });
//       } else {
//         setMessage('❌ Error saving transaction.');
//       }
//     } catch (error) {
//       if (error.response) {
//         console.error('Server response error:', error.response.data);
//         setMessage(`❌ ${error.response.data.message || 'Server error while submitting data.'}`);
//       } else {
//         console.error('Error:', error);
//         setMessage('❌ Server error while submitting data.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const selectedPlants = tableData.map((r, idx) => idx === editingIndex ? null : r.plantName);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 sm:px-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
//           <div className="p-6 sm:p-8">
//             <div className="flex justify-between items-start mb-6">
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
//                   <FiTruck className="mr-3 text-blue-600" />
//                   Truck Transaction
//                 </h1>
//                 <p className="text-gray-500 mt-1">Manage truck transportation details</p>
//               </div>
//               <CancelButton />
//             </div>

//             {/* Truck Information Section */}
//             <div className="bg-blue-50 rounded-lg p-6 mb-8">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">Truck Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Truck No {requiredStar}
//                   </label>
//                   <input
//                     type="text"
//                     name="truckNo"
//                     maxLength={11}
//                     value={formData.truckNo}
//                     onChange={handleChange}
//                     placeholder="Enter Truck No"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                   />
//                 </div>
//                 {[
//                   { field: 'transactionDate', label: 'Transaction Date', type: 'date', required: true },
//                   { field: 'cityName', label: 'City Name', type: 'text', required: true },
//                   { field: 'transporter', label: 'Transporter', type: 'text' }
//                 ].map(({ field, label, type, required }) => (
//                   <div key={field}>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       {label}{required && requiredStar}
//                     </label>
//                     <input 
//                       type={type}
//                       name={field} 
//                       value={formData[field]} 
//                       onChange={handleChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Transaction Details Table */}
//             <div className="mb-8">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h2>
//               <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plant{requiredStar}</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slip No{requiredStar}</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty{requiredStar}</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority{requiredStar}</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freight</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {tableData.map((row, idx) => (
//                       <tr key={idx} className={editingIndex === idx ? 'bg-blue-50' : 'hover:bg-gray-50'}>
//                         {editingIndex === idx ? (
//                           <>
//                             <td className="px-4 py-3 whitespace-nowrap">
//                               <select 
//                                 name="plantName" 
//                                 value={row.plantName} 
//                                 onChange={(e) => handleRowChange(idx, e)}
//                                 className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                               >
//                                 <option value="">Select</option>
//                                 {plantList
//                                   .filter(p => !selectedPlants.includes(p.plantname) || p.plantname === row.plantName)
//                                   .map((p, i) => (
//                                     <option key={i} value={p.plantname}>{p.plantname}</option>
//                                   ))}
//                               </select>
//                             </td>
//                             {['loadingSlipNo', 'qty', 'priority', 'remarks'].map(name => (
//                               <td key={name} className="px-4 py-3 whitespace-nowrap">
//                                 <input 
//                                   name={name} 
//                                   value={row[name]} 
//                                   onChange={(e) => handleRowChange(idx, e)}
//                                   className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                               </td>
//                             ))}
//                             <td className="px-4 py-3 whitespace-nowrap">
//                               <select 
//                                 name="freight" 
//                                 value={row.freight} 
//                                 onChange={(e) => handleRowChange(idx, e)}
//                                 className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                               >
//                                 <option value="To Pay">To Pay</option>
//                                 <option value="Paid">Paid</option>
//                               </select>
//                             </td>
//                             <td className="px-4 py-3 whitespace-nowrap">
//                               <button 
//                                 onClick={() => handleUpdateRow(idx)}
//                                 className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
//                               >
//                                 <FiSave className="mr-1" /> Save
//                               </button>
//                             </td>
//                           </>
//                         ) : (
//                           <>
//                             <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.plantName}</td>
//                             <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.loadingSlipNo}</td>
//                             <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.qty}</td>
//                             <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.priority}</td>
//                             <td className="px-4 py-3 text-sm text-gray-500">{row.remarks}</td>
//                             <td className="px-4 py-3 whitespace-nowrap">
//                               <span className={`px-2 py-1 text-xs rounded-full ${
//                                 row.freight === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                               }`}>
//                                 {row.freight}
//                               </span>
//                             </td>
//                             <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
//                               <div className="flex space-x-2">
//                                 <button 
//                                   onClick={() => handleEditRow(idx)}
//                                   className="text-blue-600 hover:text-blue-900 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
//                                   title="Edit"
//                                 >
//                                   <FiEdit2 className="h-4 w-4" />
//                                 </button>
//                                 <button 
//                                   onClick={() => handleDeleteRow(idx)}
//                                   className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors"
//                                   title="Delete"
//                                 >
//                                   <FiTrash2 className="h-4 w-4" />
//                                 </button>
//                               </div>
//                             </td>
//                           </>
//                         )}
//                       </tr>
//                     ))}
//                     <tr className="bg-gray-50">
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <select 
//                           name="plantName" 
//                           value={newRow.plantName} 
//                           onChange={handleNewRowChange}
//                           className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                         >
//                           <option value="">Select</option>
//                           {plantList
//                             .filter(p => !selectedPlants.includes(p.plantname))
//                             .map((p, i) => (
//                               <option key={i} value={p.plantname}>{p.plantname}</option>
//                             ))}
//                         </select>
//                       </td>
//                       {['loadingSlipNo', 'qty', 'priority', 'remarks'].map(name => (
//                         <td key={name} className="px-4 py-3 whitespace-nowrap">
//                           <input 
//                             name={name} 
//                             value={newRow[name]} 
//                             onChange={handleNewRowChange}
//                             className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                           />
//                         </td>
//                       ))}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <select 
//                           name="freight" 
//                           value={newRow.freight} 
//                           onChange={handleNewRowChange}
//                           className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                         >
//                           <option value="To Pay">To Pay</option>
//                           <option value="Paid">Paid</option>
//                         </select>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <button 
//                           onClick={addOrUpdateRow}
//                           className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
//                         >
//                           <FiPlus className="mr-1" /> Add
//                         </button>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Additional Information */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               {[  
//                 { field: 'amountPerTon', label: 'Amount Per Ton' },
//                 { field: 'deliverPoint', label: 'Deliver Point', required: true },
//                 { field: 'truckWeight', label: 'Truck Weight (In Ton)', required: true }
//               ].map(({ field, label, required }) => (
//                 <div key={field}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {label}{required && requiredStar}
//                   </label>
//                   <input 
//                     name={field} 
//                     value={formData[field]} 
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
//               <textarea 
//                 name="remarks" 
//                 value={formData.remarks} 
//                 onChange={handleChange} 
//                 rows="3"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//               ></textarea>
//             </div>

//             {/* Submit Button and Message */}
//             <div className="flex items-center justify-between">
//               {message && (
//                 <div className={`px-4 py-2 rounded-md ${
//                   message.startsWith('✅') ? 'bg-green-100 text-green-800' : 
//                   message.startsWith('❌') ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {message}
//                 </div>
//               )}
//               <button 
//                 onClick={handleSubmit}
//                 disabled={isLoading}
//                 className="ml-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
//               >
//                 {isLoading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <FiSave className="mr-2" />
//                     Submit Transaction
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }   most final working code without pop pop message 



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// import { FiEdit2, FiTrash2, FiPlus, FiSave, FiTruck, FiX } from 'react-icons/fi';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckTransaction() {
//   const location = useLocation();
//   const [formData, setFormData] = useState({
//     transactionId: null, truckNo: '', transactionDate: '', cityName: '',
//     transporter: '', amountPerTon: '', truckWeight: '', deliverPoint: '', remarks: ''
//   });
//   const [plantList, setPlantList] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [newRow, setNewRow] = useState({
//     detailId: null, plantName: '', loadingSlipNo: '', qty: '',
//     priority: '', remarks: '', freight: 'To Pay'
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const requiredStar = <span className="text-red-500 ml-1">*</span>;

//   useEffect(() => {
//     const truckNo = location?.state?.truckNo;
//     if (truckNo) fetchTruckDetails(truckNo);
//   }, [location?.state?.truckNo]);

//   useEffect(() => {
//     axios.get(`${API_URL}/api/plants`)
//       .then(res => setPlantList(res.data))
//       .catch(err => console.error('Error fetching plants:', err));
//   }, []);

//   const fetchTruckDetails = async (truckNo) => {
//     try {
//       const res = await axios.get(`${API_URL}/api/truck-transaction/${truckNo}`);
//       const { master, details } = res.data;
//       setFormData({
//         transactionId: master.transactionid,
//         truckNo: master.truckno,
//         transactionDate: master.transactiondate?.split('T')[0] || '',
//         cityName: master.cityname,
//         transporter: master.transporter,
//         amountPerTon: master.amountperton,
//         truckWeight: master.truckweight,
//         deliverPoint: master.deliverpoint,
//         remarks: master.remarks
//       });
//       setTableData(details.map(row => ({
//         detailId: row.detailid,
//         plantName: row.plantname,
//         loadingSlipNo: row.loadingslipno,
//         qty: row.qty,
//         priority: row.priority,
//         remarks: row.remarks,
//         freight: row.freight
//       })));
//       toast.success('Truck details loaded successfully');
//     } catch (err) {
//       if (err.response?.status === 409) {
//         toast.error('🚫 Truck is already in transport. Please complete Check-Out first.');
//       } else if (err.response?.status === 404) {
//         toast.info('Truck not found. You can create a new transaction.');
//       } else {
//         console.error('Error loading truck details:', err);
//         toast.error('Failed to load truck details.');
//       }
//     }
//   };

//   const handleChange = (e) => {
//     let { name, value } = e.target;

//     if (name === 'truckNo') {
//       value = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 11).toUpperCase();
//       setFormData({ ...formData, truckNo: value });
//     } else if (name === 'priority' || name === 'qty') {
//       value = value.replace(/[^0-9]/g, '');
//       if (name === 'priority') {
//         setTableData((prevData) => {
//           const updatedData = [...prevData];
//           updatedData[editingIndex][name] = value;
//           return updatedData;
//         });
//       } else {
//         setFormData({ ...formData, [name]: value });
//       }
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleNewRowChange = (e) => {
//     const { name, value } = e.target;
//     let cleanedValue = value;

//     if (name === 'priority' || name === 'qty') {
//       cleanedValue = value.replace(/[^0-9]/g, '');
//     }

//     setNewRow({ ...newRow, [name]: cleanedValue });
//   };

//   const handleRowChange = (idx, e) => {
//     const { name, value } = e.target;
//     let cleanedValue = value;

//     if (name === 'priority' || name === 'qty') {
//       cleanedValue = value.replace(/[^0-9]/g, '');
//     }

//     const updated = [...tableData];
//     updated[idx][name] = cleanedValue;
//     setTableData(updated);
//   };

//   const handleEditRow = (idx) => {
//     setEditingIndex(idx);
//   };

//   const handleUpdateRow = (idx) => {
//     const updatedPriority = tableData[idx].priority;
//     const duplicate = tableData.some((row, i) => i !== idx && row.priority === updatedPriority);
//     if (duplicate) {
//       toast.error(`Priority ${updatedPriority} already exists in another row. Please choose a different priority.`);
//       return;
//     }
//     setEditingIndex(null);
//     toast.success('Row updated successfully');
//   };

//   const handleDeleteRow = (idx) => {
//     setTableData(tableData.filter((_, i) => i !== idx));
//     setEditingIndex(null);
//     toast.success('Row deleted successfully');
//   };

//   const addOrUpdateRow = () => {
//     if (!newRow.plantName || !newRow.loadingSlipNo || !newRow.qty || !newRow.priority) {
//       toast.error("Please fill all required fields in the new row.");
//       return;
//     }

//     const selectedPlants = tableData.map(r => r.plantName);
//     if (selectedPlants.includes(newRow.plantName)) {
//       toast.error(`Plant ${newRow.plantName} is already selected.`);
//       return;
//     }

//     const existingPriorities = tableData.map(r => r.priority);
//     if (existingPriorities.includes(newRow.priority)) {
//       toast.error(`Priority ${newRow.priority} already exists. Please choose a different priority.`);
//       return;
//     }

//     setTableData([...tableData, { ...newRow, detailId: null }]);
//     setNewRow({ detailId: null, plantName: '', loadingSlipNo: '', qty: '', priority: '', remarks: '', freight: 'To Pay' });
//     toast.success('New row added successfully');
//   };

//   const requiredFormFields = [
//     'truckNo', 'transactionDate', 'cityName', 'deliverPoint', 'truckWeight'
//   ];

//   const requiredTableFields = ['plantName', 'loadingSlipNo', 'qty', 'priority'];

//   const validateForm = () => {
//     for (const field of requiredFormFields) {
//       if (!formData[field] || formData[field].toString().trim() === '') {
//         toast.error(`Please fill all mandatory fields.`);
//         return false;
//       }
//     }
//     for (const [i, row] of tableData.entries()) {
//       for (const field of requiredTableFields) {
//         if (!row[field] || row[field].toString().trim() === '') {
//           toast.error(`Please fill all mandatory fields in the table (row ${i + 1}).`);
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     const sanitizedFormData = {
//       ...formData,
//       amountPerTon: formData.amountPerTon === "" ? null : formData.amountPerTon,
//       truckWeight: formData.truckWeight === "" ? null : formData.truckWeight
//     };

//     const sanitizedTableData = tableData.map(row => ({
//       ...row,
//       qty: row.qty === "" ? null : row.qty,
//       priority: row.priority === "" ? null : row.priority
//     }));

//     let dataToSubmit = [...sanitizedTableData];
//     const isNewRowFilled = newRow.plantName || newRow.loadingSlipNo || newRow.qty || newRow.priority || newRow.remarks;
//     if (isNewRowFilled) {
//       if (!newRow.plantName || !newRow.loadingSlipNo || !newRow.qty || !newRow.priority) {
//         toast.error("Please fill all required fields in the new row before submitting.");
//         return;
//       }
//       const selectedPlants = tableData.map(r => r.plantName);
//       if (selectedPlants.includes(newRow.plantName)) {
//         toast.error(`Plant ${newRow.plantName} is already selected.`);
//         return;
//       }
//       const existingPriorities = tableData.map(r => r.priority);
//       if (existingPriorities.includes(newRow.priority)) {
//         toast.error(`Priority ${newRow.priority} already exists. Please choose a different priority.`);
//         return;
//       }
//       dataToSubmit.push({ ...newRow, detailId: null });
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.post(`${API_URL}/api/truck-transaction`, { 
//         formData: sanitizedFormData, 
//         tableData: dataToSubmit 
//       });
//       if (response.data.success) {
//         toast.success('Transaction saved successfully!');
//         setFormData({
//           transactionId: null, truckNo: '', transactionDate: '', cityName: '',
//           transporter: '', truckWeight: '', deliverPoint: '', remarks: ''
//         });
//         setTableData([]);
//         setNewRow({ detailId: null, plantName: '', loadingSlipNo: '', qty: '', priority: '', remarks: '', freight: 'To Pay' });
//       } else {
//         toast.error('Error saving transaction.');
//       }
//     } catch (error) {
//       if (error.response) {
//         console.error('Server response error:', error.response.data);
//         toast.error(error.response.data.message || 'Server error while submitting data.');
//       } else {
//         console.error('Error:', error);
//         toast.error('Server error while submitting data.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClose = () => {
//     // Add your close logic here
//     toast.info('Transaction form closed');
//   };

//   const selectedPlants = tableData.map((r, idx) => idx === editingIndex ? null : r.plantName);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 sm:px-6">
//       <ToastContainer 
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
//           <div className="p-6 sm:p-8">
//             <div className="flex justify-between items-start mb-6">
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
//                   <FiTruck className="mr-3 text-blue-600" />
//                   Truck Transaction
//                 </h1>
//                 <p className="text-gray-500 mt-1">Manage truck transportation details</p>
//               </div>
//               <button 
//                 onClick={handleClose}
//                 className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
//                 title="Close"
//               >
//                 <FiX className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Truck Information Section */}
//             <div className="bg-blue-50 rounded-lg p-6 mb-8">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">Truck Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Truck No {requiredStar}
//                   </label>
//                   <input
//                     type="text"
//                     name="truckNo"
//                     maxLength={11}
//                     value={formData.truckNo}
//                     onChange={handleChange}
//                     placeholder="Enter Truck No"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                   />
//                 </div>
//                 {[
//                   { field: 'transactionDate', label: 'Transaction Date', type: 'date', required: true },
//                   { field: 'cityName', label: 'City Name', type: 'text', required: true },
//                   { field: 'transporter', label: 'Transporter', type: 'text' }
//                 ].map(({ field, label, type, required }) => (
//                   <div key={field}>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       {label}{required && requiredStar}
//                     </label>
//                     <input 
//                       type={type}
//                       name={field} 
//                       value={formData[field]} 
//                       onChange={handleChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Transaction Details Table */}
//             <div className="mb-8">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h2>
//               <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plant{requiredStar}</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slip No{requiredStar}</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty{requiredStar}</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority{requiredStar}</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freight</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {tableData.map((row, idx) => (
//                       <tr key={idx} className={editingIndex === idx ? 'bg-blue-50' : 'hover:bg-gray-50'}>
//                         {editingIndex === idx ? (
//                           <>
//                             <td className="px-4 py-3 whitespace-nowrap">
//                               <select 
//                                 name="plantName" 
//                                 value={row.plantName} 
//                                 onChange={(e) => handleRowChange(idx, e)}
//                                 className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                               >
//                                 <option value="">Select</option>
//                                 {plantList
//                                   .filter(p => !selectedPlants.includes(p.plantname) || p.plantname === row.plantName)
//                                   .map((p, i) => (
//                                     <option key={i} value={p.plantname}>{p.plantname}</option>
//                                   ))}
//                               </select>
//                             </td>
//                             {['loadingSlipNo', 'qty', 'priority', 'remarks'].map(name => (
//                               <td key={name} className="px-4 py-3 whitespace-nowrap">
//                                 <input 
//                                   name={name} 
//                                   value={row[name]} 
//                                   onChange={(e) => handleRowChange(idx, e)}
//                                   className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                               </td>
//                             ))}
//                             <td className="px-4 py-3 whitespace-nowrap">
//                               <select 
//                                 name="freight" 
//                                 value={row.freight} 
//                                 onChange={(e) => handleRowChange(idx, e)}
//                                 className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                               >
//                                 <option value="To Pay">To Pay</option>
//                                 <option value="Paid">Paid</option>
//                               </select>
//                             </td>
//                             <td className="px-4 py-3 whitespace-nowrap">
//                               <button 
//                                 onClick={() => handleUpdateRow(idx)}
//                                 className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
//                               >
//                                 <FiSave className="mr-1" /> Save
//                               </button>
//                             </td>
//                           </>
//                         ) : (
//                           <>
//                             <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.plantName}</td>
//                             <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.loadingSlipNo}</td>
//                             <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.qty}</td>
//                             <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.priority}</td>
//                             <td className="px-4 py-3 text-sm text-gray-500">{row.remarks}</td>
//                             <td className="px-4 py-3 whitespace-nowrap">
//                               <span className={`px-2 py-1 text-xs rounded-full ${
//                                 row.freight === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                               }`}>
//                                 {row.freight}
//                               </span>
//                             </td>
//                             <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
//                               <div className="flex space-x-2">
//                                 <button 
//                                   onClick={() => handleEditRow(idx)}
//                                   className="text-blue-600 hover:text-blue-900 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
//                                   title="Edit"
//                                 >
//                                   <FiEdit2 className="h-4 w-4" />
//                                 </button>
//                                 <button 
//                                   onClick={() => handleDeleteRow(idx)}
//                                   className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors"
//                                   title="Delete"
//                                 >
//                                   <FiTrash2 className="h-4 w-4" />
//                                 </button>
//                               </div>
//                             </td>
//                           </>
//                         )}
//                       </tr>
//                     ))}
//                     <tr className="bg-gray-50">
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <select 
//                           name="plantName" 
//                           value={newRow.plantName} 
//                           onChange={handleNewRowChange}
//                           className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                         >
//                           <option value="">Select</option>
//                           {plantList
//                             .filter(p => !selectedPlants.includes(p.plantname))
//                             .map((p, i) => (
//                               <option key={i} value={p.plantname}>{p.plantname}</option>
//                             ))}
//                         </select>
//                       </td>
//                       {['loadingSlipNo', 'qty', 'priority', 'remarks'].map(name => (
//                         <td key={name} className="px-4 py-3 whitespace-nowrap">
//                           <input 
//                             name={name} 
//                             value={newRow[name]} 
//                             onChange={handleNewRowChange}
//                             className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                           />
//                         </td>
//                       ))}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <select 
//                           name="freight" 
//                           value={newRow.freight} 
//                           onChange={handleNewRowChange}
//                           className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                         >
//                           <option value="To Pay">To Pay</option>
//                           <option value="Paid">Paid</option>
//                         </select>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <button 
//                           onClick={addOrUpdateRow}
//                           className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
//                         >
//                           <FiPlus className="mr-1" /> Add
//                         </button>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Additional Information */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               {[  
//                 { field: 'amountPerTon', label: 'Amount Per Ton' },
//                 { field: 'deliverPoint', label: 'Deliver Point', required: true },
//                 { field: 'truckWeight', label: 'Truck Weight (In Ton)', required: true }
//               ].map(({ field, label, required }) => (
//                 <div key={field}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {label}{required && requiredStar}
//                   </label>
//                   <input 
//                     name={field} 
//                     value={formData[field]} 
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
//               <textarea 
//                 name="remarks" 
//                 value={formData.remarks} 
//                 onChange={handleChange} 
//                 rows="3"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//               ></textarea>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end">
//               <button 
//                 onClick={handleSubmit}
//                 disabled={isLoading}
//                 className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
//               >
//                 {isLoading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <FiSave className="mr-2" />
//                     Submit Transaction
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiTruck, FiX } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function TruckTransaction() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    transactionId: null, truckNo: '', transactionDate: '', cityName: '',
    transporter: '', amountPerTon: '', truckWeight: '', deliverPoint: '', remarks: ''
  });
  const [plantList, setPlantList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newRow, setNewRow] = useState({
    detailId: null, plantName: '', loadingSlipNo: '', qty: '',
    priority: '', remarks: '', freight: 'To Pay'
  });
  const [isLoading, setIsLoading] = useState(false);

  const requiredStar = <span className="text-red-500 ml-1">*</span>;

  useEffect(() => {
    const truckNo = location?.state?.truckNo;
    if (truckNo) fetchTruckDetails(truckNo);
  }, [location?.state?.truckNo]);

  useEffect(() => {
    axios.get(`${API_URL}/api/plants`)
      .then(res => setPlantList(res.data))
      .catch(err => console.error('Error fetching plants:', err));
  }, []);

  const fetchTruckDetails = async (truckNo) => {
    try {
      const res = await axios.get(`${API_URL}/api/truck-transaction/${truckNo}`);
      const { master, details } = res.data;
      setFormData({
        transactionId: master.transactionid,
        truckNo: master.truckno,
        transactionDate: master.transactiondate?.split('T')[0] || '',
        cityName: master.cityname,
        transporter: master.transporter,
        amountPerTon: master.amountperton,
        truckWeight: master.truckweight,
        deliverPoint: master.deliverpoint,
        remarks: master.remarks
      });
      setTableData(details.map(row => ({
        detailId: row.detailid,
        plantName: row.plantname,
        loadingSlipNo: row.loadingslipno,
        qty: row.qty,
        priority: row.priority,
        remarks: row.remarks,
        freight: row.freight
      })));
      toast.success('Truck details loaded successfully');
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('🚫 Truck is already in transport. Please complete Check-Out first.');
      } else if (err.response?.status === 404) {
        toast.info('Truck not found. You can create a new transaction.');
      } else {
        console.error('Error loading truck details:', err);
        toast.error('Failed to load truck details.');
      }
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'truckNo') {
      value = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 11).toUpperCase();
      setFormData({ ...formData, truckNo: value });
    } else if (name === 'priority' || name === 'qty') {
      value = value.replace(/[^0-9]/g, '');
      if (name === 'priority') {
        setTableData((prevData) => {
          const updatedData = [...prevData];
          updatedData[editingIndex][name] = value;
          return updatedData;
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNewRowChange = (e) => {
    const { name, value } = e.target;
    let cleanedValue = value;

    if (name === 'priority' || name === 'qty') {
      cleanedValue = value.replace(/[^0-9]/g, '');
    }

    setNewRow({ ...newRow, [name]: cleanedValue });
  };

  const handleRowChange = (idx, e) => {
    const { name, value } = e.target;
    let cleanedValue = value;

    if (name === 'priority' || name === 'qty') {
      cleanedValue = value.replace(/[^0-9]/g, '');
    }

    const updated = [...tableData];
    updated[idx][name] = cleanedValue;
    setTableData(updated);
  };

  const handleEditRow = (idx) => {
    setEditingIndex(idx);
  };

  const handleUpdateRow = (idx) => {
    const updatedPriority = tableData[idx].priority;
    const duplicate = tableData.some((row, i) => i !== idx && row.priority === updatedPriority);
    if (duplicate) {
      toast.error(`Priority ${updatedPriority} already exists in another row. Please choose a different priority.`);
      return;
    }
    setEditingIndex(null);
    toast.success('Row updated successfully');
  };

  const handleDeleteRow = (idx) => {
    setTableData(tableData.filter((_, i) => i !== idx));
    setEditingIndex(null);
    toast.success('Row deleted successfully');
  };

  const addOrUpdateRow = () => {
    if (!newRow.plantName || !newRow.loadingSlipNo || !newRow.qty || !newRow.priority) {
      toast.error("Please fill all required fields in the new row.");
      return;
    }

    const selectedPlants = tableData.map(r => r.plantName);
    if (selectedPlants.includes(newRow.plantName)) {
      toast.error(`Plant ${newRow.plantName} is already selected.`);
      return;
    }

    const existingPriorities = tableData.map(r => r.priority);
    if (existingPriorities.includes(newRow.priority)) {
      toast.error(`Priority ${newRow.priority} already exists. Please choose a different priority.`);
      return;
    }

    setTableData([...tableData, { ...newRow, detailId: null }]);
    setNewRow({ detailId: null, plantName: '', loadingSlipNo: '', qty: '', priority: '', remarks: '', freight: 'To Pay' });
    toast.success('New row added successfully');
  };

  const requiredFormFields = [
    'truckNo', 'transactionDate', 'cityName', 'deliverPoint', 'truckWeight'
  ];

  const requiredTableFields = ['plantName', 'loadingSlipNo', 'qty', 'priority'];

  const validateForm = () => {
    for (const field of requiredFormFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        toast.error(`Please fill all mandatory fields.`);
        return false;
      }
    }
    for (const [i, row] of tableData.entries()) {
      for (const field of requiredTableFields) {
        if (!row[field] || row[field].toString().trim() === '') {
          toast.error(`Please fill all mandatory fields in the table (row ${i + 1}).`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const sanitizedFormData = {
      ...formData,
      amountPerTon: formData.amountPerTon === "" ? null : formData.amountPerTon,
      truckWeight: formData.truckWeight === "" ? null : formData.truckWeight
    };

    const sanitizedTableData = tableData.map(row => ({
      ...row,
      qty: row.qty === "" ? null : row.qty,
      priority: row.priority === "" ? null : row.priority
    }));

    let dataToSubmit = [...sanitizedTableData];
    const isNewRowFilled = newRow.plantName || newRow.loadingSlipNo || newRow.qty || newRow.priority || newRow.remarks;
    if (isNewRowFilled) {
      if (!newRow.plantName || !newRow.loadingSlipNo || !newRow.qty || !newRow.priority) {
        toast.error("Please fill all required fields in the new row before submitting.");
        return;
      }
      const selectedPlants = tableData.map(r => r.plantName);
      if (selectedPlants.includes(newRow.plantName)) {
        toast.error(`Plant ${newRow.plantName} is already selected.`);
        return;
      }
      const existingPriorities = tableData.map(r => r.priority);
      if (existingPriorities.includes(newRow.priority)) {
        toast.error(`Priority ${newRow.priority} already exists. Please choose a different priority.`);
        return;
      }
      dataToSubmit.push({ ...newRow, detailId: null });
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/truck-transaction`, { 
        formData: sanitizedFormData, 
        tableData: dataToSubmit 
      });
      if (response.data.success) {
        toast.success('Transaction saved successfully!');
        setFormData({
          transactionId: null, truckNo: '', transactionDate: '', cityName: '',
          transporter: '', truckWeight: '', deliverPoint: '', remarks: ''
        });
        setTableData([]);
        setNewRow({ detailId: null, plantName: '', loadingSlipNo: '', qty: '', priority: '', remarks: '', freight: 'To Pay' });
      } else {
        toast.error('Error saving transaction.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Server response error:', error.response.data);
        toast.error(error.response.data.message || 'Server error while submitting data.');
      } else {
        console.error('Error:', error);
        toast.error('Server error while submitting data.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Add your close logic here
    toast.info('Transaction form closed');
  };

  const selectedPlants = tableData.map((r, idx) => idx === editingIndex ? null : r.plantName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-4 px-2 sm:px-6">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                  <FiTruck className="mr-2 text-blue-600" />
                  Truck Transaction
                </h1>
                <p className="text-gray-500 text-sm sm:text-base mt-1">Manage truck transportation details</p>
              </div>
              <button 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Close"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Truck Information Section */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Truck Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Truck No {requiredStar}
                  </label>
                  <input
                    type="text"
                    name="truckNo"
                    maxLength={11}
                    value={formData.truckNo}
                    onChange={handleChange}
                    placeholder="Enter Truck No"
                    className="w-full px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                {[
                  { field: 'transactionDate', label: 'Transaction Date', type: 'date', required: true },
                  { field: 'cityName', label: 'City Name', type: 'text', required: true },
                  { field: 'transporter', label: 'Transporter', type: 'text' }
                ].map(({ field, label, type, required }) => (
                  <div key={field}>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      {label}{required && requiredStar}
                    </label>
                    <input 
                      type={type}
                      name={field} 
                      value={formData[field]} 
                      onChange={handleChange}
                      className="w-full px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Details Table */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Transaction Details</h2>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden shadow-sm border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plant{requiredStar}</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slip No{requiredStar}</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty{requiredStar}</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority{requiredStar}</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freight</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tableData.map((row, idx) => (
                          <tr key={idx} className={editingIndex === idx ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                            {editingIndex === idx ? (
                              <>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <select 
                                    name="plantName" 
                                    value={row.plantName} 
                                    onChange={(e) => handleRowChange(idx, e)}
                                    className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="">Select</option>
                                    {plantList
                                      .filter(p => !selectedPlants.includes(p.plantname) || p.plantname === row.plantName)
                                      .map((p, i) => (
                                        <option key={i} value={p.plantname}>{p.plantname}</option>
                                      ))}
                                  </select>
                                </td>
                                {['loadingSlipNo', 'qty', 'priority', 'remarks'].map(name => (
                                  <td key={name} className="px-3 py-2 whitespace-nowrap">
                                    <input 
                                      name={name} 
                                      value={row[name]} 
                                      onChange={(e) => handleRowChange(idx, e)}
                                      className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </td>
                                ))}
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <select 
                                    name="freight" 
                                    value={row.freight} 
                                    onChange={(e) => handleRowChange(idx, e)}
                                    className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="To Pay">To Pay</option>
                                    <option value="Paid">Paid</option>
                                  </select>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <button 
                                    onClick={() => handleUpdateRow(idx)}
                                    className="px-2 py-1 text-xs sm:text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
                                  >
                                    <FiSave className="mr-1" /> Save
                                  </button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-900">{row.plantName}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">{row.loadingSlipNo}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">{row.qty}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">{row.priority}</td>
                                <td className="px-3 py-2 text-xs sm:text-sm text-gray-500">{row.remarks}</td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <span className={`px-1.5 py-0.5 text-xxs sm:text-xs rounded-full ${
                                    row.freight === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {row.freight}
                                  </span>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm font-medium">
                                  <div className="flex space-x-1">
                                    <button 
                                      onClick={() => handleEditRow(idx)}
                                      className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                                      title="Edit"
                                    >
                                      <FiEdit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteRow(idx)}
                                      className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                                      title="Delete"
                                    >
                                      <FiTrash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                            <select 
                              name="plantName" 
                              value={newRow.plantName} 
                              onChange={handleNewRowChange}
                              className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select</option>
                              {plantList
                                .filter(p => !selectedPlants.includes(p.plantname))
                                .map((p, i) => (
                                  <option key={i} value={p.plantname}>{p.plantname}</option>
                                ))}
                            </select>
                          </td>
                          {['loadingSlipNo', 'qty', 'priority', 'remarks'].map(name => (
                            <td key={name} className="px-3 py-2 whitespace-nowrap">
                              <input 
                                name={name} 
                                value={newRow[name]} 
                                onChange={handleNewRowChange}
                                className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              />
                            </td>
                          ))}
                          <td className="px-3 py-2 whitespace-nowrap">
                            <select 
                              name="freight" 
                              value={newRow.freight} 
                              onChange={handleNewRowChange}
                              className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="To Pay">To Pay</option>
                              <option value="Paid">Paid</option>
                            </select>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <button 
                              onClick={addOrUpdateRow}
                              className="px-2 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                            >
                              <FiPlus className="mr-1" /> Add
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {[  
                { field: 'amountPerTon', label: 'Amount Per Ton' },
                { field: 'deliverPoint', label: 'Deliver Point', required: true },
                { field: 'truckWeight', label: 'Truck Weight (In Ton)', required: true }
              ].map(({ field, label, required }) => (
                <div key={field}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    {label}{required && requiredStar}
                  </label>
                  <input 
                    name={field} 
                    value={formData[field]} 
                    onChange={handleChange}
                    className="w-full px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                  />
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea 
                name="remarks" 
                value={formData.remarks} 
                onChange={handleChange} 
                rows="2"
                className="w-full px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-1 sm:mr-2" />
                    Submit Transaction
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}