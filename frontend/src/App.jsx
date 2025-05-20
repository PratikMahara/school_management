import("./css/button.css");
import("./css/text.css");

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Client from "./client/Client";
import Home from "./client/components/home/Home";
import Contact from "./client/components/contact/Contact";
import Login from "./client/components/login/Login";
import Register from "./client/components/register/Register";

import Logout from "./client/components/logout/Logout";
import School from "./school/School";
import SchoolDashboard from "./school/components/dashboard/SchoolDashboard";
import Class from "./school/components/class/Class";
import Students from "./school/components/students/Students";
import Teachers from "./school/components/teachers/Teachers";
import Subject from "./school/components/subjects/Subjects";
import ClassDetails from "./school/components/class details/ClassDetails";
import StudentDetails from "./student/components/student details/StudentDetails";
import Student from "./student/Student";
import StudentExaminations from "./student/components/examination/StudentExaminations";
import Teacher from "./teacher/Teacher";
import TeacherDetails from "./teacher/components/teacher details/TeacherDetails";
import TeacherExaminations from "./teacher/components/teacher examinations/TeacherExaminations";
import TeacherSchedule from "./teacher/components/periods/TeacherSchedule";
import AssignPeriod2 from "./school/components/assign period/AssignPeriod2";
import AttendanceDetails from "./school/components/attendance/attendance details/AttendanceDetails";
import StudentAttendanceList from "./school/components/attendance/StudentAttendanceList";
import Schedule from "./school/components/periods/Schedule";
import Examinations from "./school/components/examinations/Examinations";
import AttendanceTeacher from "./teacher/components/attendance/AttendanceTeacher";
import AttendanceStudent from "./student/components/attendance/AttendanceStudent";
import ScheduleStudent from "./student/components/schedule/ScheduleStudent";
import NoticeSchool from "./school/components/notice/NoticeSchool";
import NoticeTeacher from "./teacher/components/notice/Notice";
import NoticeStudent from "./student/components/notice/NoticeStudent";
import ResultUpload from "./teacher/components/Results/Resultupload.jsx";
import ProtectedRoute from "./guards/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import { ThemeProvider } from "@emotion/react";
import darkTheme from "./basic utility components/darkTheme";
import lightTheme from "./basic utility components/lightTheme";
import { useContext } from "react";
import BusRoute from "./school/components/bus route/BusRoute";
import StudentBusRoute from "./student/components/bus route/StudentBusRoute";
import Syllabus from "./school/components/syllabus/Syllabus";
import StudentSyllabus from "./student/components/syllabus/StudentSyllabus";
import Books from "./school/components/books/Books";
import StudentBooks from "./student/components/books/StudentBooks";
import Entrance from "./client/components/entrance/entrance";
import { Result } from "./student/components/result/result.jsx";
import StudentFeeDue from "./student/components/fee/fee.jsx";
import StudentLeaveApplication from "./student/components/leaveAppliction/LeaveApplication.jsx";
import TransferCertificate from "./school/components/certificate/certificate.jsx";

function App() {
  const { themeDark } = useContext(AuthContext);

  const appStyle = {
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: themeDark ? "#1a1a1a" : "#f9f9f9",
    color: themeDark ? "#e0e0e0" : "#222",
    minHeight: "100vh",
    padding: "10px 20px",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <ThemeProvider theme={themeDark ? darkTheme : lightTheme}>
      <div style={appStyle}>
        <BrowserRouter>
          <Routes>
            <Route
              path="school"
              element={
                <ProtectedRoute allowedRoles={["SCHOOL"]}>
                  <School />
                </ProtectedRoute>
              }
            >
              <Route index element={<SchoolDashboard />} />
              <Route path="class" element={<Class />} />
              <Route path="class-details" element={<ClassDetails />} />
              <Route path="subject" element={<Subject />} />
              <Route path="students" element={<Students />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="assign-period" element={<AssignPeriod2 />} />
              <Route path="periods" element={<Schedule />} />
              <Route path="attendance" element={<StudentAttendanceList />} />
              <Route
                path="attendance-student/:studentId"
                element={<AttendanceDetails />}
              />
              <Route path="examinations" element={<Examinations />} />
              <Route path="notice" element={<NoticeSchool />} />
              <Route path="busRoute" element={<BusRoute />} />
              <Route path="syllabus" element={<Syllabus />} />
              <Route path="books" element={<Books />} />
              <Route path="certificate" element={<TransferCertificate />} />

            </Route>

            <Route
              path="student"
              element={
                <ProtectedRoute allowedRoles={["STUDENT"]}>
                  <Student />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDetails />} />
              <Route path="student-details" element={<StudentDetails />} />
              <Route path="examinations" element={<StudentExaminations />} />
              <Route path="periods" element={<ScheduleStudent />} />
              <Route path="attendance" element={<AttendanceStudent />} />
              <Route path="notice" element={<NoticeStudent />} />
              <Route path="busRoute" element={<StudentBusRoute />} />
              <Route path="syllabus" element={<StudentSyllabus />} />
              <Route path="books" element={<StudentBooks />} />
              <Route path="fee" element={<StudentFeeDue />} />
              <Route path="leaveapplication" element={<StudentLeaveApplication />} />


            </Route>

            <Route
              path="teacher"
              element={
                <ProtectedRoute allowedRoles={["TEACHER"]}>
                  <Teacher />
                </ProtectedRoute>
              }
            >
              <Route index element={<TeacherDetails />} />
              <Route path="details" element={<TeacherDetails />} />
              <Route path="examinations" element={<TeacherExaminations />} />
              <Route path="periods" element={<TeacherSchedule />} />
              <Route path="attendance" element={<AttendanceTeacher />} />
              <Route path="notice" element={<NoticeTeacher />} />
              <Route path="busRoute" element={<StudentBusRoute />} />
              <Route path="syllabus" element={<StudentSyllabus />} />
              <Route path="books" element={<StudentBooks />} />
              <Route path="resultupload" element={<ResultUpload />} />

            </Route>

            <Route path="/" element={<Client />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="logout" element={<Logout />} />
              <Route path="entrance" element={<Entrance />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
