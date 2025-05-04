import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Chip,
} from "@mui/material";
import { BusAlert } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";


export default function BusRouteCard({ route, onEdit, userRole, onDelete }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "16px",
        boxShadow: 3,
        transition: "0.3s",
        "&:hover": { boxShadow: 6 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <BusAlert sx={{ color: "orange" }} />
            <Typography variant="h6">{route.routeName}</Typography>
            <Chip
              size="small"
              label={route.active ? "Active" : "Inactive"}
              color={route.active ? "success" : "default"}
              sx={{ ml: "auto" }}
            />
          </Box>
        }
        sx={{ pb: 0 }}
      />
      <Divider />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1} mb={2}>
          <Typography variant="body2" color="textSecondary">
            <strong>Bus Number:</strong> {route.busNumber}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Driver:</strong> {route.driverName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Contact:</strong> {route.contactNumber}
          </Typography>
        </Box>

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Stops & Schedule
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Stop Name</TableCell>
              <TableCell>Arrival Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {route.stops.map((stop, idx) => (
              <TableRow key={idx}>
                <TableCell>{stop.stopName}</TableCell>
                <TableCell>{stop.arrivalTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {
          userRole === "SCHOOL" && (
            <IconButton onClick={() => onEdit(route)} color="primary" sx={{ ml: 1 }}>
              <EditIcon />
            </IconButton>
          )
        }
        {
          userRole === "SCHOOL" && (
            <IconButton onClick={() => onDelete(route._id)} color="primary" sx={{ ml: 1 }}>
              <DeleteIcon />
            </IconButton>
          )
        }

      </CardContent>
    </Card>
  );
}
