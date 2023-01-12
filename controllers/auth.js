import {db} from "../connect.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req,res) => {

    //CHECK IF USER EXISTS

    const q = "SELECT * FROM users WHERE username = ?" // we could have written req.boy.username instead of ? but ? is more secure. It picks up the enterd username(input) on register page and find it in db
    
    db.query(q, [req.body.username] , (err,data) => {
        if(err)
        {
            return (res.status(500).json(err)) // 500 is server error
        }
        if(data.length)
        {
            return (res.status(409).json("User already exists!"))
        }
        
    //IF NOT, CREATE A NEW USER
        //HASH THE PASSWORD (we don't send the password in it's original form, we hash it)
        
        const salt = bcrypt.genSaltSync(10); // method of hashing our password
        const hashedPassword = bcrypt.hashSync(req.body.password, salt) //hashed the password using the salt. It returns the encrypted password
    
        const q = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)"
        const values = [req.body.username, req.body.email, hashedPassword, req.body.name]

        db.query(q, [values] , (err,data) => {
            if(err)
            {
                return (res.status(500).json(err)) 
            }
            return (res.status(200).json("User has been created"))

        });
    })
    
    
}

export const login = (req,res) => {

    const q = "SELECT * FROM users WHERE username = ?" // it returns an array with only one user

    db.query(q, [req.body.username], (err,data)=>{
        if(err)
        {
            return (res.status(500).json(err)) 
        }
        if(data.length === 0)
        {
            return (res.status(404).json("User not found!"))
        }
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password) // here data[0] is that we are selecting the first(and only) data that we got in array by query "q"

        if(!checkPassword)
        {
            return(res.status(400).json("Wrong password or username!"))
        }

        const token = jwt.sign({id:data[0].id}, "secretkey") // while deleting a post if user id == id of post then only user will be able to delete the post

        const {password, ...others} = data[0] // separates password from other info

        // cookie contains hashtoken which contains our userid and using that we can do what ever we want like like posts, foolow people etc using that id
        res.cookie("accessToken", token, { // we can send and take our cookie through websites
            httpOnly: true
        }).status(200).json(others) // it returns info ther than the password
    })

}


export const logout = (req,res) => {

    res.clearCookie("accessToken",{ // clearing the cookie
        secure:true,
        sameSite:"none"
    }).status(200).json("User has been logged out.")
    
}