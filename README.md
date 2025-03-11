# cities-app
Web app to display cities data in 2 different views

This project is a Dockerized full-stack application consisting of a Cities API (backend) and Cities UI (frontend). The backend is built using NestJS and the frontend is built using Angular.

This README will guide you through the setup and running of the application on your local machine using Docker and Docker Compose.

# Prerequisites
Before you begin, make sure you have the following installed on your machine:

- Docker
- Docker Compose

# Project structure
- city-backend/: This folder contains the backend application built with NestJS. It exposes API endpoints to get cities data. 
- city-frontend/: This folder contains the frontend application built with Angular.
- Primary database: MongoDB(Docker version)

# Getting started
## Step 1: Clone the Repository
```
git clone https://github.com/siddhibhagat/cities-app.git
cd cities-app
```

## Step 2: Build and Run the Docker Containers
```
docker-compose up --build
```

This will:
- Build the Docker images for the city-backend and city-frontend services.
- Start the containers for city-backend and city-frontend and mongodb.
## Step 4: View the Application
- Frontend (City UI): Open a web browser and go to http://localhost:3000. You should see the city data page.
- Backend (City Backend): The API will be available at http://localhost:4000. You can interact with the backend (e.g., /cities endpoints).
- Run tests: ```docker-compose exec movies-api npm run test```
## Step 5: Stopping the application
When you're done, you can stop all running services with:

```
docker-compose down
```
# Architecture Design Decisions
This project is designed with a microservices-based architecture in mind. However, to make the initial setup simpler, we have chosen to structure the project as a monorepo. This approach allows us to keep both the frontend (City UI) and backend (City API) in the same repository while still maintaining a separation of concerns.

### Frontend (UI):

The frontend is built with Angular and serves as the user interface for searching movies.
It communicates with the backend via HTTP requests to the RESTful API.
### Backend (API):

The backend is built with NestJS to handle API requests related to movie data.
It uses MongoDB as the database to store cities data.
### Database:

MongoDB is used to store movie data as it provides a flexible schema for data that may evolve over time.
### Containerization:

Docker and docker-compose are used to containerize the entire application, allowing easy setup, scaling, and management of the different services.

# Architecture Diagram
![cities_architechture drawio](https://github.com/user-attachments/assets/0e044972-7c81-46de-922c-b6d3f6c07ff1)


API Endpoints:
- GET /api/cities/search?page=1&limit=10&term=
  
  Empty term string gives complete cities result with pagination
  
- POST /api/cities/insertData
  
  If I want to manually insert the data from backend. Inserts data in MongoDB.



