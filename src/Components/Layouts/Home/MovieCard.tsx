import React from "react";
import {
  Card,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MovieCardProps } from "../../../types/Moviecard";

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isSupervisor,
  cardWidth,
  isXsScreen,
  onCardClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <Card
      onClick={() => onCardClick(movie.id || 0, movie.premium || false)}
      sx={{
        width: cardWidth,
        bgcolor: "#2b2b2b",
        color: "#fff",
        borderRadius: 2,
        overflow: "hidden",
        flexShrink: 0,
        cursor: "pointer",
        position: "relative",
        "&:hover .hover-overlay": {
          opacity: 1,
        },
        "&:active .hover-overlay": {
          opacity: 1,
        },
      }}
    >
      {isSupervisor && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 3,
            display: "flex",
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onEditClick(movie);
            }}
            sx={{
              bgcolor: "rgba(0,0,0,0.7)",
              color: "#fff",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.9)",
                color: "#00bcd4",
              },
              width: isXsScreen ? 28 : 32,
              height: isXsScreen ? 28 : 32,
            }}
          >
            <EditIcon sx={{ fontSize: isXsScreen ? 16 : 18 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e: React.MouseEvent) => onDeleteClick(e, movie.id || 0)}
            sx={{
              bgcolor: "rgba(0,0,0,0.7)",
              color: "red",
              width: isXsScreen ? 28 : 32,
              height: isXsScreen ? 28 : 32,
            }}
          >
            <DeleteIcon sx={{ fontSize: isXsScreen ? 16 : 18 }} />
          </IconButton>
        </Box>
      )}

      {movie.premium && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 2,
            bgcolor: "rgba(0,0,0,0.6)",
            borderRadius: "50%",
            p: 0.8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <WorkspacePremiumIcon
            sx={{
              color: "#FFD700",
              fontSize: isXsScreen ? 18 : 24,
            }}
          />
        </Box>
      )}

      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height={isXsScreen ? 300 : 400}
          image={
            movie.poster_url ||
            "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={movie.title || "Movie poster"}
          sx={{ height: isXsScreen ? 200 : 300, objectFit: "cover" }}
        />

        {/* Hover Overlay */}
        <Box
          className="hover-overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            opacity: 0,
            transition: "opacity 0.3s ease",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            zIndex: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}
          >
            {movie.title || "Unknown Title"}
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Released: {movie.release_year || "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Director: {movie.director || "Unknown"}
          </Typography>
          {movie.genre && (
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Genre: {movie.genre}
            </Typography>
          )}
          {movie.duration && (
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Runtime: {movie.duration} min
            </Typography>
          )}
         
        </Box>

        {/* Bottom Rating Tag */}
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: 10,
            zIndex: 2,
            bgcolor: "rgba(0,0,0,0.6)",
            borderRadius: 1,
            p: 0.5,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#fff" }}>
            {movie.rating ? `${movie.rating}/10` : "N/A"}
          </Typography>
          <StarIcon
            sx={{ color: "#FFD700", fontSize: isXsScreen ? 16 : 18, ml: 0.5 }}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default MovieCard;
