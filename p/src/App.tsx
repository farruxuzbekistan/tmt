// App.tsx
import React, { useState, useEffect } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import Search from "./components/Search";
import "./App.css";

interface Task {
  id: number;
  text: string;
  isPending: boolean;
  createdAt: Date;
  deadline?: Date;
  duration?: number;
  remainingTime?: string;
}

const App: React.FC = () => {
  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([]);

  // State for the task being edited
  const [editTask, setEditTask] = useState<Task | null>(null);

  // State for showing/hiding the edit modal
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  // State for the search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State for new task text
  const [newTaskText, setNewTaskText] = useState<string>("");

  // State for new task duration
  const [newTaskDuration, setNewTaskDuration] = useState<number | undefined>(
    undefined
  );

  // UseEffect for updating remaining time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          const remainingTime = getRemainingTime(task.deadline);

          if (task.deadline && new Date() > task.deadline) {
            // Task has passed the deadline, trigger alert
            alert(`Deadline passed for task: ${task.text}`);
          }

          return {
            ...task,
            remainingTime,
          };
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Function to add a new task
  const addTask = () => {
    if (newTaskText.trim() !== "") {
      const newTask: Task = {
        id: Date.now(),
        text: newTaskText,
        isPending: false,
        createdAt: new Date(),
        deadline:
          newTaskDuration !== undefined
            ? calculateDeadline(newTaskDuration)
            : undefined,
        duration: newTaskDuration,
      };

      setTasks([...tasks, newTask]);
      setNewTaskText("");
      setNewTaskDuration(undefined);
    }
  };

  // Function to calculate deadline based on duration
  const calculateDeadline = (duration: number): Date => {
    const now = new Date();
    const deadline = new Date(now.getTime() + duration * 60000); // Convert duration to milliseconds
    return deadline;
  };

  // Function to get remaining time until the deadline
  const getRemainingTime = (deadline?: Date): string => {
    if (deadline) {
      const now = new Date();
      const timeDifference = deadline.getTime() - now.getTime();
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
      return `${hours}h ${minutes}m`;
    } else {
      return "No deadline";
    }
  };

  // Function to handle task completion status toggle
  const togglePending = (taskId: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isPending: !task.isPending } : task
    );
    setTasks(updatedTasks);
  };

  // Function to handle editing a task
  const editTaskHandler = (task: Task) => {
    setEditTask(task);
    setShowEditModal(true);
  };

  // Function to save the edited task
  const saveEditedTask = (editedText: string, duration?: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === editTask?.id
        ? {
            ...task,
            text: editedText,
            deadline: duration ? calculateDeadline(duration) : undefined,
            duration: duration,
          }
        : task
    );
    setTasks(updatedTasks);
    setShowEditModal(false);
    setEditTask(null);
  };

  // Function to handle task deletion
  const deleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Function to handle the search query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Beautiful To-Do List</h2>

      {/* Search component */}
      <Search onSearch={handleSearch} />

      {/* Form for adding a new task */}
      <Form className="mb-3">
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Add a new task"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="number"
            placeholder="Duration (minutes)"
            value={newTaskDuration || ""}
            onChange={(e) => setNewTaskDuration(parseInt(e.target.value, 10))}
          />
        </Form.Group>
        <Button variant="primary" onClick={addTask}>
          Add Task
        </Button>
      </Form>

      {/* List of tasks */}
      <ListGroup>
        {tasks.map((task) => (
          <ListGroup.Item
            key={task.id}
            className={`custom-list-item ${task.isPending ? "pending" : ""} ${
              task.deadline && new Date() > task.deadline
                ? "alert alert-danger"
                : ""
            }`}
          >
            <div>{task.text}</div>
            {task.deadline && (
              <div className="deadline">
                Deadline: {task.deadline.toLocaleString()} ({task.remainingTime}
                )
              </div>
            )}
            <div className="float-end">
              <Button
                variant="success"
                className="mx-1"
                onClick={() => togglePending(task.id)}
              >
                {task.isPending ? "Mark Complete" : "Mark Pending"}
              </Button>
              <Button
                variant="warning"
                className="mx-1"
                onClick={() => editTaskHandler(task)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                className="mx-1"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Edit Task Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Edit task"
            defaultValue={editTask?.text}
            onChange={(e) => setNewTaskText(e.target.value)}
          />
          <Form.Group className="mt-3">
            <Form.Control
              type="number"
              placeholder="Duration (minutes)"
              value={editTask?.duration || ""}
              onChange={(e) => setNewTaskDuration(parseInt(e.target.value, 10))}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => saveEditedTask(newTaskText, newTaskDuration)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
