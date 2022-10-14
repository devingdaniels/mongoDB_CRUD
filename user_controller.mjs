import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import userFilter from './helperFunctions.mjs';
import * as users from './user_model.mjs'

const app = express();

const PORT = process.env.PORT;

app.get('/', (req, res) =>{
    res.send('Hello, World!')
})


// Create new user controller
// Using asyncHandler to handle exceptions, ie, if a parameter is undefined, app will crash without the handler. There is a default message that is sent to the user
app.get('/create', asyncHandler(async(req, res) =>{
    // const user = await users.createUser(req.query.name, req.query.age, req.query.email, req.query.phoneNumber)
    let phoneNumber = req.query.phoneNumber 
    if ( phoneNumber === undefined){
        phoneNumber = 'N/A'
    }
    const user = await  users.createUser(
        req.query.name, 
        req.query.age,
        req.query.email, 
        phoneNumber,               
    )
    res.send(user);
}))

// Retrieve handler(endpoint)
app.get('/retrieve', asyncHandler(async(req, res) =>{
    const filter = userFilter(req)
    const result = await users.findUser(filter)
    res.send(result)
}))

// Retrieve handler(endpoint)
app.get('/update', (req, res) => {
    // Find the user via the _id and if found, filter, 
    // make the update, and print the number of updated documents.
    users.findById(req.query._id)
        .then(user => {
            if (user !== null) {
               const update = userFilter(req)
               users.updateUser({ _id: req.query._id }, update)
                    .then(updateCount => {
                        res.send({ updateCount: updateCount });
                    })
                    .catch(error => {
                        console.error(error);
                        res.send({ Error: 'The document was not updated.'});
                    });
            } else {
                res.send({ Error: 'The document was not found.' });
            }
        })
        .catch(error => {
            console.error(error);
            res.json({ Error: error });
        });
});


// Delete handler(endpoint)
function deleteById(req, res) {
    users.deleteById(req.query._id)
        .then(deletedCount => {
            res.send({ deletedCount: deletedCount });
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
}

// Delete based on the filter
function deleteByProperty(req, res) {
    const filters = userFilter(req);
    users.deleteByProperty(filters)
        .then(deletedCount => {
            res.send({ deletedCount: deletedCount });
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
}

app.get('/delete', (req, res) => {
    if (req.query._id !== undefined) {
        deleteById(req, res);
    } else {
        deleteByProperty(req, res);
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});