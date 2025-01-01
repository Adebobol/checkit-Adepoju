# Checkit

Checkit is an order management system designed to streamline and simplify the process of managing and tracking orders in a business environment.

## Introduction

Checkit helps businesses manage orders efficiently by providing a streamlined system for tracking, updating, and processing customer orders. It offers a user-friendly interface, order status updates, and integration with backend systems.

## Tools

Typescript

nestjs

bcrypt

prisma

passport for Authentication

postman

## Features

Create, update, get, delete and mark completed orders in real time
User authentication and role-based access control
Integration with messaging services for notifications

## Installation

git clone https://github.com/Adebobol/checkit-Adepoju.git

To set up the project locally, follow these steps:
To install all the dependencies: " npm install "

npm run start:dev => (to start the development server)

npm run build => to build the application

## database set up using mysql

create a database schema in mysql workbench

setup your database url in the .env file created after running "npx prisma generate"

DATABASE_URL="mysql://root:password@localhost:3306/name?schema=public"

mysql can be (PostgreSQL, MySQL, SQLite)

root is username of db

password is the password for db

name is the name of the schema

## Prisma installation

npx prisma generate => to generate the prisma model

npx migrate dev --name <migration name> => to migrate changes in prisma model

npx prisma studio => to open prisma interface in browser

## Usage

After setting up the project, you can:

Access the app at http://localhost:3000
create user

login as user

Create,update orders

send messages as necessary

to create a user
{
"name":"test",
"email":"test@email.com",
"password":"1234"
}

## To login as user

{
"email":"test@email.com",
"password":"1234"
}

## To run test

run npm prisma migrate reset to clean database in development mood

npm test:int

All test file are located inside the test folder in each module they end with the marker ".int-spec.ts"

## Postman documentation

inside the file checkit.postman_collection.json

## postman

pm.environment.set("jwt",pm.response.json().token) should be in the post response part in scripts to extract the token issued after logging in.

"jwt" is used as an env variable after setting auth type as bearer token

you can also test the websocket in postman
