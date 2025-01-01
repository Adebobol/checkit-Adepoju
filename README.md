# Checkit

Checkit is an order management system designed to streamline and simplify the process of managing and tracking orders in a business environment.

## Table of Contents

Introduction
Features
Installation
Usage

## Introduction

Checkit helps businesses manage orders efficiently by providing a streamlined system for tracking, updating, and processing customer orders. It offers a user-friendly interface, order status updates, and integration with backend systems.

## Features

Create, update, and track orders in real time
Admin dashboard for order management
User authentication and role-based access control
Integration with messaging services for notifications
Order history and tracking logs

## Installation

git clone https://github.com/Adebobol/checkit-Adepoju.git

To set up the project locally, follow these steps:
To install all the dependencies, type npm install in the root directory

npm run start:dev(to start the development server)

## Usage

After setting up the project, you can:

Access the app at http://localhost:3000
Log in as an admin to manage orders
Create and update orders as necessary

##Admin body
to create an admin
{
    "name":"admin",
    "email":"admin@email.com",
    "password":"1234"
    "role": "ADMIN'
}

to create a user
{
    "name":"test",
    "email":"test@email.com",
    "password":"1234"
}

## To login as admin
{
    "email":"admin@email.com",
    "password":"1234"
}

## To login as user
{
    "email":"test@email.com",
    "password":"1234"
}

## To run test 

npm test:int

##Postman documentation
inside the file checkit.postman_collection.json
