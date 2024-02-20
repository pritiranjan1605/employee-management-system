# Employee Management System

## Description
This Node.js application serves as a platform for user and admin management, notice posting, issue tracking, project submission, and more. It is built using Express.js for server-side routing, MongoDB for database management, and various middleware such as Multer for file uploads and JWT for authentication.

## Link to live application
[https://employeemanagement-o1v6.onrender.com](https://employeemanagement-o1v6.onrender.com)


## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Routes Overview](#routes-overview)
- [Contributing](#contributing)
- [License](#license)

## Installation
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Set up a MongoDB database and configure the connection string in `./config/database.js`.
5. Run the application using `npm start`.

## Usage
- The application provides separate routes for user and admin authentication, login, signup, and dashboard views.
- Users can raise issues, view notices, edit their details, and submit projects.
- Admins can manage users, view and post notices, and track issues.
- The application uses JWT tokens for user authentication and Multer for handling file uploads.

## Routes Overview
- **User Routes**:
  - `/usersignup`: User signup page.
  - `/userlogin`: User login page.
  - `/userdash`: User dashboard displaying notices and user details.
  - `/edituserdetailbyuser/:name`: Page for users to edit their details.
  - `/edituserdetail/:name`: Page for admins to edit user details.
  - `/deleteuser/:name`: Route for admins to delete user accounts.
  - `/adduser`: Page for admins to add new users.
  - `/raiseissue/:fname`: Page for users to raise issues.
  - `/displayissue`: Page for admins to view all issues.
  - `/submitproject`: Page for users to submit projects.
  - `/seepro`: Page for users to view submitted projects.
  - `/joinchatuser`: Page for users to join a chat room.
- **Admin Routes**:
  - `/adminlogin`: Admin login page.
  - `/adminsignup`: Admin signup page.
  - `/adminpage`: Admin dashboard displaying user management options.
  - `/edituserdetail/:name`: Page for admins to edit user details.
  - `/deleteuser/:name`: Route for admins to delete user accounts.
  - `/adduser`: Page for admins to add new users.
  - `/addnotice`: Page for admins to add notices.
  - `/postnotice`: Route for admins to post notices.
  - `/displayissue`: Page for admins to view all issues.
  - `/seepro`: Page for admins to view submitted projects.
  - `/joinchatadmin`: Page for admins to join a chat room.

## Contributing
Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
