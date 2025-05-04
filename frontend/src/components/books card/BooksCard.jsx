import { useState } from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import DownloadIcon from "@mui/icons-material/Download"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';


const BooksCard = ({ books, onEdit, onDelete, userRole }) => {
  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: "auto", mt: 3 }}>
        <Table aria-label="Books table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Class</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Subject Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Book name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Publication</TableCell>
              {userRole === "SCHOOL" && (
                <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book, i) => (
              <TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">{book['class'].class_num}</TableCell>
                <TableCell>{book['subject'].subject_name}</TableCell>
                <TableCell>{book['name']}</TableCell>
                <TableCell>{book['publication']}</TableCell>
                <TableCell align="center">
                  {
                    userRole === "SCHOOL" && (
                      <>
                      <IconButton
                      color="info"
                      aria-label="edit book"
                      onClick={() => onEdit(book)}
                      size="small"
                      >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="info"
                        aria-label="edit book"
                        onClick={() => onDelete(book._id)}
                        size="small"
                        >
                          <DeleteIcon />
                    </IconButton>
                    </>
                    )
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default BooksCard
