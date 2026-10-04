from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents.production_agent import ProductionAgent
from agents.logistics_agent import LogisticsAgent
from agents.risk_agent import RiskAgent
from agents.finance_agent import FinanceAgent
from agents.demand_agent import DemandAgent
from services.simulation_service import SimulationService

app = FastAPI(
    title="NEXUS Backend",
    description="AI World Simulator Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


production_agent = ProductionAgent()
logistics_agent = LogisticsAgent()
risk_agent = RiskAgent()
finance_agent = FinanceAgent()
demand_agent = DemandAgent()
simulation_service = SimulationService(
    production_agent,
    logistics_agent,
    risk_agent,
    finance_agent,
    demand_agent
)


@app.get("/")
def root():
    return {
        "system": "NEXUS",
        "status": "ONLINE",
        "message": "NEXUS Backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

@app.post("/api/agents/production/predict")
def production_prediction(input_data: dict):

    result = production_agent.predict(input_data)

    return {
        "agent": "production",
        "status": "success",
        "result": result
    }

@app.post("/api/agents/logistics/predict")
def logistics_prediction(input_data: dict):

    result = logistics_agent.predict(input_data)

    return {
        "agent": "logistics",
        "status": "success",
        "result": result
    }

@app.post("/api/agents/risk/predict")
def risk_prediction(input_data: dict):
    result = risk_agent.predict(input_data)
    return {
        "agent": "risk",
        "status": "success",
        "result": result
    }

@app.post("/api/agents/finance/predict")
def finance_prediction(input_data: dict):
    result = finance_agent.predict(input_data)
    return {
        "agent": "finance",
        "status": "success",
        "result": result
    }

@app.post("/api/agents/demand/predict")
def demand_prediction(input_data: dict):
    result = demand_agent.predict(input_data)
    return {
        "agent": "demand",
        "status": "success",
        "result": result
    }

@app.get("/api/agents/status")
def get_agent_status():
    return {
        "system": "NEXUS",
        "status": "success",
        "agents": [
            {
                "name": "Production Agent",
                "model": "Random Forest",
                "status": "ACTIVE"
            },
            {
                "name": "Logistics Agent",
                "model": "ANN",
                "status": "ACTIVE"
            },
            {
                "name": "Risk Agent",
                "model": "XGBoost",
                "status": "ACTIVE"
            },
            {
                "name": "Finance Agent",
                "model": "ANN",
                "status": "ACTIVE"
            },
            {
                "name": "Demand Agent",
                "model": "LSTM",
                "status": "ACTIVE"
            }
        ]
    }

@app.post("/api/simulation/run")
def run_simulation(input_data: dict):
    result = simulation_service.run_simulation(input_data)

    return {
        "system": "NEXUS",
        "status": "success",
        "result": result
    }



@app.post("/api/simulation/execute")
def execute_simulation(input_data: dict):
    return {
        "system": "NEXUS",
        "status": "success",
        "message": "Recovery plan execution initiated",
        "execution": {
            "status": "executing",
            "action_count": len(input_data.get("action_plan", [])),
            "actions": input_data.get("action_plan", [])
        }
    }

@app.post("/api/simulation/world-state")
def update_world_state(input_data: dict):
    return {
        "system": "NEXUS",
        "status": "success",
        "world_state": {
            "active_disruptions": 2,
            "warehouse_capacity": 84,
            "resilience_score": 91,
            "recovery_status": "VERIFIED"
        },
        "message": "World state successfully updated"
    }