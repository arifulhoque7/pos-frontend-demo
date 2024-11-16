import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import api from "../utils/api";
import Modal from "../components/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
  const [productListData, setProductListData] = useState([]);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // For edit
  const [formProduct, setFormProduct] = useState({
    name: "",
    SKU: "",
    price: "",
    initial_stock_quantity: "",
    category_id: "",
  });
  const [categories, setCategories] = useState([]); // Categories for dropdown
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProductListData();
    fetchCategories(); // Fetch categories when component mounts
  }, []);

  const fetchProductListData = async (url = "/products") => {
    try {
      const response = await api.get(url);
      setProductListData(response.data.data);
      setPaginationLinks(response.data.meta.links);
      setPaginationMeta(response.data.meta);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories"); // Assuming categories endpoint
      //   console.log("Categories:", response.data.data);
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handlePageClick = (url) => {
    if (url) {
      fetchProductListData(url);
    }
  };

  const handleAddProductClick = () => {
    setFormProduct({
      name: "",
      SKU: "",
      price: "",
      initial_stock_quantity: "",
      category_id: "",
    });
    setErrors({});
    setIsEditMode(false); // Add mode
    setShowModal(true);
  };

  const handleEditProductClick = (product) => {
    setFormProduct({
      name: product.attributes.name,
      SKU: product.attributes.SKU,
      price: product.attributes.price,
      initial_stock_quantity: product.attributes.initial_stock_quantity,
      category_id: product.attributes.category_id,
    });
    setCurrentProduct(product);
    setErrors({});
    setIsEditMode(true); // Edit mode
    setShowModal(true);
  };

  const handleDeleteProductClick = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${productId}`);
      toast.success("Product deleted successfully!");
      fetchProductListData();
    } catch (error) {
      toast.error("Failed to delete product.");
      console.error("Delete product error:", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormProduct((prev) => {
      const newFormProduct = { ...prev, [name]: value };
      if (name === "name" || name === "category_id") {
        newFormProduct.SKU = generateSKU(
          newFormProduct.name,
          newFormProduct.category_id
        ); // Update SKU when name or category changes
      }
      return newFormProduct;
    });
  };

  const generateSKU = (name, categoryId) => {
    // Simple SKU generation logic based on name and categoryId
    const categoryPrefix =
      categories
        .find((cat) => cat.id === categoryId)
        ?.name?.slice(0, 3)
        .toUpperCase() || "GEN";
    return `${categoryPrefix}-${name.slice(0, 3).toUpperCase()}-${Math.floor(
      Math.random() * 1000
    )}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update product
        await api.put(`/products/${currentProduct.id}`, formProduct);
        toast.success("Product updated successfully!");
      } else {
        // Create new product
        await api.post("/products", formProduct);
        toast.success("Product added successfully!");
      }
      setShowModal(false);
      fetchProductListData();
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
                      Product List
                    </h1>
                  </div>
                  <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                      onClick={handleAddProductClick}
                      type="button"
                      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add Product
                    </button>

                    <Modal
                      isOpen={showModal}
                      onClose={handleModalClose}
                      title={isEditMode ? "Edit Product" : "Add New Product"}
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
                              value={formProduct.name}
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
                              htmlFor="SKU"
                              className="block text-sm font-medium text-gray-700"
                            >
                              SKU
                            </label>
                            <input
                              required
                              type="text"
                              name="SKU"
                              id="SKU"
                              value={formProduct.SKU}
                              onChange={handleFormChange}
                              className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                              readOnly // SKU is auto-generated
                            />
                            {errors.SKU && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.SKU[0]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="price"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Price
                            </label>
                            <input
                              required
                              type="number"
                              name="price"
                              id="price"
                              value={formProduct.price}
                              onChange={handleFormChange}
                              className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            />
                            {errors.price && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.price[0]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="initial_stock_quantity"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Initial Stock Quantity
                            </label>
                            <input
                              required
                              type="number"
                              name="initial_stock_quantity"
                              id="initial_stock_quantity"
                              value={formProduct.initial_stock_quantity}
                              onChange={handleFormChange}
                              className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            />
                            {errors.initial_stock_quantity && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.initial_stock_quantity[0]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="category_id"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Category
                            </label>
                            <select
                              required
                              name="category_id"
                              id="category_id"
                              value={formProduct.category_id}
                              onChange={handleFormChange}
                              className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            >
                              <option value="">Select Category</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.attributes.name}
                                </option>
                              ))}
                            </select>
                            {errors.category_id && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.category_id[0]}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={handleModalClose}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            {isEditMode ? "Update Product" : "Add Product"}
                          </button>
                        </div>
                      </form>
                    </Modal>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Product Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Category Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            SKU
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Initial Stock Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Current Stock Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {productListData.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {product.attributes.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {product.attributes.category_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.attributes.SKU}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.attributes.price}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.attributes.initial_stock_quantity}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.attributes.current_stock_quantity}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEditProductClick(product)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteProductClick(product.id)
                                }
                                className="ml-2 text-red-600 hover:text-red-900"
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
          </main>
        </div>
        <ToastContainer />
      </Layout>
    </ProtectedRoute>
  );
};

export default Product;
