/* global setInterval */
var UI = require('ui');
var Vector2 = require('vector2');
var Vibe = require('ui/vibe');
var ajax = require('ajax');

var doorShown = false;
var carShown = false;
var fridgeShown = false;
var ajaxRunning = false;
var alertToShow = '';

var spark_id = ''; // Please put your device id here
var access_token = '';  // Please put your access_token here
var URL = 'https://api.spark.io/v1/devices/' + spark_id + '/allDoors?access_token=' + access_token;

// Begin alert windows
var doorWindow = new UI.Window();
var carWindow = new UI.Window();
var fridgeWindow = new UI.Window();

var doorText = new UI.Text({
    position: new Vector2(0, 20),
    size: new Vector2(144, 30),
    font: 'bitham-30-black',
    color: 'white',
    text: 'Door open',
    textAlign: 'center'
});

var doorImg = new UI.Image({
    position: new Vector2(48, 100),
    size: new Vector2(48, 55),
    backgroundColor: 'clear',
    image: 'images/door-open-big.png'
});

doorWindow.add(doorText);
doorWindow.add(doorImg);

var carText = new UI.Text({
    position: new Vector2(0, 20),
    size: new Vector2(144, 30),
    font: 'bitham-30-black',
    color: 'white',
    text: 'Car  open',
    textAlign: 'center'
});

var carImg = new UI.Image({
    position: new Vector2(48, 100),
    size: new Vector2(48, 55),
    backgroundColor: 'clear',
    image: 'images/car-open-big.png'
});

carWindow.add(carText);
carWindow.add(carImg);

var fridgeText = new UI.Text({
    position: new Vector2(0, 20),
    size: new Vector2(144, 30),
    font: 'bitham-30-black',
    color: 'white',
    text: 'Fridge open',
    textAlign: 'center'
});

var fridgeImg = new UI.Image({
    position: new Vector2(48, 100),
    size: new Vector2(48, 55),
    backgroundColor: 'clear',
    image: 'images/fridge-open-big.png'
});

fridgeWindow.add(fridgeText);
fridgeWindow.add(fridgeImg);

// End alert windows


// Begin main window

var mainWindow = new UI.Window();

var time = new UI.TimeText({
  position: new Vector2(0, 30),
  size: new Vector2(144, 30),
  font: 'bitham-42-bold',
	text: '%H:%M',
  textAlign: 'center'
});

var doorClosedMainImg = new UI.Image({
    position: new Vector2(9, 100),
    size: new Vector2(35, 40),
    backgroundColor: 'clear',
    image: 'images/door-closed.png'
});

var carClosedMainImg = new UI.Image({
    position: new Vector2(53, 100),
    size: new Vector2(35, 40),
    backgroundColor: 'clear',
    image: 'images/car-closed.png'
});

var fridgeClosedMainImg = new UI.Image({
    position: new Vector2(97, 100),
    size: new Vector2(35, 40),
    backgroundColor: 'clear',
    image: 'images/fridge-closed.png'
});

var doorOpenMainImg = new UI.Image({
    position: new Vector2(9, 100),
    size: new Vector2(35, 40),
    backgroundColor: 'clear',
    image: 'images/door-open.png'
});

var carOpenMainImg = new UI.Image({
    position: new Vector2(53, 100),
    size: new Vector2(35, 40),
    backgroundColor: 'clear',
    image: 'images/car-open.png'
});

var fridgeOpenMainImg = new UI.Image({
    position: new Vector2(97, 100),
    size: new Vector2(35, 40),
    backgroundColor: 'clear',
    image: 'images/fridge-open.png'
});

mainWindow.add(time);

// End main window


mainWindow.show();

// Initial call
getSparkData();

// Setting interval for second+ calls
setInterval(function() { 
  getSparkData();
}, 10000);

