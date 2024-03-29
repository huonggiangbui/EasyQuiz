import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { firestore as db } from '../../firebase/firebase.util.js';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import SelectStudentTestComponent from './chooseStudentTest';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function StudentSelectionComponent({ classId }) {
  const classes = useStyles();

  const [subject, setSubject] = useState("")
  const [importedTestId, setImportedTestId] = useState([])

  useEffect(() => {
    try {
      db
        .collection("classes")
        .doc(classId[0])
        .get()
        .then(doc => {
          setImportedTestId(doc.data().testId)
        })
    } catch (error) {
      console.log(error);
    }
  }, [classId]);

  return (
    <div className={classes.root} style={{ marginTop: 60 }}>
      <div className={classes.header}>
        <Typography component="h1" variant="h5">
          {subject ? "Chọn bài kiểm tra" : "Chọn môn học"}
        </Typography>
      </div>
      {subject 
      ? <SelectStudentTestComponent filterTestId={importedTestId} testSubject={subject} /> 
        : <Grid container spacing={3}>
          <Grid item xs>
            <Link onClick={() => setSubject("Mathematics")}>
              <Paper className={classes.paper}>Toán học</Paper>
            </Link>
          </Grid>
          <Grid item xs>
            <Link onClick={() => setSubject("Literature")}>
              <Paper className={classes.paper}>Văn học</Paper>
            </Link>
          </Grid>
        </Grid>}
    </div>
  );
}