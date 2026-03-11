import { toast } from "sonner";

export const toastSuccess = (message: string) => {
  toast(
    <div className="flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        color="green"
        className="bi bi-check2-circle"
        viewBox="0 0 16 16"
      >
        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
      </svg>

      <p className="text-sm font-medium text-gray-800">{message}</p>
    </div>,
    {
      className: `
        bg-white
        border-l-4 border-emerald-500
        shadow-md
        rounded-md
        px-3 py-2
        max-w-[300px]
        break-words
        flex items-center gap-2
        duration-100
      `,
    },
  );
};

export const toastError = (message: string) => {
  toast(
    <div className="flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        className="bi bi-x-circle"
        color="red"
        viewBox="0 0 16 16"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
      </svg>

      <p className="text-sm font-medium text-gray-800">{message}</p>
    </div>,
    {
      className: `
        bg-white
        border-l-4 border-red-500
        shadow-md
        rounded-md
        px-3 py-2
        max-w-[260px]
        break-words
        flex items-center gap-2
      
        duration-100
      `,
    },
  );
};
