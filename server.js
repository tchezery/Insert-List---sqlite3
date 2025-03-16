//Import the library express, sqlite3 
// and open from sqlite to create a connection with the database
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

//Create an constant "app", 
// and this constant start the server with express
const app = express();
//Inform the constant "app" that should receive json information
app.use(express.json()); 

//Create a async function "connectionDB"
async function connectionDB() {
    //Try the firt block of code
    try {
        //Create a constant "db" to use the function "open"
        const db = await open({
            //Inform address of the database
            filename: 'DB/banco.db',
            //Translate the information to the database
            driver: sqlite3.Database
        });

        //Print the message "Connection with the database was successful"
        console.log('Connection with the database was successful');
        //Return the constant "db"
        return db;
      //If the first block of code don't work,  
    } catch (error) {
        //Print the message "Error connection with the database: "
        console.error("Error connection with the database: ", error.message);
        //Throw the error
        throw error;
    }
};
    
//Create async function "createTable"
async function createTable() {
    //Create a constant "db" to use the function "connectionDB"
    //  with "await" to wait the connection after create the table
    const db = await connectionDB();

    //"Await" to wait the create table after close the connection,
    //  and "db" to use the function "run" to create the table
    await db.run(`
            CREATE TABLE IF NOT EXISTS person (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                cpf CHAR(11) NOT NULL,
                email VARCHAR(255) NOT NULL
            )
        `);

    //Close the connection
    await db.close();
    //Print the message "Table created successfully"
    console.log('Table created successfully');
}

//Add a route "/insert" and create a async function with two parameters
app.post('/insert', async (req, res) => {
    //Create a multiple constant to receive the information from the body
    const { name, cpf, email } = req.body;

    //Check if the fields are empty
    if (!name || !cpf || !email) {
        //Return a message with status 400
        return res.status(400).json({ error: 'You need to fill all fields' });    
    }

    //Try the firt block of code
    try {
        //Create a constant "db" to use the function "connectionDB"
        //  with "await" to wait the connection after insert information
        const db = await connectionDB();
        
        //"Await" to wait the insert information after close the connection,
        //  and "db" to use the function "run" to create the table
        await db.run(
            `INSERT INTO person (name, cpf, email) VALUES (?, ?, ?)`,
            //this is an array of information
            //  that will be inserted in the database
            [name, cpf, email]
        );

        //Close the connection
        await db.close();
    
        //At the end, return a message with status 201
        res.status(201).json({ message: 'Person added successfully' });

        //Print the message "Person added successfully"
        console.log('Person added successfully');

      //If the first block of code don't work,
      //  the catch will be executed
      //  and apresent "error"  
    } catch (error) {
        //Return a message with status 500
        //  and the error message
        res.status(500).json({ error: error.message });
    }
});

//Add a route "/list" and create a async function with two parameters
app.get('/list', async (req, res) => {
    //Try the firt block of code
    try {
        //Create a constant "db" to use the function "connectionDB"
        //  with "await" to wait the connection after the generate list information
        const db = await connectionDB();

        //"Await" to wait the generate list information after close the connection,
        const personList = await db.all(
            'SELECT * FROM person'
        ); 

        //Close the connection
        await db.close();

        //At the end, return a message with status 200
        res.status(200).json(personList);

        //Print the message "List of persons"
        console.log('List of persons');

      //If the first block of code don't work,
      //  the catch will be executed
      // and apresent "error"
    } catch (error) {
        //Return a message with status 500
        res.status(500).json({ error: error.message });
    }
});

//Start the server on port 3000
app.listen(3000, async () => {
    //"Await" to wait the connection with the database
    //  after create the table
    await connectionDB();
    //"Await" to wait create table
    // after start the server
    await createTable();

    //Print the message "Server running on port 3000"
    console.log('Server running on port 3000');
});