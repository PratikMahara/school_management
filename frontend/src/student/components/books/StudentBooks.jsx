import { useEffect, useState, useContext } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { baseUrl } from "../../../environment";
import BooksCard from "../../../components/books card/BooksCard";

const StudentBooks = () => {
  const [books, setBooks] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBooks = () => {
      axios.get(`${baseUrl}/books/fetch-all`)
        .then((resp) => {
          console.log(resp)
          console.log("Fetched books: ", resp.data.data);
          setBooks(resp.data.data);
        })
        .catch((e) => {
          console.error("Error fetching books", e);
        });
    }
    fetchBooks();
  }, []);

  return (<>
   
    <Box>
      <Typography sx={{margin:'auto', textAlign:"center"}} variant="h3">Books</Typography>
    
      <Box>
        {!books?.length ? (
          <Typography>No Books registered yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <BooksCard books={books} userRole={user.role} />
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
    </>
  );
};

export default StudentBooks;
