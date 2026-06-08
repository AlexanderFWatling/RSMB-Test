# RSMB Analytics Dashboard - Technical Case Study

A lightweight analytics platform demonstrating data processing, API design, and frontend visualization, built for the RSMB Senior Full Stack Engineer technical assessment.

## Setup & Run Instructions

This project is fully containerized to ensure a frictionless setup. You do not need Node.js installed locally to run it.

**Prerequisites:**
* Docker Desktop (or equivalent Docker daemon)
* Docker Compose

**To run the application:**
1. Clone or extract the repository.
2. Open a terminal in the root directory.
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
4. Once the containers are running: 
* **Frontend Dashboard**: http://localhost:3000
* **Backend API Health Check**: http://localhost:5000/api/health

(Note: To gracefully stop the containers and clear the volumes, use docker-compose down -v).

**Running Tests:**
To verify the data aggregation and business logic:
1. `cd backend`
2. `npm install`
3. `npm test`

## Design Notes

### Current Implementation

The brief outlined a 2-3 hour window. To guarantee a high-quality, typed delivery within this strict limit, I made the pragmatic decision to use Express (TypeScript) for the backend rather than the suggested FastAPI. This allowed for rapid, robust development in a familiar ecosystem without sacrificing code quality.

* **Backend Structure**: The application follows a controller-service pattern. The server acts as a lightweight API layer that ingests the CSV data on startup. By performing heavy aggregation (CTR, CPC, CPA, ROAS) at the memory-layer upon initialization rather than at request-time, the API remains highly performant and responsive for front-end consumers.

* **Frontend Consumption**: The UI leverages a centralized api/client.ts module to handle typed requests. React useEffect hooks manage the filter state; whenever a user modifies a category (Platform, Country, or Industry), the hooks trigger the client, which fetches fresh, pre-aggregated data from the relevant API endpoints, ensuring the charts and tables are always synchronized with the filter selection.

* **Dataset Assumptions**: I assumed the provided CSV represents a static, normalized export. The application treats the dataset as an immutable source-of-truth that is loaded once into memory on container startup, making it highly efficient for this analytical use case.

* **Validation & Cleaning**: To ensure data integrity, I implemented a strict sanitization pipeline during the initial stream-parsing phase:

   * **Numeric Casting**: All strings are cast to floats/ints.

   * **Defaulting**: Any missing or null values are explicitly defaulted to 0 to prevent NaN arithmetic errors.

   * **Business Logic Safety**: Division-by-zero checks are embedded into the ROAS/CTR/CPC calculation functions, returning 0 where values are undefined, ensuring the frontend never crashes during data visualization.


### Scaling the Solution (Azure + Snowflake)

While my architectural experience is deeply rooted in building platforms across GCP and AWS ecosystems, the core principles of designing high-throughput data pipelines are cloud-agnostic. To align with RSMB's stack, I have mapped my standard scalable architecture patterns to their direct Azure equivalents:

* **Data Ingestion**: (AWS/GCP Equivalent: S3 + Glue / Cloud Storage + Dataflow) Raw CSVs or streaming data would land in Azure Blob Storage. Azure Data Factory (ADF) would handle the orchestration, copying the raw data into Snowflake's landing schema.

* **Data Storage & Transformation**: Snowflake operates as the core analytical engine. A tool like dbt would transform the raw data into clean, aggregated models (e.g., daily platform rollups) and expose them as Materialised Views to ensure sub-second API reads.

* **API Layer**: (GCP Equivalent: Cloud Run) The containerized Express backend would be deployed to Azure Container Apps or App Services, allowing it to scale dynamically from zero to handle HTTP traffic spikes without managing the underlying Kubernetes clusters.

* **Caching & Performance**: (AWS Equivalent: ElastiCache) Heavy, recurring queries for the top-line summary metrics would be temporarily cached in Azure Cache for Redis. This critically reduces API latency and minimizes Snowflake compute costs.

* **Security & Access Control**: (AWS Equivalent: Cognito + IAM) Azure Entra ID (Active Directory) would manage API authentication and Role-Based Access Control (RBAC). The API would pass the client context down to Snowflake, which would enforce Row-Level Security policies to ensure clients only ever query their respective organization's data.

## AI Usage Statement

During this assessment, I used a Large Language Model as a specialized development assistant to accelerate boilerplate generation and ensure I remained well within the 2-3 hour limit.

**Tools Used**: LLM (Gemini).

**Primary Uses**:

1. **Scaffolding**: Generating the initial Docker and `docker-compose.yml` configurations to containerize the monorepo cleanly.
2. **TypeScript Configs**: Generating strict, Express-compatible `tsconfig.json` files to bypass modern module resolution conflicts.
3. **UI Boilerplate**: Scaffolding the structural foundation of the Recharts component and and CSS grid layouts, allowing me to focus entirely on the data-wiring and state management.

**Validation & Risks**: AI-generated code requires strict oversight. I manually reviewed all generated data-aggregation functions (e.g., reduce methods for ROAS and CTR) to ensure they guarded against division-by-zero errors. I also manually verified the Docker volume bindings to ensure the CSV file was correctly mounted and accessible across the container boundaries.