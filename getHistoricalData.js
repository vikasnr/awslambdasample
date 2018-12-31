var mysql = require('mysql');

exports.handler = function (event, context, callback) {
	var conn = mysql.createConnection({
		host: 'identifier.region.rds.amazonaws.com',
		user: 'username',
		password: 'password',
		database: 'Freezer'
	});

	conn.connect();
	var macaddress = event.mac_address;
	if (event.check === 0) {
		// 	  queryString="select * from SensorData where mac_address=? order by timestamp LIMIT 5"
		queryString = "select * from SensorData where mac_address=? order by timestamp"
	}

	if (event.check == 1) {
		queryString = "select temperature,humidity,luminosity,battery_status, timestamp as timestamp FROM SensorData WHERE mac_address=? AND TIMESTAMP >= DATE_SUB(NOW(),INTERVAL 1 HOUR)"
	}
	if (event.check == 2) {
		//queryString="select AVG(temperature) as temperature, AVG(humidity) as humidity , AVG(luminosity) as luminosity, AVG(battery_status) as battery_status, timestamp FROM SensorData WHERE mac_address=? AND DATE_SUB(`timestamp`,INTERVAL 1 HOUR) And timestamp > DATE_SUB(NOW(), INTERVAL 1 DAY) GROUP BY HOUR(timestamp)"
		queryString = "select AVG(temperature) as temperature, AVG(humidity) as humidity , AVG(luminosity) as luminosity, AVG(battery_status) as battery_status,timestamp  FROM SensorData WHERE mac_address=? AND timestamp >= DATE_SUB(NOW(),INTERVAL 1 DAY) group by hour(timestamp)"
	}
	if (event.check == 3) {
		queryString = "select AVG(temperature) as temperature, AVG(humidity) as humidity , AVG(luminosity) as luminosity, AVG(battery_status) as battery_status, timestamp FROM SensorData WHERE mac_address=? AND DATE_SUB(`timestamp`,INTERVAL 1 DAY) And timestamp > DATE_SUB(NOW(), INTERVAL 5 DAY) GROUP BY DAY(timestamp)"
		//queryString="select * FROM SensorData WHERE mac_address=? AND DATE_SUB(`timestamp`,INTERVAL 1 DAY) And timestamp > DATE_SUB(NOW(), INTERVAL 5 DAY)"
	}
	conn.query(queryString, [macaddress], function (err, rows, fields) {
		if (err) {
			callback(null, {
				"status": "error",
				"error": err
			})
		} else {

			callback(null, {
				"status": "success",
				"data": rows
			});
		}

	});
	conn.end();
}