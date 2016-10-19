var azureEventHub = require('azure-event-hubs');
var pmongo = require('promised-mongo');


module.exports = (function() {
    // private stuff
    var EventHubClient = azureEventHub.Client;
    var connectionString = 'HostName=IoTHackathon.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=I9lw6xcoqdIM+7RL9W5/QfNvPN2sDkcPjEnI47Q/Yhg=';

    var mongo_url = "mongodb://localhost:27017/aggregator";
    var db = null;

    var beginAggregation = function() {
        db = pmongo(mongo_url, ['data']);

        var client = EventHubClient.fromConnectionString(connectionString);
        client.open()
        .then(client.getPartitionIds.bind(client))
        .then(function (partitionIds) {
            return partitionIds.map(function (partitionId) {
                return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
                    console.log('Created partition receiver: ' + partitionId)
                    receiver.on('errorReceived', printError);
                    receiver.on('message', messageHandler);
                });
            });
        })
        .catch(printError);
    }

    var printError = function (err) {
        console.log(err.message);
    }

    var messageHandler = function (message) {
        if (db != null) {
            db.data.insert(message.body);
        }
    }

    var allDataPoints = function () {
        return db.data.find().toArray();
    }

    return {
        // public stuff
        beginAggregation: beginAggregation,
        allDataPoints: allDataPoints
    }
})();
