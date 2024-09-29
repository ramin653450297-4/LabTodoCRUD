"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Container, TextField, Button, List, ListItem, ListItemText, Typography, Box } from "@mui/material";

interface Todo {
  _id: string;
  name: string;
  note: string;
  status: boolean;
  dueDate: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState<Omit<Todo, "_id">>({
    name: "",
    note: "",
    status: false,
    dueDate: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/v1/todo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTodos(data.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleCreateTask = async () => {
    try {
      const response = await fetch("/api/v1/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        fetchTasks(); // Refresh the task list after creating
        setNewTask({ name: "", note: "", status: false, dueDate: "" });
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleToggleStatus = async (_id: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/v1/todo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id, status: !currentStatus }),
      });
      if (response.ok) {
        fetchTasks(); // Refresh task list after update
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteTask = async (_id: string) => {
    try {
      const response = await fetch("/api/v1/todo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      });
      if (response.ok) {
        fetchTasks(); // Refresh task list after deletion
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        TODO List
      </Typography>

      <div className={styles.newTask}>
        <TextField
          label="Task Name"
          variant="outlined"
          fullWidth
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />

        <Box mb={2} />
        <TextField
          label="Task Note"
          variant="outlined"
          fullWidth
          value={newTask.note}
          onChange={(e) => setNewTask({ ...newTask, note: e.target.value })}
        />

        <Box mb={2} />

        <TextField
          label="Due Date"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          inputProps={{
            min: new Date().toISOString().split("T")[0],
          }}
        />

        <Button variant="contained" color="primary" onClick={handleCreateTask} fullWidth>
          Create Task
        </Button>
      </div>

      <List className={styles.todoList}>
        {todos.map((todo) => (
          <ListItem key={todo._id} className={todo.status ? styles.completed : ""}>
            <ListItemText
              primary={todo.name}
              secondary={
                todo.note || todo.dueDate
                  ? `${todo.note ? todo.note : ""} ${todo.dueDate ? `- ${new Date(todo.dueDate).toLocaleDateString("th-TH")}` : ""}`
                  : ""
              }
            />

            <Button
              variant="outlined"
              className={todo.status ? styles.completeButton : styles.incompleteButton}
              onClick={() => handleToggleStatus(todo._id, todo.status)}
            >
              {todo.status ? "Mark Incomplete" : "Mark Complete"}
            </Button>

            <Button
              variant="outlined"
              className={styles.deleteButton}
              onClick={() => handleDeleteTask(todo._id)}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
