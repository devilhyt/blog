﻿# How to run this project

1. Install dependencies:
    ```bash
    npm install
    ```

2. Run the database using Docker:
    ```bash
    docker compose -f ./docker-services/docker-compose.yml up -d
    ```

3. Generate fake data:
    ```bash
    node ./docker-services/fake.js
    ```

4. Run the app:
    - On MacOS or Linux:
        ```bash
        DEBUG=blog:* npm start
        ```

    - On Windows Command Prompt:
        ```cmd
        set DEBUG=blog:* & npm start
        ```

    - On Windows PowerShell:
        ```powershell
        $env:DEBUG='blog:*'; npm start
        ```