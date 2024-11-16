import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import api from "../utils/api";
import Modal from "../components/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Supplier = () => {
  const [supplierListData, setSupplierListData] = useState([]);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null); // For edit
  const [formSupplier, setFormSupplier] = useState({
    name: "",
    contact_info: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSupplierListData();
  }, []);

  const fetchSupplierListData = async (url = "/suppliers") => {
    try {
      const response = await api.get(url);
      setSupplierListData(response.data.data);
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
      console.error("Failed to fetch supplier data:", error);
    }
  };

  const handlePageClick = (url) => {
    if (url) {
      fetchSupplierListData(url);
    }
  };

  const handleAddSupplierClick = () => {
    setFormSupplier({ name: "", contact_info: "", address: "" });
    setErrors({});
    setIsEditMode(false); // Add mode
    setShowModal(true);
  };

  const handleEditSupplierClick = (supplier) => {
    setFormSupplier({
      name: supplier.attributes.name,
      contact_info: supplier.attributes.contact_info,
      address: supplier.attributes.address,
    });
    setCurrentSupplier(supplier);
    setErrors({});
    setIsEditMode(true); // Edit mode
    setShowModal(true);
  };

  const handleDeleteSupplierClick = async (supplierId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/suppliers/${supplierId}`);
      toast.success("Supplier deleted successfully!");
      fetchSupplierListData();
    } catch (error) {
      toast.error("Failed to delete supplier.");
      console.error("Delete supplier error:", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentSupplier(null);
  };

  const handleFormChange = (e) => {
    setFormSupplier({ ...formSupplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update supplier
        await api.put(`/suppliers/${currentSupplier.id}`, formSupplier);
        toast.success("Supplier updated successfully!");
      } else {
        // Create new supplier
        await api.post("/suppliers", formSupplier);
        toast.success("Supplier added successfully!");
      }
      setShowModal(false);
      fetchSupplierListData();
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
                      Suppliers List
                    </h1>
                  </div>
                  <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                      onClick={handleAddSupplierClick}
                      type="button"
                      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add Supplier
                    </button>

                    <Modal
                      isOpen={showModal}
                      onClose={handleModalClose}
                      title={isEditMode ? "Edit Supplier" : "Add New Supplier"}
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
                              value={formSupplier.name}
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
                              htmlFor="contact_info"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Contact Info
                            </label>
                            <input
                              required
                              type="text"
                              name="contact_info"
                              id="contact_info"
                              value={formSupplier.contact_info}
                              onChange={handleFormChange}
                              className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            />
                            {errors.contact_info && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.contact_info[0]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Address
                            </label>
                            <input
                              required
                              type="text"
                              name="address"
                              id="address"
                              value={formSupplier.address}
                              onChange={handleFormChange}
                              className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            />
                            {errors.address && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.address[0]}
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
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Contact Info
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Address
                              </th>
                              <th
                                scope="col"
                                className="relative px-3 py-3.5 text-sm font-semibold text-gray-900"
                              >
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {supplierListData.map((supplier) => (
                              <tr key={supplier.id}>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                  {supplier.attributes.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {supplier.attributes.contact_info}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {supplier.attributes.address}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                                  <button
                                    onClick={() =>
                                      handleEditSupplierClick(supplier)
                                    }
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    Edit
                                  </button>{" "}
                                  |{" "}
                                  <button
                                    onClick={() =>
                                      handleDeleteSupplierClick(supplier.id)
                                    }
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
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
      <ToastContainer />
    </ProtectedRoute>
  );
};

export default Supplier;
