import React, { useReducer, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { auth, firestore as db } from '../../firebase/firebase.util.js';
import firebase from 'firebase';

import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';

import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '150%',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  question: {
    marginTop: theme.spacing(5),
  },
}));

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const GreenRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

export default function TakingExamPage({ userData }) {
  const classes = useStyles();
  const history = useHistory();

  const [examData, updateExamData] = useState({});

  const { testId } = useParams()

  useEffect(() => {
    db.collection('tests')
      .doc(testId)
      .get()
      .then(doc => {
        if (!doc.exists) {
          return alert('No test with this ID')
        }
        calculateQuestion(doc.data().data.length)
        return updateExamData(doc.data())
      })
  }, [testId])

  const [inputValues, setInputValues] = useState([]);

  const calculateQuestion = (numOfQuestion) => {
    const questionData = [];

    for (var count = 1; count <= numOfQuestion; count++) {
      questionData.push({
        id: count,
        studentChoice: ''
      })
    }

    return setInputValues(questionData)
  }

  const [state, setState] = React.useState({
    choiceA: false,
    choiceB: false,
    choiceC: false,
    choiceD: false,
  });

  const handleCheckboxChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleRadioChange = (event) => {
    const { value, id } = event.target;
    const elementsIndex = inputValues.findIndex(element => element.id == id);
    let newArray = [...inputValues];
    newArray[elementsIndex] = { ...newArray[elementsIndex], studentChoice: value };
    setInputValues(newArray)
  };

  // const [studentAnswer, setStudentAnswer] = useReducer(
  //   (state, newState) => ({ ...state, ...newState }),
  //   {
  //     userId: auth.currentUser.uid,
  //     point: '',
  //     data: []
  //   }
  // );

  const handleSubmit = async () => {
    try {
      let totalPoint = 0;

      for (var id = 0; id < examData.data.length; id++) {
        let point = parseInt(examData.data[id].point)
        if (examData.data[id].correctAnswer === inputValues[id].studentChoice) {
          totalPoint = totalPoint + point;
        }
      }

      // setStudentAnswer({
      //   point: totalPoint,
      //   data: inputValues
      // })
     
      await db
        .collection("tests")
        .doc(testId)
        .update({
          result: firebase.firestore.FieldValue.arrayUnion({
            userId: auth.currentUser.uid,
            name: userData.name,
            classId: userData.class[0],
            point: totalPoint,
            data: inputValues
          })
        })

      history.push(`/test/${testId}`)

    } catch (error) {
      console.log("Error while taking test" + error.message);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {examData && examData.data
        ? <div className={classes.paper}>
            <div className={classes.header}>
              <Typography component="h1" variant="h5">
                {examData.title}
              </Typography>
            </div>
            <div className={classes.root}>
              <form className={classes.form} noValidate>
                {examData.data.map((question) => {
                  const questionId = question.id;

                  // const [state, setState] = useState({
                  //   choiceA: false,
                  //   choiceB: false,
                  //   choiceC: false,
                  //   choiceD: false,
                  // });

                  return (
                    <Grid container spacing={2} className={classes.question}>
                      <Typography variant="subtitle1">
                        {`Question ${questionId}`}
                      </Typography>
                      <Grid item xs={12}>
                        <FormGroup column>
                          <FormControlLabel
                            fullWidth
                            control={
                              question.type === "checkbox"
                                ? <GreenCheckbox checked={state.choiceA}
                                  // onChange={(event) => {
                                  //   handleAnswerChange(event)
                                  // }} 
                                  onChange={handleCheckboxChange}
                                  name="choiceA" />
                                : <GreenRadio value="choiceA" id={questionId} onChange={handleRadioChange} />
                            }
                            label={question.answer.choiceA}
                          />
                          <FormControlLabel
                            control={
                              question.type === "checkbox"
                                ? <GreenCheckbox checked={state.choiceB} onChange={handleCheckboxChange} name="choiceB" />
                                : <GreenRadio value="choiceB" id={questionId} onChange={handleRadioChange} />
                            }
                            label={question.answer.choiceB}
                          />
                          <FormControlLabel
                            control={
                              question.type === "checkbox"
                                ? <GreenCheckbox checked={state.choiceC} onChange={handleCheckboxChange} name="choiceC" />
                                : <GreenRadio value="choiceC" id={questionId} onChange={handleRadioChange} />
                            }
                            label={question.answer.choiceC}
                          />
                          <FormControlLabel
                            control={
                              question.type === "checkbox"
                                ? <GreenCheckbox checked={state.choiceD} onChange={handleCheckboxChange} name="choiceD" />
                                : <GreenRadio value="choiceD" id={questionId} onChange={handleRadioChange} />
                            }
                            label={question.answer.choiceD}
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                  )
                })}
              </form>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => handleSubmit()}
              >
                Nộp bài
              </Button>
            </div>
          </div>
      : null}
    </Container>
  );
}