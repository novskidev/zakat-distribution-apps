import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function ZakatForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    rt: '',
    muzakiCount: 0,
    timbanganCount: 0,
    zakatMoney: 0,
    sodaqahMoney: 0
  });

  const [rt1Data, setRt1Data] = useState([]);
  const [rt2Data, setRt2Data] = useState([]);
  const [rt3Data, setRt3Data] = useState([]);
  const [rt4Data, setRt4Data] = useState([]);

  const [rtTotals, setRtTotals] = useState({
    RT1: 0,
    RT2: 0,
    RT3: 0,
    RT4: 0
  });

  const [sadaTotals, setSadaTotals] = useState({
    RT1: 0,
    RT2: 0,
    RT3: 0,
    RT4: 0
  });

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, address, rt, muzakiCount, timbanganCount, zakatMoney, sodaqahMoney } = formData;
    const newData = { name, address, rt, muzakiCount, timbanganCount, zakatMoney, sodaqahMoney };
    switch(rt) {
      case 'RT1':
        setRt1Data(prevData => [...prevData, newData]);
        break;
      case 'RT2':
        setRt2Data(prevData => [...prevData, newData]);
        break;
      case 'RT3':
        setRt3Data(prevData => [...prevData, newData]);
        break;
      case 'RT4':
        setRt4Data(prevData => [...prevData, newData]);
        break;
      default:
        break;
    }
     // Hitung total muzaki setiap RT
     const updatedRtTotals = { ...rtTotals };
     updatedRtTotals[rt] += parseInt(muzakiCount);
     setRtTotals(updatedRtTotals);

     const updatedsadaTotals = { ...sadaTotals };
     updatedsadaTotals[rt] += (timbanganCount - (muzakiCount * 2.7));
     setSadaTotals(updatedsadaTotals);

    // Reset formData menjadi nilai awal
    setFormData({
      name: '',
      address: '',
      rt: '',
      muzakiCount: 0,
      timbanganCount: 0,
      zakatMoney: 0,
      sodaqahMoney: 0
    });
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Create worksheets for each RT
    ['RT1', 'RT2', 'RT3', 'RT4'].forEach(rt => {
      const data = [];
      // Add headers
      const headers = ['Nama', 'Jumlah Muzaki', 'Beras Sadaqah', 'Zakat Uang', 'Sadaqah Uang'];
      data.push(headers);
      // Add data
      switch (rt) {
        case 'RT1':
          rt1Data.forEach(item => {
            const rowData = [item.name, item.muzakiCount, (item.timbanganCount - (item.muzakiCount * 2.7)).toFixed(2), item.zakatMoney, item.sodaqahMoney];
            data.push(rowData);
          });
          break;
        case 'RT2':
          rt2Data.forEach(item => {
            const rowData = [item.name, item.muzakiCount, (item.timbanganCount - (item.muzakiCount * 2.7)).toFixed(2), item.zakatMoney, item.sodaqahMoney];
            data.push(rowData);
          });
          break;
        case 'RT3':
          rt3Data.forEach(item => {
            const rowData = [item.name, item.muzakiCount, (item.timbanganCount - (item.muzakiCount * 2.7)).toFixed(2), item.zakatMoney, item.sodaqahMoney];
            data.push(rowData);
          });
          break;
        case 'RT4':
          rt4Data.forEach(item => {
            const rowData = [item.name, item.muzakiCount, (item.timbanganCount - (item.muzakiCount * 2.7)).toFixed(2), item.zakatMoney, item.sodaqahMoney];
            data.push(rowData);
          });
          break;
        default:
          break;
      }

      // Convert data to worksheet
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, rt);
    });

    // Save the workbook
    XLSX.writeFile(wb, 'zakat_data.xlsx');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Nama:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Alamat:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          RT (Piih RT):
          <select
            name="rt"
            value={formData.rt}
            onChange={handleChange}
          >
            <option value="">Pilih sesuai RT</option>
            <option value="RT1">RT 01</option>
            <option value="RT2">RT 02</option>
            <option value="RT3">RT 03</option>
            <option value="RT4">RT 04</option>
          </select>
        </label>
        <br />
        <label>
          Jumlah Muzaki (orang):
          <input
          placeholder='Jumlah orang'
            type="number"
            name="muzakiCount"
            value={formData.muzakiCount}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Jumlah Timbangan (Kg): 
          <input
            placeholder='Dalam Kilogram'
            type="number"
            name="timbanganCount"
            value={formData.timbanganCount}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Zakat Uang (Rupiah):
          <input
            type="number"
            name="zakatMoney"
            value={formData.zakatMoney}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Sodaqah Uang (Rupiah):
          <input
            type="number"
            name="sodaqahMoney"
            value={formData.sodaqahMoney}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <hr />
      {/* Menampilkan data untuk setiap RT */}
      <div>
        <h2>Data RT 01:</h2>
        <p>Total Muzaki = {rtTotals.RT1} orang</p>
        <p>Total Sadaqah Beras = {sadaTotals.RT1} Kilogram</p>
        <ol>
          {rt1Data.map((data, index) => (
            <li key={index}>Nama = {data.name}, Jumlah Muzaki = {data.muzakiCount}, Beras Sadaqah = {(data.timbanganCount - (data.muzakiCount * 2.7)).toFixed(2)} Kilogram, Zakat Uang = {data.zakatMoney}, Sadaqah Uang = {data.sodaqahMoney} </li>
          ))}
        </ol>
      </div>
      <hr />
      <div>
        <h2>Data RT 02:</h2>
        <p>Total Muzaki = {rtTotals.RT2} orang</p>
        <p>Total Sadaqah Beras = {sadaTotals.RT2} Kilogram</p>
        <ol>
          {rt2Data.map((data, index) => (
            <li key={index}>Nama = {data.name}, Jumlah Muzaki = {data.muzakiCount}, Beras Sadaqah = {(data.timbanganCount - (data.muzakiCount * 2.7)).toFixed(2)} Kilogram, Zakat Uang = {data.zakatMoney}, Sadaqah Uang = {data.sodaqahMoney} </li>
          ))}
        </ol>
      </div>
      <hr />
      <div>
        <h2>Data RT 03:</h2>
        <p>Total Muzaki = {rtTotals.RT3} orang</p>
        <p>Total Sadaqah Beras = {sadaTotals.RT3} Kilogram</p>
        <ol>
          {rt3Data.map((data, index) => (
            <li key={index}>Nama = {data.name}, Jumlah Muzaki = {data.muzakiCount}, Beras Sadaqah = {(data.timbanganCount - (data.muzakiCount * 2.7)).toFixed(2)} Kilogram, Zakat Uang = {data.zakatMoney}, Sadaqah Uang = {data.sodaqahMoney} </li>
          ))}
        </ol>
      </div>
      <hr />
      <div>
        <h2>Data RT 04:</h2>
        <p>Total Muzaki = {rtTotals.RT4} orang</p>
        <p>Total Sadaqah Beras = {sadaTotals.RT4} Kilogram</p>
        <ol>
          {rt4Data.map((data, index) => (
            <li key={index}>Nama = {data.name}, Jumlah Muzaki = {data.muzakiCount}, Beras Sadaqah = {(data.timbanganCount - (data.muzakiCount * 2.7)).toFixed(2)} Kilogram, Zakat Uang = {data.zakatMoney}, Sadaqah Uang = {data.sodaqahMoney} </li>
          ))}
        </ol>
      </div>
      <button onClick={exportToExcel}>Export to Excel</button>
    </div>
  );
}

export default ZakatForm;
