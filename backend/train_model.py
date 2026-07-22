import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report

from sklearn.linear_model import LogisticRegression

df = pd.read_csv("dataset.csv")

print("Dataset Shape:", df.shape)
print("Class Distribution:")
print(df["Class"].value_counts())

X = df.drop(columns=["Class"])
y = df["Class"]

print("Number of Features:", len(X.columns))
print("Target Column:", y.name)
print("Feature Names:")
print(X.columns.tolist())
print("=" * 50)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42,stratify=y
)

preprocessor = ColumnTransformer([("scaler", StandardScaler(), X_train.columns)])

pipeline = Pipeline(
    [
        ("processor", preprocessor),
        (
            "model",
            LogisticRegression(max_iter=1000, class_weight="balanced", random_state=42),
        ),
    ]
)

pipeline.fit(X_train, y_train)

y_pred = pipeline.predict(X_test)

print("Classification Report:")
print(classification_report(y_test, y_pred))

feature_name = X.columns.tolist()

joblib.dump(feature_name, "features_name.pkl")
joblib.dump(pipeline, "credit_card_fraud_detection_model.pkl")

print("Model Saved Successfully")

saved_features = joblib.load("features_name.pkl")

print("\nSaved Features:")
print(saved_features)
print("Total Features:", len(saved_features))