import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  update,
} from "firebase/database";
import "./style.css";

function App() {
  const db = getDatabase();
  let [taskname, setTaskName] = useState("");
  let [taskdecp, setTaskDecp] = useState("");
  let [tasknameerr, setTaskNameErr] = useState("");
  let [taskdecperr, setTaskDecpErr] = useState("");
  let [todoarr, setTodoArr] = useState([]);
  let [change, setChange] = useState(true);
  let [open, setOpen] = useState(false);

  //todo edit js
  let [tasknameedit, setTaskNameEdit] = useState("");
  let [taskdecpedit, setTaskDecpEdit] = useState("");
  let [tasknameediterr, setTaskNameEditErr] = useState("");
  let [taskdecpediterr, setTaskDecpEditErr] = useState("");
  let [editid, setEditId] = useState("");

  // input function js
  let tasknameFunc = (e) => {
    setTaskName(e.target.value);
    setTaskNameErr("");
  };

  let taskdecpFunc = (e) => {
    setTaskDecp(e.target.value);
    setTaskDecpErr("");
  };

  // handel submit js
  let handelSubmit = (e) => {
    e.preventDefault();

    if (taskname == "") {
      setTaskNameErr("Please give a task name");
    } else {
      set(push(ref(db, "todoList")), {
        taskName: taskname,
        taskDecp: taskdecp,
      }).then(() => {
        setChange(!change);
        setTaskName("");
        setTaskDecp("");
      });
    }

    if (taskdecp == "") {
      setTaskDecpErr("Please give a trask description");
    }
  };

  // show data default js
  useEffect(() => {
    const todoRef = ref(db, "todoList");
    let arr = [];
    onValue(todoRef, (snapshot) => {
      const data = snapshot.val();
      snapshot.forEach((item) => {
        let taskinfo = {
          id: item.key,
          taskName: item.val().taskName,
          taskDecp: item.val().taskDecp,
        };
        arr.push(taskinfo);
      });
      setTodoArr(arr);
    });
  }, [change]);

  //delete todo js
  let handelDelete = (id) => {
    const todoRef = ref(db, "todoList/" + id);
    remove(todoRef);
    setChange(!change);
  };

  //edit todo js
  let taskNameEditFunc = (e) => {
    setTaskNameEdit(e.target.value);
    setTaskNameEditErr("");
  };

  let taskDecpEditFunc = (e) => {
    setTaskDecpEdit(e.target.value);
    setTaskDecpEditErr("");
  };

  let handelOpen = (id) => {
    setOpen(true);
    setEditId(id);
  };

  let handelEdit = (e) => {
    e.preventDefault();

    if (tasknameedit == "") {
      setTaskNameEditErr("Please give a task name");
    }

    if (taskdecpedit == "") {
      setTaskDecpEditErr("Please give a trask description");
    }

    const todoRef = ref(db, "todoList/" + editid);
    update(todoRef, {
      taskName: tasknameedit,
      taskDecp: taskdecpedit,
    }).then(() => {
      setOpen(false);
      setChange(!change);
      setTaskNameEdit("");
      setTaskDecpEdit("");
    });
  };

  return (
    <Container>
      <Row>
        <Col lg="8" className="mx-auto">
          <Form className="shadow-lg p-5">
            <h1 className=" text-center mb-4">To-Do Application</h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                onChange={tasknameFunc}
                type="text"
                value={taskname}
                placeholder="Task Name"
              />
              {tasknameerr != "" ? (
                <Form.Text className="text-muted">{tasknameerr}</Form.Text>
              ) : (
                ""
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                onChange={taskdecpFunc}
                type="text"
                value={taskdecp}
                placeholder="Enter Task Description"
              />
              {taskdecperr != "" ? (
                <Form.Text className="text-muted">{taskdecperr}</Form.Text>
              ) : (
                ""
              )}
            </Form.Group>

            <Button onClick={handelSubmit} variant="primary" type="submit">
              Add
            </Button>
          </Form>

          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Task Name</th>
                <th>Task Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {todoarr.map((item) => (
                <tr>
                  <td>#</td>
                  <td>{item.taskName}</td>
                  <td>{item.taskDecp}</td>
                  <td>
                    <Button
                      onClick={() => handelOpen(item.id)}
                      variant="primary"
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      onClick={() => handelDelete(item.id)}
                      variant="danger"
                    >
                      Delete
                    </Button>{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {open && (
            <div className="mymodal">
              <div className="mymodal_body">
                <div className="modal_close">
                  <i
                    onClick={() => setOpen(false)}
                    class="fa-solid fa-xmark"
                  ></i>
                </div>

                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Task Name</Form.Label>
                    <Form.Control
                      onChange={taskNameEditFunc}
                      type="text"
                      value={tasknameedit}
                      placeholder="Task Name"
                    />
                    {tasknameediterr != "" ? (
                      <Form.Text className="text-muted">
                        {tasknameediterr}
                      </Form.Text>
                    ) : (
                      ""
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Task Description</Form.Label>
                    <Form.Control
                      onChange={taskDecpEditFunc}
                      type="text"
                      value={taskdecpedit}
                      placeholder="Enter Task Description"
                    />
                    {taskdecperr != "" ? (
                      <Form.Text className="text-muted">
                        {taskdecperr}
                      </Form.Text>
                    ) : (
                      ""
                    )}
                  </Form.Group>

                  <Button onClick={handelEdit} variant="primary" type="submit">
                    Add
                  </Button>
                </Form>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
