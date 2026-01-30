# osu-referee-client-poc

Working client for the upcoming [refereeing API](https://github.com/ppy/osu-server-spectator/issues/406).

At the time of writing this is only intended for testing the API's functionality and usability. **NOT INTENDED FOR PRODUCTION USAGE. ANY USE OUTSIDE OF `localhost` IS ILL-ADVISED. USE AT YOUR OWN RISK.**

## Test setup

1. Edit `config.ts` to point:
   - `OSU_WEB_URL` at a local `osu-web` instance,
   - `SPECTATOR_SERVER_URL` at a local `osu-server-spectator` instance.
2. In your `osu-web` instance, get an OAuth client. If you want to be using `authorization_code` grant, give it `http://localhost:3000/main_window/index.html` as the callback URL.
3. Run `npm run start`. You should see an application window. Give it the credentials it wants to connect to spectator server.
4. You can type `ping {MESSAGE}` to get a response from the spectator server. It'll echo back what you gave it, and also tell you which user you are.