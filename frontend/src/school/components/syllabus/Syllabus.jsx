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
import SyllabusCard from "@/components/syllabus card/SyllabusCard";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
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
});



export default function Syllabus() {
  const [syllabus, setSyllabus] = useState([]);
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


const handleEditSyllabus = (syllabus) => {
  setIsEdit(true);
  setEditId(syllabus._id);
  
  Formik.setValues({
    title: syllabus.title,
    description: syllabus.description,
    file: syllabus.file,
    class_num: syllabus.class.class_num,
  });

  setImageUrl(syllabus.file);
};


  const handleDeleteSyllabus = (syllabusId) => {
    setIsLoading(true);
    axios
      .delete(`${baseUrl}/syllabus/delete/${syllabusId}`)
      .then((resp) => {
        setMessage(resp.data.message);
        setType("success");
        fetchsyllabus();
      })
      .catch((e) => {
        setMessage(e);
        setType("error");
        console.log("Error deleting syllabus", e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const fetchsyllabus = () => {
    axios.get(`${baseUrl}/syllabus/fetch-all`)
      .then((resp) => {
        console.log("Fetched syllabus", resp.data.data);
        setSyllabus(resp.data.data);
      })
      .catch((e) => {
        console.log("Error fetching syllabus", e);
      });
  }

  useEffect(() => {
    fetchsyllabus();
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
      title: "",
      description: "",
      file: null,
      class_num: 1,
    },
    validationSchema,
    onSubmit: (values) => {
      if (isEdit) {
        const fd = new FormData();
        fd.append("title", values.title);
        fd.append("description", values.description);
        fd.append("class_num", values.class_num);
        if (file) {
          fd.append("file", file); // 👈 file field, not fileUrl
        }

        axios
          .patch(`${baseUrl}/syllabus/update/${editId}`, fd)
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
            .post(`${baseUrl}/syllabus/upload`, fd)
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
    Syllabus
  </Typography>

  <Paper sx={{ p: 4, maxWidth: "800px", mx: "auto", mb: 6 }}>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
      <DirectionsBusFilled sx={{ mr: 1, verticalAlign: "middle", color: "orange" }} />
      {isEdit ? "Edit Syllabus" : "Upload New Syllabus"}
    </Typography>

    <form onSubmit={Formik.handleSubmit}>
      <Grid container spacing={2}>
        {["title", "description"].map((field) => (
          <Grid item xs={12} md={6} key={field}>
            <TextField
              fullWidth
              name={field}
              label={field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
              value={Formik.values[field]}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              error={Formik.touched[field] && Boolean(Formik.errors[field])}
              helperText={Formik.touched[field] && Formik.errors[field]}
            />
          </Grid>
        ))}

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
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Upload Syllabus"}
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
      Uploaded Syllabus
    </Typography>
    {!syllabus?.length ? (
      <Typography>No syllabus uploaded yet.</Typography>
    ) : (
      <Grid container spacing={2}>

        <SyllabusCard
          syllabus={syllabus}
          onEdit={handleEditSyllabus}
          onDelete={handleDeleteSyllabus}
          userRole={user.role}
        />

      </Grid>
    )}
  </Box>
</Box>

  );
}
