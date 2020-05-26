
### Node Cli App

So, you want to build a cli app in Node.js, well, you came to the right place. Clone this git repository and follow the steps listed below.

1. Open your terminal and run the command **npm init**

2. Download and install the mongodb server and client.

2. Open the Weather.js file in the app directory and paste your api_key to the **const APiKey**

3. Open your terminal and run the command **node index.js --help**

List of commands

1. Create a new note: **node index.js createNote --title="Note Title" --body="Note Body"**

2. Listing Notes: **node index.js listNote --status="completed || pending || Null"**

3. Fetching Notes: **node index.js fetchNote --title="Note Title"**

4. Complete Note: **node index.js completeNote --title="Note Title"**

5. Update Note: **node index.js updateNote --title="Note Title"**

6. Delete Note: **node index.js deleteNote --title="Note Title"**

7. Fetch Weather: **node index.js fetchWeather --city="City Name"**

