Rantanplan
==========

Rantanplan is a project for DataDog recruiting process.

## Statement

Create a simple web application that monitors load average on your machine:

* Collect the machine load (using “uptime” for example)
* Display in the application the key statistics as well as a history of load
  over the past 10 minutes in 10s intervals. We’d suggest a graphical
  representation using D3.js, but feel free to use another tool or
  representation if you prefer. Make it easy for the end-user to picture the
  situation!
* Make sure a user can keep the web page open and monitor the load on their
  machine.
* Whenever the load for the past 2 minutes exceeds 1 on average, add a message
  saying that “High load generated an alert - load = {value}, triggered at
  {time}”
* Whenever the load average drops again below 1 on average for the past 2
  minutes, Add another message explaining when the alert recovered.
* Make sure all messages showing when alerting thresholds are crossed remain
  visible on the page for historical reasons.
* Write a test for the alerting logic
* Explain how you’d improve on this application design

## Usage

### Install

Clone the repository and setup everything that is required:

``` sh
git clone https://github.com/themouette/rantanplan.git
cd rantanplan
./bin/setup
```

### Run in production mode

To build the whole project, run the follwing:

``` sh
./bin/build
cd dist
npm install --production
npm start
```

You should see a message telling you the server is running on port 3000.

### Run in development mode

In development mode, the code will live reload on every change.
As there is 2 separate projects (one for the frontend application and one for
the server), you need to have both processes running at the same time.

To do so, open 2 terminal windows.

* In the first window, type `cd server ; npm run dev`
* In the second window, type `cd client ; npm run dev`

## Test

This project uses [jest](https://facebook.github.io/jest/) for tests on both
client and server.

To run tests, just run `./bin/test`. It will execute both test suite.

To run a project test suite in development mode, go to the project directory and
run `npm test -- --watch --notify --coverage`

## TODO

### Use Electron

Packaging the application as an [Electron][electron] application makes
distribution easy and cross platform.

To move the current application to a full [Electron][electron] application would
require some work, such as merging both client and server codebase.

I did not do that at first as I wanted to try [create-react-app][cra] to avoid
the build configuration. This was a mistake as the current setup (a client and a
server) requires to support multiple browsers and multiple [NodeJs][nodejs]
versions. It also force the end user to install [NodeJs][nodejs] and [npm][npm]
on its own machine.

An [Electron][electron] application would also allow better OS integration such
as desktop launcher or reduce in the taskbar.

### Leverage WebSockets

Current client application polls the whole set of metrics for the last 10
minutes every seconds.

This adds an overhead for parsing and serializing, and it can cause some visual
inconsistencies, as both collection and displays are not in sync. With a 1
second interval it is no big deal, but if the interval was larger, we could
fetch data that happened more than 10 minutes ago.

To keep everything in sync and reduce the amount of transferred data, we could
use WebSockets (with [Socket.IO][socketio] for instance) so any read metric is
immediately pushed to the client.

This would require to use an EventEmitter or a stream to whenever the monitoring
scheduler reads new data, it publish an event. The socket would subscribe to
this event server side and push any new data to the client immediately.

In the end, the application would consume less resources.

### Functional Testing

Data logic is unit tested and I would say it is enough. What bothers me is the
cross browser rendering given I rely heavily on [Flexbox][flexbox].

What would make me more confident is render the application in different states
across different browsers and different resolutions.

To achieve this I would create a test application (`test.html` and
`index.test.js`).
The application would expose a function `window.renderWithProps(props)` that
renders the `src/components/Dashboard` component with `props`. By doing this we
**avoid a mock server**.

Once the test application is available, we could use a [SeleniumHQ][selenium]
cloud service such as [Sauce Labs][saucelabs] or [BrowserStack][browserstack]
with [WebdriverIO][webdriverio] to render this static site.

For each combination of browser, resolution and state, we would call
`window.renderWithProps(state)` and take a screenshot. Those screenshots would
be attached to every release and ideally a service such as [Aplitools
Eyes][applitools] would detect visual regression.

### Style And User Experience Improvements

The overall style can be improved, for instance the widget displaying a single
value deserves more attention.

Those widgets could change color depending on the value. For instance turning in
`warning` mode when the memory usage is above 80% and `danger` if the usage is
above 90%.

Doing so requires to move the data formatting outside of
`src/components/Dashboard` component closer to the displaying component.
In the process we could also refactor the `src/components/Metrics` component
into a composer, assembling smaller, easier to follow, more reusable and more
testable components.

### Release Process

A release script would allow to release a new version in one line.

The expected process is:

- Enter a release note
- Bump both `package.json` versions via
  `npm version {patch|minor|major} --no-git-tag-version`
- Run tests
- Build the project
- Tag the repository and push tags
- Create an archive of the `dist` directory
- Attach this archive to GitHub release page

The expected interface is `./bin/release {patch|minor|major}`

### Fix Inconsistently Failing Test

Due to the fact that I do not freeze the clock during tests (Jest does not
provide this kind of utility), one test are failing from time to time.

Using something similar to [Sinon.JS Fake
Timers](http://sinonjs.org/releases/v1.17.7/fake-timers/) should do the trick.

### Use A d3.js Charting Library

As I had previous experience with [Chart.js][chartjs], I did not want to take
risks with a new charting library.

The subject encouraged to use a d3 based chart library, this could be an
improvement.


[cra]: https://github.com/facebook/create-react-app
[electron]: https://electronjs.org/
[nodejs]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[socketio]: https://socket.io/
[flexbox]: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
[selenium]: https://www.seleniumhq.org/
[webdriverio]: http://webdriver.io/
[saucelabs]: https://saucelabs.com/
[browserstack]: https://www.browserstack.com/
[applitools]: https://applitools.com/
[chartjs]: https://www.chartjs.org
