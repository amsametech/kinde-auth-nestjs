When you register your API with Kinde and link it to a Kinde application, the API will be in the audience (aud) claim of the token.
The token can then be used to make a request from the front-end to the back-end, which verifies the token and checks the aud claim.

# To retrieve your audience

- Go to <b>Settings</b> > <b>APIs</b>
- In Kinde Management API click on <b>Details</b>

  ![Kinde Management API](audience.png?raw=true 'Kinde Management API')

- Copy the audience and add it to your NestJs App environments
  ```bash
  KINDE_AUDIENCE=<your-audience>
  ```
- Add this value also to your Kinde SDK

  example of NextJs SDK
  .env.local

  ```bash
  KINDE_AUDIENCE=<your-audience>
  ```

  example of JavaScript SDK

  ```bash
  const kinde = await createKindeClient({
    audience: "<your-audience>"
    ...
  });
  ```

- select <b>Applications</b> in the left menu.
- Activate the connection for each application that uses the API and click save.
