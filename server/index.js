require('./ignore-styles');
require('babel-register')({
  ignore: /\/(build|node_modules)\//,
  plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
  presets: ['react-app']
});

const App = require('../src/App').default;
const React = require('react');
const ReactDOM = require('react-dom');
const Zone = require('can-zone');
const express = require('express');
const fs = require('fs');
const app = express();

const requests = require("done-ssr/zones/requests");
const dom = require("done-ssr/zones/can-simple-dom");
const pushFetch = require("done-ssr/zones/push-fetch");
const pushMutations = require("done-ssr/zones/push-mutations");

function render() {
  const styles = document.createElement("link");
  styles.setAttribute("rel", "stylesheet");
  styles.setAttribute("href", "/static/css/main.c17080f1.css");
  document.head.appendChild(styles);
  document.body.innerHTML = `
    <div id="one"></div>
    <div id="root"></div>
    <script src="/static/js/main.cc351d6c.js"></script>
  `;

  ReactDOM.render(React.createElement(App), document.getElementById('root'));
}

const PORT = process.env.PORT || 8080;

app.use(express.static('build'));
app.use(express.static('.'));

require('./api')(app);

app.get('/', async (request, response) => {
	var zone = new Zone([
		// Overrides XHR, fetch
		requests(request),

		// Sets up a DOM
		dom(request),

    // PUSH!
		pushFetch(response),
    pushMutations(response)
	]);

  const runPromise = zone.run(render);

  // Send the initial HTML
  response.write(zone.data.html);

  await runPromise;
  response.end();
});

require('donejs-spdy').createServer({
	key: fs.readFileSync(process.env.KEY),
	cert: fs.readFileSync(process.env.CERT),
	spdy: {
		protocols: ['h2', 'http/1.1']
	}
}, app).listen(PORT);

console.error(`Server running at https://localhost:${PORT}`);
