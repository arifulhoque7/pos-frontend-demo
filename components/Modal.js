import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25"
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xl rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {title}
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-4">{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
