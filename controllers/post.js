import {db} from '../connect.js'
import  jwt  from 'jsonwebtoken'
import moment from 'moment';

export const getPosts = (req,res) => {

    const userId = req.query.userId
    const token = req.cookies.accessToken;
    if(!token)
    {
        return (res.status(401).json("Not logged in!"))
    }

    jwt.verify(token,"secretkey", (err,userInfo) => {
        if(err)
        {
            return(res.status(403).json("Token is not valid!"));
        }

        const q =userId !== "undefined" 
            ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
            : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS 
            r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createdAt DESC` // we are fetching users and posts but we are specifying that DB has to select only the owner of the post
        // we are fetching everything from posts but only particulars from users. We are fetching only those posts whose profiles we are following. "?" is our id
        // posts will be ordered by dated in closest date order

        // As we are using cookies, it has web tokens and web token has userid

        const values = userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

        db.query(q, [userId ? userId : userInfo.id, userInfo.id] ,(err,data) => {
        if(err)
        {
            return(res.status(500).json(err))
        }
        return(res.status(200).json(data))
        })

    })

    
}

export const addPost = (req,res) => {

    const token = req.cookies.accessToken;
    if(!token)
    {
        return (res.status(401).json("Not logged in!"))
    }

    jwt.verify(token,"secretkey", (err,userInfo) => {
        if(err)
        {
            return(res.status(403).json("Token is not valid!"));
        }

        const q = "INSERT INTO posts (`desc`,`img`,`createdAt`,`userId`) VALUES (?)"
        
        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), // geting the date and converting it into MySql format
            userInfo.id
        ]

        db.query(q, [values] ,(err,data) => {
        if(err)
        {
            return(res.status(500).json(err))
        }
        return(res.status(200).json("Post has been created"))
        })

    })

    
}

export const deletePost = (req,res) => {

    const token = req.cookies.accessToken;
    if(!token)
    {
        return (res.status(401).json("Not logged in!"))
    }

    jwt.verify(token,"secretkey", (err,userInfo) => {
        if(err)
        {
            return(res.status(403).json("Token is not valid!"));
        }

        const q = "DELETE FROM posts WHERE `id`=? AND `userId`=? "
        
        db.query(q, [req.params.id, userInfo.id] ,(err,data) => {
        if(err)
        {
            return(res.status(500).json(err))
        }
        if(data.affectedRows > 0)
        {
            return (res.status(200).json("Post has been deleted"))
        }
        return(res.status(403).json("You can delete only your post"))
        })

    })

    
}