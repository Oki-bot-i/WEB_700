/*********************************************************************************
 *  WEB700 – Assignment No 3
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 *  of this assignment has been copied manually or electronically from any other source 
 *  (including 3rd party web sites) or distributed to other students.
 *  Name: Dea Guxholli Student ID: 145699237 Date: 14/06/2024
 *********************************************************************************/
const express = require('express');
const path = require('path');
const collegeData = require('./modules/collegeData');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

// Route to serve the about page
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

// Route to serve the HTML demo page
app.get('/htmlDemo', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/htmlDemo.html'));
});

// Route to fetch all students or students by course
app.get('/students', (req, res) => {
  if (req.query.course) {
    collegeData.getStudentsByCourse(req.query.course)
      .then(data => {
        if (data.length === 0) {
          res.status(404).json({ message: "No students found for this course" });
        } else {
          res.json(data);
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Error fetching students by course", error: err });
      });
  } else {
    collegeData.getAllStudents()
      .then(data => {
        if (data.length === 0) {
          res.status(404).json({ message: "No students found" });
        } else {
          res.json(data);
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Error fetching all students", error: err });
      });
  }
});

// Route to fetch all TAs
app.get('/tas', (req, res) => {
  collegeData.getTAs()
    .then(data => {
      if (data.length === 0) {
        res.status(404).json({ message: "No TAs found" });
      } else {
        res.json(data);
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error fetching TAs", error: err });
    });
});

// Route to fetch all courses
app.get('/courses', (req, res) => {
  collegeData.getCourses()
    .then(data => {
      if (data.length === 0) {
        res.status(404).json({ message: "No courses found" });
      } else {
        res.json(data);
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error fetching courses", error: err });
    });
});

// Route to fetch a single student by student number
app.get('/student/:num', (req, res) => {
  collegeData.getStudentByNum(req.params.num)
    .then(data => {
      if (!data) {
        res.status(404).json({ message: "Student not found" });
      } else {
        res.json(data);
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error fetching student by number", error: err });
    });
});

// Handle 404 errors for undefined routes
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// Initialize collegeData module and start server
collegeData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server is listening on port ${HTTP_PORT}`);
    });
  })
  .catch(err => {
    console.error(`Error initializing collegeData: ${err.message}`);
  });