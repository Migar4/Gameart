const mongoose = require('mongoose');


//connect to the database using mongoose
mongoose.connect('mongodb://127.0.0.1:27017/gameart', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then((data)=>{
    console.log("Connected to database");
}).catch((e) => {
    console.log(e);
});
