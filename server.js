/*********************************************************************************
 *  WEB700 – Assignment No 7
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 *  of this assignment has been copied manually or electronically from any other source 
 *  (including 3rd party web sites) or distributed to other students.
 *  Name: Dea Guxholli Student ID: 145699237 Date: 01/08/2024
 *********************************************************************************/
const express = require('express');
const path = require('path');
const collegeData = require('./modules/collegeData');
const exphbs = require('express-handlebars');

const app = express();

// Set up express-handlebars
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    navLink: function(url, options) {
      return '<li' +
        ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
        '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function(lvalue, rvalue, options) {
      if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
      return lvalue != rvalue ? (options.inverse ? options.inverse(this) : '') : (options.fn ? options.fn(this) : '');
    }
  }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to handle active routes
app.use((req, res, next) => {
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  next();
});

// Route to serve the home page
app.get('/', (req, res) => {
  res.render('home', { title: 'Home Page' });
});

// Route to serve the about page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Page' });
});

// Route to serve the HTML demo page
app.get('/htmlDemo', (req, res) => {
  res.render('htmlDemo', { title: 'HTML Demo Page' });
});

// Route to serve the add student form
app.get('/students/add', (req, res) => {
  collegeData.getCourses()
    .then(courses => {
      res.render('addStudent', { title: 'Add Student Page', courses: courses });
    })
    .catch(err => {
      console.error("Error fetching courses for add student:", err);
      res.render('addStudent', { title: 'Add Student Page', courses: [] });
    });
});

// Route to handle the form submission for adding a student
app.post('/students/add', (req, res) => {
  collegeData.addStudent(req.body)
    .then(() => {
      res.redirect('/students');
    })
    .catch(err => {
      console.error("Error adding student:", err);
      res.status(500).send("Unable to add student");
    });
});

// Route to handle the form submission for updating student information
app.post('/student/update', (req, res) => {
  collegeData.updateStudent(req.body)
    .then(() => {
      res.redirect('/students');
    })
    .catch(err => {
      console.error("Error updating student:", err);
      res.status(500).send("Unable to update student");
    });
});

// Route to serve the add course form
app.get('/courses/add', (req, res) => {
  res.render('addCourse', { title: 'Add Course Page' });
});

// Route to handle the form submission for adding a course
app.post('/courses/add', (req, res) => {
  collegeData.addCourse(req.body)
    .then(() => {
      res.redirect('/courses');
    })
    .catch(err => {
      console.error("Error adding course:", err);
      res.status(500).send("Unable to add course");
    });
});

// Route to handle the form submission for updating course information
app.post('/course/update', (req, res) => {
  collegeData.updateCourse(req.body)
    .then(() => {
      res.redirect('/courses');
    })
    .catch(err => {
      console.error("Error updating course:", err);
      res.status(500).send("Unable to update course");
    });
});

// Route to fetch all students or students by course
app.get('/students', (req, res) => {
  if (req.query.course) {
    collegeData.getStudentsByCourse(req.query.course)
      .then(data => {
        console.log("Students by course data:", data); // Debugging line
        if (data.length === 0) {
          res.render('students', { message: "No students found for this course" });
        } else {
          res.render('students', { students: data });
        }
      })
      .catch(err => {
        console.error("Error fetching students by course:", err);
        res.render('students', { message: "Error fetching students by course" });
      });
  } else {
    collegeData.getAllStudents()
      .then(data => {
        console.log("All students data:", data); // Debugging line
        if (data.length === 0) {
          res.render('students', { message: "No students found" });
        } else {
          res.render('students', { students: data });
        }
      })
      .catch(err => {
        console.error("Error fetching all students:", err);
        res.render('students', { message: "Error fetching all students" });
      });
  }
});

// Route to fetch all courses
app.get('/courses', (req, res) => {
  collegeData.getCourses()
    .then(data => {
      console.log("Courses data:", data); // Debugging line
      if (data.length === 0) {
        res.render('courses', { message: "No courses found" });
      } else {
        res.render('courses', { courses: data });
      }
    })
    .catch(err => {
      console.error("Error fetching courses:", err);
      res.render('courses', { message: "Error fetching courses" });
    });
});

// Route to fetch a single student by student number
app.get('/student/:studentNum', (req, res) => {
  let viewData = {};
  collegeData.getStudentByNum(req.params.studentNum)
    .then(student => {
      if (student) {
        viewData.student = student;
      } else {
        viewData.student = null;
      }
      return collegeData.getCourses();
    })
    .then(courses => {
      viewData.courses = courses;
      viewData.courses.forEach(course => {
        if (course.courseId == viewData.student.course) {
          course.selected = true;
        }
      });
      if (viewData.student === null) {
        res.status(404).send("Student not found");
      } else {
        res.render('studentDetail', { title: 'Student Detail Page', student: viewData.student, courses: viewData.courses });
      }
    })
    .catch(err => {
      console.error("Error fetching student or courses:", err);
      res.status(500).send("Unable to fetch student or courses");
    });
});

// Route to fetch all TAs
app.get('/tas', (req, res) => {
  collegeData.getTAs()
    .then(data => {
      console.log("TAs data:", data); // Debugging line
      if (data.length === 0) {
        res.render('tas', { message: "No TAs found" });
      } else {
        res.render('tas', { tas: data });
      }
    })
    .catch(err => {
      console.error("Error fetching TAs:", err);
      res.render('tas', { message: "Error fetching TAs" });
    });
});

// Route to delete a student by student number
app.get('/student/delete/:studentNum', (req, res) => {
  collegeData.deleteStudentByNum(req.params.studentNum)
    .then(() => {
      res.redirect('/students');
    })
    .catch(err => {
      console.error("Error deleting student:", err);
      res.status(500).send("Unable to delete student");
    });
});

// Route to delete a course by courseId
app.get('/course/delete/:courseId', (req, res) => {
  collegeData.deleteCourseById(req.params.courseId)
    .then(() => {
      res.redirect('/courses');
    })
    .catch(err => {
      console.error("Error deleting course:", err);
      res.status(500).send("Unable to delete course");
    });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});