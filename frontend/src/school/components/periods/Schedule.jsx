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
import ScheduleCard from "@/components/schedule card/ScheduleCard";

const validationSchema = Yup.object().shape({
  file: Yup.mixed()
    .required("A file is required")
    .test("fileSize", "File too large", value => {
      if (!value) return false; // no file selected
      return value.size <= 15 * 1024 * 1024; // 15MB limit (likey to remove this, added for future)
    })
    .test("fileType", "Unsupported file format", value => {
      if (!value) return false;
      return ["application/pdf", "image/jpeg", "image/png"].includes(value.type);
    }),
  class_num: Yup.number().required("Class number is required"),
  class_section: Yup.string().optional(),
});

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const cancelEdit = () => {
    setIsEdit(false);
    setEditId(null);
    Formik.resetForm();
  };

  const addImage = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      Formik.setFieldValue("file", selectedFile)
    }
  };


const handleEditSchedule = (schedule) => {
  setIsEdit(true);
  setEditId(schedule._id);
  
  Formik.setValues({
    file: schedule.file,
    class_num: schedule.class.class_num,
  });

  setImageUrl(schedule.file);
};


  const handleDeleteSchedule = (scheduleId) => {
    setIsLoading(true);
    axios
      .delete(`${baseUrl}/period/delete/${scheduleId}`)
      .then((resp) => {
        setMessage(resp.data.message);
        setType("success");
        fetchSchedule();
      })
      .catch((e) => {
        setMessage(e);
        setType("error");
        console.log("Error deleting schedule", e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const fetchSchedule = () => {
    axios.get(`${baseUrl}/period/fetch-all`)
      .then((resp) => {
        // console.log("Fetched schedule", resp.data.data);
        setSchedule(resp.data.data);
      })
      .catch((e) => {
        console.log("Error fetching schedule", e);
      });
  }

  // show the section of the class after the user selects the class (fetch the sections of the class from the backend on the go.) maybe later

  const fetchClass = async () => {
    try {
      const resp = await axios.get(`${baseUrl}/class/fetch-all`);
      // console.log("Fetched class", resp.data.data);
  
      const allClasses = resp.data.data.map((singleClass) => singleClass.class_section);
      setSubjects(allClasses);
  
      // console.log("filterKeys:", allClasses);
    } catch (e) {
      console.error("Error fetching classes", e);
    }
  };

  useEffect(() => {
    fetchSchedule();
    fetchClass();
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
      class_num: 1,
      class_section: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (isEdit) {
        const fd = new FormData();
        fd.append("class_num", values.class_num);  // 👈 watch the field name, match what server expects
        if (file) {
          fd.append("file", file); // 👈 file field, not fileUrl
        }

        axios
          .patch(`${baseUrl}/period/update/${editId}`, fd)
          .then((resp) => {
            setMessage(resp.data.message);
            setType("success");
            handleClearFile();
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
          });
      } else {
        if (file) {
          const fd = new FormData();
          fd.append("image", file, file.name);
          Object.keys(values).forEach((key) => fd.append(key, values[key]));

          axios
            .post(`${baseUrl}/period/upload`, fd)
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
      }
    },
  });



  return (
<Box sx={{ p: 3 }}>
  <Typography variant="h4" sx={{ textAlign: "center", fontWeight: 600, mb: 4 }}>
    schedule
  </Typography>

  <Paper sx={{ p: 4, maxWidth: "800px", mx: "auto", mb: 6 }}>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
      <DirectionsBusFilled sx={{ mr: 1, verticalAlign: "middle", color: "orange" }} />
      {isEdit ? "Edit schedule" : "Upload New schedule"}
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

        {/* Class select dropdown */}
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            name="class_num"
            label="Class"
            value={Formik.values.class_num}
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            error={Formik.touched.class_num && Boolean(Formik.errors.class_num)}
            helperText={Formik.touched.class_num && Formik.errors.class_num}
          >
            {[...Array(10)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                Class {i + 1}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* section select dropdown */}
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            name="class_section"
            label="Section"
            value={Formik.values.class_section}
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            error={Formik.touched.class_section && Boolean(Formik.errors.class_section)}
            helperText={Formik.touched.class_section && Formik.errors.class_section}
          >
            {subjects.map((subject_name, i) => (
              <MenuItem key={i} value={subject_name}>
                {subject_name}
              </MenuItem>
            ))}
          </TextField>
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
          {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Upload schedule"}
        </Button>

        {isEdit && (
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              setIsEdit(false);
              setEditId(null);
              Formik.resetForm();
            }}
          >
            Cancel
          </Button>
        )}
      </Box>
    </form>
  </Paper>

  <Box>
    <Typography variant="h5" sx={{ mb: 2 }}>
      Uploaded schedule
    </Typography>
    {!schedule?.length ? (
      <Typography>No schedule uploaded yet.</Typography>
    ) : (
      <Grid container spacing={2}>

        <ScheduleCard
          schedule={schedule}
          onEdit={handleEditSchedule}
          onDelete={handleDeleteSchedule}
          userRole={user.role}
        />

      </Grid>
    )}
  </Box>
</Box>

  );
}
