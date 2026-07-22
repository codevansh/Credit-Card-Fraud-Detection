import { useState } from "react";
import axios from "axios";
import {
    FaUpload,
    FaFileCsv,
    FaSearch,
    FaDownload,
    FaSpinner,
} from "react-icons/fa";

const CSVPrediction = () => {
    const [file, setFile] = useState(null)
    const [dragActive, setDragActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState([])
    const [search, setSearch] = useState("")
    const [stats, setStats] = useState({
        total: 0,
        fraud: 0,
        legitimate: 0,
        fraudRate: 0,
    })
    const [error, setError] = useState("")

    const handleFile = (selectedFile) => {
        if (!selectedFile) return

        if (!selectedFile.name.endsWith(".csv")) {
            setError("Please upload a CSV file.")
            return
        }

        setError("")
        setFile(selectedFile)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragActive(false)

        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handlePrediction = async () => {
        if (!file) {
            setError("Please upload a CSV first.")
            return
        }

        try {
            setLoading(true)
            setError("")

            const formData = new FormData()
            formData.append("file", file)

            const response = await axios.post(
                "https://credit-card-fraud-detection-9i0v.onrender.com/predict_csv",
                formData
            )

            const data = response.data
            // console.log(response.data)
            // console.log(typeof response.data)
            setResults(data)

            const fraud = data.filter(
                (row) => row.Prediction === "Fraudulent Transaction"
            ).length

            const legitimate = data.length - fraud

            setStats({
                total: data.length,
                fraud,
                legitimate,
                fraudRate:
                    data.length === 0
                        ? 0
                        : ((fraud / data.length) * 100).toFixed(2),
            })
        } catch (err) {
            console.log("========== ERROR ==========");
            console.log(err);
            console.log("Message:", err.message);
            console.log("Response:", err.response);
            console.log("Status:", err.response?.status);
            console.log("Data:", err.response?.data);

            if (err.response) {
                setError(JSON.stringify(err.response.data));
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const filteredResults = results.filter((row, index) =>
        index.toString().includes(search)
    )

    return (
        <div className="space-y-10">

            {/* Upload Section */}

            <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-700 p-10">

                <h2 className="text-3xl font-bold text-white text-center mb-3">
                    Upload Transaction Dataset
                </h2>

                <p className="text-slate-400 text-center mb-8">
                    Upload a CSV file to analyze transactions for potential fraud.
                </p>

                <div
                    onDragEnter={() => setDragActive(true)}
                    onDragLeave={() => setDragActive(false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${dragActive
                        ? "border-blue-500 bg-blue-900/20"
                        : "border-slate-600"
                        }`}
                >
                    <FaFileCsv className="mx-auto text-6xl text-green-400 mb-4" />

                    <p className="text-slate-300 text-lg">
                        Drag & Drop CSV Here
                    </p>

                    <p className="text-slate-500 my-3">
                        or
                    </p>

                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-3 transition">
                        <FaUpload />
                        Browse File
                        <input
                            type="file"
                            accept=".csv"
                            hidden
                            onChange={(e) => handleFile(e.target.files[0])}
                        />
                    </label>

                    {file && (
                        <p className="mt-5 text-green-400 font-semibold">
                            Selected File: {file.name}
                        </p>
                    )}
                </div>

                {error && (
                    <div className="mt-5 bg-red-900/40 border border-red-500 rounded-lg p-4 text-red-300">
                        {error}
                    </div>
                )}

                <div className="flex justify-center mt-8">
                    <button
                        onClick={handlePrediction}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg text-white font-semibold transition flex items-center gap-3 disabled:opacity-60">
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <FaSearch />
                                Analyze Transactions
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Statistics */}

            {results.length > 0 && (
                <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
                        <p className="text-slate-400">Total Transactions</p>

                        <h2 className="text-4xl font-bold text-white mt-2">
                            {stats.total}
                        </h2>
                    </div>

                    <div className="bg-red-900/20 rounded-xl p-6 border border-red-500">
                        <p className="text-red-300">
                            Fraudulent Transactions
                        </p>

                        <h2 className="text-4xl font-bold text-red-400 mt-2">
                            {stats.fraud}
                        </h2>
                    </div>

                    <div className="bg-green-900/20 rounded-xl p-6 border border-green-500">
                        <p className="text-green-300">
                            Legitimate Transactions
                        </p>

                        <h2 className="text-4xl font-bold text-green-400 mt-2">
                            {stats.legitimate}
                        </h2>
                    </div>

                    <div className="bg-yellow-900/20 rounded-xl p-6 border border-yellow-500">
                        <p className="text-yellow-300">
                            Fraud Rate
                        </p>

                        <h2 className="text-4xl font-bold text-yellow-400 mt-2">
                            {stats.fraudRate}%
                        </h2>
                    </div>

                </div>
            )}
            {/* Search & Download */}

            {results.length > 0 && (
                <>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div className="relative w-full md:w-96">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                placeholder="Search by transaction index..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500"
                            />
                        </div>

                        <button
                            onClick={() => {
                                const headers = Object.keys(results[0]);

                                const csv = [
                                    headers.join(","),
                                    ...results.map((row) =>
                                        headers
                                            .map((header) => `"${row[header]}"`)
                                            .join(",")
                                    ),
                                ].join("\n");

                                const blob = new Blob([csv], {
                                    type: "text/csv",
                                });

                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "prediction_report.csv";
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg text-white flex items-center justify-center gap-3"
                        >
                            <FaDownload />

                            Download Report
                        </button>
                    </div>

                    {/* Prediction Table */}

                    <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-slate-300">
                                            Transaction
                                        </th>
                                        <th className="px-6 py-4 text-left text-slate-300">
                                            Prediction
                                        </th>
                                        <th className="px-6 py-4 text-left text-slate-300">
                                            Fraud Probability
                                        </th>
                                        <th className="px-6 py-4 text-left text-slate-300">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResults.map((row, index) => {

                                        const probability =
                                            row["Fraud Probability (%)"];

                                        const fraud =
                                            row.Prediction ===
                                            "Fraudulent Transaction";

                                        return (
                                            <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/60 transition">
                                                <td className="px-6 py-4 text-slate-300">
                                                    TXN-{index + 1}
                                                </td>

                                                <td className={`px-6 py-4 font-semibold ${fraud
                                                    ? "text-red-400"
                                                    : "text-green-400"
                                                    }`}
                                                >
                                                    {row.Prediction}
                                                </td>

                                                <td className="px-6 py-4 text-white">
                                                    {probability}%
                                                </td>

                                                <td className="px-6 py-4">

                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${fraud
                                                        ? "bg-red-500/20 text-red-400 border border-red-500"
                                                        : "bg-green-500/20 text-green-400 border border-green-500"
                                                        }`}>
                                                        {fraud
                                                            ? "High Risk"
                                                            : "Safe"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CSVPrediction;