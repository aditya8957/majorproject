
import React, { useEffect, useState } from "react";
import axios from "axios";

export function ApplicationHistory() {
  const [history, setHistory] = useState([]);
  const phone = "8957434966"; // logged-in user's phone

  useEffect(() => {
    axios
      .get("http://localhost:4000/application/history", {
        params: { phone }
      })
      .then(res => setHistory(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Application History</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Application ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Device</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {history.map(app => (
            <tr key={app._id} className="text-center border-t">
              <td>{app.applicationId}</td>
              <td>{app.name}</td>
              <td>{app.phoneNumber}</td>
              <td>{app.device}</td>
              <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
              <td>{app.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
