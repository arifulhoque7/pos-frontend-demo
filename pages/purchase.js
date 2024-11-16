import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import api from "../utils/api";
import Modal from "../components/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Purchase = () => {
  const [purchaseListData, setPurchaseListData] = useState([]);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const [formPurchase, setFormPurchase] = useState({
    supplier_id: "",
    purchase_date: new Date().toISOString().slice(0, 10),
    items: [
      {
        product_id: "",
        quantity: "",
        unit_price: "",
      },
    ],
  });
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPurchaseListData();
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchPurchaseListData = async (url = "/purchases") => {
    try {
      const response = await api.get(url);
      setPurchaseListData(response.data.data);
      setPaginationLinks(response.data.meta.links);
      setPaginationMeta(response.data.meta);
    } catch (error) {
      console.error("Failed to fetch purchase data:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get("/suppliers");
      setSuppliers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleAddPurchaseClick = () => {
    setFormPurchase({
      supplier_id: "",
      purchase_date: new Date().toISOString().slice(0, 10),
      items: [
        {
          product_id: "",
          quantity: "",
          unit_price: "",
        },
      ],
    });
    setErrors({});
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleEditPurchaseClick = (purchase) => {
    // Call fetchPurchase to load the data for the selected purchase
    const fetchPurchase = async () => {
      try {
        const response = await api.get(`/purchases/${purchase.id}`);
        console.log(
          "Fetched purchase data:",
          response.data.data.attributes.items
        );

        setFormPurchase({
          supplier_id: response.data.data.attributes.supplier_id,
          purchase_date: response.data.data.attributes.purchase_date,
          items: response.data.data.attributes.items.map((item) => ({
            product_id: item.attributes.product_id,
            quantity: item.attributes.quantity,
            unit_price: item.attributes.unit_price,
          })),
        });
        setCurrentPurchase(response.data.data); // Save the current purchase data
        setErrors({});
        setIsEditMode(true); // Set edit mode
        setShowModal(true); // Show the modal
      } catch (error) {
        console.error("Failed to fetch purchase data:", error);
      }
    };

    fetchPurchase(); // Ensure we actually call the function
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("items")) {
      const [_, index, field] = name.split("-");
      const parsedIndex = parseInt(index, 10);
      const newItems = [...formPurchase.items];
      newItems[parsedIndex] = {
        ...newItems[parsedIndex],
        [field]: value,
      };
      setFormPurchase((prev) => ({ ...prev, items: newItems }));
    } else {
      setFormPurchase((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddItem = () => {
    setFormPurchase((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product_id: "",
          quantity: "",
          unit_price: "",
        },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    const newItems = formPurchase.items.filter((_, i) => i !== index);
    setFormPurchase((prev) => ({ ...prev, items: newItems }));
  };

  const calculateTotal = () => {
    return formPurchase.items
      .reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
      .toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formPurchase);

    // Calculate total amount
    const totalAmount = formPurchase.items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );

    const formData = {
      ...formPurchase,
      total_amount: totalAmount.toFixed(2),
    };

    try {
      if (isEditMode) {
        await api.put(`/purchases/${currentPurchase.id}`, formData);
        toast.success("Purchase updated successfully!");
      } else {
        await api.post("/purchases", formData);
        toast.success("Purchase added successfully!");
      }
      setShowModal(false);
      fetchPurchaseListData();
      setErrors({});
    } catch (error) {
      console.error("Submit error:", error);
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
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold text-gray-900">
                    Purchase List
                  </h1>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <button
                    onClick={handleAddPurchaseClick}
                    type="button"
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Add Purchase
                  </button>

                  <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={isEditMode ? "Edit Purchase" : "Add New Purchase"}
                  >
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="supplier_id"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Supplier
                          </label>
                          <select
                            required
                            name="supplier_id"
                            id="supplier_id"
                            value={formPurchase.supplier_id}
                            onChange={handleFormChange}
                            className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                          >
                            <option value="">Select Supplier</option>
                            {suppliers.map((supplier) => (
                              <option key={supplier.id} value={supplier.id}>
                                {supplier.attributes.name}
                              </option>
                            ))}
                          </select>
                          {errors.supplier_id && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.supplier_id[0]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="purchase_date"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Purchase Date
                          </label>
                          <input
                            required
                            type="date"
                            name="purchase_date"
                            id="purchase_date"
                            value={formPurchase.purchase_date}
                            onChange={handleFormChange}
                            min={new Date().toISOString().slice(0, 10)}
                            className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                          />
                          {errors.purchase_date && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.purchase_date[0]}
                            </p>
                          )}
                        </div>

                        {formPurchase.items.map((item, index) => (
                          <div key={index} className="flex space-x-4">
                            <div className="flex-1">
                              <label
                                htmlFor={`items-${index}-product_id`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                Product #{index + 1}
                              </label>
                              <select
                                required
                                name={`items-${index}-product_id`}
                                id={`items-${index}-product_id`}
                                value={item.product_id}
                                onChange={handleFormChange}
                                className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                              >
                                <option value="">Select Product</option>
                                {products.map((product) => (
                                  <option key={product.id} value={product.id}>
                                    {product.attributes.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex-1">
                              <label
                                htmlFor={`items-${index}-quantity`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                Quantity #{index + 1}
                              </label>
                              <input
                                required
                                type="number"
                                min="1"
                                name={`items-${index}-quantity`}
                                id={`items-${index}-quantity`}
                                value={item.quantity}
                                onChange={handleFormChange}
                                className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                              />
                            </div>
                            <div className="flex-1">
                              <label
                                htmlFor={`items-${index}-unit_price`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                Unit Price #{index + 1}
                              </label>
                              <input
                                required
                                type="number"
                                min="0"
                                step="any"
                                name={`items-${index}-unit_price`}
                                id={`items-${index}-unit_price`}
                                value={item.unit_price}
                                onChange={handleFormChange}
                                className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={handleAddItem}
                          className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          + Add Item
                        </button>

                        <div className="mt-6">
                          <p className="text-lg font-semibold">
                            Total: ৳ {calculateTotal()}
                          </p>
                        </div>

                        <div className="mt-4 flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                          >
                            {isEditMode ? "Update Purchase" : "Add Purchase"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </Modal>
                </div>
              </div>

              <div className="mt-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th className="py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                          Supplier
                        </th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                          Purchase Date
                        </th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                          Total Amount
                        </th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {purchaseListData.map((purchase) => (
                        <tr key={purchase.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                            {purchase.attributes.supplier_name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(
                              purchase.attributes.purchase_date
                            ).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            ৳ {purchase.attributes.total_amount}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                            <button
                              onClick={() => handleEditPurchaseClick(purchase)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>{" "}
                            <button
                              onClick={() =>
                                handleDeletePurchaseClick(purchase.id)
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
                    onPageClick={fetchPurchaseListData}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
        <ToastContainer />
      </Layout>
    </ProtectedRoute>
  );
};

export default Purchase;
