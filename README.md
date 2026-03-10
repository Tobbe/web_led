Start the web server: `node led_server.js`
Start a cloudflare tunnel: `cloudflared tunnel --url http://localhost:8989`
Use cURL to test: `curl -X POST -d LED_OFF https://<tunnel-name>.trycloudflare.com`

I'm using fly.io sprites to run a server for the web part of this project

I created the sprite with `sprite create tobbe-esp32-led`

Connect to the sprite: `sprite console -s tobbe-esp32-led`
Run commands: `sprite exec -s tobbe-esp32-led -- ls -la`
You can run `sprite use tobbe-esp32-led` to set the sprite as the default for
future commands.

Sprites come with nvm, but it's not fully set up. Run
`/.sprite/languages/node/nvm/install.sh` and then `source ~/.zshrc`. After that,
you can run `nvm install --lts` to install and switch to the latest LTS version
of Node.js.

When logged in to the sprite, run `node sprite-server.js` to start the web
server that's supposed to run on the sprite for public accees.
