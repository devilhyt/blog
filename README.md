# How to run this project

- Install dependencies:
    > $ npm install

- Run the database using Docker:
    > $ docker compose -f ./docker-services/docker-compose.yml up -d

- Generate fake data:
    > node ./docker-services/fake.js

- Run the app:
    - On MacOS or Linux:
        > $ DEBUG=blog:* npm start

    - On Windows Command Prompt:
        > \>set DEBUG=blog:* & npm start

    - On Windows PowerShell:
        > PS> $env:DEBUG='blog:*'; npm start