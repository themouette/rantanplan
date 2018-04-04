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

* move to an electron application in order to ease deployment
* Improve the style
* Separate the `src/components/Metrics` into smaller, easy to maintain
  components
* Move the data formatting logic from `src/components/Dashboard` to rendering
  components. It will allow to change widgets styles to draw user attention on
  problems.
