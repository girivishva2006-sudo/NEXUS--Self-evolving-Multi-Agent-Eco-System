import os
import pickle
import joblib
import numpy as np
import pandas as pd


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "production",
    "nexus_production_agent_rf.pkl"
)

FEATURES_PATH = os.path.join(
    BASE_DIR,
    "models",
    "production",
    "nexus_production_features.pkl"
)


class ProductionAgent:

    def __init__(self):
        print("Loading Production Agent...")

        self.model = joblib.load(MODEL_PATH)

        with open(FEATURES_PATH, "rb") as feature_file:
            self.features = pickle.load(feature_file)

        print("Production Agent loaded successfully.")
        print("Features:", self.features)

    def predict(self, input_data):

        values = [
            input_data["lead_time"],
            input_data["number_of_products_sold"],
            input_data["manufacturing_lead_time"],
            input_data["defect_rates"],
            input_data["manufacturing_costs"],
            input_data["availability"],
            input_data["stock_levels"],
            input_data["order_quantities"]
        ]

        data = pd.DataFrame([values], columns=self.features)

        prediction = self.model.predict(data)

        return {
            "prediction": prediction.tolist()
        }