import React, { useReducer, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, firestore as db } from '../../firebase/firebase.util.js';
import firebase from 'firebase';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import CreatableSelect from 'react-select/creatable';

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
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SignUpPage() {
  const classes = useStyles();
  const history = useHistory()

  const userClassId = [];
  const [allClasses, setallClasses] = useState([]);
  const [importedClasses, setimportedClasses] = useState();
  const [finalClasses, setFinalClasses] = useState([]);
  
  let userSchoolId;
  const [importedSchools, setImportedSchools] = useState([]);
  const [finalSchools, setFinalSchools] = useState([]);
  
  useEffect(() => {
    try {
      db
        .collection("schools")
        .get()
        .then(snapshot => {
          setImportedSchools(snapshot.docs
            .map(doc => ({ ...doc.data(), schoolId: doc.id, label: doc.data().schoolName, value: doc.data().schoolName })))
        })

      db
        .collection("classes")
        .get()
        .then(snapshot => {
          setallClasses(snapshot.docs
            .map(doc => ({ ...doc.data(), classId: doc.id, label: doc.data().className, value: doc.data().className })))
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

  const [inputValues, setInputValues] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      email: '',
      password: '',
      phone: null,
      name: '',
      role: '',
      address: '',
    }
  );

  const handleChange = event => {
    const { name, value } = event.target;
    setInputValues({ [name]: value });

    if (name === "subject") {
      setInputValues({...inputValues, subject: value})
    }
  };

  const handleSchoolChange = (newValue) => {
    setFinalSchools(newValue)

    let selectedClasses = [];

    if(importedSchools.includes(newValue)) {
      newValue.classId.forEach((classWithSchool) => {
        allClasses.forEach((importedClass) => {
          if (importedClass.classId === classWithSchool) {
            selectedClasses.push(importedClass)
          }
        })
      })
    }

    setimportedClasses(selectedClasses)
  };

  const handleTeacherClassChange = (newValue) => {
    setFinalClasses(newValue)
  };

  const handleStudentClassChange = (newValue) => {
    setFinalClasses([newValue])
  };

  const handleSubmit = async () => {
    let userId;
    let newClassId = [];

    for(var classIndex = 0; classIndex < finalClasses.length; classIndex++) {
      if (!importedClasses.includes(finalClasses[classIndex]) || importedClasses.length === 0) {
        try {
          await db
            .collection("classes")
            .add({
              className: finalClasses[classIndex].value,
              testId: []
            })
            .then((docRef) => {
              userClassId.push(docRef.id)
              newClassId.push(docRef.id)
            })
        } catch (error) {
          console.log("Error while saving class" + error.message);
        }
      } else {
        userClassId.push(finalClasses[classIndex].classId)
      }
    }

     if (!importedSchools.includes(finalSchools)) {
      try {
        await db
          .collection("schools")
          .add({
            schoolName: finalSchools.value,
            classId: userClassId
          })
          .then((docRef) => {
            userSchoolId = docRef.id
          })
      } catch (error) {
        console.log("Error while saving school" + error.message);
      }
    } else {
      try {
        if (newClassId.length > 0) {
          await db
            .collection("schools")
            .doc(finalSchools.schoolId)
            .update({
              classId: firebase.firestore.FieldValue.arrayUnion(...newClassId)
            })
        }
        userSchoolId = finalSchools.schoolId;
      } catch (error) {
        console.log("Error while saving school" + error.message);
      }
    }
    console.log(userSchoolId)


    await db
      .doc(`/users/${inputValues.email}`)
      .get()
      .then(() => {
        return auth
          .createUserWithEmailAndPassword(
            inputValues.email,
            inputValues.password
          );
      })

      .then((data) => {
        userId = data.user.uid;
      })

      .then(async () => {
        const userCredentials = {
          name: inputValues.name,
          phone: inputValues.phone,
          email: inputValues.email,
          role: inputValues.role,
          address: inputValues.address,
          class: userClassId,
          school: userSchoolId
        };
        await db
          .doc(`/users/${userId}`)
          .set(userCredentials);
        history.push("/")
      })

      .catch((err) => {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
          return setOpen(true)
        } else {
          return setOpen(true)
        }
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.header}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng ký
          </Typography>
        </div>
        <div className={classes.root}>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Họ và tên"
                  autoFocus
                  value={inputValues.name}
                  onChange={(event) => handleChange(event)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    Bạn là
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    name="role"
                    value={inputValues.role}
                    onChange={(event) => handleChange(event)}
                    displayEmpty
                    className={classes.selectEmpty}
                    fullWidth
                  >
                    <MenuItem value={'teacher'}>Giáo viên</MenuItem>
                    <MenuItem value={'student'}>Học sinh</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="phone"
                  label="Số điện thoại"
                  name="phone"
                  autoComplete="phone"
                  value={inputValues.phone}
                  onChange={(event) => handleChange(event)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="address"
                  label="Địa chỉ"
                  name="address"
                  autoComplete="address"
                  value={inputValues.address}
                  onChange={(event) => handleChange(event)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={inputValues.email}
                  onChange={(event) => handleChange(event)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={inputValues.password}
                  onChange={(event) => handleChange(event)}
                />
              </Grid>
              {inputValues.role === "teacher"
                ? <>
                  <Grid item xs={12}>
                    <FormControl className={classes.formControl}>
                      <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                        Môn học
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        name="subject"
                        value={inputValues.subject}
                        onChange={(event) => handleChange(event)}
                        displayEmpty
                        className={classes.selectEmpty}
                      >
                        <MenuItem value={'math'}>Toán học</MenuItem>
                        <MenuItem value={'literature'}>Văn học/Tiếng Việt</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Trường học
                    </Typography>
                    <CreatableSelect
                      isClearable
                      onChange={handleSchoolChange}
                      options={importedSchools}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Lớp giảng dạy
                    </Typography>
                    <CreatableSelect
                      isMulti
                      onChange={handleTeacherClassChange}
                      options={importedClasses}
                    />
                  </Grid>
                </>
                : null}
              {inputValues.role === "student" 
                ? <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Trường học
                    </Typography>
                    <CreatableSelect
                      isClearable
                      onChange={handleSchoolChange}
                      options={importedSchools}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Lớp theo học
                    </Typography>
                    <CreatableSelect
                      isClearable
                      onChange={handleStudentClassChange}
                      options={importedClasses}
                    />
                  </Grid>
                </>
              : null}
            </Grid>
          </form>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className={classes.button}
            >
              Gửi
            </Button>
          </div>
          <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                Đã xảy ra lỗi. Vui lòng xem lại thông tin đăng ký.
            </Alert>
            </Snackbar>
          </div>
        </div>
      </div>
    </Container>
  );
}