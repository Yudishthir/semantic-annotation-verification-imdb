# Semantic Annotation Verification on IMDB

## Installation and Setup

1. Clone the repository and run the command `npm install` to install the dependencies
2. Run the command
    - `npm start` to run the service as an application
    - `npm run generate` to run the schema generation script
    - `npm run scrape` to run metadata retrieval script
    - `npm run validate` for a detailed verification output

## Application

When run as an application the UI will prompt you to enter a valid url. This url shall be used to provide the metadata for verification.

Following this the user has two options,

- Copy the metadata data for some other purpose
- Validate the metadata against the existing schemas

When you validate one retrieves a result as to how many incorrect properties have been used. For a detailed result, run the `npm run validate` script.

## Scripts

There are 3 scripts:

1. `schema.js`
    - Takes a valid schema.org schema **url** and stores the scraped schema in the schemas folder.
2. `scraper.js`
    - Takes in a **url** and scrapes the metadata and generates a file called data.json containing the said metadata
3. `verification.js`
    - Takes the available output from the previous two scripts, validates the metadata against the schemas and print all mismatches to the console.

## Deployment

The application can be deployed on any platform that support a node runtime environment. Just ensure that the build script is set to `node server.js` or `npm start`

## API

On can query two endpoints available post deployment

1. */getOutput* : Scrapes and responds with the site metadata. it has the following params
    - **url**: The url of the site to be scraped
2. */validate* : Validates metadata against the existing schemas. It has the following params
    - **metadata**: A Json object containing the metadata to be processed

## Additional

- The public folder contains all the static assets for the front end
- The modules folder contains the support modules to the code.
