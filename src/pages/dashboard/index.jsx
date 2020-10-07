import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, firestore as db } from '../../firebase/firebase.util.js';

import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import StudentSelectionComponent from '../../components/paperSelection/student';
import TeacherSelectionComponent from '../../components/paperSelection/teacher';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function Dashboard({userData}) {
  const classes = useStyles();
  const userRole = userData.role;


  return (
    <div className={classes.root}>
      <CssBaseline />
      <div className={classes.header}>
        <Avatar className={classes.avatar}>
          <HomeIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Dashboard
        </Typography>
      </div>
      <div style={{ padding: 30 }}>
        {userRole === "teacher"  
          ? <div>
            <Grid container spacing={3}>
              <Grid item xs = {12}>
                <Link to="/createTest">
                  <Paper className={classes.paper}>Add Test</Paper>
                </Link>
              </Grid>
              <TeacherSelectionComponent />
            </Grid>
          </div>
          : <StudentSelectionComponent classId={userData.class} />
        }
      </div>
    </div>
  );
}