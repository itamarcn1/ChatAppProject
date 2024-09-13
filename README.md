# Chat App

## Description
A real-time chat application built using Node.js, Express, and Socket.io for handling live messages.

## Table of Contents
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Deployment](#deployment)
- [Features](#features)
- [Built With](#built-with)


## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/itamarcn1/ChatAppProject

If you downloaded a zip file of the project there is no need to clone it, just continue with the following steps but ignore and don't copy only the command line "cd .\ChatAppProject\" in stage 2 and 4

2. **Install dependencies:**
   ```bash
   cd .\ChatAppProject\
   npm i

3. **Set up environment variables:** <br/>
    Create a ".env" file inside the backend folder and configure the following environment variables:
    ```bash
    JWT_SECRET=it

### Deployment
3. **Start the server:**
   ```bash
   npm start

4. **Start the front end:** <br/>
   Open another terminal, and copy:
   ```bash
   cd .\ChatAppProject\
   cd .\MyChatApp\
   npm i
   npm run dev
6. **Access the application:** <br/>
    Open your browser and go to  http://localhost:5173/.

### Features 
* Real-time messaging 
* User authentication 
* Chat one-on-one 
* Group chats 

### Built With:
* Material ui
* Bootstrap
* Socket-io
* React
* JavaScript
* Express
* MongoDB
