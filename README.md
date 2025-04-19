# Food Delivery Microservices

This project is a microservices-based food delivery application with Docker support.

## Services Architecture

- **API Gateway** (Port 8000): Routes requests to appropriate microservices
- **Auth Service** (Port 5001): Handles driver authentication
- **Restaurant Service** (Port 5002): Manages restaurant data
- **Order Service** (Port 5003): Handles order processing
- **Delivery Service** (Port 5004): Manages delivery tracking and assignment
- **Payment Service** (Port 5005): Processes payments
- **Notification Service** (Port 5006): Sends notifications via email and SMS

## Docker Setup

Each service has its own Dockerfile, and the entire application can be run using Docker Compose.

### Prerequisites

- Docker
- Docker Compose

### Running the Application

1. Clone the repository
2. Navigate to the project root directory
3. Run the following command to start all services:

```bash
docker-compose up
```

To rebuild the containers after making changes:

```bash
docker-compose up --build
```

To run in detached mode:

```bash
docker-compose up -d
```

### Accessing Services

- API Gateway: http://localhost:8000
- Auth Service: http://localhost:5001
- Restaurant Service: http://localhost:5002
- Order Service: http://localhost:5003
- Delivery Service: http://localhost:5004
- Payment Service: http://localhost:5005
- Notification Service: http://localhost:5006

## Environment Variables

Environment variables are configured in the docker-compose.yml file. In a production environment, sensitive information should be managed using Docker secrets or environment-specific configuration files.
