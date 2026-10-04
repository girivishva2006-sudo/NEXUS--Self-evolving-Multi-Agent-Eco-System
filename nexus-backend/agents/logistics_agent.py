import os
import pickle
import joblib
import pandas as pd
import tensorflow as tf


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "logistics",
    "nexus_logistics_agent_ann.keras"
)

PREPROCESSOR_PATH = os.path.join(
    BASE_DIR,
    "models",
    "logistics",
    "nexus_logistics_preprocessor.pkl"
)

FEATURES_PATH = os.path.join(
    BASE_DIR,
    "models",
    "logistics",
    "nexus_logistics_features.pkl"
)


class LogisticsAgent:

    def __init__(self):
        print("Loading Logistics Agent...")

        self.model = tf.keras.models.load_model(MODEL_PATH)

        with open(PREPROCESSOR_PATH, "rb") as file:
            self.preprocessor = joblib.load(file)

        with open(FEATURES_PATH, "rb") as file:
            self.features = pickle.load(file)

        print("Logistics Agent loaded successfully.")
        print("Features:", self.features)

    def predict(self, input_data):

        data = pd.DataFrame([{
            "delivery_partner": input_data["delivery_partner"],
            "package_type": input_data["package_type"],
            "vehicle_type": input_data["vehicle_type"],
            "delivery_mode": input_data["delivery_mode"],
            "region": input_data["region"],
            "weather_condition": input_data["weather_condition"],
            "distance_km": input_data["distance_km"],
            "package_weight_kg": input_data["package_weight_kg"],
            "expected_time_num": input_data["expected_time_num"],
            "delivery_cost": input_data["delivery_cost"]
        }])

        processed_data = self.preprocessor.transform(data)

        probability = float(self.model.predict(processed_data, verbose=0)[0][0])

        prediction = 1 if probability >= 0.5 else 0

        return {
            "prediction": prediction,
            "delay_probability": probability
        }