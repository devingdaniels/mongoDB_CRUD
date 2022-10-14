// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to the Atlas cluster or local MongoDB.
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

// Define the user schema for the collection
const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    age: {type: String, required: true},
    email: {type: String, required: true},
    phoneNumber: {type: String, required: true}
})

// Create the model form the schema 
// Creates a class behinds the scenes, called User, using the userSchema schema 
const User = mongoose.model('User', userSchema)

// A function, to be used in user_controller, to create new instances of User based on the schema (this is the C in CRUD)
const createUser = async(name, age ,email, phoneNumber) => {    
    const user = new User({
        name: name, 
        age: age, 
        email: email, 
        phoneNumber:phoneNumber
    })
    return user.save()
}

// A function, to be used in user_controller, to find a specific user given query parameters. If no parameters are passed, should return all entries (this is the R in CRUD
const findUser = async(filter) =>{
    // Call static method .find() - this is a method native to mongoose that returns a query object
    // Filter method conditions is programmer defined
    const query = User.find(filter)
    // Execute the query object to get the results
    return query.exec()
}

// A function, to be used in user_controller, to update the properties of a specific document. This is the U in CRUD
const updateUser = async (filter, update) => {
    const result = await User.updateOne(filter, update);
    return result.modifiedCount;
 };
 
const findById = async (_id) => {
    const query = User.findById(_id);
    return query.exec();
}

// A function, to be used in user_controller, to delete a document, or in this case, a user. This is the D in CRUD
// Delete based on the ID.
const deleteById = async (_id) => {
    const result = await User.deleteOne({_id: _id});
    return result.deletedCount;
};

// Delete based on filter.
const deleteByProperty = async (filter) => {
    const result = await User.deleteMany(filter);
    return result.deletedCount;
}


// Confirm that the database has connected 
// and print a message in the console.
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});


export {createUser , findUser, updateUser, findById, deleteById, deleteByProperty}