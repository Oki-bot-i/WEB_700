/*********************************************************************************
* WEB700 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Dea Guxholli Student ID: 145699237 Date: 01/06/2024
*
********************************************************************************/
// Require module 
const collegeData = require('./modules/collegeData');
// Invoke Initialize function
collegeData.initialize().then(() => {
    //console.log("Initialization successful");

    // Get all students
    collegeData.getAllStudents().then(students => {
        console.log(`Successfully retrieved ${students.length} students`);
    }).catch(err => {
        console.log(err);
    });

    // Get all courses
    collegeData.getCourses().then(courses => {
        console.log(`Successfully retrieved ${courses.length} courses`);
    }).catch(err => {
        console.log(err);
    });

    // Get all TAs
    collegeData.getTAs().then(TAs => {
        console.log(`Successfully retrieved ${TAs.length} TAs`);
    }).catch(err => {
        console.log(err);
    });

}).catch(err => {
    console.log(err);
});