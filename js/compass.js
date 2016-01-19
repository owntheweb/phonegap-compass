function Compass() {
    //target elements in index.html
    this.targets = {
        degrees: document.getElementById("degrees"),
        compass: document.getElementById("compass"),
        log: document.getElementById('log')
    };

    //only update compass if the heading has changed, possibly saving battery power
    this.oldHeading = 0.0;
}

//log messages to the app screen, mostly for testing
Compass.prototype.log = function(message) {
    this.targets.log.innerHTML = message;
    console.log(message); //more helpful if additional debugging tools are installed
};

Compass.prototype.startReadings = function() {
    var self = this;
    var degrees, turnStyle;

    //clear "Initiating..." text present in index.html at start
    self.log('');

    //handle the compass heading once every 100 miliseconds (10 times per second)
    var timer = setInterval(function() {
        
        navigator.compass.getCurrentHeading(function(heading) {
            
            if(heading.magneticHeading != self.oldHeading) {
                //round the magnetic heading degrees to two decinal places, and always show two decimal places 
                //(e.g. even 1.00), appending a degree symbol at the end
                degrees = (Math.round(heading.magneticHeading * 100) / 100).toFixed(2).toString() + "°";
                self.targets.degrees.innerHTML = degrees;
                
                //turn the compass dial
                turnStyle = "rotate(" + (-heading.magneticHeading).toString() + "deg) translate(-50%, -50%)";
                self.targets.compass.style.transform = turnStyle;

                self.oldHeading = heading.magneticHeading;
            }

        }, function(error) {
            self.log('Compass Error: ' + error.code);
        });

    }, 100);

};

//deviceready event handler (called from index.html)
Compass.prototype.onReady = function() {
    try {
        this.startReadings();
    } catch(err) {
        alert(err);
        this.log(err.message);
    }  

};

