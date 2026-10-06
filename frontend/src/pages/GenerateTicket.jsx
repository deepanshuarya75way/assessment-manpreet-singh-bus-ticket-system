import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function GenerateTicket() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    from: "",
    to: "",
    fare: "",
    busNo: ""
  });
  const seats = Array.from({length:40}, (... i) => i+1);
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);

  

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  

  const selectSeat =(seat) =>{
    setSelectedSeat(seat);
  }
  // Dummy fare calculation
  const getDistance = () => {
    const fakeDistance = Math.floor(Math.random() * 100);
    const fare = fakeDistance * 10;

    setForm({ ...form, fare });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  const handleGenerateAndPrint = async () => {

    // ✅ Validation
    if (!form.from || !form.to || !form.fare || !form.busNo) {
      alert("Please fill all fields");
      return;
    }
   
    if(!selectedSeat){
      alert("Please select a seat");
    }
    try {
      setLoading(true);

    //  const res = await axios.post(
    //    "https://bus-ticket-system-2.onrender.com/create-ticket",
    //    form
    //  );

      const ticketData ={
        ...form,
        seatNumber: selectedSeat
      };
      const res = await axios.post(
        "http://127.0.0.1:5000/create-ticket",
        ticketData
      )
      
      const qrCode = res.data.qr;
      setQr(qrCode);

      const printWindow = window.open("", "_blank");

      printWindow.document.write(`
      <html>
      <head>
        <title>Bus Ticket</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: monospace;
          }
          .ticket {
            width: 250px;
            border: 2px dashed black;
            padding: 15px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <h2>STATE TRANSPORT</h2>
          <hr/>
          <p><b>From:</b> ${form.from}</p>
          <p><b>To:</b> ${form.to}</p>
          <p><b>Fare:</b> ₹${form.fare}</p>
          <p><b>Bus:</b> ${form.busNo}</p>
          <p><b>Seat:<b> ${selectedSeat}</p>
          <hr/>
          <img src="${qrCode}" width="120"/>
          <p>Valid Ticket</p>
        </div>
      </body>
      </html>
      `);

      printWindow.document.close();
      setBookedSeats([...bookedSeats, selectedSeat]);
      setSelectedSeat(null);

      setTimeout(() => {
        printWindow.print();

        printWindow.onafterprint = () => {
          printWindow.close();
        };
        

      }, 500);

    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Generate Ticket</h2>

      {/* ✅ Controlled Inputs */}
      <input
        type="text"
        name="from"
        placeholder="From"
        value={form.from}
        onChange={handleChange}
      />

      <input
        type="text"
        name="to"
        placeholder="To"
        value={form.to}
        onChange={handleChange}
      />

      <input
        type="number"
        name="fare"
        value={form.fare}
        readOnly
      />

      <input
        type="text"
        name="busNo"
        placeholder="Bus Number"
        value={form.busNo}
        onChange={handleChange}
      />

      <div className = "seat-container">
        <h3>Select Seat</h3>
        <div className="seat-legend">
          <span>
            <i className="legend availaible"></i>
            Available
          </span>
           <span>
            <i className="legend selected"></i>
            Selected
          </span>
          <span>
            <i className="legend Booked"></i>
            Booked
          </span>
        </div>
        <div className="seat-layout"> 
            <button type="button" classname="seat" onClick={ ()=> selectSeat(1)}>
              1
            </button>
            <button type="button" className="seat" onClick={ ()=> selectSeat(2)}>
              2
            </button>
            <button type="button" className="seat" onClick={ ()=> selectSeat(3)}>
              3
            </button>
            <button type="button" className="seat" onClick={ ()=> selectSeat(4)}>
              4
            </button>
            <button type="button" className="seat" onClick={ ()=> selectSeat(5)}>
              5
            </button>
            <button type="button" className="seat" onClick={ ()=> selectSeat(6)}>
              6
            </button>
            <button type="button" className="seat" onClick={ ()=> selectSeat(7)}>
              7
            </button>
            <button type="button" className="seat" onClick={ ()=> selectSeat(8)}>
              8
            </button>
            <button type="button" className="seat" onClick={ ()=> selectSeat(9)}>
              9
            </button>

            </div>
          {selectedSeat &&(
            <p >
              Selected Seat: <b>{selectedSeat}</b>
            </p>
          )}

        
      </div>

      <button onClick={getDistance}>Calculate Fare</button>

      <button onClick={handleGenerateAndPrint} disabled={loading}>
        {loading ? "Generating..." : "Generate & Print Ticket 🖨️"}
      </button>

      <button onClick={handleLogout}>Logout 🚪</button>


    </div>
  );
}

export default GenerateTicket;