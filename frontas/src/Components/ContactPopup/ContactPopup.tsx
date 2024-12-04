import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Fab, Box } from "@mui/material";
import { Chat } from "@mui/icons-material";
import axios from "axios"; // Make sure to install axios with npm
import {makePostRequest} from '../Api/Api'
const ContactPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [surname, setSurname] = useState("");
  const [names, setNames] = useState("");
  const [company, setCompany] = useState("");

  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNames("");
    setMessage("");
    setEmail("");
  };

  const name = localStorage.getItem("name"); // Simulating logged-in user detection
 // New Function to Send Message Using makePostRequest
 async function sendMessageToAdmin(email: string, message: string) {
  try {
    const response = await makePostRequest("api/contact/send-message", { email, message });

    if (response) {
      console.log("Message sent successfully:", response);
      return response;
    } else {
      console.error("Failed to send message");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

  const handleSubmit = async () => {
    if (!name && !email) {
      alert("Please enter your email address.");
      return;
    }
    setLoading(true);
    sendMessageToAdmin(email,message);
    setLoading(false);
    handleClose();
  };

  return (
    <Box>
      {/* Floating Action Button in the Bottom Right */}
      <Fab
        color="primary"
        onClick={handleOpen}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#1976d2",
        }}
      >
        <Chat style={{ color: "#fff" }} />
      </Fab>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Contact Admin</DialogTitle>
        <DialogContent>
          {/* If user is not logged in, ask for their email */}
          {!name && (
            <Box>
              <TextField
              label="Your Name"
              fullWidth
              variant="outlined"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              style={{ marginBottom: "1rem"}}
              slotProps={{
                inputLabel: {
                  style: { lineHeight: "1.5" },
                },
              }}
            />
             <TextField
              label="Your Surname"
              fullWidth
              variant="outlined"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              style={{ marginBottom: "1rem"}}
              slotProps={{
                inputLabel: {
                  style: { lineHeight: "1.5" },
                },
              }}
            />

              <TextField
              label="Your Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: "1rem"}}
              slotProps={{
                inputLabel: {
                  style: { lineHeight: "1.5" },
                },
              }}
            />
             <TextField
              label="Your Company"
              fullWidth
              variant="outlined"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{ marginBottom: "1rem"}}
              slotProps={{
                inputLabel: {
                  style: { lineHeight: "1.5" },
                },
              }}
            />
            </Box>
          )}

          {/* Message Field */}
          <TextField
            label="Your Message"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Box style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{ marginRight: "0.5rem" }}
            >
              {loading ? "Sending..." : "Send"}
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ContactPopup;
