import express from "express";
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import commentRoutes from "./routes/comments.js"
import authRoutes from "./routes/auth.js"
import likeRoutes from "./routes/likes.js"
import cors from "cors"
import multer from "multer"
import cookieParser from "cookie-parser";
import relationshipRoutes from "./routes/relationships.js"

const app = express()

// middlewares

app.use((req, res, next) => {   // when we make request we should be allowed
    res.header("Access-Control-Allow-Credentials", true); // we can pass cookies
    next();
  });

app.use(express.json()) // using this we will be able to send user input data (such as while registering) as JSON

app.use(cors({              // our api can be reached through one particular URL
    origin:"http://localhost:3000" // client URL
})) 

app.use(cookieParser())

const storage = multer.diskStorage({ // for uploading files (share.jsx component)
    destination: function (req, file, cb) {
      cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
})
  
const upload = multer({ storage: storage })

app.use("/api/upload", upload.single("file"), (req,res)=>{ // for uploading
    const file = req.file;
    res.status(200).json(file.filename);
})

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/relationships",relationshipRoutes)

app.listen(8800, ()=>{
    console.log("API working!")
})