function getSparkData() {
  ajaxRunning = true;
  alertToShow = '';
  // Make the request
  ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
      // Success!
      console.log('Successfully feteched spark data!');
  
      // Extract data
      var results = data.result.toString(2);
      if (results.length == 2)
          results = '0' + results;
      else if (results.length == 1)
          results = '00' + results;
      console.log(results);
      
      var doorStatus = results[0] == '1' ? 'open' : 'closed';
      var carStatus = results[1] == '1' ? 'open' : 'closed';
      var fridgeStatus = results[2] == '1' ? 'open' : 'closed';

      if (doorStatus == 'open' && !doorShown) {
        alertToShow = 'door';
      } 
      
      if (carStatus == 'open' && !carShown) {
        if (alertToShow !== 'door')
          alertToShow = 'car';
      } 
      
      if (fridgeStatus == 'open' && !fridgeShown) {
        if (alertToShow !== 'door' && alertToShow !== 'car')
          alertToShow = 'fridge';
      }
    
      if (alertToShow == 'door') {
          doorShown = true;
          doorWindow.show();
          setTimeout(function() {
              doorWindow.hide();
          }, 5000);
          Vibe.vibrate('long');
      } else if (alertToShow == 'car') {
          carShown = true;
          carWindow.show();
          setTimeout(function() {
              carWindow.hide();
          }, 5000);
          Vibe.vibrate('long');
        
      } else if (alertToShow == 'fridge') {
          fridgeShown = true;
          fridgeWindow.show();
          setTimeout(function() {
              fridgeWindow.hide();
          }, 5000);
          Vibe.vibrate('long');
      }
    
      if (doorStatus == 'open') {
          if (doorClosedMainImg.index() != -1)
              doorClosedMainImg.remove();
        
          if (doorOpenMainImg.index() == -1)
              mainWindow.add(doorOpenMainImg);
      }
      if (carStatus == 'open') {
          if (carClosedMainImg.index() != -1)
              carClosedMainImg.remove();
        
          if (carOpenMainImg.index() == -1)
              mainWindow.add(carOpenMainImg);
      }
      if (fridgeStatus == 'open') {
          if (fridgeClosedMainImg.index() != -1)
              fridgeClosedMainImg.remove();
        
          if (fridgeOpenMainImg.index() == -1)
              mainWindow.add(fridgeOpenMainImg);
      }
    
      if (doorStatus == 'closed') {
          doorShown = false;
          if (doorOpenMainImg.index() != -1)
              doorOpenMainImg.remove();
        
          if (doorClosedMainImg.index() == -1)
              mainWindow.add(doorClosedMainImg);
      }
      if (carStatus == 'closed') {
          carShown = false;
          if (carOpenMainImg.index() != -1)
              carOpenMainImg.remove();
        
          if (carClosedMainImg.index() == -1)
              mainWindow.add(carClosedMainImg);
      }
      if (fridgeStatus == 'closed') {
          fridgeShown = false;
          if (fridgeOpenMainImg.index() != -1)
              fridgeOpenMainImg.remove();
        
          if (fridgeClosedMainImg.index() == -1)
              mainWindow.add(fridgeClosedMainImg);
      }
      
      // Always upper-case first letter of description
      //var description = 'Door: ' + doorStatus + '\nCar: ' + carStatus + '\nFridge: ' + fridgeStatus;
    
      // Show to user
      //mainCard.title(time);
      //mainCard.subtitle('Locks status');
      //mainCard.body(description);
  },
  function(error) {
    // Failure!
    console.log('Failed fetching spark data: ' + error);
    
    if (doorClosedMainImg.index() != -1)
      doorClosedMainImg.remove();
    if (carClosedMainImg.index() != -1)
      carClosedMainImg.remove();
    if (fridgeClosedMainImg.index() != -1)
      fridgeClosedMainImg.remove();
    if (doorOpenMainImg.index() != -1)
      doorOpenMainImg.remove();
    if (carOpenMainImg.index() != -1)
      carOpenMainImg.remove();
    if (fridgeOpenMainImg.index() != -1)
      fridgeOpenMainImg.remove();
  },
  function(complete) {
    ajaxRunning = false;
  }
  );
}  