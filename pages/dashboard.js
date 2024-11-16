import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import api from "../utils/api";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("user_id");
      if (userId) {
        try {
          const response = await api.get(`/users/${userId}`);
          setUserData(response.data.data.attributes);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            Welcome to your Dashboard!
            {userData && (
              <span>
                <br />
                You are logged in as: {userData.name} ({userData.email})
              </span>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
