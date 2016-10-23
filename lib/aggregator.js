var azureEventHub = require('azure-event-hubs');
var pmongo = require('promised-mongo');
var simulator = require('../simulator/simulator');


module.exports = (function() {
    // private stuff
    var EventHubClient = azureEventHub.Client;
    var connectionString = 'HostName=IoTHackathon.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=I9lw6xcoqdIM+7RL9W5/QfNvPN2sDkcPjEnI47Q/Yhg=';

    var mongo_url = "mongodb://localhost:27017/aggregator";
    var db = null;
    var io = null;

    var beginAggregation = function(io) {
        // db = pmongo(mongo_url, ['data']);
        io = io;

        simulator.beginSimulation();
        setInterval(function() {
            var message = {body: simulator.payload()};
            messageHandler(message, io);
        }, 100);

        // var client = EventHubClient.fromConnectionString(connectionString);
        // client.open()
        // .then(client.getPartitionIds.bind(client))
        // .then(function (partitionIds) {
        //     return partitionIds.map(function (partitionId) {
        //         return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
        //             console.log('Created partition receiver: ' + partitionId)
        //             receiver.on('errorReceived', printError);
        //             receiver.on('message', (message) => {
        //                 messageHandler(message, io);
        //             });
        //         });
        //     });
        // })
        // .catch(printError);
    }

    var printError = function (err) {
        console.log(err.message);
    }

    var messageHandler = function (message, io) {
        if (db != null) {
            db.data.insert(message.body);
        }
        if (io != null) {
            io.emit('new data point', message.body);
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
