import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { firestore as db } from '../../firebase/firebase.util.js';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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

export default function SelectStudentTestComponent({ filterTestId, testSubject }) {
  const classes = useStyles();
  const [importedTest, setImportedTest] = useState([])


  useEffect(() => {
    try {
      db
        .collection("tests")
        .get()
        .then(snapshot => {
          setImportedTest(snapshot.docs
            .filter(doc => doc.data().subject === testSubject && filterTestId.includes(doc.id))
            .map(doc => ({ ...doc.data(), testId: doc.id })))
        })
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className={classes.root} style={{ marginTop: 60 }}>
      <div className={classes.header}>
        {importedTest.length !== 0
          ? null
          : <div className={classes.header}>
              <Typography component="h1" variant="h5">
                Không có bài kiểm tra nào cho môn học này
              </Typography>
            </div>  
        }
      </div>
      <Grid container spacing={3}>
        {importedTest.map((userTest) => {
          return (
            <Grid item xs>
              <Link to={`/test/${userTest.testId}`}>
                <Paper className={classes.paper}>{userTest.title}</Paper>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}