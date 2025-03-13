import React, { useState } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  IconButton,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CheckCircle, Add } from "@mui/icons-material";
import {
  ITask,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../store/tasks/tasksApi";
import { useAppSelector } from "../../store/index";

const TaskList: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const [newTask, setNewTask] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const { data: tasks, isLoading, refetch } = useGetTasksQuery();

  const addTask = async () => {
    if (!newTask.trim()) return;
    await createTask({
      title: newTask,
      status: "pending",
      user: auth.user,
    }).unwrap();
    setNewTask("");
    setOpen(false);
    refetch();
  };

  const completeTask = async (id: string) => {
    await updateTask(id).unwrap();
    refetch();
  };

  const getTimeDifference = (createdAt: string, updatedAt: string) => {
    const diff = new Date(updatedAt).getTime() - new Date(createdAt).getTime();
    const minutes = Math.floor(diff / 60000);
    return `${minutes} min`;
  };

  return (
    <Paper
      style={{
        padding: 16,
        margin: "auto",
        marginTop: 20,
        position: "relative",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Lista de Tareas
      </Typography>
      <IconButton
        color="primary"
        onClick={() => setOpen(true)}
        style={{ position: "absolute", top: 16, right: 16 }}
      >
        <Add />
      </IconButton>
      {!isLoading && tasks && (
        <List>
          {tasks.map((task: ITask) => (
            <ListItem
              alignItems="flex-start"
              key={task._id}
              secondaryAction={
                task.status === "pending" && (
                  <IconButton
                    edge="end"
                    color="success"
                    onClick={() => completeTask(task._id)}
                  >
                    <CheckCircle />
                  </IconButton>
                )
              }
            >
              <ListItemText
                primary={task.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "text.primary", display: "inline" }}
                    >
                      {task.user.nickname}
                    </Typography>
                    {` - ${
                      task.status === "completed" ? "Completada" : "Pendiente"
                    }`}
                  </React.Fragment>
                }
                style={{ textDecoration: task.status === "completed" ? "line-through" : "none" }}
              />
              <ListSubheader>
                {task.status === "completed" && (
                  <Typography variant="body2" color="textSecondary">
                    Tiempo tomado:{" "}
                    {getTimeDifference(task.createdAt, task.updatedAt)}
                  </Typography>
                )}
              </ListSubheader>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Agregar Nueva Tarea</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Título de la tarea"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={addTask} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TaskList;
