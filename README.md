# Northcoders News API

## Overview

This project is an API designed to provide programmatic access to application data, mimicking the backend service of a real-world application like Reddit. It uses PostgreSQL as the database, and interactions with the database are managed using node-postgres.

## Viewing this repo
Link to hosted version of repo [here](https://northcoder-news.onrender.com/)


## Installation and Setup

1. Clone the repository to your local machine:
    ```
    git clone <repository_url>
    ```

2. Install dependencies:
    ```
    npm install 
    ```

3. Run 'setup' script to create database:
    ```
    npm run setup-dbs
    ```

4. Run 'seed' script to seed database:
    ```
    npm run seed
    ```

5. Create `.env.test` and `.env.development` files. 
Set environment variable `PGDATABASE= <name of your database>`

6. Set 'test' script to jest:
    ```
    "scripts": {
        "test": "jest"
        }
    ```

7. Run tests with jest:
    ```
    npm test
    ```

#### Minimum versions:

`Node.js: v14.0.0 or later`

`PostgreSQL: v10.0 or later`
