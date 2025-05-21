import React, { useState, useRef } from 'react';

const AdmitCard = () => {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    section: '',
    roll: '',
    exam: '',
    year: ''
  });

  const [generated, setGenerated] = useState();
  const printRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateCard = () => {
    const { name, class: cls, section, roll, exam, year } = formData;
    if (!name || !cls || !section || !roll || !exam || !year) {
      alert("Please fill in all fields.");
      return;
    }
    setGenerated(true);
  };

  const printAdmitCard = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div style={{ background: '#edf2f8', padding: '20px', fontFamily: 'Poppins, sans-serif' }}>
      <div className="form-section" style={{ maxWidth: '800px', margin: '20px auto', display: generated ? 'none' : 'block' }}>
        {['name', 'class', 'section', 'roll', 'exam', 'year'].map((field) => (
          <div className="form-group" key={field} style={{ marginBottom: '15px' }}>
            <label htmlFor={field} style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              {field.charAt(0).toUpperCase() + field.slice(1).replace('class', 'Class').replace('roll', 'Roll Number').replace('exam', 'Examination Type').replace('year', 'Academic Year')}:
            </label>
            <input
              type="text"
              name={field}
              placeholder={`Enter ${field}`}
              value={formData[field]}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #cbd5e0', borderRadius: '8px' }}
            />
          </div>
        ))}
        <button className="btn" onClick={generateCard} style={btnStyle}>
          Generate Admit Card
        </button>
      </div>

      {generated && (
        <>
          <div ref={printRef} id="printArea" className="admit-card" style={admitCardStyle}>
            <div className="header" style={headerStyle}>
              <img src="https://via.placeholder.com/80" alt="School Logo" style={logoStyle} />
              <div className="school-name" style={schoolNameStyle}>Paramount Boarding High School</div>
            </div>
            <div className="output" style={{ fontSize: '18px' }}>
              <p>
                This is to certify that <strong>{formData.name}</strong> is currently enrolled in <strong>Class {formData.class}</strong>, Section <strong>{formData.section}</strong>, with Roll Number <strong>{formData.roll}</strong> at Paramount Boarding High School. The student is eligible and permitted to appear for the <strong>{formData.exam} Examination</strong> for the academic session <strong>{formData.year}</strong>, having met all academic and administrative requirements.
              </p>
            </div>
          </div>
          <div className="print-btn" style={{ textAlign: 'right', marginTop: '20px' }}>
            <button className="btn" onClick={printAdmitCard} style={btnStyle}>
              Print / Download
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const btnStyle = {
  background: 'linear-gradient(to right, #3b82f6, #1e40af)',
  color: 'white',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '16px',
  marginTop: '10px'
};

const admitCardStyle = {
  width: '800px',
  margin: 'auto',
  background: '#fff',
  border: '4px solid #1e3a8a',
  borderRadius: '16px',
  padding: '40px',
  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '2px solid #e0e7ff',
  paddingBottom: '20px',
  marginBottom: '30px'
};

const logoStyle = {
  width: '80px',
  height: '80px',
  objectFit: 'contain'
};

const schoolNameStyle = {
  flexGrow: 1,
  textAlign: 'center',
  fontSize: '26px',
  fontWeight: 700,
  color: '#1e3a8a',
  marginRight: '80px'
};

export default AdmitCard;
