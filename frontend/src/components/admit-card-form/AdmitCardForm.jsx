import React, { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Paper,
} from '@mui/material'
import axios from 'axios'
import { baseUrl } from "../../environment";


const AdmitCardForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    section: '',
    roll: '',
    exam: '',
    year: '',
  })

  const fields = [
    { label: "Student Name", name: "name" },
    { label: "Class", name: "class" },
    { label: "Section", name: "section" },
    { label: "Roll No", name: "roll" },
    { label: "Exam", name: "exam" },
    { label: "Year", name: "year", type: "number" },
  ]

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Simple validation
    for (const key in formData) {
      if (!formData[key]) {
        setError(`Please fill out ${key}`)
        return
      }
    }

    try {
      setLoading(true)
      // Replace with your API endpoint
      const response = await axios.post(`${baseUrl}/teacher/admit-card`, formData)
      setSuccess(true)
      setFormData({
        name: '',
        class: '',
        section: '',
        roll: '',
        exam: '',
        year: '',
      })
    } catch (err) {
      setError('Something went wrong or student does not exist.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Create Admit Card
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>

            {fields.map((field) => (
                <TextField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    type={field.type || "text"}
                    fullWidth
                    margin="normal"
                />
            ))}


          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          {success && (
            <Typography color="primary" sx={{ mt: 1 }}>
              Admit card created successfully!
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Create Admit Card'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default AdmitCardForm
