// components/Pagination.js
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const Pagination = ({ paginationLinks, paginationMeta, onPageClick }) => {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{paginationMeta.from}</span>{" "}
            to <span className="font-medium">{paginationMeta.to}</span> of{" "}
            <span className="font-medium">{paginationMeta.total}</span> results
          </p>
        </div>
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          >
            {paginationLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageClick(link.url);
                }}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  link.active ? "bg-indigo-600 text-white" : ""
                }`}
              >
                {link.label.includes("Next") ? (
                  <ChevronRightIcon className="h-5 w-5" />
                ) : link.label.includes("Previous") ? (
                  <ChevronLeftIcon className="h-5 w-5" />
                ) : (
                  link.label
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
