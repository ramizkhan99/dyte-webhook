import mongoose from "mongoose";

const dbURL = process.env.DB_URI as string;

mongoose
    .connect(dbURL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(
        () => {
            console.log("Connected to database");
        },
        (err) => {
            console.log(err);
        }
    );
