import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from 'react-router-dom';
import { firestore as db } from "../../firebase/firebase.util";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Table, Checkbox, Button } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
const { Column, HeaderCell, Cell, Pagination } = Table;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function TeacherResult() {
  const [allStudents, updateAllStudents] = useState([])
  const [assignedClass, updateAssignedClass] = useState([])
  const [selectedClass, updateSelectedClass] = useState()
  const [displayLength, setDisplayLength] = useState(10)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState()
  const [sortColumn, setSortColumn] = useState()
  const [sortType, setSortType] = useState()

  const classes = useStyles()

  const { testId } = useParams()

  useEffect(() => {
    db.collection('tests')
      .doc(testId)
      .get()
      .then(doc => {
        if (!doc.exists) {
          return alert('No test with this ID')
        }
        return updateAllStudents(doc.data().result)
      })

    db
      .collection("classes")
      .get()
      .then(snapshot => {
        updateAssignedClass(snapshot.docs
          .filter(doc => doc.data().testId.includes(testId))
          .map(doc => ({ ...doc.data(), classId: doc.id })))
      })

    // const studentId = allStudents.map(student => student.userId)

    // if (selectedClass) {
    //   db
    //   .collection("users")
    //   .get()
    //   .then(snapshot => {
    //     updateAllStudents(snapshot.docs
    //       .filter(doc => studentId.includes(doc.id) && selectedClass === doc.data().classId[0])
    //       .map(doc => ({ ...doc.data(), userId: doc.id })))
    //   })
    // }
    
  }, [testId, selectedClass])

  function handleChangePage(dataKey) {
    setPage(dataKey)
  }

  function handleChangeLength(dataKey) {
    setPage(1)
    setDisplayLength(dataKey)
  }

  function getData(taskData) {
    const data = taskData.filter((v, i) => {
      const start = displayLength * (page - 1)
      const end = start + displayLength
      return i >= start && i < end
    })

    if (sortColumn && sortType) {
      return data.sort((a, b) => {
        let x = a[sortColumn]
        let y = b[sortColumn]
        if (typeof x === 'string') {
          x = x.charCodeAt()
        }
        if (typeof y === 'string') {
          y = y.charCodeAt()
        }
        if (sortType === 'asc') {
          return x - y
        } else {
          return y - x
        }
      })
    }
    return data
  }

  function handleSortColumn(sortColumn, sortType) {
    setLoading(true)

    setTimeout(() => {
      setSortColumn(sortColumn)
      setSortType(sortType)
      setLoading(false)
    }, 500)
  }

  // const history = useHistory()

  return (
    <div className='container'>
      {console.log(allStudents)}
      {selectedClass 
      ? <>
          <Table
            height={500}
            autoHeight
            wordWrap
            data={getData(allStudents)}
            sortColumn={sortColumn}
            sortType={sortType}
            onSortColumn={handleSortColumn}
            loading={loading}
          // onRowClick={data => {
          //   history.push(``)
          // }}
          >
            <Column width={150} align="justify" fixed>
              <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Name</HeaderCell>
              <Cell dataKey="name" />
            </Column>

            <Column width={180} align="justify">
              <HeaderCell style={{ color: "black", fontSize: "medium", fontWeight: "600" }}>Point</HeaderCell>
              <Cell dataKey="point" />
            </Column>
          </Table>
          <div className="footer">
            <Pagination
              lengthMenu={[
                {
                  value: 10,
                  label: 10
                },
                {
                  value: 20,
                  label: 20
                },
                {
                  value: 50,
                  label: 50
                },
                {
                  value: 100,
                  label: 100
                }
              ]}
              activePage={page}
              displayLength={displayLength}
              total={allStudents.length}
              onChangePage={handleChangePage}
              onChangeLength={handleChangeLength}
            />
          </div>
        </>
        : <div className={classes.root} style={{ marginTop: 60 }}>
          <Grid container spacing={3}>
            {assignedClass.map((userClass) => {
              return (
                <Grid item xs>
                  <Link onClick={() => {
                    allStudents.filter(student => {
                      return student.classId === userClass.classId
                    })
                    updateSelectedClass(userClass.classId)
                  }}>
                    <Paper className={classes.paper}>{userClass.className}</Paper>
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </div>}
    </div>
  )
}