import CalendarCard from "@/components/calendar-card/CalendarCard";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { baseUrl } from "@/environment"
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";

const ViewCalendar = () => {
    const [calendarState, setCalendarState] = useState({});
    const { user } = useContext(AuthContext);

    const handleDeleteCalendar = (calendarId) => {
        setIsLoading(true);
        axios
            .delete(`${baseUrl}/calendar/delete/${calendarId}`)
            .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            fetchCalendar();
            })
            .catch((e) => {
            setMessage(e);
            setType("error");
            console.error("Error deleting calendar", e);
            })
            .finally(() => {
            setIsLoading(false);
            });
    }

    const fetchCalendar = async () => {
        try {
        const response = await axios.get(`${baseUrl}/calendar/fetch-calendar`);
        setCalendarState(response.data.data);
        } catch (error) {
        console.error("Error fetching calendar", error);
        setMessage("Failed to fetch calendar.");
        setType("error");
        }
    }

    useEffect(() => {
        fetchCalendar();
    }, []);

    return (
        <div>
            <Box>
                <Typography variant="h5" sx={{ mb: 2 }}>
                Uploaded Calendar
                </Typography>
                {!calendarState || !calendarState.file ? (
                <Typography>No calendar uploaded.</Typography>
                ) : (
                <Grid container spacing={2}>

                    <CalendarCard
                    calendar={calendarState}
                    onDelete={handleDeleteCalendar}
                    userRole={user.role}
                    />

                </Grid>
                )}
            </Box>
        </div>
    );
};

export default ViewCalendar;