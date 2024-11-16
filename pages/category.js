import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import api from "../utils/api";
import Modal from "../components/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Category = () => {
  const [categoryListData, setCategoryListData] = useState([]);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // For edit
  const [formCategory, setFormCategory] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategoryListData();
  }, []);

  const fetchCategoryListData = async (url = "/categories") => {
    try {
      const response = await api.get(url);
      console.log("Category data:", response.data.meta);
      setCategoryListData(response.data.data);
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
      console.error("Failed to fetch category data:", error);
    }
  };

  const handlePageClick = (url) => {
    if (url) {
      fetchCategoryListData(url);
    }
  };

  const handleAddCategoryClick = () => {
    setFormCategory({ name: "", description: "" });
    setErrors({});
    setIsEditMode(false); // Add mode
    setShowModal(true);
  };

  const handleEditCategoryClick = (category) => {
    setFormCategory({
      name: category.attributes.name,
      description: category.attributes.description,
    });
    setCurrentCategory(category);
    setErrors({});
    setIsEditMode(true); // Edit mode
    setShowModal(true);
  };

  const handleDeleteCategoryClick = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/categories/${categoryId}`);
      toast.success("Category deleted successfully!");
      fetchCategoryListData();
    } catch (error) {
      toast.error("Failed to delete category.");
      console.error("Delete category error:", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentCategory(null);
  };

  const handleFormChange = (e) => {
    setFormCategory({ ...formCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update category
        await api.put(`/categories/${currentCategory.id}`, formCategory);
        toast.success("Category updated successfully!");
      } else {
        // Create new category
        await api.post("/categories", formCategory);
        toast.success("Category added successfully!");
      }
      setShowModal(false);
      fetchCategoryListData();
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
                      Categories List
                    </h1>
                  </div>
                  <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                      onClick={handleAddCategoryClick}
                      type="button"
                      className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add Category
                    </button>

                    <Modal
                      isOpen={showModal}
                      onClose={handleModalClose}
                      title={isEditMode ? "Edit Category" : "Add New Category"}
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
                              value={formCategory.name}
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
                              htmlFor="description"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Description
                            </label>
                            <textarea
                              required
                              name="description"
                              id="description"
                              value={formCategory.description}
                              onChange={handleFormChange}
                              className="relative block w-full rounded-t-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            />
                            {errors.description && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.description[0]}
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
                                Description
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
                            {categoryListData.map((category) => (
                              <tr key={category.id}>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                  {category.attributes.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {category.attributes.description}
                                </td>
                                <td className="relative whitespace-nowrap px-3 py-4 text-sm text-right font-medium">
                                  <button
                                    onClick={() =>
                                      handleEditCategoryClick(category)
                                    }
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteCategoryClick(category.id)
                                    }
                                    className="text-red-600 hover:text-red-900 ml-4"
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
        <ToastContainer />
      </Layout>
    </ProtectedRoute>
  );
};

export default Category;
