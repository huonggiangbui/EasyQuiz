import React, { useReducer, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { firestore as db } from '../../firebase/firebase.util.js';
import firebase from 'firebase';

import TestComponent from '../../components/test';

import Select from 'react-select';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Pagination from '@material-ui/lab/Pagination';

import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '150%',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(6),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  questionForm: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const questionLimit = [];

const questionOption = () => {
  for(var count = 1; count <= 50; count++) {
    questionLimit.push({label: `${count}`, value: count})
  }
}

questionOption()

export default function CreateTestPage({ userData }) {
  const classes = useStyles();
  const history = useHistory()

  const [numOfQuestion, setNumOfQuestion] = useState();
  const [allClasses, setallClasses] = useState([]);
  
  useEffect(() => {
    try {
      db
        .collection("classes")
        .get()
        .then(snapshot => {
          setallClasses(snapshot.docs
            .filter(doc => userData.class.includes(doc.id))
            .map(doc => ({ ...doc.data(), label: doc.data().className, value: doc.id })))
        })
    } catch (error) {
      console.log(error);
    }
  }, []);

  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // const [page, setPage] = React.useState(1);
  // const handlePaginationChange = (event, value) => {
  //   setPage(value);
  // };

  // let numOfPage = 0;

  // const calculatePage = () => {
  //   if (numOfQuestion % 10 !== 0) {
  //     numOfPage = Math.floor(numOfQuestion / 10) + 1;
  //   } else {
  //     numOfPage = numOfQuestion / 10;
  //   }
  // }

  // calculatePage()

  const [inputValues, setInputValues] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      title: '',
      description: '',
      classId: [],
      data: [],
      time: '',
      result: []
    }
  );

  const handleChange = event => {
    const { name, value } = event.target;
    setInputValues({ [name]: value });
  };

  const handleClassChange = (newValue) => {
    if (newValue !== null) {
      setInputValues({ ...inputValues, classId: newValue.map(userClass => userClass.value) })
    } else {
      setInputValues({ ...inputValues, classId: [] })
    }
  };

  const handleQuestionChange = (newValue) => {
    if (newValue !== null) {
      setNumOfQuestion(newValue.value)
    } else {
      setNumOfQuestion(null)
    }
  };

  const onDataChange = (data) => {
    setInputValues({ data: data })
  }

  const handleSubmit = async () => {
    let testId;

    let totalPoint = 0;

    for (var id = 0; id < inputValues.data.length; id++) {
      let point = parseInt(inputValues.data[id].point)
      totalPoint = totalPoint + point;
    }

    try {
      await db
        .collection("tests")
        .add({
          ...inputValues,
          ownerId: userData.userId,
          schoolId: userData.school[0],
          subject: userData.subject,
          status: "created",
          totalPoint: totalPoint

        })
        .then((docRef) => {
          testId = docRef.id
        });

      inputValues.classId.forEach(async (selectedClass) => {
        await db
          .collection("classes")
          .doc(selectedClass)
          .update({
            testId: firebase.firestore.FieldValue.arrayUnion(testId)
          })
      })

      history.push("/dashboard")

    } catch (error) {
      console.log("Error while creating test" + error.message);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.header}>
          <Avatar className={classes.avatar}>
            <AssignmentOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Tạo bài kiểm tra mới
          </Typography>
        </div>
        <div className={classes.root}>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  variant="outlined"
                  required
                  fullWidth
                  id="title"
                  label="Tiêu đề bài kiểm tra"
                  autoFocus
                  value={inputValues.title}
                  onChange={(event) => handleChange(event)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Lớp sử dụng bài kiểm tra
                </Typography>
                <Select
                  isMulti
                  name="classes"
                  options={allClasses}
                  onChange={handleClassChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-multiline-static"
                  label="Mô tả bài kiểm tra"
                  name="description"
                  multiline
                  required
                  fullWidth
                  rows={5}
                  placeholder="Nhập mô tả/hướng dẫn về bài kiểm tra tại đây."
                  variant="outlined"
                  value={inputValues.description}
                  onChange={(event) => handleChange(event)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="time"
                  variant="outlined"
                  required
                  fullWidth
                  id="time"
                  label="Thời gian làm bài (tính theo phút)"
                  autoFocus
                  value={inputValues.time}
                  onChange={(event) => handleChange(event)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Số câu hỏi
                </Typography>
                <Select
                  name="numOfQuestion"
                  isClearable
                  options={questionLimit}
                  onChange={handleQuestionChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </Grid>
              {numOfQuestion 
                ? <Grid item xs={12}>
                    <TestComponent onChange={(e) => onDataChange(e)} numOfQuestion={numOfQuestion} />
                    {/* <div className={classes.questionForm}>
                      <Pagination 
                        count={numOfPage} 
                        page={page} 
                        onChange={handlePaginationChange} 
                      />
                    </div> */}
                </Grid> 
                : null
              }
            </Grid>
          </form>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className={classes.button}
            >
              Tạo bài kiểm tra
            </Button>
          </div>
          <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                Đã xảy ra lỗi. Hãy xem lại thông tin bài kiểm tra.
              </Alert>
            </Snackbar>
          </div>
        </div>
      </div>
    </Container>
  );
}