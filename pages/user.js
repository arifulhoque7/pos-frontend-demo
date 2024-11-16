import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import api from "../utils/api";
import Modal from "../components/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const User = () => {
  const [userListData, setUserListData] = useState([]);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // For edit
  const [formUser, setFormUser] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    fetchUserListData();
  }, []);

  const fetchUserListData = async (url = "/users") => {
    try {
      const response = await api.get(url);
      setUserListData(response.data.data);
      setPaginationLinks(response.data.meta.links);
      setPaginationMeta({
        from: response.data.meta.from,
        to: response.data.meta.to,
        currentPage: response.data.meta.current_page,
        lastPage: response.data.meta.last_page,
        total: response.data.meta.total,
        perPage: response.data.meta.per_page,
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handlePageClick = (url) => {
    if (url) {
      fetchUserListData(url);
    }
  };

  const handleAddUserClick = () => {
    setFormUser({ name: "", email: "" });
    setErrors({});
    setIsEditMode(false); // Add mode
    setShowModal(true);
  };

  const handleEditUserClick = (user) => {
    setFormUser({ name: user.attributes.name, email: user.attributes.email });
    setCurrentUser(user);
    setErrors({});
    setIsEditMode(true); // Edit mode
    setShowModal(true);
  };

  const handleDeleteUserClick = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/users/${userId}`);
      toast.success("User deleted successfully!");
      fetchUserListData();
    } catch (error) {
      toast.error("Failed to delete user.");
      console.error("Delete user error:", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleFormChange = (e) => {
    setFormUser({ ...formUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update user
        await api.put(`/users/${currentUser.id}`, formUser);
        toast.success("User updated successfully!");
      } else {
        // Create new user
        await api.post("/users", formUser);
        toast.success("User added successfully!");
      }
      setShowModal(false);
      fetchUserListData();
      setErrors({});
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors(error.response.data.message);
      }
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-10">
          <main>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">
                      Users List
                    </h1>
                  </div>
                  <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                      onClick={handleAddUserClick}
                      type="button"
                      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add User
                    </button>

                    <Modal
                      isOpen={showModal}
                      onClose={handleModalClose}
                      title={isEditMode ? "Edit User" : "Add New User"}
                    >
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name
                            </label>
                            <input
                              required
                              type="text"
                              name="name"
                              id="name"
                              value={formUser.name}
                              onChange={handleFormChange}
                              className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            />
                            {errors.name && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.name[0]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email
                            </label>
                            <input
                              required
                              type="email"
                              name="email"
                              id="email"
                              value={formUser.email}
                              onChange={handleFormChange}
                              className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            />
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.email[0]}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={handleModalClose}
                            className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </Modal>
                  </div>
                </div>
                <div className="mt-8 flow-root">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Email
                              </th>
                              <th
                                scope="col"
                                className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {userListData?.map((user) => (
                              <tr key={user.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  {user.attributes.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {user.attributes.email}
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                  <button
                                    onClick={() => handleEditUserClick(user)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    Edit
                                  </button>
                                  {user.id !=
                                    localStorage.getItem("user_id") && (
                                    <button
                                      onClick={() =>
                                        handleDeleteUserClick(user.id)
                                      }
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <Pagination
                          paginationLinks={paginationLinks}
                          paginationMeta={paginationMeta}
                          onPageClick={handlePageClick}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default User;
