import { toast } from "react-toastify";


export const showConfirmToast = (message, onConfirm) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p>{message}</p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={async () => {
              try {
                await onConfirm(); 
                toast.success("Action completed!");
              } catch (err) {
                toast.error("Something went wrong!");
              }
              closeToast();
            }}
            className="rounded bg-red-600 px-3 py-1 text-white"
          >
            Yes
          </button>
          <button
            onClick={closeToast}
            className="rounded bg-gray-400 px-3 py-1 text-white"
          >
            No
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    }
  );
};
