//Node Modules....
const Yargs = require('yargs');

//Custom Modules....
const Notes = require('./app/Notes');
const Weather = require('./app/Weather');

//App Initialization...
const YargsArgV = Yargs
  .command('add', 'Adds A New Note', {
    title: {
      alias: 't',
      demand: true,
      describe: 'Add a title for your new Note.',
    },
    body: {
      alias: 'b',
      demand: true,
      describe: 'Add a body for your new Note.'
    }
  })
  .command('list', 'List all notes.', {
    status: {
      alias: 's',
      demand: false,
      describe: 'Fetches all notes with a status type of completed and pending'
    }
  })
  .command('fetchNote', 'Fetch a particular Note.', {
    title: {
      alias: 't',
      demand: true,
      describe: 'Fetch a Note with this title.'
    }
  }).command('completeNote', 'Completes a Note with this title', {
    title: {
      alias: 't',
      demand: true,
      describe: 'Marks a Note with a status of completed.'
    }
  }).command('updateNote', 'Updates a Note with this title', {
    title: {
      alias: 't',
      demand: true,
      describe: 'Updates a Note with this title.'
    },
    body: {
      alias: 'b',
      demand: true,
      describe: 'A New content for the note.'
    }
  })
  .command('deleteNote', 'Deletes a particular Note', {
    title: {
      alias: 't',
      demand: true,
      describe: 'Deletes a Note with this title.'
    }
  }).command('fetchWeather', 'Fetches information about the weather for a specific city', {
    city: {
      alias: 'c',
      demand: true,
      describe: 'Fetches information about the weather for this city.'
    }
  })
  .help().argv;

//Fetch cli command...
const Command = YargsArgV._[0];

//Cli commands...
if (Command === 'add')
  Notes.createNote( YargsArgV.title, YargsArgV.body );
else if (Command === 'list')
  Notes.listNotes( YargsArgV.status );
else if (Command === 'fetchNote')
  Notes.fetchNote( YargsArgV.title );
else if (Command == 'completeNote')
  Notes.completeNote( YargsArgV.title );
else if (Command == 'updateNote')
  Notes.updateNote( YargsArgV.title, YargsArgV.body );
else if (Command === 'deleteNote')
  Notes.deleteNote( YargsArgV.title );
else if (Command == 'fetchWeather')
  Weather.getWeather( YargsArgV.city );
else
  console.log( 'Command not recognized...' );
