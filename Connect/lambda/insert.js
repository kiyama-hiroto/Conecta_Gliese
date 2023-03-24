var mysql = require('mysql')

exports.handler = async (event) => {
  try {
     const connection = mysql.createConnection({
          host: 'database-connect.cumjjmajipi7.us-east-1.rds.amazonaws.com',
          user: 'root',
          password: 'rootroot',
          database: 'gliese'
        });
        
    const {user, email, cpf, password, type} = JSON.parse(event.body);
        
     const data = await new Promise((resolve, reject) => {
           connection.connect(function (err) {
          if (err) {
         reject(err);
        }
        
        var sql = "INSERT INTO users (user, email, cpf, password, type) VALUES ('" + user + "','" + email + "','" + cpf + "','" + password + "','" + type + "')";
        connection.query(sql, function (err, result) {
             if (err) {
               console.log("Error->" + err);
            reject(err);
       }
      resolve(result);
           });
      })
       }); 
        return { 
          statusCode: 200,  
         body: JSON.stringify(data)   
      } 
      } catch (err) {    
     return {   
        statusCode: 400,   
        body: err.message 
        } 
      }
     }; 