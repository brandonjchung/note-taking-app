import express from "express"
import cors from "cors"
import notes from "./routes/note.js"
import tags from "./routes/tag.js"
import user from "./routes/user.js"

const PORT = process.env.PORT || 5050;
const app = express();

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 app.options("*", (req, res, next) => {
    try {
      console.log("CORS preflight request received");
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.status(200).end();
    } catch (error) {
      console.error("CORS Preflight Error:", error);
      res.status(500).send("CORS Preflight Failed");
    }
  });
app.use(cors(corsOptions))
// app.use(cors({
//     origin: "https://bjc-note-taking-app-frontend.vercel.app", // Change this to your frontend URL
//     credentials: true
//   }));
// app.options("*", cors());
  
app.use(express.json());
app.use('/note', notes);
app.use('/tag', tags);
app.use('/user', user);

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})