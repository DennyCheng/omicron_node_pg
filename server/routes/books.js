var express = require('express');
var router = express.Router();
var pg = require('pg');
//we use pg package to make requests to our quarries
var connectionString = 'postgres://localhost:5432/omicron';
//postgress is our protocol and localhost 5432 is default, and name of database

router.get('/',function(req,res){
  //retrieve books from database
  pg.connect(connectionString,function(err,client,done){
    //first time we have access to done, when we open the query
    if(err){
      res.sendStatus(500);
    }
    client.query('SELECT * FROM books',function(err,result){
      done();
      //done is a function, we are done with the connection (done our query got our data close the connection)
      //Can run 10 querys on a connection, if we don't call DONE the querys will stay open.
      //if we odn't call run the query connection will stay open
      if(err){
        res.sendStatus(500);
      }
      res.send(result.rows);
    });
  });
  //connect takes two parameters(connectionString,function(err,client,done))
});

router.post('/',function(req,res){
  var book = req.body;
  console.log(book);

  pg.connect(connectionString, function(err,client,done){
    if(err){
      res.sendStatus(500);
    };
    client.query('INSERT INTO books(author, title, published, edition, publisher)'
    //the three fields we want to insert into but these are fields in the database
      +'VALUES($1,$2,$3,$4,$5)',
      //prepared statements - when i prepare the statement i prepare $1 is going to be book.author.book
      //prevents SQL injections
      //$1 will always match the first thing in the array (first database field is author)
      [book.author,book.title,book.published,book.edition,book.publisher],
        function(err,result){
          done();
          //close connections
          if (err){
            res.sendStatus(500);
            //after we close the connection and we get an error this will be sent
          }

          else{res.sendStatus(201);
          //this is a created status
        }
        });

      //these are properities on the object
  });
});

module.exports = router;
