const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/collegeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Define the Student schema
const studentSchema = new mongoose.Schema({
  studentNum: {
    type: Number,
    unique: true,
    required: true
  },
  firstName: String,
  lastName: String,
  email: String,
  addressStreet: String,
  addressCity: String,
  addressProvince: String,
  TA: Boolean,
  status: String,
  course: Number // Assuming courseId is a number
});

// Define the Course schema
const courseSchema = new mongoose.Schema({
  courseId: {
    type: Number,
    unique: true,
    required: true
  },
  courseCode: String,
  courseDescription: String
});

// Create models
const Student = mongoose.model('Student', studentSchema);
const Course = mongoose.model('Course', courseSchema);

module.exports.initialize = function () {
  return Promise.resolve(); // No need to sync with MongoDB, connection is established in connect
};

module.exports.getAllStudents = function () {
  return Student.find().exec();
};

module.exports.getTAs = function () {
  return Student.find({ TA: true }).exec();
};

module.exports.getCourses = function () {
  return Course.find().exec();
};

module.exports.getCourseById = function (id) {
  return Course.findOne({ courseId: id }).exec();
};

module.exports.getStudentByNum = function (num) {
  return Student.findOne({ studentNum: num }).exec();
};

module.exports.getStudentsByCourse = function (course) {
  return Student.find({ course: course }).exec();
};

module.exports.addStudent = function (studentData) {
  const student = new Student(studentData);
  return student.save();
};

module.exports.updateStudent = function (studentData) {
  return Student.updateOne({ studentNum: studentData.studentNum }, studentData).exec();
};

module.exports.addCourse = function (courseData) {
  const course = new Course(courseData);
  return course.save();
};

module.exports.updateCourse = function (courseData) {
  return Course.updateOne({ courseId: courseData.courseId }, courseData).exec();
};

module.exports.deleteCourseById = function (id) {
  return Course.deleteOne({ courseId: id }).exec();
};

module.exports.deleteStudentByNum = function (num) {
  return Student.deleteOne({ studentNum: num }).exec();
};
