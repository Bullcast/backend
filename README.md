# Bullcast Backend Repository

## Features

- **API Key Management**  
  Securely store and manage API keys for prediction service.

- **Prediction & Analyst Agent Forwarding**  
  Forward incoming data to prediction and analyst agents for processing and insights.

- **Sui-Integrated Agent Forwarding**  
  Forward requests to the Sui-integrated agent for blockchain interactions.

- **OHLCV Data Fetching**  
  Automated jobs to retrieve Open-High-Low-Close-Volume data for financial analysis.

- **Investment Trigger**  
  Automated jobs that initiate investment actions based on predefined conditions and strategies.

## How to Run

1. **Start MySQL and Install Dependencies**  
   ```bash
   docker-compose -f docker-compose.yml up -d
   npm install
   ```

2. **Development Mode**  
   ```bash
   npm run dev
   ```
   This command starts the server in development mode with automatic restarts on file changes.

3. **Build and Run in Production Mode**  
   ```bash
   npm run build:start
   ```
   This command compiles the project and then runs the production build.