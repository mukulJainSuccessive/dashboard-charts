/**
* @file Express routes for App
*/
var JDBC = require('jdbc');
var jinst = require('jdbc/lib/jinst');
var Pool = require('jdbc/lib/pool');
var asyncjs = require('async');
// const triremeJdbc = require('trireme-jdbc');
const settings = require('./config/settings');
const db = settings.db;

var Chance = require('chance');
var chance = new Chance();

var bodyParser = require('body-parser');

module.exports = function (app) {

  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  /**
  * @api
  * @desc Returns data via JDBC connection
  */
  app.get('/getData', function(req, res) {

    if (!jinst.isJvmCreated()) {
        jinst.addOption("-Xrs");
        jinst.setupClasspath(['./jars/mysql-connector-java-5.0.8-bin.jar']);
    }

    var mySql = JDBC_CONFIG();

    mySql.initialize(function(err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Connected");
      mySql.reserve(function(err, connObj) {
        console.log("Using connection: " + connObj.uuid);
        var conn = connObj.conn;
        asyncjs.series([
          function(callback) {
            conn.createStatement(function(err, statement) {
              if (err) {
                callback(err);
                return;
              }
                statement.setFetchSize(100, function(err) {
                  if (err) {
                    callback(err);
                    return;
                  }
                  statement.executeQuery("SELECT * FROM Data;", function(err, resultset) {
                    if (err) {
                      callback(err);
                      return;
                    }
                    resultset.toObjArray(function(err, results) {
                      var data = {};
                      data.type = [];
                      for (var i = 0; i < results.length; i++) {
                        data.type.push({
                          id: results[i].Id,
                          chartId: results[i].ChartId,
                          name: results[i].Name
                        });
                      }
                      res.json(data);
                      callback(null);
                    });
                  });
              });
            });
          }
        ], function(err) {
          mySql.release(connObj, function(err) {
            if (err) {
              console.log(err.message);
            }
            console.log("Connection Closed");
          });
        });
      });

    });

  });

  /**
  * @api
  * @desc Returns data via JDBC connection
  */
  app.post('/getSampleData', function(req, res) {

    console.log(req.body.id);
    if (!jinst.isJvmCreated()) {
        jinst.addOption("-Xrs");
        jinst.setupClasspath(['./jars/mysql-connector-java-5.0.8-bin.jar']);
    }

    var mySql = JDBC_CONFIG();

    mySql.initialize(function(err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Connected");
      mySql.reserve(function(err, connObj) {
        console.log("Using connection: " + connObj.uuid);
        var conn = connObj.conn;
        asyncjs.series([
          function(callback) {
            conn.createStatement(function(err, statement) {
              if (err) {
                callback(err);
                return;
              }
                statement.setFetchSize(100, function(err) {
                  if (err) {
                    callback(err);
                    return;
                  }
                  var query = `SELECT *, (case when
                              start_date between "2010-05-01" and "2010-04-30"
                              then
                              "Apr 2010"
                              when
                              start_date between "2010-06-01" and "2010-05-27"
                              then
                              "May 2010"
                              when
                              start_date between "2010-07-01" and "2010-06-30"
                              then
                              "Jun 2010"
                              when
                              start_date between "2010-08-01" and "2010-07-30"
                              then
                              "Jul 2010"
                              else "other"
                              end) as month,
                              count(*) as total
                              FROM dateAgeData
                              group by month
                              order by month`

                              console.log(query);
                  statement.executeQuery(query, function(err, resultset) {
                    if (err) {
                      callback(err);
                      return;
                    }
                    resultset.toObjArray(function(err, results) {
                      res.json(results);
                      callback(null);
                    });
                  });
              });
            });
          }
        ], function(err) {
          mySql.release(connObj, function(err) {
            if (err) {
              console.log(err.message);
            }
            console.log("Connection Closed");
          });
        });
      });

    });

  });

  /**
  * @api
  * @desc Insert data via JDBC connection
  */
  app.get('/addData', function(req, res) {

    if (!jinst.isJvmCreated()) {
        jinst.addOption("-Xrs");
        jinst.setupClasspath(['./jars/mysql-connector-java-5.0.8-bin.jar']);
    }

    var mySql = JDBC_CONFIG();
    console.log(mySql)
    mySql.initialize(function(err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Connected");
      mySql.reserve(function(err, connObj) {
        console.log("Using connection: " + connObj.uuid);
        var conn = connObj.conn;
        asyncjs.series([
          function(callback) {
            conn.createStatement(function(err, statement) {
              if (err) {
                callback(err);
                return;
              }
                statement.setFetchSize(100, function(err) {
                  if (err) {
                    callback(err);
                    return;
                  }
                  var i = 554148, start_index = 554148;
                  while(true) {
                     var str = "INSERT INTO dateAgeData Values ( "
                              + i + ", "
                              + chance.age() + ", "
                              + "'" + chance.name() + "'" + ", "
                              + "'" + new Date(chance.date({string: true, year: 2013})).toISOString().slice(0, 19).replace('T', ' ') + "'"
                              + " )";
                     statement.executeUpdate(str, function(err, count) {
                     	console.log("Inserting");
                        if (err) {
                          console.log(err);
                        }
                    });
                    if (i - start_index === 100000) {
                    	// console.log("Connection closing")
            //         	mySql.release(connObj, function(err) {
				        //     if (err) {
				        //       console.log(err.message);
				        //     }
				        //     console.log("Connection Closed");
				        //     start_index = i;
				        // });
	                }
                    i++;
                  }
              });
            });
          }
        ], function(err) {
          mySql.release(connObj, function(err) {
            if (err) {
              console.log(err.message);
            }
            console.log("Connection Closed");
          });
        });
      });

    });

  });


  /**
  * @api
  * @desc Insert data in chunks via JDBC connection
  */
  app.get('/addDataInChunks', function(req, res) {
    if (!jinst.isJvmCreated()) {
      jinst.addOption("-Xrs");
      jinst.setupClasspath(['./jars/mysql-connector-java-5.0.8-bin.jar']);
    }
    var mySql = JDBC_CONFIG();
    var init = true, reInit = true;

    while(true) {
    	if (reInit) {
    		console.log(mySql)
	    	mySql.initialize(function(err) {
	    		console.log("kkk")
		      if (err) {
		        console.log(err);
		        return;
		      }
	      	  console.log("Connected");
	      	  mySql.reserve(function(err, connObj) {
	            console.log("Using connection: " + connObj.uuid);
	            var conn = connObj.conn;
	            asyncjs.series([
	               function(callback) {
	               conn.createStatement(function(err, statement) {
	               if (err) {
	                  callback(err);
	                  return;
	               }
	               statement.setFetchSize(100, function(err) {
	                if (err) {
	                  callback(err);
	                  return;
	                }
	                var i = 545132, start_index = 545132;
	                while(init) {
	                    var str = "INSERT INTO dateAgeData Values ( "
	                              + i + ", "
	                              + chance.age() + ", "
	                              + "'" + chance.name() + "'" + ", "
	                              + "'" + new Date(chance.date({string: true, year: 2013})).toISOString().slice(0, 19).replace('T', ' ') + "'"
	                              + " )";
	                    // statement.executeUpdate(str, function(err, count) {
	                    //     if (err) {
	                    //       console.log(err);
	                    //     }
	                    // });
	                    if (i - start_index === 1000) {
	                    	console.log("Connection closing")
	                    	mySql.release(connObj, function(err) {
					            if (err) {
					              console.log(err.message);
					            }
					            console.log("Connection Closed");
					            init = false;
					        });
	                    }
	                    i++;
	                  }
	              });
	            });
	          }
	        ], function(err) {
	          mySql.release(connObj, function(err) {
	            if (err) {
	              console.log(err.message);
	            }
	            console.log("Connection Closed");
	          });
	        });
	      });

	    });
    	}
    	reInit = false;
    }

  });


  /**
  * @api
  * @desc Serve index.html file on path '/'
  */
  app.get('/', function(req, res) {
      res.sendfile('./public/index.html');
  });

};

function JDBC_CONFIG() {
  return new JDBC({
      url: db.url + db.database + '?user=' + db.user + '&' + 'password=' + db.password,
      drivername: 'com.mysql.jdbc.Driver',
      minpoolsize: 5,
      maxpoolsize: 10,
      user: db.user,
      password: db.password
  });
}

function initMysql(cb) {

}

function closeMysql(cb) {

}
