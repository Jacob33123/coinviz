# Coinviz
Cryptocurrency Market Data Visualization

# Demo
https://github.com/Jacob33123/coinviz/assets/12245405/136148e9-c0f7-4b28-ab98-944d4fcbac15


# Getting Started
Install the node modules for the api:
`cd coinviz-api && npm install`

To start the project you will need to be running a MySQL database. Create a new one, name it whatever you like and note the connection settings.

Copy the variables in the coinviz-api/.example.env folder into your .env file and fill out the MYSQL variables with your connection settings.

From here you should be able to populate your MySQL database with the necessary tables by navigating to the coinviz-api folder and running:
`node ace migration:run`

You should now be able to start the backend using
`node ace serve --watch`

Install the node modules for the ui
`cd ../coinviz-ui && npm install`

Copy the .env.example file to your .env and update as necessary (make sure the REACT_APP_COINVIZ_API_BASE_URL is pointing at the API instance you have running)

Start the UI with:
`npm start`
