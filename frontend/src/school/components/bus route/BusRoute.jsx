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
} from "@mui/material";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { useState, useContext } from "react";
import { baseUrl } from "@/environment";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { PlusOne, Delete, DirectionsBusFilled } from "@mui/icons-material";
import * as Yup from "yup";
// import { useToast } from "@/hooks/use-toast";
import BusRouteCard from "@/components/bus-route-card/BusRouteCard";

const validationSchema = Yup.object().shape({
  routeName: Yup.string().required("Route name is required"),
  busNumber: Yup.string().required("Bus number is required"),
  driverName: Yup.string().required("Driver name is required"),
  contactNumber: Yup.string().required("Contact number is required"),
  stops: Yup.array().of(
    Yup.object().shape({
      stopName: Yup.string().required("Stop name is required"),
      arrivalTime: Yup.string().required("Arrival time is required"),
    })
  ),
});


export default function BusRoutesPage() {
  // const { toast } = useToast();
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const cancelEdit = () => {
    setIsEdit(false);
    setEditId(null);
    formik.resetForm();
  };  


  const handleEditRoute = (route) => {
    setIsEdit(true);
    setEditId(route._id);
    formik.setValues({
      routeName: route.routeName,
      busNumber: route.busNumber,
      driverName: route.driverName,
      contactNumber: route.contactNumber,
      active: route.active,
      stops: route.stops,
    });
  };

  const handleDeleteRoute = (routeId) => {
    setIsLoading(true);
    axios
      .delete(`${baseUrl}/busRoute/delete/${routeId}`)
      .then((resp) => {
        setMessage(resp.data.message);
        setType("success");
        fetchRoutes();
      })
      .catch((e) => {
        setMessage(e);
        setType("error");
        console.log("Error deleting route", e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const fetchRoutes = () => {
    axios.get(`${baseUrl}/busRoute/fetch-all`)
      .then((resp) => {
        console.log(resp)
        console.log("Fetched routes", resp.data.data);
        setRoutes(resp.data.data);
      })
      .catch((e) => {
        console.log("Error fetching routes", e);
      });
  }

  useEffect(() => {
    fetchRoutes();
  }, []);

  const formik = useFormik({
    initialValues: {
      routeName: "",
      busNumber: "",
      driverName: "",
      contactNumber: "",
      active: true,
      stops: [{ stopName: "", arrivalTime: "" }],
    },
    validationSchema,
    onSubmit: (values) => {
      if (isEdit) {
        console.log("edit id", editId);
        axios
          .patch(`${baseUrl}/busRoute/update/${editId}`, {
            ...values,
          })
          .then((resp) => {
            // console.log("Edit submit", resp);
            setMessage(resp.data.message);
            setType("success");
            fetchRoutes();
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e);
            setType("error");
            console.log("Error, edit casting submit", e);
          });
      } else {
      
          axios
            .post(`${baseUrl}/busRoute/create`,{...values})
            .then((resp) => {
              // console.log("Response after submitting admin casting", resp);
              setMessage(resp.data.message);
              setType("success");
            })
            .catch((e) => {
              setMessage(e);
              setType("error");
              fetchRoutes();
              console.log("Error, response admin casting calls", e);
            });
          formik.resetForm();
        
      }
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: 600, mb: 4 }}>
        Bus Routes
      </Typography>

      <Paper sx={{ p: 4, maxWidth: "800px", mx: "auto", mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          <DirectionsBusFilled sx={{ mr: 1, verticalAlign: "middle", color: "orange" }} />
          {isEdit ? "Edit Bus Route" : "Register New Bus Route"}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {["routeName", "busNumber", "driverName", "contactNumber"].map((field) => (
              <Grid item xs={12} md={6} key={field}>
                <TextField
                  fullWidth
                  name={field}
                  label={field.replace(/([A-Z])/g, " $1")}
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched[field] && Boolean(formik.errors[field])}
                  helperText={formik.touched[field] && formik.errors[field]}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.active}
                    onChange={(e) => formik.setFieldValue("active", e.target.checked)}
                  />
                }
                label="Active Route"
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 500 }}>
            Stops & Schedule
          </Typography>

          {formik.values.stops.map((stop, index) => (
            <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  name={`stops[${index}].stopName`}
                  label="Stop Name"
                  value={stop.stopName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.stops?.[index]?.stopName && Boolean(formik.errors.stops?.[index]?.stopName)}
                  helperText={formik.touched.stops?.[index]?.stopName && formik.errors.stops?.[index]?.stopName}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  name={`stops[${index}].arrivalTime`}
                  label="Arrival Time"
                  value={stop.arrivalTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.stops?.[index]?.arrivalTime && Boolean(formik.errors.stops?.[index]?.arrivalTime)}
                  helperText={formik.touched.stops?.[index]?.arrivalTime && formik.errors.stops?.[index]?.arrivalTime}
                />
              </Grid>
              <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => {
                    const newStops = formik.values.stops.filter((_, i) => i !== index);
                    formik.setFieldValue("stops", newStops);
                  }}
                  disabled={formik.values.stops.length === 1}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button
            type="button"
            variant="outlined"
            sx={{ mt: 2 }}
            startIcon={<PlusOne />}
            onClick={() =>
              formik.setFieldValue("stops", [...formik.values.stops, { stopName: "", arrivalTime: "" }])
            }
          >
            Add Stop
          </Button>

          <Box sx={{ mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Register Bus Route"}
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
                formik.resetForm();
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
          Active Bus Routes
        </Typography>
        {!routes?.length ? (
          <Typography>No routes registered yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            {routes.map((route) => (
              <Grid item xs={12} md={6} key={route._id}>
                <BusRouteCard key={route._id} route={route} onEdit={handleEditRoute} onDelete={handleDeleteRoute} userRole={user.role} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
