import express from "express"
import cors from "cors"
import notes from "./routes/note.js"
import tags from "./routes/tag.js"
import login from "./routes/login.js"
import signup from "./routes/signup.js"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/note', notes);
app.use('/tag', tags);
app.use('/login', login);
app.use('/signup', signup);

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})