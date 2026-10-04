import os
import pickle
import joblib
import numpy as np
import tensorflow as tf


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "demand",
    "nexus_demand_lstm_final.keras"
)

SCALER_PATH = os.path.join(
    BASE_DIR,
    "models",
    "demand",
    "nexus_demand_lstm_scaler.pkl"
)

FEATURES_PATH = os.path.join(
    BASE_DIR,
    "models",
    "demand",
    "nexus_demand_features.pkl"
)


class DemandAgent:

    def __init__(self):
        print("Loading Demand Agent...")

        self.model = tf.keras.models.load_model(MODEL_PATH)

        self.scaler = joblib.load(SCALER_PATH)

        with open(FEATURES_PATH, "rb") as file:
            self.features = pickle.load(file)

        print("Demand Agent loaded successfully.")
        print("Features:", self.features)

    def predict(self, input_data):

        values = [
            input_data["Units_Sold"],
            input_data["Inventory_Level"],
            input_data["Supplier_Lead_Time_Days"],
            input_data["Reorder_Point"],
            input_data["Order_Quantity"],
            input_data["Unit_Cost"],
            input_data["Unit_Price"],
            input_data["Promotion_Flag"],
            input_data["Lag_1"],
            input_data["Lag_7"],
            input_data["Lag_14"],
            input_data["Rolling_Mean_7"],
            input_data["Rolling_Mean_14"]
        ]

        data = np.array([values], dtype=float)

        scaled_data = self.scaler.transform(data)

        # LSTM expects: [samples, timesteps, features]
        lstm_data = scaled_data.reshape(
            (scaled_data.shape[0], 1, scaled_data.shape[1])
        )

        prediction = self.model.predict(
            lstm_data,
            verbose=0
        )

        return {
            "prediction": prediction.tolist()
        }
