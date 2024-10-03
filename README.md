## Overview
This project is a fully functional eCommerce application built using Node.js, TypeScript, postgresql, and Prisma. It covers essential features such as authentication, product management, and image uploads.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)

## Features
- User authentication (sign up, login, password reset)
- CRUD operations for products
- Image upload and management
- Pagination and filtering of products
- Order management

## Technologies Used
- Node.js
- TypeScript
- Express.js
- Postgresql
- Prisma
- Redis

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Youssefhikal93/E-commerce-API.git

2. Install Redis
docker pull redis

### Run Redis Server
docker run --name my-redis -d -p 6380:6379 redis

### Open the redis cli command
docker exec -it my-redis redis-cli

### Check running redis
docker ps

2. Connect to Postgresql or any other sql database supported with prisma
   ### use .env to replace your URL string (DATABASE_URL)

3. install the dependencies 
   ```bash 
   npm install

4. start the server 
   ```bash 
   npm run dev

# Note
All env varibales must be declared to be able to run the app on your local host. 
