"use client"

// This is a simplified version of the toast hook
// In a real application, you would use a proper toast library

import { useState } from "react"

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description, variant = "default" }) => {
    // In a real app, this would show a toast notification
    console.log(`Toast: ${variant} - ${title} - ${description}`)

    // For demonstration purposes, we'll just alert the message
    alert(`${title}: ${description}`)
  }

  return { toast }
}
