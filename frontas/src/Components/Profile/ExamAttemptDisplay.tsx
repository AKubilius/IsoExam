import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

interface Answer {
  questionId: number;
  policyDefined: string;
  controlImplemented: string;
  controlAutomated: string;
  controlReported: string;
}

interface ExamAttempt {
  id: number;
  attemptedAt: string;
  timeTaken: string;
  score: number;
  status: string;
  answers: Answer[];
}

interface Props {
  examAttempts: ExamAttempt[];
}

const ExamAttemptsDisplay: React.FC<Props> = ({ examAttempts }) => {
  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h6" gutterBottom>
        Exam Attempts
      </Typography>
      <List>
        {examAttempts.map((attempt) => (
          <Box key={attempt.id} sx={{ marginBottom: 2 }}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography component="span">
                    Attempted At: {new Date(attempt.attemptedAt).toLocaleString()}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography component="span">Score: {attempt.score}</Typography>
                    <br />
                    <Typography component="span">Status: {attempt.status}</Typography>
                    <br />
                    <Typography component="span">Time Taken: {attempt.timeTaken}</Typography>
                  </>
                }
              />
            </ListItem>
            <Divider />
            <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
              Answers:
            </Typography>
            <List sx={{ paddingLeft: 4 }}>
              {attempt.answers.map((answer, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={
                      <Typography component="span">
                        Question ID: {answer.questionId}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span">Policy Defined: {answer.policyDefined}</Typography>
                        <br />
                        <Typography component="span">
                          Control Implemented: {answer.controlImplemented}
                        </Typography>
                        <br />
                        <Typography component="span">
                          Control Automated: {answer.controlAutomated}
                        </Typography>
                        <br />
                        <Typography component="span">
                          Control Reported: {answer.controlReported}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default ExamAttemptsDisplay;
