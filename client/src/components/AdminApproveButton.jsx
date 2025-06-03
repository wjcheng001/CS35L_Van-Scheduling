import { useState } from "react";
import axios from "axios";

export default function AdminApproveButton() {
  const [uid, setUid] = useState("");
  const [msg, setMsg] = useState("");

  const handleApprove = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/approve-user",
        { uid },
        { withCredentials: true }
      );
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md space-y-2">
      <h2 className="text-lg font-bold">Approve User</h2>
      <input
        type="text"
        placeholder="Enter UID"
        value={uid}
        onChange={(e) => setUid(e.target.value)}
        className="border px-2 py-1 rounded w-full"
      />
      <button
        onClick={handleApprove}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Approve
      </button>
      {msg && <p className="text-green-600">{msg}</p>}
    </div>
  );
}
