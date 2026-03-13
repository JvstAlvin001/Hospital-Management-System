import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Billing = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const res = await axios.get('http://localhost:5000/api/billing/all');
    setBills(res.data);
  };

  const markAsPaid = async (id) => {
    try {
      // We'll create this 'pay' route in a second
      await axios.put(`http://localhost:5000/api/billing/pay/${id}`);
      alert("Payment Confirmed!");
      fetchBills(); // Refresh list
    } catch (err) {
      console.error("Payment failed");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Hospital Billing & Invoices</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={tdStyle}>Patient Name</th>
            <th style={tdStyle}>Amount</th>
            <th style={tdStyle}>Status</th>
            <th style={tdStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(bill => (
            <tr key={bill._id}>
              <td style={tdStyle}>{bill.patientId?.fullName || 'N/A'}</td>
              <td style={tdStyle}>${bill.amount}</td>
              <td style={{ ...tdStyle, color: bill.status === 'Paid' ? 'green' : 'red' }}>
                {bill.status}
              </td>
              <td style={tdStyle}>
                {bill.status === 'Unpaid' && (
                  <button onClick={() => markAsPaid(bill._id)}>Mark as Paid</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tdStyle = { padding: '12px', borderBottom: '1px solid #ddd' };

export default Billing;