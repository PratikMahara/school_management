import {
  Box,
  Typography,
  Grid,
} from "@mui/material";

import { useState, useContext, useRef } from "react";
import { baseUrl } from "@/environment";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import ViewLeaveApplicationCard from "../../../components/view-leave-application-card/ViewLeaveApplicationCard";

export default function Syllabus() {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const fetchLeaveApplication = async ()=>{
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/teacher/leave-application`);
      console.log(response.data.data)
      setLeaveApplications(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching leave applications:", error);
      setMessage("Failed to fetch leave applications");
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    fetchLeaveApplication();
  }, [])

  return (
<Box sx={{ p: 3 }}>
  <Typography variant="h4" sx={{ textAlign: "center", fontWeight: 600, mb: 4 }}>
    Leave Applications
  </Typography>

  <Box>
    {!leaveApplications?.length ? (
      <Typography>No leave applications yet.</Typography>
    ) : (
      <Grid container spacing={2}>
        <ViewLeaveApplicationCard leaveApplications={leaveApplications} />
      </Grid>
    )}
  </Box>
</Box>

  );
}
