// import axios from "axios";
// import { useEffect, useState } from "react";
// import { baseUrl } from "../../../environment";
// import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
// import { convertDate } from "../../../utilityFunctions";

// export default function StudentExaminations(){
    
  
//     // const [classId, setClassId] = useState(null)
//     const [examinations, setExaminations] = useState([]);
//     const [classDetails, setClassDetails] = useState(null)
//     const fetchExaminations = (classId) => {
//       axios
//         .get(`${baseUrl}/examination/fetch-class/${classId}`)
//         .then((resp) => {
//           console.log("ALL Examination", resp);
//           setExaminations(resp.data.data);
//         })
//         .catch((e) => {
//           console.log("Error in fetching  Examinstions.");
//         });
//     };

//     const getStudentDetails = ()=>{
//       axios.get(`${baseUrl}/student/fetch-own`).then(resp=>{
//           fetchExaminations(resp.data.data.student_class._id);
//           setClassDetails({id:resp.data.data.student_class._id, class:resp.data.data.student_class.class_section})
//   console.log("student",  resp)
//       }).catch(e=>{
//           console.log("Error in student", e)
//       })
//   }

// useEffect(()=>{
//   getStudentDetails();
   
// },[])
//     return(
//         <>
        
//         <Typography
//                   sx={{ textAlign: "center" }}
//                   variant="h3"
//                 >
//                 Your Examinations [ Class: {classDetails && classDetails.class} ]
//                 </Typography>
//                 <TableContainer component={"div"}>
//                   <Table sx={{ minWidth: 250 }} aria-label="simple table">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: "700" }} align="left">
//                           Exam Date
//                         </TableCell>
//                         <TableCell sx={{ fontWeight: "700" }} align="left">
//                           Subject
//                         </TableCell>
//                         <TableCell sx={{ fontWeight: "700" }} align="center">
//                           Exam Type
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {examinations &&
//                         examinations.map((examination, i) => {
//                           return (
//                             <TableRow key={i}>
//                               <TableCell component="th" scope="row">
//                                 {convertDate(examination.examDate)}
//                               </TableCell>
//                               <TableCell align="left">
//                                 {examination.subject.subject_name}
//                               </TableCell>
//                               <TableCell align="center">
//                                 {examination.examType}
//                               </TableCell>
//                             </TableRow>
//                           );
//                         })}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
        
//         </>
//     )
// }




import { DashboardLayout } from "@/components/DashboardLayout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function StudentExamsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-orange-700 dark:text-orange-400">Exam Schedule</h1>
          <p className="text-muted-foreground">View your upcoming examinations and assessments.</p>
        </div>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader>
            <CardTitle>Mid-Term Examinations</CardTitle>
            <CardDescription>April 20 - April 28, 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-orange-200 dark:border-orange-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-500" />
                      Exam Period
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">April 20 - April 28, 2025</p>
                    <p className="text-sm text-muted-foreground">8 days duration</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 dark:border-orange-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-500" />
                      Exam Timing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">9:00 AM - 12:00 PM</p>
                    <p className="text-sm text-muted-foreground">3 hours per exam</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 dark:border-orange-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-500" />
                      Venue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">Main Examination Hall</p>
                    <p className="text-sm text-muted-foreground">Building B, 2nd Floor</p>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      date: "April 20, 2025",
                      day: "Monday",
                      subject: "Mathematics",
                      time: "9:00 AM - 12:00 PM",
                      status: "Upcoming",
                    },
                    {
                      date: "April 22, 2025",
                      day: "Wednesday",
                      subject: "Science",
                      time: "9:00 AM - 12:00 PM",
                      status: "Upcoming",
                    },
                    {
                      date: "April 24, 2025",
                      day: "Friday",
                      subject: "English",
                      time: "9:00 AM - 12:00 PM",
                      status: "Upcoming",
                    },
                    {
                      date: "April 26, 2025",
                      day: "Monday",
                      subject: "History",
                      time: "9:00 AM - 12:00 PM",
                      status: "Upcoming",
                    },
                    {
                      date: "April 28, 2025",
                      day: "Wednesday",
                      subject: "Computer Science",
                      time: "9:00 AM - 12:00 PM",
                      status: "Upcoming",
                    },
                  ].map((exam, index) => (
                    <TableRow key={index}>
                      <TableCell>{exam.date}</TableCell>
                      <TableCell>{exam.day}</TableCell>
                      <TableCell className="font-medium">{exam.subject}</TableCell>
                      <TableCell>{exam.time}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/30"
                        >
                          {exam.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div>
                <h3 className="text-lg font-medium mb-4">Important Instructions</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Students must arrive at the examination hall 30 minutes before the scheduled time.</li>
                  <li>Bring your student ID card and admit card to every examination.</li>
                  <li>Use of calculators is permitted only for Mathematics and Science exams.</li>
                  <li>Mobile phones and electronic devices are strictly prohibited in the examination hall.</li>
                  <li>Students found engaging in malpractice will face disciplinary action.</li>
                  <li>In case of illness, inform the class teacher and provide a medical certificate.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader>
            <CardTitle>Upcoming Assessments</CardTitle>
            <CardDescription>Other tests and quizzes scheduled for this term</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Assessment Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Topics</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    date: "April 12, 2025",
                    type: "Quiz",
                    subject: "Science",
                    topics: "Periodic Table, Chemical Bonding",
                  },
                  {
                    date: "April 14, 2025",
                    type: "Class Test",
                    subject: "Mathematics",
                    topics: "Trigonometry, Coordinate Geometry",
                  },
                  {
                    date: "April 16, 2025",
                    type: "Practical",
                    subject: "Computer Science",
                    topics: "Database Management, SQL Queries",
                  },
                ].map((assessment, index) => (
                  <TableRow key={index}>
                    <TableCell>{assessment.date}</TableCell>
                    <TableCell>{assessment.type}</TableCell>
                    <TableCell className="font-medium">{assessment.subject}</TableCell>
                    <TableCell>{assessment.topics}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
