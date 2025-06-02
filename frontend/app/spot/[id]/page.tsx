"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { surfSpots } from "../../../src/data/spots";
import { Box, Typography, Paper, Button, Grid, Card, CardContent, Divider } from "@mui/material";

export default function SpotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const spot = surfSpots.find((s) => s.id === params.id);
  if (!spot) return <Box p={4}><Typography>Spot not found.</Typography></Box>;
  return (
    <Box p={4}>
      <Button variant="outlined" onClick={() => router.back()} sx={{ mb: 3 }}>Back to Map</Button>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>{spot.name}</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Today's Conditions: <b>{spot.conditionsRating}</b>
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{spot.description}</Typography>
        <Typography variant="body2">Difficulty: {spot.difficulty}</Typography>
      </Paper>
      <Grid container spacing={3}>
        {/* Current Conditions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Current Conditions</Typography>
              <Typography variant="body2">Swell: {spot.currentConditions.swellHeight}ft @ {spot.currentConditions.swellPeriod}s ({spot.currentConditions.swellDirection})</Typography>
              <Typography variant="body2">Wind: {spot.currentConditions.windSpeed}mph {spot.currentConditions.windDirection}</Typography>
              <Typography variant="body2">Tide: {spot.currentConditions.tide}</Typography>
              <Typography variant="body2">Water Temp: {spot.currentConditions.waterTemp}°F</Typography>
              <Typography variant="body2">Air Temp: {spot.currentConditions.airTemp}°F</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Best Conditions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Best Conditions</Typography>
              <Typography variant="body2">Swell: {spot.bestConditions.swellDirection.join(', ')} {spot.bestConditions.swellSize}</Typography>
              <Typography variant="body2">Wind: {spot.bestConditions.windDirection.join(', ')}</Typography>
              <Typography variant="body2">Tide: {spot.bestConditions.tide.join(', ')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Forecast */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Forecast</Typography>
              {spot.forecast.map((f, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">{f.date}</Typography>
                  <Typography variant="body2">Swell: {f.swellHeight}ft @ {f.swellPeriod}s ({f.swellDirection})</Typography>
                  <Typography variant="body2">Wind: {f.windSpeed}mph {f.windDirection}</Typography>
                  {i < spot.forecast.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 