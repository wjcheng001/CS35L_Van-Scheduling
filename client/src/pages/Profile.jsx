import React from "react";

export default function Profile() {
  // TODO: be replaced with real user data via props or global state
  const user = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "Project Member",
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>User Profile</h1>
      <div style={{ marginTop: "1rem" }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
}
