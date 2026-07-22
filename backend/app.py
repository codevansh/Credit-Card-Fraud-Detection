from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

model = joblib.load("credit_card_fraud_detection_model.pkl")
feature_names = joblib.load("features_name.pkl")


@app.route("/")
def home():
    return {"msg": "Credit Card Fraud Detection API running"}


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        input_df = pd.DataFrame([data])

        missing = [col for col in feature_names if col not in input_df.columns]
        if missing:
            return (
                jsonify({"error": "Missing Columns", "missing_columns": missing}),
                400,
            )

        input_df = input_df[feature_names]

        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]

        return jsonify(
            {
                "prediction": (
                    "Fraudulent Transaction"
                    if prediction == 1
                    else "Legitimate Transaction"
                ),
                "fraud_probability": round(probability * 100, 2),
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict_csv", methods=["POST"])
def predict_csv():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]

        df = pd.read_csv(file.stream)

        missing = [col for col in feature_names if col not in df.columns]
        if missing:
            return (
                jsonify({"error": "Missing Columns", "missing_columns": missing}),
                400,
            )

        X = df[feature_names]

        predictions = model.predict(X)
        probabilities = model.predict_proba(X)

        df["Prediction"] = [
            "Fraudulent Transaction" if p == 1 else "Legitimate Transaction"
            # p ==1 ? "Fraudulent Transaction" : "Legitimate Transaction"
            for p in predictions
        ]

        df["Fraud Probability (%)"] = (probabilities[:, 1] * 100).round(2)
        return jsonify(df.to_dict(orient="records"))

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
