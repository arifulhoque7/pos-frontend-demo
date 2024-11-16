import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
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

  const handleLogout = async () => {
    try {
      const response = await api.post("/logout");
      localStorage.removeItem("token");
      toast.success(response?.data?.message);
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message);
    }
  };

  const activeLinkStyle = (path) => {
    return router.pathname === path
      ? "border-b-2 border-indigo-500"
      : "border-b-2 border-transparent";
  };

  const activeLinkStyle2 = (path) => {
    return router.pathname === path
      ? "border-l-4 border-indigo-500 text-indigo-700  bg-indigo-50"
      : "";
  };
  return (
    <Disclosure as="nav" className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="-ml-2 mr-2 flex items-center md:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://upload.wikimedia.org/wikipedia/commons/1/1e/D.E.M.O._Logo_2006.svg"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/dashboard"
                className={`inline-flex items-center  px-1 pt-1 text-sm font-medium text-gray-900 ${activeLinkStyle(
                  "/dashboard"
                )}`}
              >
                Dashboard
              </Link>

              <Link
                href="/user"
                className={`inline-flex items-center  px-1 pt-1 text-sm font-medium text-gray-900 ${activeLinkStyle(
                  "/user"
                )}`}
              >
                User
              </Link>

              <Link
                href="/supplier"
                className={`inline-flex items-center  px-1 pt-1 text-sm font-medium text-gray-900 ${activeLinkStyle(
                  "/supplier"
                )}`}
              >
                Supplier
              </Link>

              <Link
                href="/category"
                className={`inline-flex items-center  px-1 pt-1 text-sm font-medium text-gray-900 ${activeLinkStyle(
                  "/category"
                )}`}
              >
                Category
              </Link>

              <Link
                href="/product"
                className={`inline-flex items-center  px-1 pt-1 text-sm font-medium text-gray-900 ${activeLinkStyle(
                  "/product"
                )}`}
              >
                Product
              </Link>
              <Link
                href="/purchase"
                className={`inline-flex items-center  px-1 pt-1 text-sm font-medium text-gray-900 ${activeLinkStyle(
                  "/purchase"
                )}`}
              >
                Purchase
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-4 md:flex md:shrink-0 md:items-center">
              <button
                type="button"
                className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>

              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="md:hidden">
        <div className="space-y-1 pb-3 pt-2">
          <Link
            href="/dashboard"
            className={`block  py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6 ${activeLinkStyle2(
              "/dashboard"
            )}`}
          >
            Dashboard
          </Link>
          <Link
            href="/user"
            className={`block  py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6 ${activeLinkStyle2(
              "/user"
            )}`}
          >
            User
          </Link>
          <Link
            href="/supplier"
            className={`block  py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6 ${activeLinkStyle2(
              "/supplier"
            )}`}
          >
            Supplier
          </Link>

          <Link
            href="/category"
            className={`block  py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6 ${activeLinkStyle2(
              "/category"
            )}`}
          >
            Category
          </Link>

          <Link
            href="/product"
            className={`block  py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6 ${activeLinkStyle2(
              "/product"
            )}`}
          >
            Product
          </Link>
          <Link
            href="/purchase"
            className={`block  py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6 ${activeLinkStyle2(
              "/purchase"
            )}`}
          >
            Purchase
          </Link>
        </div>
        <div className="border-t border-gray-200 pb-3 pt-4">
          <div className="flex items-center px-4 sm:px-6">
            <div className="shrink-0">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="size-10 rounded-full"
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">
                {userData?.name || ""}
              </div>
              <div className="text-sm font-medium text-gray-500">
                {userData?.email || ""}
              </div>
            </div>
            <button
              type="button"
              className="relative ml-auto shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-3 space-y-1">
            <DisclosureButton
              as="button"
              onClick={() => handleLogout()}
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
            >
              Sign out
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
