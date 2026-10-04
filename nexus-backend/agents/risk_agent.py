import os
import pickle
import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "risk",
    "nexus_risk_agent_xgb.pkl"
)

PREPROCESSOR_PATH = os.path.join(
    BASE_DIR,
    "models",
    "risk",
    "nexus_risk_preprocessor.pkl"
)

FEATURES_PATH = os.path.join(
    BASE_DIR,
    "models",
    "risk",
    "nexus_risk_features.pkl"
)


class RiskAgent:

    def __init__(self):
        print("Loading Risk Agent...")

        self.model = joblib.load(MODEL_PATH)

        with open(PREPROCESSOR_PATH, "rb") as file:
            self.preprocessor = joblib.load(file)

        with open(FEATURES_PATH, "rb") as file:
            self.features = pickle.load(file)

        print("Risk Agent loaded successfully.")
        print("Features:", self.features)

    def predict(self, input_data):

        data = pd.DataFrame([{
            "disruption_type": input_data["disruption_type"],
            "industry": input_data["industry"],
            "supplier_tier": input_data["supplier_tier"],
            "supplier_region": input_data["supplier_region"],
            "supplier_size": input_data["supplier_size"],
            "has_backup_supplier": input_data["has_backup_supplier"],
            "disruption_severity": input_data["disruption_severity"],
            "production_impact_pct": input_data["production_impact_pct"],
            "revenue_loss_usd": input_data["revenue_loss_usd"],
            "response_type": input_data["response_type"],
            "impact_per_severity": input_data["impact_per_severity"],
            "loss_per_impact": input_data["loss_per_impact"],
            "high_severity": input_data["high_severity"],
            "high_impact": input_data["high_impact"],
            "high_loss": input_data["high_loss"],
            "backup_risk": input_data["backup_risk"]
        }])

        processed_data = self.preprocessor.transform(data)

        prediction = self.model.predict(processed_data)

        return {
            "prediction": prediction.tolist()
        }