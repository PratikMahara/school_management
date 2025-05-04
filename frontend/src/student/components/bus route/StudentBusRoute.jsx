import { useEffect, useState, useContext } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { baseUrl } from "../../../environment";
import BusRouteCard from "@/components/bus-route-card/BusRouteCard";

const StudentBusRoute = () => {
  const [routes, setRoutes] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRoutes = () => {
      axios.get(`${baseUrl}/busRoute/fetch-all`)
        .then((resp) => {
          // console.log(resp)
          // console.log("Fetched routes", resp.data.data);
          setRoutes(resp.data.data);
        })
        .catch((e) => {
          console.error("Error fetching routes", e);
        });
    }
    fetchRoutes();
  }, []);

  return (<>
   
    <Box>
      <Typography sx={{margin:'auto', textAlign:"center"}} variant="h3">Bus Routes</Typography>
    
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Active Bus Routes
        </Typography>
        {!routes?.length ? (
          <Typography>No routes registered yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            {routes.map((route) => (
              <Grid item xs={12} md={6} key={route._id}>
                <BusRouteCard key={route._id} route={route} userRole={user.role} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
    </>
  );
};

export default StudentBusRoute;
