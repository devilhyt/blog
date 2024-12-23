# How to run this project

1. Install dependencies:
    ```bash
    npm install
    ```

2. Run the database using Docker:
    ```bash
    docker compose -f ./docker-services/docker-compose.yml up -d
    ```

3. Rename the file `.env.example` to `.env`. 
    - This file contains the token secret used to sign the JWTs.
    - You should generate a new secret and replace the value of the `TOKEN_SECRET`.

4. Generate fake data:
    ```bash
    node ./fake.js
    ```

5. Run the app:
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