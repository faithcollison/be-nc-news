# Northcoders News API

## Overview

This project is an API designed to provide programmatic access to application data, mimicking the backend service of a real-world application like Reddit. It uses PostgreSQL as the database, and interactions with the database are managed using node-postgres.

## Viewing this repo
Link to hosted version of repo: `https://northcoder-news.onrender.com/`


## Installation and Setup

1. Clone the repository to your local machine:
   git clone `<repository_url>`

2. Install dependencies:
```
npm install 
```

3. Add database to setup.sql file:
```
DROP DATABASE IF EXISTS <name of your database>
CREATE DATABASE <name of your database>
```
4. Add 'setup-dbs' script:
```
"scripts": {
    "setup-dbs": "psql -f ./db/setup.sql"
}
```
5. Run 'setup' script to create database:
```
npm run setup-dbs
```

6. Create `.env.test` and `.env.development` files. 
Set environment variable `PGDATABASE= <name of your database>`

7. Add 'seed' script :
```
"scripts": {
    "seed": "node ./db/seeds/run-seed.js"
    }
```

8. Run 'seed' script to seed database:
```
npm run seed
```

9. Install jest to run tests:
```
npm install --save-dev jest
```

10. Set 'test' script to jest:
```
"scripts": {
    "test": "jest"
    }
```

11. Run tests with jest:
```
npm test
```

### Minimum versions:
```
Node.js: v14.0.0 or later
PostgreSQL: v10.0 or later
```