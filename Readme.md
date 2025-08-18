# LMS API Documentation

This documentation outlines the available endpoints, request parameters, and expected responses for the Learning Management System (LMS) API.

## Authentication API

This section covers the endpoint for user authentication.

### POST /api/v1/auth/login

Authenticates a user and returns a JSON Web Token (JWT).

**Request Body:**

| Parameter | Type   | Required | Description                |
| :-------- | :----- | :------- | :------------------------- |
| `email`   | string | Yes      | The user's email address.  |
| `password`| string | Yes      | The user's password.       |

**Responses:**

- **200 OK:** Successful login.
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

- **400 Bad Request:** Email or password not provided.
  ```json
  {
    "error": "Email and password are required."
  }
  ```

- **401 Unauthorized:** Invalid credentials.
  ```json
  {
    "error": "Invalid credentials."
  }
  ```

- **500 Internal Server Error:** Server-side error during login.
  ```json
  {
    "error": "Login failed."
  }
  ```

## Admin API

These endpoints are protected and require an Admin role. A valid JWT must be included in the `Authorization` header as a `Bearer` token.

### Course Management

#### GET /api/v1/admin/courses

Retrieves a list of all courses.

**Responses:**

- **200 OK:** Returns an array of course objects.
- **500 Internal Server Error:** Error fetching courses.

#### GET /api/v1/admin/courses/:courseId

Retrieves a single course by its ID, including its modules.

**URL Parameters:**

| Parameter  | Type   | Description           |
| :--------- | :----- | :-------------------- |
| `courseId` | string | The ID of the course. |

**Responses:**

- **200 OK:** Returns the course object.
- **404 Not Found:** Course with the specified ID does not exist.
- **500 Internal Server Error:** Error fetching the course.

#### POST /api/v1/admin/courses

Creates a new course.

**Request Body:**

| Parameter     | Type   | Required | Description                 |
| :------------ | :----- | :------- | :-------------------------- |
| `title`       | string | Yes      | The title of the course.    |
| `description` | string | No       | A description of the course.|

**Responses:**

- **201 Created:** Returns the newly created course object.
- **400 Bad Request:** Title is missing.
- **500 Internal Server Error:** Error creating the course.

#### PUT /api/v1/admin/courses/:courseId

Updates an existing course.

**URL Parameters:**

| Parameter  | Type   | Description                   |
| :--------- | :----- | :---------------------------- |
| `courseId` | string | The ID of the course to update. |

**Request Body:**

| Parameter     | Type   | Required | Description                     |
| :------------ | :----- | :------- | :------------------------------ |
| `title`       | string | No       | The new title for the course.   |
| `description` | string | No       | The new description for the course. |

**Responses:**

- **200 OK:** Returns the updated course object.
- **400 Bad Request:** No update data provided.
- **404 Not Found:** Course not found.
- **500 Internal Server Error:** Error updating the course.

#### DELETE /api/v1/admin/courses/:courseId

Deletes a course.

**URL Parameters:**

| Parameter  | Type   | Description                   |
| :--------- | :----- | :---------------------------- |
| `courseId` | string | The ID of the course to delete. |

**Responses:**

- **204 No Content:** The course was deleted successfully.
- **404 Not Found:** Course not found.
- **500 Internal Server Error:** Error deleting the course.

### Module Management

#### POST /api/v1/admin/courses/:courseId/modules

Creates a new module for a specific course.

**URL Parameters:**

| Parameter  | Type   | Description                         |
| :--------- | :----- | :---------------------------------- |
| `courseId` | string | The ID of the course to add the module to. |

**Request Body:**

| Parameter     | Type   | Required | Description                           |
| :------------ | :----- | :------- | :------------------------------------ |
| `title`       | string | Yes      | The title of the module.              |
| `description` | string | No       | A description of the module.          |
| `videoUrl`    | string | Yes      | The URL for the module's video content. |

**Responses:**

- **201 Created:** Returns the newly created module object.
- **400 Bad Request:** Required fields are missing.
- **404 Not Found:** The specified course does not exist.
- **500 Internal Server Error:** Error creating the module.

#### PUT /api/v1/admin/modules/:moduleId

Updates an existing module.

**URL Parameters:**

