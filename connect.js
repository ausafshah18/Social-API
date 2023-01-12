import mysql from "mysql";
import fs from 'fs';
// export const db = mysql.createConnection({  // connection to DB
//     host:"tipsmysql.mysql.database.azure.com",
//     user:"tipsandtricks",
//     password:"ausaF123*",
//     database:"social"
// })

export const db = mysql.createConnection({
    host:"tipsmysql.mysql.database.azure.com", 
    user:"tipsandtricks", 
    password:"ausaF123*",  
    database:"social", 
    port:3306, 
    ssl:{ca:fs.readFileSync("DigiCertGlobalRootCA.crt.pem")}});