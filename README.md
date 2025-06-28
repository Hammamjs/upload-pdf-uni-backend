# UOFB PROJECT

This is an open source project and the purpose of this project that built for computer science collage specially to store there files to restore it when they needed

### ⚔️ Built with

### **Core Tech**

- **Languages**: Nodejs
- **Framework**: Express
- **Datebase**: MongoDB **No-SQL**

### Key dependencies

| Libarary                 | Purpose                                                     |
| ------------------------ | ----------------------------------------------------------- |
| `axios`                  | HTTP Request                                                |
| `Express`                | Backend server                                              |
| `multer`                 | Upload files and imgs                                       |
| `bcrypt`                 | Hash the password                                           |
| `cheerio`                | Act like broswer to get data                                |
| `cookie-parser`          | Parse cookie to the server                                  |
| `cors`                   | Allow connect to the server from outer resource             |
| `express-async-handler`  | Fetch async erros                                           |
| `googleapi`              | Used to connect to google drive                             |
| `jsonwebtoken`           | Issue new token                                             |
| `mongoose`               | c\Connect to DB                                             |
| `express-mongo-sanitize` | Prevent **No-SQL injection**                                |
| `express-rate-limit`     | Limit acces from specific **IP** to prevent **Brute force** |
| `express-validator`      | Validate data before call the server                        |
| `nodemailer`             | Send **SMTP**                                               |
| `socket.io`              | Real time communication                                     |

## 🚦 API routes

| Protected | Mthods   | Endpoint                                  | Description                                                                                                  |
| --------- | -------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 🔓 ❌     | `GET`    | /api/v1/auth                              | Sign in                                                                                                      |
| 🔓 ❌     | `POST`   | /api/v1/auth/register                     | Create new account                                                                                           |
| 🔒 ✅     | `PUT`    | /api/v1/auth/update-password              | Update student password                                                                                      |
| 🔒 ✅     | `POST`   | /api/v1/auth/logout                       | Sign out                                                                                                     |
| 🔓 ❌     | `POST`   | /api/v1/auth/forgot-password              | Search for email if exist then send a reset code                                                             |
| 🔓 ❌     | `POST`   | /api/v1/auth/verify-code                  | Verify reset code if not invalid or expired                                                                  |
| 🔓 ❌     | `POST`   | /api/v1/auth/reset-password               | Reset password                                                                                               |
| 🔒 ✅     | `GET`    | /api/v1/file                              | Get All files                                                                                                |
| 🔒 ✅     | `POST`   | /api/v1/file                              | Upload new file this route is protected by authenticated and Specific role can get access **Limited access** |
| 🔒 ✅     | `DELETE` | /api/v1/file/:id                          | Delete specific file protected by authenticated and roles **Limited access**                                 |
| 🔒 ✅     | `GET`    | /api/v1/file/student-file                 | Get specific files for authenticated student                                                                 |
| 🔓 ❌     | `POST`   | /api/v1/students                          | Create new account                                                                                           |
| 🔒 ✅     | `GET`    | /api/v1/students                          | Get registered all students                                                                                  |
| 🔒 ✅     | `PUT`    | /api/v1/students                          | Update student role should be authenticated                                                                  |
| 🔒 ✅     | `GET`    | /api/v1/students/:name                    | Get specifc student protected by name **Limited access**                                                     |
| 🔒 ✅     | `PUT`    | /api/v1/students                          | Update student role should be authenticated                                                                  |
| 🔒 ✅     | `PUT`    | /api/v1/students/activate                 | Activate student account **Limited access**                                                                  |
| 🔒 ✅     | `PATCH`  | /api/v1/students/deactivateAccount        | Deactivate student account **Limited access**                                                                |
| 🔒 ✅     | `DELETE` | /api/v1/students/:id                      | Delete student account **Limited access**                                                                    |
| 🔒 ✅     | `GET`    | /api/v1/subjects                          | Get all subjects **Limited access**                                                                          |
| 🔒 ✅     | `POST`   | /api/v1/subjects                          | Create new subject **Limited access**                                                                        |
| 🔒 ✅     | `PUT`    | /api/v1/subjects                          | Update subject **Limited access**                                                                            |
| 🔒 ✅     | `DELETE` | /api/v1/subjects                          | Delete subject **Limited access**                                                                            |
| 🔒 ✅     | `DELETE` | /api/v1/subjects/:id                      | Delete subject by id **Limited access**                                                                      |
| 🔒 ✅     | `DELETE` | /api/v1/subjects                          | Delete subject **Limited access**                                                                            |
| 🔒 ✅     | `GET`    | /api/v1/results                           | This route fetch student result from an official university website For an authenticated student             |
| 🔒 ✅     | `GET`    | /api/v1/notifications                     | Get all notifications for specific student authentication needed                                             |
| 🔒 ✅     | `POST`   | /api/v1/notifications/read                | Mark all notifications as read authentication needed                                                         |
| 🔒 ✅     | `POST`   | /api/v1/notifications/update-notification | Mark one notification as read authentication needed                                                          |
