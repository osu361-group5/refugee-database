# Refugee Database
This application attempts to solve the issue of helping distributed refugees.

## Installation
```bash
git clone https://github.com/osu361-group5/refugee-database.git
npm install
```

## Running App
Set environment variable for database host, ie
```bash
    export dbHost='localhost'
```

Then do `npm start`

## Running/Writing tests
This project uses jasmine for testing.

tests go in the spec directory.  Each file should be of the following
format, `some_name_for_some_tests_spec.js` import part is the spec part.
All files ending in `spec.js` will be picked up by the testing harness.

running tests: from root of project, do `npm test`

## Using Docker
If you have Docker & docker-compose installed, running the app is 
as simple as `docker-compose up`.  Currently, the app will be available
on your docker hosts port 3000.


## Live Link
link: [hosted on heroku](https://lit-tundra-42207.herokuapp.com/)

