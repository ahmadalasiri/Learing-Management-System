# Learning Management System (LMS) Project 

## Internet Application Course (IS 345) (FCIA-Helwan University - Spring 2023)

## Technologies Used
- Node.js
- Express.js
- MySQL
- JavaScript

## Installation
1. Clone the repository: `git clone https://github.com/your-repo.git`
2. Install dependencies: `npm install`
5. Start the server: `npm start`

## Usage

### Administrator
- Access the admin routes by logging in as an admin user.
- Manage courses: create, update, and delete courses.
- Manage users: create, update, and delete users.
- Assign instructors to courses.

### Instructor
- Access the instructor routes by logging in as an instructor user.
- View enrolled students in a specific course.
- Set grades for students in a specific course.

### Student
- Access the student routes by logging in as a student user.
- View available courses.
- Register for a course.
- View grades for enrolled courses.

## API Endpoints
### Admin Routes
- GET /admin/courses: Get all courses.
- POST /admin/courses: Create a new course.
- GET /admin/courses/:id: Get a specific course.
- PUT /admin/courses/:id: Update a specific course.
- DELETE /admin/courses/:id: Delete a specific course.
- GET /admin/users: Get all users.
- POST /admin/users: Create a new user.
- GET /admin/users/:id: Get a specific user.
- PUT /admin/users/:id: Update a specific user.
- DELETE /admin/users/:id: Delete a specific user.
- GET /admin/students: Get all students.
- GET /admin/instructors: Get all instructors.
- POST /admin/courses/:courseId/assign: Assign an instructor to a course.

### Instructor Routes
- GET /instructor/courses/:courseId/students: Get all students enrolled in a specific course.
- GET /instructor/courses: Get all courses.
- POST /instructor/courses/:courseId/students/:studentId/grades: Set grades for a student in a specific course.

### Student Routes
- GET /student/courses: Get all available courses.
- GET /student/grades: Get grades for enrolled courses.
- POST /student/courses/:courseId/register: Register for a course.

## Conclusion
This documentation provides an overview of the LMS project, including installation instructions, usage guidelines, and API endpoints for different user roles. Feel free to explore the codebase and customize it according to your requirements.
