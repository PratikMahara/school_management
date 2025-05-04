import { useEffect, useState, useContext } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { baseUrl } from "../../../environment";
import SyllabusCard from "@/components/syllabus card/SyllabusCard";

const StudentSyllabus = () => {
  const [syllabus, setSyllabus] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchsyllabus = () => {
      axios.get(`${baseUrl}/syllabus/fetch-all`)
        .then((resp) => {
          console.log(resp)
          console.log("Fetched syllabus", resp.data.data);
          setSyllabus(resp.data.data);
        })
        .catch((e) => {
          console.error("Error fetching syllabus", e);
        });
    }
    fetchsyllabus();
  }, []);

  return (<>
   
    <Box>
      <Typography sx={{margin:'auto', textAlign:"center"}} variant="h3">syllabus</Typography>
    
      <Box>
        {!syllabus?.length ? (
          <Typography>No syllabus registered yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            {/* {syllabus.map((syllabi) => ( */}
              <Grid item xs={12} md={6}>
                <SyllabusCard syllabus={syllabus} userRole={user.role} />
              </Grid>
            {/* ))} */}
          </Grid>
        )}
      </Box>
    </Box>
    </>
  );
};

export default StudentSyllabus;
