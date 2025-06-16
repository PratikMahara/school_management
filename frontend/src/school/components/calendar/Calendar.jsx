import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { useState, useContext, useRef } from "react";
import { baseUrl } from "@/environment";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { DirectionsBusFilled } from "@mui/icons-material";
import * as Yup from "yup";
import CalendarCard from "@/components/calendar-card/CalendarCard";

const validationSchema = Yup.object().shape({
  file: Yup.mixed()
    .required("A file is required")
    .test("fileSize", "File too large", value => {
      if (!value) return false;
      return value.size <= 15 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", value => {
      if (!value) return false;
      return ["application/pdf", "image/jpeg", "image/png"].includes(value.type);
    }),
});



export default function Calendar() {
  const [calendarState, setCalendarState] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const addImage = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      Formik.setFieldValue("file", selectedFile)
    }
  };


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
      // console.log("Fetched calendar response", response);
      // console.log("Fetched calendar", response.data.data);
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

  //   CLEARING IMAGE FILE REFENCE FROM INPUT
  const fileInputRef = useRef(null);
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
    setFile(null); // Reset the file state
    setImageUrl(null); // Clear the image preview
  };

  const Formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema,
    onSubmit: (values) => {
      if (file) {
        const fd = new FormData();
        fd.append("file", file, file.name);
        Object.keys(values).forEach((key) => fd.append(key, values[key]));

        axios
          .post(`${baseUrl}/calendar/upload`, fd)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            Formik.resetForm();
            handleClearFile();
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
          });
      } else {
        setMessage("Please provide an image.");
        setType("error");
      }
    },
  });



  return (
<Box sx={{ p: 3 }}>
  <Typography variant="h4" sx={{ textAlign: "center", fontWeight: 600, mb: 4 }}>
    Calendar
  </Typography>

  <Paper sx={{ p: 4, maxWidth: "800px", mx: "auto", mb: 6 }}>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
      <DirectionsBusFilled sx={{ mr: 1, verticalAlign: "middle", color: "orange" }} />
      {"Upload New Calendar"}
    </Typography>

    <form onSubmit={Formik.handleSubmit}>
      <Grid container spacing={2}>

        <Grid item xs={12} md={6}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
          >
            Upload File
            <input
              type="file"
              hidden
              accept="image/*,.pdf"
              onChange={addImage}
              ref={fileInputRef}
            />
          </Button>
          {Formik.touched.file && Formik.errors.file && (
            <Typography variant="caption" color="error">
              {Formik.errors.file}
            </Typography>
          )}
        </Grid>

      </Grid>

      <Box sx={{ mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Upload Calendar"}
        </Button>

      </Box>
    </form>
  </Paper>

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
</Box>

  );
}
