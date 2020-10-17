import React, { useReducer, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, firestore as db } from '../../firebase/firebase.util.js';
import firebase from 'firebase';

import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';

import Grid from '@material-ui/core/Grid';

import Select from 'react-select';

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

export default function TestComponent({ onChange, numOfQuestion }) {
  const classes = useStyles();

  useEffect(() => {
    const questionData = [];

    const calculateQuestion = () => {
      for (var count = 1; count <= numOfQuestion; count++) {
        questionData.push({
          id: count,
          title: '',
          type: '',
          answer: {
            choiceA: '',
            choiceB: '',
            choiceC: '',
            choiceD: '',
          },
          correctAnswer: '',
          point: ''
        })
      }
    }

    calculateQuestion();
    setInputValues(questionData)
  }, [])

  const questionType = [
    {
      label: 'Chọn một đáp án đúng',
      value: 'radio'
    },
    {
      label: 'Chọn nhiều đáp án đúng',
      value: 'checkbox'
    }
  ];

  const questionPointOption = [
    {
      label: '0.1',
      value: '0.1',
    },
    {
      label: '0.2',
      value: '0.2',
    },
    {
      label: '0.25',
      value: '0.25'
    },
    {
      label: '0.5',
      value: '0.5',
    },
    {
      label: '1',
      value: '1',
    },
  ];

  const [inputValues, setInputValues] = useState([]);

  const [state, setState] = React.useState({
    choiceA: false,
    choiceB: false,
    choiceC: false,
    choiceD: false,
  });

  const handleChange = event => {
    const { name, value, id } = event.target;
    const elementsIndex = inputValues.findIndex(element => element.id == id);
    let newArray = [...inputValues];
    newArray[elementsIndex] = { ...newArray[elementsIndex], [name]: value };
    setInputValues(newArray)
    onChange(newArray)
  };

  const handleAnswerChange = event => {
    const { name, value, id } = event.target;
    const elementsIndex = inputValues.findIndex(element => element.id == id);
    let newArray = [...inputValues];
    newArray[elementsIndex].answer = { ...newArray[elementsIndex].answer, [name]: value };
    setInputValues(newArray)
    onChange(newArray)
  };

  const handleCheckboxChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleRadioChange = (event) => {
    const { value, id } = event.target;
    const elementsIndex = inputValues.findIndex(element => element.id == id);
    let newArray = [...inputValues];
    newArray[elementsIndex] = { ...newArray[elementsIndex], correctAnswer: value };
    setInputValues(newArray)
    onChange(newArray)
  };

  const handleQuestionTypeChange = (typeData) => {
    const elementsIndex = inputValues.findIndex(element => element.id == typeData.questionId);
    let newArray = [...inputValues];
    if (typeData.newValue !== null) {
      newArray[elementsIndex] = { ...newArray[elementsIndex], type: typeData.newValue.value };
    } else {
      newArray[elementsIndex] = { ...newArray[elementsIndex], type: null };
    }  
    setInputValues(newArray)
    onChange(newArray)
  };

  const handleQuestionPointChange = (pointData) => {
    const elementsIndex = inputValues.findIndex(element => element.id == pointData.questionId);
    let newArray = [...inputValues];
    if (pointData.newValue !== null) {
      newArray[elementsIndex] = { ...newArray[elementsIndex], point: pointData.newValue.value };
    } else {
      newArray[elementsIndex] = { ...newArray[elementsIndex], point: null };
    }
    setInputValues(newArray)
    onChange(newArray)
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.header}>
          <Typography component="h1" variant="h5">
            Thông tin câu hỏi
          </Typography>
        </div>
        <div className={classes.root}>
          <form className={classes.form} noValidate>
            {inputValues.map((question) => {
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
                    {`Câu hỏi ${questionId}`}
                    </Typography>
                  <Grid item xs={12}>
                    <TextField
                      id={questionId}
                      label="Câu hỏi"
                      name="title"
                      multiline
                      required
                      fullWidth
                      rows={4}
                      variant="outlined"
                      value={question.title}
                      onChange={(event) => handleChange(event)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Dạng câu hỏi
                    </Typography>
                    <Select
                      name="type"
                      isClearable
                      options={questionType}
                      onChange={(newValue) => handleQuestionTypeChange({questionId, newValue})}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Điểm của câu hỏi
                    </Typography>
                    <Select
                      name="point"
                      isClearable
                      options={questionPointOption}
                      onChange={(newValue) => handleQuestionPointChange({ questionId, newValue })}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </Grid>
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
                            : <GreenRadio value="choiceA" id={questionId} onChange={handleRadioChange} checked={question.correctAnswer === "choiceA"} />
                        }
                        label={<TextField required id={questionId} name="choiceA" required fullWidth onChange={(event) => handleAnswerChange(event)} />}
                      />
                      <FormControlLabel
                        control={
                          question.type === "checkbox"
                            ? <GreenCheckbox checked={state.choiceB} onChange={handleCheckboxChange} name="choiceB" />
                            : <GreenRadio value="choiceB" id={questionId} onChange={handleRadioChange} checked={question.correctAnswer === "choiceB"} />
                        }
                        label={<TextField required id={questionId} name="choiceB" required fullWidth onChange={(event) => handleAnswerChange(event)} />}
                      />
                      <FormControlLabel
                        control={
                          question.type === "checkbox"
                            ? <GreenCheckbox checked={state.choiceC} onChange={handleCheckboxChange} name="choiceC" />
                            : <GreenRadio value="choiceC" id={questionId} onChange={handleRadioChange} checked={question.correctAnswer === "choiceC"} />
                        }
                        label={<TextField required id={questionId} name="choiceC" required fullWidth onChange={(event) => handleAnswerChange(event)} />}
                      />
                      <FormControlLabel
                        control={
                          question.type === "checkbox"
                            ? <GreenCheckbox checked={state.choiceD} onChange={handleCheckboxChange} name="choiceD" />
                            : <GreenRadio value="choiceD" id={questionId} onChange={handleRadioChange} checked={question.correctAnswer === "choiceD"} />
                        }
                        label={<TextField required id={questionId} name="choiceD" required fullWidth onChange={(event) => handleAnswerChange(event)} />}
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              )
            })}
          </form>
        </div>
      </div>
    </Container>
  );
}