| Parameter  | Type   | Description                   |
| :--------- | :----- | :---------------------------- |
| `moduleId` | string | The ID of the module to update. |

**Request Body:**

| Parameter     | Type   | Required | Description                       |
| :------------ | :----- | :------- | :-------------------------------- |
| `title`       | string | No       | The new title for the module.     |
| `description` | string | No       | The new description for the module. |
| `videoUrl`    | string | No       | The new video URL for the module. |

**Responses:**

- **200 OK:** Returns the updated module object.
- **400 Bad Request:** No update data provided.
- **404 Not Found:** Module not found.
- **500 Internal Server Error:** Error updating the module.

#### DELETE /api/v1/admin/modules/:moduleId

Deletes a module.

**URL Parameters:**

| Parameter  | Type   | Description                   |
| :--------- | :----- | :---------------------------- |
| `moduleId` | string | The ID of the module to delete. |

**Responses:**

- **204 No Content:** The module was deleted successfully.
- **404 Not Found:** Module not found.
- **500 Internal Server Error:** Error deleting the module.

### Student Management

#### GET /api/v1/admin/students

Retrieves a list of all students.

**Responses:**

- **200 OK:** Returns an array of student objects.
- **500 Internal Server Error:** Error fetching students.

#### GET /api/v1/admin/students/:studentId

Retrieves a single student by their ID.

**URL Parameters:**

| Parameter   | Type   | Description             |
| :---------- | :----- | :---------------------- |
| `studentId` | string | The ID of the student.  |

**Responses:**

- **200 OK:** Returns the student object.
- **404 Not Found:** Student not found.
- **500 Internal Server Error:** Error fetching the student.

#### POST /api/v1/admin/students

Creates a new student and enrolls them in courses.

**Request Body:**

| Parameter   | Type             | Required | Description                                     |
| :---------- | :--------------- | :------- | :---------------------------------------------- |
| `email`     | string           | Yes      | The student's email.                            |
| `password`  | string           | Yes      | The student's password.                         |
| `courseIds` | array of strings | Yes      | An array of course IDs to enroll the student in. |

**Responses:**

- **201 Created:** Returns the new student object.
- **400 Bad Request:** Missing required fields or invalid course IDs.
- **409 Conflict:** A user with this email already exists.
- **500 Internal Server Error:** Error creating the student.

#### PUT /api/v1/admin/students/:studentId

Updates a student's course enrollments.

**URL Parameters:**

| Parameter   | Type   | Description                      |
| :---------- | :----- | :------------------------------- |
| `studentId` | string | The ID of the student to update. |

**Request Body:**

| Parameter   | Type             | Required | Description                                |
| :---------- | :--------------- | :------- | :----------------------------------------- |
| `courseIds` | array of strings | Yes      | The new array of course IDs for the student. |

**Responses:**

- **200 OK:** Returns the updated student object.
- **400 Bad Request:** `courseIds` is not an array.
- **404 Not Found:** Student or a specified course not found.
- **500 Internal Server Error:** Error updating the student.

#### DELETE /api/v1/admin/students/:studentId

Deletes a student.

**URL Parameters:**

| Parameter   | Type   | Description                     |
| :---------- | :----- | :------------------------------ |
| `studentId` | string | The ID of the student to delete. |

**Responses:**

- **204 No Content:** The student was deleted successfully.
- **404 Not Found:** Student not found.
- **500 Internal Server Error:** Error deleting the student.

## Student API

These endpoints are protected and require a Student role. A valid JWT must be included in the `Authorization` header as a `Bearer` token.

### GET /api/v1/student/courses

Retrieves all courses the authenticated student is enrolled in.

**Responses:**

- **200 OK:** Returns an array of the student's enrolled courses.
- **404 Not Found:** Student not found.
- **500 Internal Server Error:** Error fetching courses.

### GET /api/v1/student/courses/:courseId

Retrieves a specific course by ID that the authenticated student is enrolled in, including its modules.

**URL Parameters:**

| Parameter  | Type   | Description           |
| :--------- | :----- | :-------------------- |
| `courseId` | string | The ID of the course. |

**Responses:**

- **200 OK:** Returns the course object with modules.
- **403 Forbidden:** The student is not enrolled in this course.
- **500 Internal Server Error:** Error fetching the course.
