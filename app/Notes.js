const { MongoClient } = require('mongodb');
const _ = require('lodash');

class Notes {
  constructor() {  }

  // Create A New Mongo Connection...
  async createConnection() {
    // Mongo Config || Constants.....
    const Url = 'mongodb://localhost:27017';
    const dbName = 'learning_dollars_db';
    // Mongo Initialization....
    const Client = await new MongoClient(Url, { useUnifiedTopology: true });
    const Database = new Promise((resolve, reject) => {
        Client.connect((err) => {
          if (err) {
            reject(err);
          }

          resolve(Client.db(dbName));
        });
    });

    return Database;
  }

  // Create A New Note Entry...
  async createNote(noteTitle, noteBody) {
    let title = _.trim(noteTitle);
    title = _.upperFirst(title);

    let body = _.trim(noteBody);
    body = _.upperFirst(body);

    // check if the title exist....
    const CheckTitle = await this.checkNote(title);
    if (CheckTitle) {
      console.log('*********** NOTE ***********');
      console.log('Sorry, But A Note with this title already exist.');
      console.log('*********** NEW NOTE ***********');
      return;
    }

    // Create the note...
    const dbConnection = await this.createConnection();
    try {
      const NewNote = await dbConnection.collection('notes_db').insertOne({ title: title, body: body, completed: false }).then((doc) => {
        return doc.ops[0];
      });

      if (NewNote) {
        console.log('*********** NEW NOTE ***********');
        console.log(`Title: ${NewNote.title}`);
        console.log(`Body: ${NewNote.body}`);
        console.log(`Completed: ${NewNote.completed}`);
        console.log('*********** NEW NOTE ***********');
      }
    } catch (e) {
        console.log('*********** Error ***********');
        console.log(`ErrorName: ${e.name}`);
        console.log(`errorMessage: ${e.message}`);
        console.log('*********** Error ***********');
    }

    return;
  }

  // List Notes Depending On The Status...
  async listNotes(status = null) {
    const dbConnection = await this.createConnection();
    switch (status) {
      case 'completed':
        try {
          const CompletedNotes = await dbConnection.collection('notes_db').find({ completed: true }).toArray().then((docs) => {
            return docs;
          });

          if (CompletedNotes.length > 0) {
            console.log('*********** Completed NOTES **************');
            CompletedNotes.forEach((note, index) => {
              console.log(`************* Index: ${index} ********************`);
              console.log(`Title: ${note.title}`);
              console.log(`Body: ${note.body}`);
              console.log(`Completed: ${note.completed}`);
            });
            console.log('*********** Completed NOTES **************');
          } else {
            console.log('*********** There Are No Completed Notes Yet **************');
          }
        } catch (e) {
            console.log('*********** Error ***********');
            console.log(`ErrorName: ${e.name}`);
            console.log(`errorMessage: ${e.message}`);
            console.log('*********** Error ***********');
        }
        break;
      case 'pending':
        try {
          const PendingNotes = await dbConnection.collection('notes_db').find({ completed: false }).toArray().then((docs) => {
                return docs;
              });

          if (PendingNotes.length > 0) {
          console.log('*********** Pending NOTES **************');
            PendingNotes.forEach((note, index) => {
              console.log(`************* Index: ${index} ********************`);
              console.log(`Title: ${note.title}`);
              console.log(`Body: ${note.body}`);
              console.log(`Completed: ${note.completed}`);
            });
            console.log('*********** Pending NOTES **************');
          } else {
            console.log('*********** There Are No Pending Notes Yet **************');
          }
        } catch (e) {
            console.log('*********** Error ***********');
            console.log(`ErrorName: ${e.name}`);
            console.log(`errorMessage: ${e.message}`);
            console.log('*********** Error ***********');
        }
        break;
      default:
         try {
           const AllNotes = await dbConnection.collection('notes_db').find().toArray().then((docs) => {
             return docs;
           });

           if (AllNotes.length > 0) {
             console.log('*********** All NOTES **************');
             AllNotes.forEach((note, index) => {
               console.log(`************* Index: ${index} ********************`);
               console.log(`Title: ${note.title}`);
               console.log(`Body: ${note.body}`);
               console.log(`Completed: ${note.completed}`);
             });
             console.log('*********** All NOTES **************');
           } else {
             console.log('*********** There Are No Notes Yet **************');
           }
         } catch (e) {
             console.log('*********** Error ***********');
             console.log(`ErrorName: ${e.name}`);
             console.log(`errorMessage: ${e.message}`);
             console.log('*********** Error ***********');
         }
        break;
    }
    return;
  }

