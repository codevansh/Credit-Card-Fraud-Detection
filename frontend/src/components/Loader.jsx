import { FaShieldAlt } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">

      <div className="flex flex-col items-center">

        {/* Shield Icon */}
        <div className="bg-blue-600 p-5 rounded-full mb-6 animate-pulse">
          <FaShieldAlt className="text-white text-5xl" />
        </div>

        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>

        {/* Heading */}
        <h2 className="mt-8 text-3xl font-bold text-white">
          Analyzing Transactions
        </h2>

        {/* Description */}
        <p className="mt-3 text-slate-400 text-center max-w-md">
          Our AI model is scanning uploaded transactions and
          identifying potentially fraudulent activities.
        </p>

        {/* Loading Bar */}
        <div className="mt-8 w-72 h-2 bg-slate-800 rounded-full overflow-hidden">

          <div className="h-full bg-blue-500 rounded-full animate-[loading_2s_linear_infinite]"></div>

        </div>

        <p className="text-slate-500 mt-4 text-sm">
          Please wait...
        </p>

      </div>

    </div>
  );
};

export default Loader;