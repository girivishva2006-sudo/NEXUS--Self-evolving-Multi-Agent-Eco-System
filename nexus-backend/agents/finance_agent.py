import os
import pickle
import joblib
import pandas as pd
import tensorflow as tf


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "finance",
    "nexus_finance_agent_ann.keras"
)

PREPROCESSOR_PATH = os.path.join(
    BASE_DIR,
    "models",
    "finance",
    "nexus_finance_preprocessor.pkl"
)

FEATURES_PATH = os.path.join(
    BASE_DIR,
    "models",
    "finance",
    "nexus_finance_features.pkl"
)


class FinanceAgent:

    def __init__(self):
        print("Loading Finance Agent...")

        self.model = tf.keras.models.load_model(MODEL_PATH)

        self.preprocessor = joblib.load(PREPROCESSOR_PATH)

        with open(FEATURES_PATH, "rb") as file:
            self.features = pickle.load(file)

        print("Finance Agent loaded successfully.")
        print("Features:", self.features)

    def predict(self, input_data):

        data = pd.DataFrame([{
            "City": input_data["City"],
            "Store_Format": input_data["Store_Format"],
            "Category": input_data["Category"],
            "Brand": input_data["Brand"],
            "Channel": input_data["Channel"],
            "Payment_Mode": input_data["Payment_Mode"],
            "Units": input_data["Units"],
            "Cost_Price": input_data["Cost_Price"],
            "Selling_Price": input_data["Selling_Price"],
            "Stock_On_Hand": input_data["Stock_On_Hand"],
            "Reorder_Level": input_data["Reorder_Level"],
            "Lead_Time_Days": input_data["Lead_Time_Days"],
            "Customer_Age": input_data["Customer_Age"],
            "Customer_Gender": input_data["Customer_Gender"],
            "Loyalty_Flag": input_data["Loyalty_Flag"]
        }])

        processed_data = self.preprocessor.transform(data)

        prediction = self.model.predict(
            processed_data,
            verbose=0
        )

        return {
            "prediction": prediction.tolist()
        }