  // Fetch A Note that matches this title...
  async fetchNote(title) {
    // Fetch Note...
    const dbConnection = await this.createConnection();

    try {
      const Note = await dbConnection.collection('notes_db').findOne({ title }).then((doc) => {
        return doc;
      });

      if (Note) {
        console.log('*********** NOTE ***********');
        console.log(`Title: ${Note.title}`);
        console.log(`Body: ${Note.body}`);
        console.log(`Completed: ${Note.completed}`);
        console.log('*********** NOTE ***********');
      } else {
        console.log('*********** The Note With This Title Could Not Be Found **************');
      }
    } catch (e) {
      console.log('*********** Error ***********');
      console.log(`ErrorName: ${e.name}`);
      console.log(`errorMessage: ${e.message}`);
      console.log('*********** Error ***********');
    }

    return;
  }

  // Mark A Note as completed...
  async completeNote(title) {
    // check if the title exist....
    const CheckTitle = await this.checkNote(title);
    if (!CheckTitle) {
      console.log('*********** NOTE ***********');
      console.log('Sorry, But A Note with this title could not be found.');
      console.log('*********** NOTE ***********');
      return;
    }

    // Complete Note....
    const dbConnection = await this.createConnection();
    try {
      const Note = await dbConnection.collection('notes_db').findOneAndUpdate({
        title
      }, {
        $set: {
          completed: true
        }
      }, {
        returnOriginal: false
      }).then((note) => {
        return note.value;
      });

      if (Note) {
        console.log('*********** NOTE ***********');
        console.log(`Title: ${Note.title}`);
        console.log(`Body: ${Note.body}`);
        console.log(`Completed: ${Note.completed}`);
        console.log('*********** NOTE ***********');
      }
    } catch (e) {
        console.log('*********** Error ***********');
        console.log(`ErrorName: ${e.name}`);
        console.log(`errorMessage: ${e.message}`);
        console.log('*********** Error ***********');
    }

    return;
  }

  // Update A Note....
  async updateNote(title, body) {
    // check if the title exist....
    const CheckTitle = await this.checkNote(title);
    if (!CheckTitle) {
      console.log('*********** NOTE ***********');
      console.log('Sorry, But A Note with this title could not be found.');
      console.log('*********** NEW NOTE ***********');
      return;
    }

    // Update Note...
    const dbConnection = await this.createConnection();
    try {
      const Note = await dbConnection.collection('notes_db').findOneAndUpdate({
        title
      }, {
        $set: {
          body: body
        }
      }, {
        returnOriginal: false
      }).then((doc) => {
        return doc.value;
      });

      if (Note) {
        console.log('*********** NOTE ***********');
        console.log(`Title: ${Note.title}`);
        console.log(`Body: ${Note.body}`);
        console.log(`Completed: ${Note.completed}`);
        console.log('*********** NOTE ***********');
      }
    } catch (e) {
        console.log('*********** Error ***********');
        console.log(`ErrorName: ${e.name}`);
        console.log(`errorMessage: ${e.message}`);
        console.log('*********** Error ***********');
    }

    return;
  }

  // Delete A Note entry...
  async deleteNote(title) {
    // check if the title exist....
    const CheckTitle = await this.checkNote(title);
    if (!CheckTitle) {
      console.log('*********** NOTE ***********');
      console.log('Sorry, But A Note with this title could not be found.');
      console.log('*********** NEW NOTE ***********');
      return;
    }

    // Delete Note....
    const dbConnection = await this.createConnection();
    await dbConnection.collection('notes_db').deleteOne({ title }).then((doc) => {
      if (doc.result.ok) {
        console.log('*********** Delete NOTE ***********');
        console.log('The selcted Note has been deleted successfully.');
        console.log('*********** Delete NOTE ***********');
      }
    }).catch((e) => {
      console.log('*********** Error ***********');
      console.log(`ErrorName: ${e.name}`);
      console.log(`errorMessage: ${e.message}`);
      console.log('*********** Error ***********');
    });
    return;
  }

  async checkNote(title) {
    const dbConnection = await this.createConnection();
    return dbConnection.collection('notes_db').findOne({ title }).then((doc) => {
      if (doc) {
        return true;
      } else {
        return false;
      }
    }).catch((e) => {
      console.log('*********** Error ***********');
      console.log(`ErrorName: ${e.name}`);
      console.log(`errorMessage: ${e.message}`);
      console.log('*********** Error ***********');
    });
  }
}

module.exports = new Notes();
