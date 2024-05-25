/*********************************************************************************
* WEB700 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Dea Guxholli Student ID: 145699237 Date: 18/05/2024
*
********************************************************************************/

//  Creating the "Server Paths": Define the arrays to store server data
const serverVerbs = ["GET", "GET", "GET", "POST", "GET", "POST"];
const serverPaths = ["/", "/about", "/contact", "/login", "/panel", "/logout"];
const serverResponses = [
    "Welcome to WEB700 Assignment 1 ",
    "This course name is WEB700. This assignment was prepared by Dea Guxholli ",
    "dguxholli@myseneca.ca \nDea Guxholli ",
    "Hello, User Logged In ",
    "Main Panel ",
    "Logout Complete. Goodbye "
];

// Simulate web server response
function httpRequest(httpVerb, path) {
    for (let i = 0; i < serverPaths.length; i++) {
        if (serverVerbs[i] === httpVerb && serverPaths[i] === path) {
            return `200: ${serverResponses}`;
        }
    }
    return `404: Unable to process ${httpVerb} request for ${path}`;
}

/* Manually testing the "httpRequest" function
console.log(httpRequest("GET", "/"));          
console.log(httpRequest("GET", "/about"));       
console.log(httpRequest("PUT", "/"));          
*/

// Automating the Tests by creating an "automateTests" Function: Generate a random integer 0 - max 
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Automate testing of the httpRequest function
function automateTests() {
    const testVerbs = ["GET", "POST"];
    const testPaths = ["/", "/about", "/contact", "/login", "/panel", "/logout", "/randomPath1", "/randomPath2"];
    
    // Generate and log a random request
    function randomRequest() {
        const randVerb = testVerbs[getRandomInt(testVerbs.length)];
        const randPath = testPaths[getRandomInt(testPaths.length)];
        console.log(httpRequest(randVerb, randPath));
    }
    
    // Repeat randomRequest function every 1 second = 1000 ms
    setInterval(randomRequest, 1000);
}

// Invoke the "automateTests" function
automateTests();