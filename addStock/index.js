var { DynamoDB } = require("@aws-sdk/client-dynamodb");

var dynamoDB = new DynamoDB({
  region: "us-east-1",
});

exports.handler = async(event) => {
  try {
    // Data passed from the HTTP request is saved as a JSON string in event.body
    // We need to parse it into a Javascript object before we can use it.
    let obj = JSON.parse(event.body);
    var fileItem = {
      Item: {
        ticker: {
          S: obj.ticker
        },
        purchasePrice: {
          N: obj.purchasePrice
        },
        shares: {
          N: obj.shares
        }
      },
      TableName: "stocks"
    };
    return new Promise((resolve, reject) => {
      dynamoDB.putItem(fileItem, function(err, data) {
        if (err) {
          console.log(err, err.stack);
        }
        else {
          const response = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
            body: JSON.stringify({"error":false})
            };
          resolve(response);
          console.log(data);
        }
      });
    });
  }
  catch (err) {
    console.log("Error", err);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify({error: true, msg: 'Invalid data'})
  };
  }
};