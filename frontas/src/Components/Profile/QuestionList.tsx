import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  TextField,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { makePutRequest, makeDeleteRequest, getRequest } from "../Api/Api";

interface Question {
  id: number;
  detail: string;
  group: number;
}

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getRequest("api/question", "");
        setQuestions(data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch questions. Please try again later.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleEdit = (question: Question) => {
    setEditQuestion(question);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await makeDeleteRequest(`api/question/${id}`);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete question. Please try again.");
    }
  };

  const handleModalClose = () => {
    setEditQuestion(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (editQuestion) {
      try {
        const response = await makePutRequest(`api/question/${editQuestion.id}`, {
          detail: editQuestion.detail,
          group: editQuestion.group,
        });
        console.log("Update Response:", response); // Log the full response
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === editQuestion.id ? { ...q, ...editQuestion } : q
          )
        );
        handleModalClose();
      } catch (err) {
        console.error("Update Error:", err);
        setError("Failed to update question. Please try again.");
      }
    }
  };
  
  
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Klausimai
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "500px",
          overflow: "auto",
          backgroundColor: "#f9f9f9", // Subtle background color
          borderRadius: "8px",
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)", // Softer shadow
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "#eaeaea" }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "#eaeaea", width: "50%" }}
              >
                Tekstas
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "#eaeaea" }}
              >
                Grupė
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "#eaeaea" }}
              >
                Veiksmai
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell>{question.id}</TableCell>
                <TableCell>{question.detail}</TableCell>
                <TableCell>{question.group}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(question)}
                    sx={{ marginRight: 1 }}
                  >
                    Atnaujinti
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(question.id)}
                  >
                    Pašalinti
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Atnaujinti klausimą
          </Typography>
          <TextField
            fullWidth
            label="Tekstas"
            value={editQuestion?.detail || ""}
            onChange={(e) =>
              setEditQuestion((prev) =>
                prev ? { ...prev, detail: e.target.value } : null
              )
            }
            multiline
            rows={4} // Increase size for better editing
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Grupė"
            type="number"
            value={editQuestion?.group || ""}
            onChange={(e) =>
              setEditQuestion((prev) =>
                prev ? { ...prev, group: parseInt(e.target.value, 10) } : null
              )
            }
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Išsaugoti
            </Button>
            <Button variant="outlined" onClick={handleModalClose}>
             Atšaukti
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default QuestionsPage;
