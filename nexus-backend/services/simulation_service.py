class SimulationService:

    def __init__(
        self,
        production_agent,
        logistics_agent,
        risk_agent,
        finance_agent,
        demand_agent
    ):
        self.production_agent = production_agent
        self.logistics_agent = logistics_agent
        self.risk_agent = risk_agent
        self.finance_agent = finance_agent
        self.demand_agent = demand_agent

    def run_simulation(self, scenario):

        # Simulation inputs derived from the selected disruption scenario.
        # These are orchestration inputs; each trained model keeps its
        # original feature requirements.
        

                # Simulation inputs derived from the selected disruption scenario.
        # These are orchestration inputs; each trained model keeps its
        # original feature requirements.

        disruption_type = scenario.get(
            "disruption_type",
            "Supplier Failure"
        )

        severity = scenario.get(
            "disruption_severity",
            5
        )

        production_input = {
            "lead_time": scenario.get("lead_time", 5),
            "number_of_products_sold": scenario.get("number_of_products_sold", 120),
            "manufacturing_lead_time": scenario.get("manufacturing_lead_time", 10),
            "defect_rates": scenario.get("defect_rates", 2.5),
            "manufacturing_costs": scenario.get("manufacturing_costs", 500),
            "availability": scenario.get("availability", 95),
            "stock_levels": scenario.get("stock_levels", 300),
            "order_quantities": scenario.get("order_quantities", 100)
        }

        if disruption_type == "Supplier Failure":
            production_input["lead_time"] += severity * 0.8
            production_input["availability"] -= severity * 1.5
            production_input["stock_levels"] -= severity * 4

        elif disruption_type == "Demand Spike":
            production_input["number_of_products_sold"] += severity * 12
            production_input["order_quantities"] += severity * 10
            production_input["stock_levels"] -= severity * 3

        elif disruption_type == "Transportation Disruption":
            production_input["lead_time"] += severity * 0.5
            production_input["availability"] -= severity * 1.0
            production_input["stock_levels"] -= severity * 2

        elif disruption_type == "Production Bottleneck":
            production_input["manufacturing_lead_time"] += severity * 1.2
            production_input["defect_rates"] += severity * 0.25
            production_input["availability"] -= severity * 1.2

        production_input["availability"] = max(
            1,
            min(100, production_input["availability"])
        )

        production_input["stock_levels"] = max(
            1,
            production_input["stock_levels"]
        )

        logistics_input = {
            "delivery_partner": scenario.get("delivery_partner", "Partner A"),
            "package_type": scenario.get("package_type", "Box"),
            "vehicle_type": scenario.get("vehicle_type", "Truck"),
            "delivery_mode": scenario.get("delivery_mode", "Road"),
            "region": scenario.get("region", "North"),
            "weather_condition": scenario.get("weather_condition", "Clear"),
            "distance_km": scenario.get("distance_km", 50),
            "package_weight_kg": scenario.get("package_weight_kg", 10),
            "expected_time_num": scenario.get("expected_time_num", 24),
            "delivery_cost": scenario.get("delivery_cost", 500)
        }
        if disruption_type == "Transportation Disruption":
            logistics_input["distance_km"] += severity * 15
            logistics_input["expected_time_num"] += severity * 2
            logistics_input["delivery_cost"] += severity * 75

        elif disruption_type == "Supplier Failure":
            logistics_input["expected_time_num"] += severity * 1
            logistics_input["delivery_cost"] += severity * 40

        elif disruption_type == "Demand Spike":
            logistics_input["package_weight_kg"] += severity * 1.5
            logistics_input["expected_time_num"] += severity * 1
            logistics_input["delivery_cost"] += severity * 50

        elif disruption_type == "Production Bottleneck":
            logistics_input["expected_time_num"] += severity * 1.5
            logistics_input["delivery_cost"] += severity * 45

        risk_input = {
            "disruption_type": scenario.get("disruption_type", "Supplier Failure"),
            "industry": scenario.get("industry", "Manufacturing"),
            "supplier_tier": scenario.get("supplier_tier", 1),
            "supplier_region": scenario.get("supplier_region", "North"),
            "supplier_size": scenario.get("supplier_size", "Large"),
            "has_backup_supplier": scenario.get("has_backup_supplier", 1),
            "disruption_severity": scenario.get("disruption_severity", 8),
            "production_impact_pct": scenario.get("production_impact_pct", 40),
            "revenue_loss_usd": scenario.get("revenue_loss_usd", 50000),
            "response_type": scenario.get("response_type", "Alternate Supplier"),
            "impact_per_severity": scenario.get("impact_per_severity", 5),
            "loss_per_impact": scenario.get("loss_per_impact", 10000),
            "high_severity": scenario.get("high_severity", 1),
            "high_impact": scenario.get("high_impact", 1),
            "high_loss": scenario.get("high_loss", 1),
            "backup_risk": scenario.get("backup_risk", 0)
        }

        finance_input = {
            "City": scenario.get("City", "Chennai"),
            "Store_Format": scenario.get("Store_Format", "Urban"),
            "Category": scenario.get("Category", "Electronics"),
            "Brand": scenario.get("Brand", "Brand A"),
            "Channel": scenario.get("Channel", "Online"),
            "Payment_Mode": scenario.get("Payment_Mode", "UPI"),
            "Units": scenario.get("Units", 10),
            "Cost_Price": scenario.get("Cost_Price", 500),
            "Selling_Price": scenario.get("Selling_Price", 750),
            "Stock_On_Hand": scenario.get("Stock_On_Hand", 100),
            "Reorder_Level": scenario.get("Reorder_Level", 20),
            "Lead_Time_Days": scenario.get("Lead_Time_Days", 5),
            "Customer_Age": scenario.get("Customer_Age", 25),
            "Customer_Gender": scenario.get("Customer_Gender", "Male"),
            "Loyalty_Flag": scenario.get("Loyalty_Flag", 1)
        }
        # finance_input = {...}

        if disruption_type == "Supplier Failure":
            finance_input["Lead_Time_Days"] += severity * 0.5
            finance_input["Cost_Price"] += severity * 10
            finance_input["Stock_On_Hand"] = max(
                1,
                finance_input["Stock_On_Hand"] - severity * 5
            )

        elif disruption_type == "Demand Spike":
            finance_input["Units"] += severity * 8
            finance_input["Selling_Price"] += severity * 5
            finance_input["Stock_On_Hand"] = max(
                1,
                finance_input["Stock_On_Hand"] - severity * 8
            )

        elif disruption_type == "Transportation Disruption":
            finance_input["Lead_Time_Days"] += severity * 0.5
            finance_input["Cost_Price"] += severity * 8

        elif disruption_type == "Production Bottleneck":
            finance_input["Units"] = max(
                1,
                finance_input["Units"] - severity * 5
            )
            finance_input["Cost_Price"] += severity * 12

        finance_result = self.finance_agent.predict(finance_input)

        demand_input = {
            "Units_Sold": scenario.get("Units_Sold", 120),
            "Inventory_Level": scenario.get("Inventory_Level", 300),
            "Supplier_Lead_Time_Days": scenario.get("Supplier_Lead_Time_Days", 7),
            "Reorder_Point": scenario.get("Reorder_Point", 100),
            "Order_Quantity": scenario.get("Order_Quantity", 200),
            "Unit_Cost": scenario.get("Unit_Cost", 50),
            "Unit_Price": scenario.get("Unit_Price", 80),
            "Promotion_Flag": scenario.get("Promotion_Flag", 0),
            "Lag_1": scenario.get("Lag_1", 115),
            "Lag_7": scenario.get("Lag_7", 110),
            "Lag_14": scenario.get("Lag_14", 105),
            "Rolling_Mean_7": scenario.get("Rolling_Mean_7", 112),
            "Rolling_Mean_14": scenario.get("Rolling_Mean_14", 108)
        }
        if disruption_type == "Supplier Failure":
            demand_input["Supplier_Lead_Time_Days"] += severity * 0.8
            demand_input["Inventory_Level"] = max(
                1,
                demand_input["Inventory_Level"] - severity * 5
            )

        elif disruption_type == "Demand Spike":
            demand_input["Units_Sold"] += severity * 12
            demand_input["Order_Quantity"] += severity * 10
            demand_input["Inventory_Level"] = max(
                1,
                demand_input["Inventory_Level"] - severity * 8
            )

        elif disruption_type == "Transportation Disruption":
            demand_input["Supplier_Lead_Time_Days"] += severity * 0.6
            demand_input["Inventory_Level"] = max(
                1,
                demand_input["Inventory_Level"] - severity * 4
            )

        elif disruption_type == "Production Bottleneck":
            demand_input["Units_Sold"] = max(
                1,
                demand_input["Units_Sold"] - severity * 5
            )
            demand_input["Inventory_Level"] = max(
                1,
                demand_input["Inventory_Level"] - severity * 6
            )

        production_result = self.production_agent.predict(production_input)
        logistics_result = self.logistics_agent.predict(logistics_input)
        if disruption_type == "Transportation Disruption":
            base_delay = float(
                logistics_result.get("delay_probability", 0)
            )

            logistics_result["delay_probability"] = min(
                1.0,
                base_delay + (severity * 0.08)
            )
        risk_result = self.risk_agent.predict(risk_input)
        finance_result = self.finance_agent.predict(finance_input)
        demand_result = self.demand_agent.predict(demand_input)

        production_prediction = float(production_result["prediction"][0])

        logistics_delay_probability = float(
        logistics_result["delay_probability"]
        )

        risk_prediction = int(
        risk_result["prediction"][0]
        )

        finance_prediction = float(
        finance_result["prediction"][0][0]
        )

        demand_prediction = float(
        demand_result["prediction"][0][0]
        )

        risk_score = risk_prediction * 100
        resilience_score = max(0, 100 - risk_score)
        service_level = max(
            0,
            min(100, (1 - logistics_delay_probability) * 100)
        )

        recovery_time_hours = max(
            4,
        round(
            scenario.get("disruption_severity", 5) * 2
            + risk_score * 0.05,
            1
            )
        )

        recovery_cost = round(
            finance_prediction * (1 + risk_score / 100),
            2
        )
        recovery_performance = round(
            max(0, min(100, 100 - (recovery_time_hours * 2))),
            2
        )

        resource_efficiency = round(
            max(
                0,
                min(
                    100,
                    100 - (recovery_cost / 200)
                )
            ),
            2
        )

        disruption_type = scenario.get("disruption_type", "Supplier Failure")

        strategy_profiles = {
            "Supplier Failure": {
                "a": {
                    "name": "Alternate Supplier Activation",
                    "description": "Activate qualified alternate suppliers to reduce dependency on the disrupted supplier and restore material flow.",
                    "method": [
                        "Identify available alternate suppliers",
                        "Reallocate procurement demand",
                        "Validate material availability",
                        "Monitor supplier recovery"
                    ]
                },
                "b": {
                    "name": "Inventory Buffer Deployment",
                    "description": "Use available inventory buffers to maintain production while alternate sourcing is established.",
                    "method": [
                        "Release emergency inventory",
                        "Prioritize critical materials",
                        "Rebalance warehouse stock",
                        "Monitor inventory depletion"
                    ]
                },
                "c": {
                    "name": "Procurement Demand Reallocation",
                    "description": "Redistribute purchasing requirements across available suppliers to stabilize the supply network.",
                    "method": [
                        "Split procurement requirements",
                        "Assign demand to available suppliers",
                        "Track supplier capacity",
                        "Verify material flow"
                    ]
                }
            },

            "Demand Spike": {
                "a": {
                    "name": "Production Capacity Expansion",
                    "description": "Increase production allocation toward high-demand products to reduce fulfilment delays.",
                    "method": [
                        "Identify high-demand products",
                        "Reallocate production capacity",
                        "Increase critical production batches",
                        "Monitor fulfilment levels"
                    ]
                },
                "b": {
                    "name": "Inventory Buffer Activation",
                    "description": "Deploy available inventory reserves to absorb the sudden increase in customer demand.",
                    "method": [
                        "Release safety stock",
                        "Prioritize high-demand orders",
                        "Rebalance warehouse inventory",
                        "Monitor stock levels"
                    ]
                },
                "c": {
                    "name": "Demand Prioritization",
                    "description": "Prioritize critical customer orders and dynamically allocate available supply.",
                    "method": [
                        "Classify customer demand",
                        "Prioritize critical orders",
                        "Allocate available supply",
                        "Track service levels"
                    ]
                }
            },

            "Transportation Disruption": {
                "a": {
                    "name": "Dynamic Route Reallocation",
                    "description": "Redirect affected shipments through alternative transportation routes to maintain supply continuity.",
                    "method": [
                        "Identify disrupted routes",
                        "Calculate alternate logistics paths",
                        "Reassign affected shipments",
                        "Monitor delivery status"
                    ]
                },
                "b": {
                    "name": "Alternate Logistics Activation",
                    "description": "Activate backup logistics connections and redistribute transportation capacity.",
                    "method": [
                        "Activate alternate carriers",
                        "Redistribute transportation capacity",
                        "Prioritize critical shipments",
                        "Verify delivery flow"
                    ]
                },
                "c": {
                    "name": "Inventory Positioning",
                    "description": "Reposition available inventory closer to demand locations to reduce transportation dependency.",
                    "method": [
                        "Identify affected demand locations",
                        "Reposition nearby inventory",
                        "Prioritize critical warehouses",
                        "Monitor regional stock levels"
                    ]
                }
            },

            "Production Bottleneck": {
                "a": {
                    "name": "Production Reallocation",
                    "description": "Shift production workloads toward available manufacturing capacity to reduce the bottleneck.",
                    "method": [
                        "Identify constrained production stage",
                        "Reallocate workloads",
                        "Use available manufacturing capacity",
                        "Monitor production throughput"
                    ]
                },
                "b": {
                    "name": "Capacity Balancing",
                    "description": "Balance production loads across available facilities and manufacturing resources.",
                    "method": [
                        "Measure facility capacity",
                        "Redistribute production orders",
                        "Balance machine utilization",
                        "Verify throughput recovery"
                    ]
                },
                "c": {
                    "name": "Priority Production Scheduling",
                    "description": "Prioritize critical products and orders to maintain service levels during the bottleneck.",
                    "method": [
                        "Identify critical products",
                        "Prioritize production orders",
                        "Adjust production schedules",
                        "Monitor recovery progress"
                    ]
                }
            }
        }

        profile = strategy_profiles.get(
            disruption_type,
            strategy_profiles["Supplier Failure"]
        )

        strategy_a = {
            "name": profile["a"]["name"],
            "description": profile["a"]["description"],
            "method": profile["a"]["method"],
            "cost": round(recovery_cost * 1.05, 2),
            "recovery_time_hours": max(
                4,
                round(recovery_time_hours * 0.90, 1)
            ),
            "service_level": round(min(100, service_level + 1), 2),
            "resilience_score": round(min(100, resilience_score + 12), 2)
        }

        strategy_b = {
            "name": profile["b"]["name"],
            "description": profile["b"]["description"],
            "method": profile["b"]["method"],
            "cost": round(recovery_cost * 1.15, 2),
            "recovery_time_hours": max(
                4,
                round(recovery_time_hours * 0.65, 1)
            ),
            "service_level": round(min(100, service_level + 3), 2),
            "resilience_score": round(min(100, resilience_score + 18), 2)
        }

        strategy_c = {
            "name": profile["c"]["name"],
            "description": profile["c"]["description"],
            "method": profile["c"]["method"],
            "cost": round(recovery_cost * 0.95, 2),
            "recovery_time_hours": max(
                4,
                round(recovery_time_hours * 1.20, 1)
            ),
            "service_level": round(max(0, service_level - 2), 2),
            "resilience_score": round(min(100, resilience_score + 8), 2)
        }

        action_plan = [
            {
                "step": 1,
                "title": "Reallocate transportation routes",
                "description": "Redirect affected logistics connections"
            },
            {
                "step": 2,
                "title": "Activate alternate logistics path",
                "description": "Reduce dependency on disrupted route"
            },
            {
                "step": 3,
                "title": "Monitor affected warehouse",
                "description": "Track inventory and capacity changes"
            },
            {
                "step": 4,
                "title": "Verify recovery state",
                "description": "Compare resulting state against target"
            }
        ]

        return {
            "scenario": scenario,
            "risk_score": risk_score,
            "resilience_score": resilience_score,
            "service_level": service_level,
            "recovery_time_hours": recovery_time_hours,
            "recovery_cost": recovery_cost,
            "recovery_performance": recovery_performance,
            "resource_efficiency": resource_efficiency,
            "strategies": {
                "strategy_a": strategy_a,
                "strategy_b": strategy_b,
                "strategy_c": strategy_c
            },
            "action_plan": action_plan,
            
            "agents": {
                "production": production_result,
                "logistics": logistics_result,
                "risk": risk_result,
                "finance": finance_result,
                "demand": demand_result
            }
        }

