import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [showScenario, setShowScenario] = useState(false);
  const [activeScreen, setActiveScreen] = useState("command");
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showDecision, setShowDecision] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [executionActive, setExecutionActive] = useState(false);
  const [executionData, setExecutionData] = useState(null);
  const [executionStep, setExecutionStep] = useState(0);
  const [worldUpdated, setWorldUpdated] = useState(false);
  const [worldState, setWorldState] = useState(null);
  const [agentStatus, setAgentStatus] = useState(null);
  useEffect(() => {
  if (activeScreen === "agents") {
    fetch("http://localhost:8000/api/agents/status")
      .then((response) => response.json())
      .then((data) => {
        setAgentStatus(data.agents);
      })
      .catch((error) => {
        console.error("Agent status failed:", error);
      });
  }
}, [activeScreen]);
  const [simulationData, setSimulationData] = useState(null);
  const [severity, setSeverity] = useState(7);
  const [disruptionType, setDisruptionType] = useState("Supplier Failure");
  const startSimulation = async () => {
    console.log("START SIMULATION BUTTON CLICKED");
    const response = await fetch("http://localhost:8000/api/simulation/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      disruption_type: disruptionType,
      disruption_severity: severity,
    }),
  });

  const data = await response.json();

  console.log("NEXUS Backend Result:", data);
  setSimulationData(data.result);

  setShowScenario(false);
  setSimulationActive(true);
  setActiveScreen("command");
  setSimulationStep(0);
};
  const startExecution = async () => {
  try {
    const response = await fetch(
      "http://localhost:8000/api/simulation/execute",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action_plan: simulationData?.action_plan || [],
        }),
      }
    );

    const data = await response.json();

    console.log("NEXUS Execution Result:", data);
    setExecutionData(data.execution);

    setShowDecision(false);
    setExecutionActive(true);
    setExecutionStep(0);
  } catch (error) {
    console.error("Execution failed:", error);
  }
};
  useEffect(() => {
    if (!simulationActive) return;

    if (simulationStep >= 6) return;

    const timer = setTimeout(() => {
      setSimulationStep((previous) => previous + 1);
    }, 1800);

    return () => clearTimeout(timer);
  }, [simulationActive, simulationStep]);
  useEffect(() => {
  if (!executionActive) return;

  if (executionStep >= 4) return;

  const timer = setTimeout(() => {
    setExecutionStep((previous) => previous + 1);
  }, 1800);

  return () => clearTimeout(timer);
  }, [executionActive, executionStep]);
  const twinState = worldUpdated
  ? {
      label: "RECOVERY VERIFIED",
      colorClass: "verified",
      networkStatus: "STABLE",
      eventStatus: "VERIFIED",
      eventTitle: "Recovery State Verified",
      eventDescription:
        "The digital twin reflects the successfully recovered supply chain state."
    }
  : simulationData
  ? {
      label: "DISRUPTION ACTIVE",
      colorClass: "warning",
      networkStatus: "DISRUPTED",
      eventStatus: "ACTIVE",
      eventTitle: "Disruption State Detected",
      eventDescription:
        `${simulationData.scenario?.disruption_type || "Supply chain disruption"} is currently affecting the simulated network.`
    }
  : {
      label: "BASELINE READY",
      colorClass: "baseline",
      networkStatus: "READY",
      eventStatus: "STANDBY",
      eventTitle: "Digital Twin Ready",
      eventDescription:
        "Run a simulation to generate a live disruption state in the digital twin."
    };
  return (
    
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-mark">N</span>
          <div>
            <h2>NEXUS</h2>
            <p>AI WORLD SIMULATOR</p>
          </div>
        </div>

        <nav className="navigation">
          <button
            className={`nav-item ${
              activeScreen === "command" ? "active" : ""
            }`}
            onClick={() => {
              setActiveScreen("command");
              setShowResults(false);
            }}
          >
          <span>⌂</span>
          Command Center
          </button>

          <button
            className={`nav-item ${
              activeScreen === "digital-twin" ? "active" : ""
            }`}
            onClick={() => {
              setActiveScreen("digital-twin");
              setShowResults(false);
            }}
          >
          <span>◎</span>
          Digital Twin
          </button>

          <button
            className={`nav-item ${
              activeScreen === "agents" ? "active" : ""
            }`}
            onClick={() => {
              setActiveScreen("agents");
              setShowResults(false);
            }}
          >
          <span>◈</span>
          AI Agents
          </button>
          
          <button
            className={`nav-item ${
              activeScreen === "simulator" ? "active" : ""
            }`}
            onClick={() => {
              setActiveScreen("simulator");
              setShowResults(false);
          }}
          >
          <span>⌁</span>
            Simulator
          </button>

          <button
            className={`nav-item ${
              activeScreen === "strategy" ? "active" : ""
            }`}
            onClick={() => {
              setActiveScreen("command");
              setShowResults(true);
            }}
          >
          <span>▦</span>
            Strategy Analysis
          </button>
        </nav>

        <div className="system-status">
          <div className="status-dot"></div>
          <div>
            <strong>System Operational</strong>
            <small>All agents online</small>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
{activeScreen === "agents" && (
  <div className="screen-overlay">

    <div className="screen-header">
      <div>
        <span className="panel-kicker">
          NEXUS AUTONOMOUS SYSTEM
        </span>

        <h1>AI Agents</h1>

        <p>
          Autonomous agents powering NEXUS decision intelligence
        </p>
      </div>

      <button
        className="results-close"
        onClick={() => setActiveScreen("command")}
      >
        ×
      </button>
    </div>

    <div className="digital-twin-dashboard">

      <div className="digital-twin-status">
        <div>
          <span className="panel-kicker">AGENT NETWORK</span>
          <h2>AI Agent Fleet</h2>
        </div>

        <div className="digital-live-status">
          <span></span>
          ALL SYSTEMS ACTIVE
        </div>
      </div>

      <div className="twin-metrics">

        {agentStatus?.map((agent, index) => (
          <div className="twin-metric" key={index}>
            <span>AGENT {String(index + 1).padStart(2, "0")}</span>

            <strong>{agent.name}</strong>

            <small>
              {agent.model} · {agent.status}
            </small>
          </div>
        ))}

      </div>

      <div className="twin-event">

        <div className="twin-event-icon">✓</div>

        <div>
          <span className="panel-kicker">
            AUTONOMOUS SYSTEM
          </span>

          <h3>Agent Coordination Online</h3>

          <p>
            NEXUS agents are connected to the simulation engine and ready
            to evaluate disruption scenarios.
          </p>
        </div>

        <div className="twin-event-status">
          ACTIVE
        </div>

      </div>

    </div>

  </div>
)}
{activeScreen === "digital-twin" && (
  <div className="screen-overlay">

    <div className="screen-header">
      <div>
        <span className="panel-kicker">
          NEXUS WORLD MODEL
        </span>

        <h1>Digital Twin</h1>

        <p>
          Live operational representation of the simulated supply chain
        </p>
      </div>

      <button
        className="results-close"
        onClick={() => setActiveScreen("command")}
      >
        ×
      </button>
    </div>

    <div className="digital-twin-dashboard">

      <div className="digital-twin-status">
        <div>
          <span className="panel-kicker">WORLD STATUS</span>
          <h2>Supply Chain Network</h2>
        </div>

        <div className={`digital-live-status ${twinState.colorClass}`}>
          <span></span>
          {twinState.label}
        </div>

      </div>

      <div className="twin-network">

        <div className="twin-node">
          <div className="twin-node-icon">S</div>
          <strong>SUPPLIERS</strong>
          <span>24 NODES</span>
          <small>Supply sources</small>
        </div>

        <div className="twin-connection">
          <span></span>
          <small>SUPPLY FLOW</small>
        </div>

        <div className="twin-node">
          <div className="twin-node-icon">F</div>
          <strong>FACTORIES</strong>
          <span>08 NODES</span>
          <small>Production units</small>
        </div>

        <div className="twin-connection">
          <span></span>
          <small>PRODUCTION FLOW</small>
        </div>

        <div className={`twin-node ${
          simulationData && !worldUpdated
          ? "twin-node-warning"
          : ""
        }`}>
          <div className="twin-node-icon">W</div>
          <strong>WAREHOUSES</strong>
          <span>
            {simulationData && !worldUpdated ? "12 NODES" : "16 NODES"}
          </span>
          <small>Inventory hubs</small>
        </div>

        <div className="twin-connection">
          <span></span>
          <small>DISTRIBUTION FLOW</small>
        </div>

        <div className="twin-node">
          <div className="twin-node-icon">C</div>
          <strong>CUSTOMERS</strong>
          <span>142 NODES</span>
          <small>Demand endpoints</small>
        </div>

      </div>

      <div className="twin-metrics">

        <div className="twin-metric">
          <span>ACTIVE NODES</span>
          <strong>190</strong>
          <small>Across simulated network</small>
        </div>

        <div className="twin-metric">
          <span>WAREHOUSE CAPACITY</span>
          <strong>84%</strong>
          <small>Current utilization</small>
        </div>

        <div className="twin-metric">
          <span>RESILIENCE INDEX</span>
          <strong>91/100</strong>
          <small>Recovery state verified</small>
        </div>

        <div className="twin-metric">
        <span>NETWORK STATUS</span>
        <strong>{twinState.networkStatus}</strong>
        <small>
          {worldUpdated
            ? "Recovery completed"
            : simulationData
            ? "Disruption currently active"
            : "Awaiting simulation"}
        </small>
        </div>

      </div>

      <div className="twin-event">

  <div className="twin-event-icon">
    {worldUpdated ? "✓" : simulationData ? "!" : "○"}
  </div>

  <div>
    <span className="panel-kicker">
      WORLD EVENT
    </span>

    <h3>{twinState.eventTitle}</h3>

    <p>
      {twinState.eventDescription}
    </p>
  </div>

  <div className="twin-event-status">
    {twinState.eventStatus}
  </div>

</div>

    </div>

  </div>
)}
{activeScreen === "simulator" && (
  <div className="screen-overlay">

    <div className="screen-header">
      <div>
        <span className="panel-kicker">
          NEXUS SIMULATION ENGINE
        </span>

        <h1>Scenario Simulator</h1>

        <p>
          Configure a disruption scenario and run the NEXUS simulation
        </p>
      </div>

      <button
        className="results-close"
        onClick={() => setActiveScreen("command")}
      >
        ×
      </button>
    </div>

    <div className="screen-placeholder">

      <span className="panel-kicker">
        SIMULATION CONTROL
      </span>

      <h2>Run a New Scenario</h2>

      <p>
        Test supply chain disruptions using the trained AI agent network.
      </p>

      <button
        className="simulator-run-button"
        onClick={() => setShowScenario(true)}
      >
        RUN SIMULATION →
      </button>

    </div>

  </div>
)}
{activeScreen === "command" && (
<>
    {/* Header */}
        <header className="topbar">
          <div>
            <p className="eyebrow">AUTONOMOUS DECISION INTELLIGENCE</p>
            <h1>Command Center</h1>
          </div>

          <div className="header-status">
            <span className="live-dot"></span>
            LIVE SIMULATION
          </div>
        </header>
        {worldUpdated && (
          <div className="world-update-banner">

          <div className="world-update-icon">
            ✓
          </div>

          <div>
      <span>WORLD STATE UPDATED</span>

      <strong>
        Recovery state verified successfully
      </strong>

      <small>
        NEXUS executed the simulated recovery plan and
        synchronized the resulting system state.
      </small>
    </div>

    <div className="world-update-status">
      VERIFIED
    </div>

  </div>
)}

        {/* Overview Cards */}
        <section className="metrics-grid">

          <div className="metric-card">
            <span className="metric-label">SUPPLIERS</span>
            <strong>24</strong>
            <span className="metric-change positive">+2 connected</span>
          </div>

          <div className="metric-card">
            <span className="metric-label">FACTORIES</span>
            <strong>08</strong>
            <span className="metric-change">Operating</span>
          </div>

          <div className="metric-card">
            <span className="metric-label">WAREHOUSES</span>
            <strong>16</strong>
            <span className={`metric-change ${worldUpdated ? "positive" : ""}`}>
              {worldState
                ? `${worldState.warehouse_capacity}% capacity · ${worldState.recovery_status}`
                : "92% capacity"}
            </span>
          </div>

          <div className="metric-card alert-card">
            <span className="metric-label">ACTIVE DISRUPTIONS</span>
            <strong>
              {worldState?.active_disruptions ?? (simulationData ? 1 : 0)}
            </strong>
            <span className={`metric-change ${worldUpdated ? "positive" : "danger"}`}>
              {worldUpdated ? "1 disruption resolved" : "Requires attention"}
            </span>
          </div>

        </section>

        {/* Main Dashboard */}
        <section className="dashboard-grid">

          {/* Digital Twin */}
          <div className="panel digital-twin">

            <div className="panel-header">
              <div>
                <span className="panel-kicker">WORLD MODEL</span>
                <h2>Digital Twin</h2>
              </div>

              <span className="panel-live">
                ● LIVE
              </span>
            </div>

            <div className="supply-chain">

              <div className="node">
                <div className="node-icon">S</div>
                <strong>Suppliers</strong>
                <small>24 nodes</small>
              </div>

              <div className="connection"></div>

              <div className="node">
                <div className="node-icon">F</div>
                <strong>Factories</strong>
                <small>08 nodes</small>
              </div>

              <div className="connection danger-line"></div>

              <div className="node warning">
                <div className="node-icon">W</div>
                <strong>Warehouses</strong>
                <small>16 nodes</small>
              </div>

              <div className="connection"></div>

              <div className="node">
                <div className="node-icon">C</div>
                <strong>Customers</strong>
                <small>142 nodes</small>
              </div>

            </div>

            <div className={`disruption-alert ${worldUpdated ? "resolved-alert" : ""}`}>

  <span>
    {worldUpdated ? "✓" : "⚠"}
  </span>

  <div>

    <strong>
  {worldUpdated
    ? `${simulationData?.scenario?.disruption_type || "Transportation disruption"} resolved`
    : `${simulationData?.scenario?.disruption_type || "Transportation disruption"} detected`}
</strong>

    <small>
  {worldUpdated
    ? `Affected ${
        simulationData?.scenario?.disruption_type?.toLowerCase() ||
        "disruption"
      } restored and recovery state verified`
    : simulationData
    ? `Potential cascade affecting 6 connected nodes`
    : "No active disruption. Network operating at baseline."}
</small>

  </div>

</div>

          </div>

          {/* AI Agents */}
          <div className="panel agents-panel">

            <div className="panel-header">
              <div>
                <span className="panel-kicker">AUTONOMOUS SYSTEM</span>
                <h2>AI Agents</h2>
              </div>

              <span className="agent-count">6 ONLINE</span>
            </div>

            <div className="agent-list">

              <div className="agent">
                <span className="agent-icon">P</span>
                <div>
                  <strong>Production Agent</strong>
                  <small>Analyzing capacity</small>
                </div>
                <span className="online"></span>
              </div>

              <div className="agent">
                <span className="agent-icon">L</span>
                <div>
                  <strong>Logistics Agent</strong>
                  <small>Evaluating routes</small>
                </div>
                <span className="online"></span>
              </div>

              <div className="agent">
                <span className="agent-icon">R</span>
                <div>
                  <strong>Risk Agent</strong>
                  <small>Assessing cascade</small>
                </div>
                <span className="online"></span>
              </div>

              <div className="agent">
                <span className="agent-icon">F</span>
                <div>
                  <strong>Finance Agent</strong>
                  <small>Calculating cost</small>
                </div>
                <span className="online"></span>
              </div>

            </div>

          </div>

        </section>

        {/* Bottom Section */}
        <section className="bottom-grid">

          <div className="panel simulation-panel">

            <div className="panel-header">
              <div>
                <span className="panel-kicker">DECISION ENGINE</span>
                <h2>Simulation Status</h2>
              </div>

              <span className="simulation-number">#NXS-043</span>
            </div>

            <div className="simulation-progress">

              <div className="progress-step completed">
                <span>✓</span>
                <p>World State</p>
              </div>

              <div className="progress-line"></div>

              <div className="progress-step completed">
                <span>✓</span>
                <p>Disruption</p>
              </div>

              <div className="progress-line"></div>

              <div className="progress-step active-step">
                <span>3</span>
                <p>Agent Coordination</p>
              </div>

              <div className="progress-line"></div>

              <div className="progress-step">
                <span>4</span>
                <p>Simulation</p>
              </div>

            </div>

            <button 
              className="simulate-button"
              onClick={() => setShowScenario(true)}
            >
              RUN NEW SCENARIO →
            </button>

          </div>

          <div className="panel resilience-panel">

            <span className="panel-kicker">RESILIENCE INDEX</span>

            <div className="resilience-score">
              <strong>{worldState?.resilience_score ?? 87}</strong>
              <span>/100</span>
            </div>

            <div className="score-bar">
              <div
                style={{
                  width: `${worldState?.resilience_score ?? 87}%`,
                }}
              ></div>
            </div>

            <p>
              {worldUpdated
                ? "Recovery state verified"
                : "Current system resilience"}
            </p>

          </div>

        </section>
{simulationActive && (
  <div className="simulation-overlay">

    <div className="simulation-modal">

      <div className="simulation-top">
        <div>
          <span className="panel-kicker">
            NEXUS SIMULATION ENGINE
          </span>

          <h2>Multi-Factor Crisis Simulation</h2>

          <p>
            NXS-043 · Autonomous decision cycle in progress
          </p>
        </div>

        <div className="simulation-live">
          <span></span>
          SIMULATING
        </div>
      </div>

      <div className="simulation-progress-bar">
        <div
          style={{
            width: `${Math.min((simulationStep / 6) * 100, 100)}%`,
          }}
        ></div>
      </div>

      <div className="simulation-percentage">
        {Math.min(Math.round((simulationStep / 6) * 100), 100)}%
      </div>

      <div className="simulation-stages">

        <div className={`simulation-stage ${simulationStep >= 0 ? "active" : ""}`}>
          <span>{simulationStep > 0 ? "✓" : "01"}</span>
          <div>
            <strong>World State Captured</strong>
            <small>Mapping suppliers, factories, inventory and dependencies</small>
          </div>
        </div>

        <div className={`simulation-stage ${simulationStep >= 1 ? "active" : ""}`}>
          <span>{simulationStep > 1 ? "✓" : "02"}</span>
          <div>
            <strong>Disruption Detected</strong>
            <small>Identifying multi-factor disruption signals</small>
          </div>
        </div>

        <div className={`simulation-stage ${simulationStep >= 2 ? "active" : ""}`}>
          <span>{simulationStep > 2 ? "✓" : "03"}</span>
          <div>
            <strong>Cascade Analysis</strong>
            <small>Mapping potential impact across connected nodes</small>
          </div>
        </div>

        <div className={`simulation-stage ${simulationStep >= 3 ? "active" : ""}`}>
          <span>{simulationStep > 3 ? "✓" : "04"}</span>
          <div>
            <strong>Agent Coordination</strong>
            <small>Production, logistics, finance and risk agents coordinating</small>
          </div>
        </div>

        <div className={`simulation-stage ${simulationStep >= 4 ? "active" : ""}`}>
          <span>{simulationStep > 4 ? "✓" : "05"}</span>
          <div>
            <strong>Strategy Generation</strong>
            <small>Generating alternative recovery strategies</small>
          </div>
        </div>

        <div className={`simulation-stage ${simulationStep >= 5 ? "active" : ""}`}>
          <span>{simulationStep > 5 ? "✓" : "06"}</span>
          <div>
            <strong>Counterfactual Simulation</strong>
            <small>Testing strategies inside the digital world</small>
          </div>
        </div>

        <div className={`simulation-stage ${simulationStep >= 6 ? "active" : ""}`}>
          <span>{simulationStep >= 6 ? "✓" : "07"}</span>
          <div>
            <strong>Evaluation Complete</strong>
            <small>Comparing cost, service level and recovery performance</small>
          </div>
        </div>

      </div>

      {simulationStep >= 6 && (
        <button
          className="results-button"
          onClick={() => {
            setSimulationActive(false);
            setShowResults(true);
          }}
        >
          VIEW STRATEGY RESULTS →
        </button>
      )}

    </div>

  </div>
)}
{showResults && (
  <div className="results-overlay">

    <div className="results-container">

      {/* HEADER */}
      <div className="results-header">

        <div>
          <span className="panel-kicker">
            NEXUS DECISION INTELLIGENCE
          </span>

          <h2>Strategy Analysis</h2>

          <p>
            Multi-factor crisis recovery evaluation · NXS-043
          </p>
        </div>

        <button
          className="results-close"
          onClick={() => setShowResults(false)}
        >
          ×
        </button>

      </div>


      {/* SUMMARY */}
      <div className="backend-results-panel">
      {!simulationData && (
        <div className="empty-results-state">
        <span className="panel-kicker">NO SIMULATION DATA</span>
        <h3>Run a scenario to generate analysis</h3>
        <p>
          Strategy analysis will appear here after the NEXUS simulation engine
          completes a scenario.
        </p>
        </div>
      )}

  <span className="panel-kicker">
    LIVE AI AGENT OUTPUT
  </span>

  <h3>Backend Simulation Results</h3>

  {simulationData && (
    <div className="backend-agent-grid">

      <div>
        <span>PRODUCTION</span>
        <strong>
          {simulationData.agents.production.prediction[0].toFixed(2)}
        </strong>
      </div>

      <div>
        <span>LOGISTICS DELAY</span>
        <strong>
          {(simulationData.agents.logistics.delay_probability * 100).toFixed(2)}%
        </strong>
      </div>

      <div>
        <span>RISK</span>
        <strong>
          {simulationData.agents.risk.prediction[0]}
        </strong>
      </div>

      <div>
        <span>FINANCE</span>
        <strong>
          ₹{simulationData.agents.finance.prediction[0][0].toFixed(2)}
        </strong>
      </div>

      <div>
        <span>DEMAND</span>
        <strong>
          {simulationData.agents.demand.prediction[0][0].toFixed(3)}
        </strong>
      </div>

    </div>
  )}

</div>
      <div className="results-summary">

        <div>
          <span>STRATEGIES GENERATED</span>
          <strong>03</strong>
        </div>

        <div>
          <span>SIMULATION STATUS</span>
          <strong className="success-text">VALIDATED</strong>
        </div>

        <div>
          <span>SCENARIO</span>
          <strong>MULTI-FACTOR</strong>
        </div>

      </div>


      {/* STRATEGY CARDS */}
      <div className="strategy-grid">

        {/* STRATEGY A */}
        <div className="strategy-card">

          <div className="strategy-title">
            <div>
              <span className="strategy-label">
                STRATEGY A
              </span>

              <h3>{simulationData?.strategies?.strategy_a?.name || "Strategy A"}</h3>
            </div>

            <span className="strategy-status">
              VALIDATED
            </span>
          </div>

          <div className="strategy-metrics">

            <div>
              <span>OPERATIONAL COST</span>
              <strong>
                ₹{simulationData?.strategies?.strategy_a?.cost?.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>RECOVERY TIME</span>
              <strong>
                {simulationData?.strategies?.strategy_a?.recovery_time_hours} hrs
              </strong>
            </div>

            <div>
              <span>SERVICE LEVEL</span>
              <strong>
                {simulationData?.strategies?.strategy_a?.service_level}%
              </strong>
            </div>

            <div>
              <span>RESILIENCE SCORE</span>
              <strong>
                {simulationData?.strategies?.strategy_a?.resilience_score}%
              </strong>
            </div>

          </div>
          <p className="strategy-card-description">
            {simulationData?.strategies?.strategy_a?.description}
          </p>

          <button
            className="strategy-button"
            onClick={() => {
              setSelectedStrategy(simulationData?.strategies?.strategy_a);
            }}
          >
          VIEW SIMULATION →
          </button>

        </div>


        {/* STRATEGY B */}
        <div className="strategy-card highlighted">

          <div className="strategy-title">
            <div>
              <span className="strategy-label">
                STRATEGY B
              </span>

              <h3>{simulationData?.strategies?.strategy_b?.name || "Strategy B"}</h3>
            </div>

            <span className="strategy-status">
              VALIDATED
            </span>
          </div>

          <div className="strategy-metrics">

            <div>
              <span>OPERATIONAL COST</span>
              <strong>
                ₹{simulationData?.strategies?.strategy_b?.cost?.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>RECOVERY TIME</span>
              <strong>
                {simulationData?.strategies?.strategy_b?.recovery_time_hours} hrs
              </strong>
            </div>

            <div>
              <span>SERVICE LEVEL</span>
              <strong>
                {simulationData?.strategies?.strategy_b?.service_level}%
              </strong>
            </div>

            <div>
              <span>RESILIENCE SCORE</span>
              <strong>
                {simulationData?.strategies?.strategy_b?.resilience_score}%
              </strong>
            </div>

          </div>
          <p className="strategy-card-description">
            {simulationData?.strategies?.strategy_b?.description}
          </p>

          <button
            className="strategy-button"
            onClick={() => {
              setSelectedStrategy(simulationData?.strategies?.strategy_b);
            }}
          >
          VIEW SIMULATION →
          </button>

        </div>


        {/* STRATEGY C */}
        <div className="strategy-card">

          <div className="strategy-title">
            <div>
              <span className="strategy-label">
                STRATEGY C
              </span>

              <h3>{simulationData?.strategies?.strategy_c?.name || "Strategy C"}</h3>
            </div>

            <span className="strategy-status">
              VALIDATED
            </span>
          </div>

          <div className="strategy-metrics">

            <div>
              <span>OPERATIONAL COST</span>
              <strong>
                ₹{simulationData?.strategies?.strategy_c?.cost?.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>RECOVERY TIME</span>
              <strong>
                {simulationData?.strategies?.strategy_c?.recovery_time_hours} hrs
              </strong>
            </div>

            <div>
              <span>SERVICE LEVEL</span>
              <strong>
                {simulationData?.strategies?.strategy_c?.service_level}%
              </strong>
            </div>

            <div>
              <span>RESILIENCE SCORE</span>
              <strong>
                {simulationData?.strategies?.strategy_c?.resilience_score}%
              </strong>
            </div>

          </div>
          <p className="strategy-card-description">
            {simulationData?.strategies?.strategy_c?.description}
          </p>

          <button
            className="strategy-button"
            onClick={() => {
              setSelectedStrategy(simulationData?.strategies?.strategy_c);
            }}
          >
          VIEW SIMULATION →
          </button>

        </div>

      </div>


      {/* COMPARISON */}
      <div className="comparison-panel">

        <div className="comparison-header">

          <div>
            <span className="panel-kicker">
              COUNTERFACTUAL ANALYSIS
            </span>

            <h3>Strategy Performance</h3>
          </div>

          <span className="simulation-number">
            SIMULATION COMPLETE
          </span>

        </div>


        <div className="comparison-row">

          <span>Service Level</span>

          <div className="comparison-track">
            <div
              className="comparison-fill"
              style={{
                width: `${simulationData?.service_level ?? 91}%`,
              }}
            ></div>
          </div>

          <strong>
            {simulationData?.service_level?.toFixed(0)}%
          </strong>

        </div>


        <div className="comparison-row">

          <span>Recovery Performance</span>

          <div className="comparison-track">
            <div
              className="comparison-fill"
              style={{
                width: `${simulationData?.recovery_performance ?? 82}%`,
              }}
            ></div>
          </div>

          <strong>
            {simulationData?.recovery_performance?.toFixed(0)}%
          </strong>

        </div>


        <div className="comparison-row">

          <span>Resource Efficiency</span>

          <div className="comparison-track">
            <div
              className="comparison-fill"
              style={{
                width: `${simulationData?.resource_efficiency ?? 78}%`,
              }}
            ></div>
          </div>

          <strong>
            {simulationData?.resource_efficiency?.toFixed(0)}%
          </strong>

        </div>


        <div className="comparison-row">

          <span>Resilience</span>

          <div className="comparison-track">
            <div
              className="comparison-fill"
              style={{
                width: `${simulationData?.resilience_score ?? 87}%`,
              }}
            ></div>
          </div>

          <strong>
            {simulationData?.resilience_score?.toFixed(0)}%
          </strong>

        </div>

      </div>


      {/* FOOTER */}
      <div className="results-footer">

        <div>
          <span className="footer-dot"></span>

          <span>
            Results generated from controlled simulation
          </span>
        </div>

        {simulationData && (
          <button
            className="execute-button"
            onClick={() => {
              setShowResults(false);
              setShowDecision(true);
        }}
          >
            CONTINUE TO DECISION →
          </button>
      )}

      </div>

    </div>

  </div>
)}
{showDecision && (
  <div className="decision-overlay">

    <div className="decision-container">

      {/* HEADER */}
      <div className="decision-header">

        <div>
          <span className="panel-kicker">
            NEXUS DECISION INTELLIGENCE
          </span>

          <h2>Decision Center</h2>

          <p>
            Autonomous recovery action · NXS-043
          </p>
        </div>

        <button
          className="decision-close"
          onClick={() => setShowDecision(false)}
        >
          ×
        </button>

      </div>


      {/* SCENARIO STATUS */}
      <div className="decision-status">

        <div>
          <span>SCENARIO</span>
          <strong>
            {simulationData?.scenario?.disruption_type || "MULTI-FACTOR CRISIS"}
          </strong>
        </div>

        <div>
          <span>SIMULATION</span>
          <strong>NXS-043</strong>
        </div>

        <div>
          <span>DECISION STATE</span>
          <strong className="ready-text">
            READY
          </strong>
        </div>

      </div>


      {/* AGENT CONSENSUS */}
      <div className="decision-panel">

        <div className="decision-panel-header">
          <div>
            <span className="panel-kicker">
              AUTONOMOUS SYSTEM
            </span>

            <h3>AI Agent Consensus</h3>
          </div>

          <span className="consensus-status">
            4 / 4 READY
          </span>
        </div>


        <div className="consensus-grid">

          <div className="consensus-agent">
            <span className="decision-agent-icon">P</span>

            <div>
              <strong>Production Agent</strong>
              <small>Capacity verified</small>
            </div>

            <span className="ready-dot"></span>
          </div>


          <div className="consensus-agent">
            <span className="decision-agent-icon">L</span>

            <div>
              <strong>Logistics Agent</strong>
              <small>Route validated</small>
            </div>

            <span className="ready-dot"></span>
          </div>


          <div className="consensus-agent">
            <span className="decision-agent-icon">R</span>

            <div>
              <strong>Risk Agent</strong>
              <small>Cascade contained</small>
            </div>

            <span className="ready-dot"></span>
          </div>


          <div className="consensus-agent">
            <span className="decision-agent-icon">F</span>

            <div>
              <strong>Finance Agent</strong>
              <small>Cost evaluated</small>
            </div>

            <span className="ready-dot"></span>
          </div>

        </div>

      </div>


      {/* IMPACT */}
      <div className="decision-panel">

        <div className="decision-panel-header">

          <div>
            <span className="panel-kicker">
              PREDICTED IMPACT
            </span>

            <h3>Decision Impact</h3>
          </div>

        </div>


        <div className="impact-grid">

          <div className="impact-card">
            <span>RECOVERY TIME</span>
            <strong>
              {simulationData?.strategies?.strategy_b?.recovery_time_hours} hrs
            </strong>
            <small>Simulated outcome</small>
          </div>

          <div className="impact-card">
            <span>SERVICE LEVEL</span>
            <strong>
              {simulationData?.strategies?.strategy_b?.service_level?.toFixed(0)}%
            </strong>
            <small>Simulated outcome</small>
          </div>

          <div className="impact-card">
            <span>OPERATIONAL COST</span>
            <strong>
              ₹{simulationData?.strategies?.strategy_b?.cost?.toFixed(2)}
            </strong>
            <small>Simulated outcome</small>
          </div>

          <div className="impact-card">
            <span>RESILIENCE</span>
            <strong>
              {simulationData?.strategies?.strategy_b?.resilience_score?.toFixed(0)}/100
            </strong>
            <small>Simulated outcome</small>
          </div>

        </div>

      </div>


      {/* ACTION PLAN */}
      <div className="decision-panel">

        <div className="decision-panel-header">

          <div>
            <span className="panel-kicker">
              AUTONOMOUS ACTION PLAN
            </span>

            <h3>Recovery Sequence</h3>
          </div>

          <span className="action-count">
            {simulationData?.action_plan?.length || 0} ACTIONS
          </span>

        </div>


        <div className="action-list">

          <div className="action-item">
            <span>01</span>

            <div>
              <strong>
                {simulationData?.action_plan?.[0]?.title}
              </strong>
              <small>
                {simulationData?.action_plan?.[0]?.description}
              </small>
            </div>

            <b>
              READY
            </b>
          </div>


          <div className="action-item">
            <span>02</span>

            <div>
              <strong>
                {simulationData?.action_plan?.[1]?.title}
              </strong>

              <small>
                {simulationData?.action_plan?.[1]?.description}
              </small>
            </div>

            <b>
              READY
            </b>
          </div>


          <div className="action-item">
            <span>03</span>

            <div>
              <strong>
                {simulationData?.action_plan?.[2]?.title}
              </strong>

              <small>
                {simulationData?.action_plan?.[2]?.description}
              </small>
            </div>

            <b>
              READY
            </b>
          </div>


          <div className="action-item">
            <span>04</span>

            <div>
              <strong>
                {simulationData?.action_plan?.[3]?.title}
              </strong>

              <small>
                {simulationData?.action_plan?.[3]?.description}
              </small>
            </div>

            <b>
              READY
            </b>
          </div>

        </div>

      </div>


      {/* EXECUTE */}
      <div className="decision-footer">

        <div>
          <span className="footer-dot"></span>

          <span>
            All required agents have completed evaluation
          </span>
        </div>

        <button className="execute-decision-button"
          onClick={startExecution}
        >
          EXECUTE DECISION →
        </button>

      </div>

    </div>

  </div>
)}
{executionActive && (
  <div className="execution-overlay">

    <div className="execution-container">

      <div className="execution-header">

        <div>
          <span className="panel-kicker">
            NEXUS ACTION ENGINE
          </span>

          <h2>Executing Recovery Plan</h2>

          <p>
            Autonomous action cycle · NXS-043
          </p>
        </div>

        <div className="execution-live">
          <span></span>
          {executionData?.status?.toUpperCase() || "EXECUTING"}
        </div>

      </div>


      <div className="execution-progress">

        <div
          style={{
            width: `${Math.min((executionStep / 4) * 100, 100)}%`,
          }}
        ></div>

      </div>

      <div className="execution-percentage">
        {Math.min(
          Math.round((executionStep / 4) * 100),
          100
        )}%
      </div>


      <div className="execution-actions">

        <div
          className={`execution-action ${
            executionStep >= 0 ? "active" : ""
          }`}
        >

          <span>
            {executionStep > 0 ? "✓" : "01"}
          </span>

          <div>
            <strong>
              {simulationData?.action_plan?.[0]?.title}
            </strong>

            <small>
              {simulationData?.action_plan?.[0]?.description}
            </small>
          </div>

          <b>
            {executionStep === 0
              ? "EXECUTING"
              : executionStep > 0
              ? "COMPLETE"
              : "QUEUED"}
          </b>

        </div>


        <div
          className={`execution-action ${
            executionStep >= 1 ? "active" : ""
          }`}
        >

          <span>
            {executionStep > 1 ? "✓" : "02"}
          </span>

          <div>
            <strong>
              {simulationData?.action_plan?.[1]?.title}
            </strong>

            <small>
              {simulationData?.action_plan?.[1]?.description}
            </small>
          </div>

          <b>
            {executionStep === 1
              ? "EXECUTING"
              : executionStep > 1
              ? "COMPLETE"
              : "QUEUED"}
          </b>

        </div>


        <div
          className={`execution-action ${
            executionStep >= 2 ? "active" : ""
          }`}
        >

          <span>
            {executionStep > 3 ? "✓" : "03"}
          </span>

          <div>
            <strong>
              {simulationData?.action_plan?.[2]?.title}
            </strong>

            <small>
              {simulationData?.action_plan?.[2]?.description}
            </small>
          </div>

          <b>
            {executionStep === 2
              ? "EXECUTING"
              : executionStep > 2
              ? "COMPLETE"
              : "QUEUED"}
          </b>

        </div>


        <div
          className={`execution-action ${
            executionStep >= 3 ? "active" : ""
          }`}
        >

          <span>
            {executionStep >= 4 ? "✓" : "04"}
          </span>

          <div>
            <strong>
              {simulationData?.action_plan?.[3]?.title}
            </strong>

            <small>
              {simulationData?.action_plan?.[3]?.description}
            </small>
          </div>

          <b>
            {executionStep === 3
              ? "VERIFYING"
              : executionStep >= 4
              ? "VERIFIED"
              : "QUEUED"}
          </b>

        </div>

      </div>


      {executionStep >= 4 && (
        <div className="execution-complete">

          <div className="complete-icon">
            ✓
          </div>

          <div>
            <span className="panel-kicker">
              ACTION VERIFIED
            </span>

            <h3>
              Recovery plan successfully executed
            </h3>

            <p>
              {worldState?.recovery_status === "VERIFIED"
                ? "NEXUS has completed the recovery action cycle and verified the resulting world state."
                : "NEXUS is completing the recovery action cycle."}
            </p>
          </div>

        </div>
      )}


      {executionStep >= 4 && (
        <button
  className="return-command-button"
  onClick={async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/simulation/world-state",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            simulation_id: "NXS-043",
          }),
        }
      );

      const data = await response.json();

      console.log("NEXUS World State Result:", data);
      setWorldState(data.world_state);

      setExecutionActive(false);
      setWorldUpdated(true);
    } catch (error) {
      console.error("World state update failed:", error);
    }
  }}
>
  RETURN TO COMMAND CENTER →
</button>
      )}

    </div>

  </div>
)}
</>
)}
{showScenario && (
  <div className="scenario-overlay">

    <div className="scenario-modal">

      <div className="scenario-header">
        <div>
          <span className="panel-kicker">
            NEXUS SIMULATION ENGINE
          </span>

          <h2>Create Disruption Scenario</h2>
        </div>

        <button
          className="close-button"
          onClick={() => setShowScenario(false)}
        >
          ×
        </button>
      </div>

      <p className="scenario-description">
        Configure a multi-factor disruption and let NEXUS
        evaluate possible recovery strategies.
      </p>

      <div className="scenario-options">

        <label className="scenario-option">
          <input
           type="radio"
           name = "disruption"
           onChange={() => setDisruptionType("Supplier Failure")}
          />
          <div>
            <strong>Supplier Failure</strong>
            <small>Remove a critical supplier from the network</small>
          </div>
        </label>

        <label className="scenario-option">
          <input
           type="radio"
           name = "disruption"
           onChange={() => setDisruptionType("Demand Spike")}
          />
          <div>
            <strong>Demand Spike</strong>
            <small>Increase customer demand unexpectedly</small>
          </div>
        </label>

        <label className="scenario-option">
          <input
           type="radio"
           name = "disruption"
           onChange={() => setDisruptionType("Transportation Disruption")}
          />
          <div>
            <strong>Transportation Disruption</strong>
            <small>Disable selected transportation routes</small>
          </div>
        </label>

        <label className="scenario-option">
          <input
           type="radio"
           name = "disruption"
           onChange={() => setDisruptionType("Production Bottleneck")}
          />
          <div>
            <strong>Production Bottleneck</strong>
            <small>Reduce factory production capacity</small>
          </div>
        </label>

      </div>

      <div className="severity-section">

        <div className="severity-header">
          <span>DISRUPTION SEVERITY</span>
          <strong>HIGH</strong>
        </div>

        <input
          type="range"
          min="1"
          max="10"
          value={severity}
          onChange={(e) => setSeverity(Number(e.target.value))}
          className="severity-slider"
        />

      </div>

      <div className="scenario-actions">

        <button
          className="cancel-button"
          onClick={() => setShowScenario(false)}
        >
          CANCEL
        </button>

        <button 
          className="start-button"
          onClick={startSimulation}
        >
          START SIMULATION →
        </button>

      </div>

    </div>

  </div>
)}
{selectedStrategy && (
  <div className="strategy-detail-overlay">
    <div className="strategy-detail-panel">

      <button
        className="strategy-detail-close"
        onClick={() => setSelectedStrategy(null)}
      >
        ✕
      </button>

      <span className="panel-kicker">STRATEGY ANALYSIS</span>

      <h2>{selectedStrategy.name}</h2>

      <p className="strategy-detail-description">
        {selectedStrategy.description}
      </p>

      <div className="strategy-detail-metrics">
        <div>
          <span>COST</span>
          <strong>₹{selectedStrategy.cost?.toFixed(2)}</strong>
        </div>

        <div>
          <span>RECOVERY TIME</span>
          <strong>{selectedStrategy.recovery_time_hours} hrs</strong>
        </div>

        <div>
          <span>SERVICE LEVEL</span>
          <strong>{selectedStrategy.service_level}%</strong>
        </div>

        <div>
          <span>RESILIENCE</span>
          <strong>{selectedStrategy.resilience_score}%</strong>
        </div>
      </div>

      <div className="strategy-detail-method">
        <span className="panel-kicker">EXECUTION METHOD</span>

        <ol>
          {selectedStrategy.method?.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

    </div>
  </div>
)}
      </main>

    </div>
  );
}

export default App;