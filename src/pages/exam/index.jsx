import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { firestore as db } from '../../firebase/firebase.util.js';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '200%'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(5),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '200%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  button: {
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}));

export default function ExamPage({ userData }) {
  const classes = useStyles();
  const [examData, updateExamData] = useState({})

  const { testId } = useParams()

  useEffect(() => {
    db.collection('tests')
      .doc(testId)
      .get()
      .then(doc => {
        if (!doc.exists) {
          return alert('No test with this ID')
        }
        return updateExamData(() => ({...doc.data(), testId: doc.id}))
      })
  }, [testId])

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.header}>
          <Typography component="h1" variant="h5">
            {examData.title}
          </Typography>
        </div>
        <div className={classes.root}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <p>{examData.description}</p>
            </Grid>
          </Grid>
        </div>
        <div>
          <Link to={`/test/${examData.testId}/taking`}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            >
              {userData.role === "teacher" ? "Kích hoạt" : "Bắt đầu"}
          </Button>
          </Link>
          <Link to={`/test/${examData.testId}/result`}>
            <Button
              variant="contained"
              color="white"
              className={classes.button}
            >
              Xem kết quả
          </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}