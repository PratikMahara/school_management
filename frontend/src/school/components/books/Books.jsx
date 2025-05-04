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
  import BooksCard from "@/components/books card/booksCard";
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Title is required"),
    publication: Yup.string().required("Description is required"),
    class_num: Yup.number().required("Class number is required"),
    subject_name: Yup.string().required("Subject is required"),
  });
  
  
  
  export default function Books() {
    const [books, setBooks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    // const [imageUrl, setImageUrl] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
  
    const cancelEdit = () => {
      setIsEdit(false);
      setEditId(null);
      Formik.resetForm();
    };
  
    // const addImage = (event) => {
    //   const selectedFile = event.target.files[0];
    //   if (selectedFile) {
    //     setFile(selectedFile);
    //     setImageUrl(URL.createObjectURL(selectedFile));
    //     Formik.setFieldValue("file", selectedFile)
    //   }
    // };
  
  
  const handleEditBooks = (books) => {
    setIsEdit(true);
    setEditId(books._id);

    console.log("onedit: book info:", books)
    
    Formik.setValues({
      name: books.name,
      publication: books.publication,
      class_num: books.class.class_num,
      subject_name: books.subject.subject_name
    });
  };
  
  
    const handleDeleteBooks = (booksId) => {
      setIsLoading(true);
      axios
        .delete(`${baseUrl}/books/delete/${booksId}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
          fetchBooks();
        })
        .catch((e) => {
          setMessage(e);
          setType("error");
          console.error("Error deleting books", e);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  
    const fetchBooks = () => {
      axios.get(`${baseUrl}/books/fetch-all`)
        .then((resp) => {
          console.log("Fetched books", resp.data.data);
          setBooks(resp.data.data);
        })
        .catch((e) => {
          console.error("Error fetching books", e);
        });
    }

    const fetchSubjects = async () => {
        try {
          const resp = await axios.get(`${baseUrl}/subject/fetch-all`);
          console.log("Fetched subjects", resp.data.data);
      
          const subjectNames = resp.data.data.map((item) => item.subject_name);
          setSubjects(subjectNames);
      
          console.log("filterKeys:", subjectNames);
        } catch (e) {
          console.error("Error fetching subjects", e);
        }
      };
      

    useEffect(() => {
        fetchBooks();
        fetchSubjects();
    }, []);
  
    // //   CLEARING IMAGE FILE REFENCE FROM INPUT
    // const fileInputRef = useRef(null);
    // const handleClearFile = () => {
    //   if (fileInputRef.current) {
    //     fileInputRef.current.value = ""; // Clear the file input
    //   }
    //   setFile(null); // Reset the file state
    //   setImageUrl(null); // Clear the image preview
    // };
  
    const Formik = useFormik({
      initialValues: {
        name: "",
        publication: "",
        class_num: 1,
        subject_name: "",
      },
      validationSchema,
      onSubmit: (values) => {
        if (isEdit) {
            const fd = new FormData();
            fd.append("name", values.name);
            fd.append("publication", values.publication);
            fd.append("subject_name", values.subject_name);
          axios
            .patch(`${baseUrl}/books/update/${editId}`, values)
            .then((resp) => {
              setMessage(resp.data.message);
              setType("success");
              cancelEdit();
            })
            .catch((e) => {
              setMessage(e.response.data.message);
              setType("error");
            });
        } else {
            axios
              .post(`${baseUrl}/books/upload`, values)
              .then((resp) => {
                setMessage(resp.data.message);
                setType("success");
                Formik.resetForm();
              })
              .catch((e) => {
                setMessage(e.response.data.message);
                setType("error");
              });
          }
        }
    });

    return (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" sx={{ textAlign: "center", fontWeight: 600, mb: 4 }}>
      Books
    </Typography>
  
    <Paper sx={{ p: 4, maxWidth: "800px", mx: "auto", mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
        <DirectionsBusFilled sx={{ mr: 1, verticalAlign: "middle", color: "orange" }} />
        {isEdit ? "Edit books" : "Upload New books"}
      </Typography>
  
      <form onSubmit={Formik.handleSubmit}>
        <Grid container spacing={2}>
          {["name", "publication"].map((field) => (
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

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              name="subject_name"
              label="Subject Name"
              value={Formik.values.subject_name}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              error={Formik.touched.subject_name && Boolean(Formik.errors.subject_name)}
              helperText={Formik.touched.subject_name && Formik.errors.subject_name}
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
            {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Upload books"}
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
        Uploaded books
      </Typography>
      {!books?.length ? (
        <Typography>No books uploaded yet.</Typography>
      ) : (
        <Grid container spacing={2}>
  
          <BooksCard
            books={books}
            onEdit={handleEditBooks}
            onDelete={handleDeleteBooks}
            userRole={user.role}
          />
  
        </Grid>
      )}
    </Box>
  </Box>
  
    );
  }
  