import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CreditCard, CheckCircle, AlertCircle, Search, DollarSign, Printer, Plus } from 'lucide-react';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]); // Added for the dropdown
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // New Bill State
  const [newBill, setNewBill] = useState({ patientId: '', amount: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [billsRes, patientsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/billing/all', { headers: { 'x-auth-token': token } }),
        axios.get('http://localhost:5000/api/patients', { headers: { 'x-auth-token': token } })
      ]);
      setBills(billsRes.data);
      setPatients(patientsRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/billing/create', newBill, {
        headers: { 'x-auth-token': token }
      });
      setNewBill({ patientId: '', amount: '', description: '' });
      fetchData(); // Refresh list
      alert("Bill Generated Successfully");
    } catch (err) {
      alert("Failed to create bill");
    }
  };

  const handleMarkAsPaid = async (billId) => {
    if (!window.confirm("Confirm payment collection?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/billing/pay/${billId}`, {}, {
        headers: { 'x-auth-token': token }
      });
      setBills(prev => prev.map(b => b._id === billId ? { ...b, status: 'paid' } : b));
    } catch (err) {
      alert("Error: " + (err.response?.data?.msg || "Payment failed"));
    }
  };

  const printReceipt = (bill) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${bill.patientId?.fullName || 'Patient'}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin: 15px 0; border-bottom: 1px solid #eee; }
            .total { font-size: 1.5rem; font-weight: bold; margin-top: 20px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header"><h1>MEGALIFE HOSPITAL</h1><p>Payment Receipt</p></div>
          <div class="row"><span>Patient:</span> <strong>${bill.patientId?.fullName || 'N/A'}</strong></div>
          <div class="row"><span>Service:</span> <span>${bill.description}</span></div>
          <div class="row"><span>Date:</span> <span>${new Date(bill.createdAt).toLocaleDateString()}</span></div>
          <div class="total">Amount Paid: KES ${bill.amount.toLocaleString()}</div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const pendingTotal = bills
    .filter(b => b.status?.toLowerCase() === 'unpaid')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <div style={headerSection}>
        <div>
          <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '1.8rem' }}>Billing & Invoices</h1>
          <p style={{ color: '#64748b' }}>Create and manage hospital receipts</p>
        </div>
        <div style={statsCard}>
          <DollarSign size={24} color="#e11d48" />
          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' }}>PENDING REVENUE</span>
            <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#e11d48' }}>KES {pendingTotal.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* NEW: Quick Bill Form */}
      <div style={quickBillCard}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Quick Invoice
        </h3>
        <form onSubmit={handleCreateBill} style={billForm}>
          <select 
            style={miniInput} 
            value={newBill.patientId} 
            onChange={e => setNewBill({...newBill, patientId: e.target.value})} 
            required
          >
            <option value="">Select Patient</option>
            {patients.map(p => <option key={p._id} value={p._id}>{p.fullName}</option>)}
          </select>
          <input 
            type="number" placeholder="Amount (KES)" style={miniInput}
            value={newBill.amount} onChange={e => setNewBill({...newBill, amount: e.target.value})} required 
          />
          <input 
            type="text" placeholder="Description (e.g. Lab Test)" style={miniInput}
            value={newBill.description} onChange={e => setNewBill({...newBill, description: e.target.value})} required 
          />
          <button type="submit" style={addBtn}>Generate Bill</button>
        </form>
      </div>

      <div style={searchBarWrapper}>
        <Search size={18} color="#94a3b8" />
        <input type="text" placeholder="Search patient..." style={searchInput} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {/* Table Section */}
      <div style={tableContainer}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeader}>
              <th style={{ padding: '15px 20px' }}>Patient</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'right', paddingRight: '20px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={emptyState}>Loading...</td></tr>
            ) : bills
                .filter(b => (b.patientId?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()))
                .map((bill) => (
              <tr key={bill._id} style={tableRow}>
                <td style={{ padding: '15px 20px', fontWeight: '600' }}>{bill.patientId?.fullName || "N/A"}</td>
                <td style={{ color: '#475569', fontSize: '0.85rem' }}>{bill.description}</td>
                <td style={{ fontWeight: '700' }}>KES {bill.amount.toLocaleString()}</td>
                <td>
                  <span style={bill.status?.toLowerCase() === 'paid' ? paidBadge : unpaidBadge}>
                    {bill.status?.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                  {bill.status?.toLowerCase() === 'unpaid' ? (
                    <button onClick={() => handleMarkAsPaid(bill._id)} style={payBtn}>Pay</button>
                  ) : (
                    <button onClick={() => printReceipt(bill)} style={printBtn}><Printer size={14}/> Receipt</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { padding: '110px 40px', backgroundColor: '#f8fafc', minHeight: '100vh' };
const headerSection = { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' };
const statsCard = { backgroundColor: '#fff1f2', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #fecdd3' };
const quickBillCard = { backgroundColor: 'white', padding: '20px', borderRadius: '15px', marginBottom: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' };
const billForm = { display: 'flex', gap: '10px', flexWrap: 'wrap' };
const miniInput = { flex: 1, minWidth: '150px', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' };
const addBtn = { backgroundColor: '#2c3e50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };
const searchBarWrapper = { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', padding: '10px 20px', borderRadius: '25px', border: '1px solid #e2e8f0', marginBottom: '25px', maxWidth: '400px' };
const searchInput = { border: 'none', outline: 'none', width: '100%' };
const tableContainer = { backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeader = { backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' };
const tableRow = { borderBottom: '1px solid #f1f5f9' };
const emptyState = { padding: '40px', textAlign: 'center', color: '#94a3b8' };
const badgeBase = { padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700' };
const paidBadge = { ...badgeBase, backgroundColor: '#dcfce7', color: '#166534' };
const unpaidBadge = { ...badgeBase, backgroundColor: '#fee2e2', color: '#991b1b' };
const btnBase = { padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem', border: '1px solid' };
const payBtn = { ...btnBase, borderColor: '#3498db', color: '#3498db', backgroundColor: 'transparent' };
const printBtn = { ...btnBase, borderColor: '#94a3b8', color: '#64748b', backgroundColor: 'transparent', display: 'inline-flex', alignItems: 'center', gap: '5px' };

export default Billing;