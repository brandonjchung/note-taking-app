import express from "express"
import cors from "cors"
import notes from "./routes/note.js"
import tags from "./routes/tag.js"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/note', notes);
app.use('/tag', tags);

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})