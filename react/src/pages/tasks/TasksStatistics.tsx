import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useGetStatsQuery } from "../../store/tasks/tasksApi";

const COLORS = ["#0088FE", "#FFBB28"];

interface IPieData {
  name: string;
  value: number;
}

const StatisticsDashboard: React.FC = () => {
  const { data } = useGetStatsQuery();
  const [pieData, setPieData] = useState<IPieData[]>([]);

  useEffect(() => {
    if (data) {
      setPieData([
        { name: "Completadas", value: data.completedTasks },
        { name: "Pendientes", value: data.pendingTasks },
      ]);
    }
  }, [data]);

  return (
    <>
      {data && (
        <Grid container spacing={3}>
          {/* Tarjetas de estadísticas generales */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total de Tareas</Typography>
                <Typography variant="h4">{data.totalTasks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Tareas Completadas</Typography>
                <Typography variant="h4">{data.completedTasks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Tareas Pendientes</Typography>
                <Typography variant="h4">{data.pendingTasks}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Tasa de Finalización</Typography>
                <Typography variant="h4">{data.completionRate}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Estado de Tareas</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      label
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Tareas por Usuario</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.tasksByUser}>
                    <XAxis dataKey="userName" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default StatisticsDashboard;
