import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { MovieCardProps } from "../../../types/MainMovieCard";

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  userRole,
  onCardClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <Box
      onClick={() => onCardClick(movie.id, movie.premium)}
      sx={{
        position: "relative",
        width: { xs: "100%", sm: "45%", md: "35%", lg: "18%" },
        height: { xs: "85vh", sm: "65vh", md: "55vh" },
        bgcolor: "black", 
        color: "#fff",
        cursor: "pointer",
        overflow: "hidden",
        boxShadow: "0px 4px 15px  rgba(255, 255, 255, 0.2)",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.02)" },
        "&:hover .movie-overlay": {
          opacity: 1,
          pointerEvents: "auto",
        },
      }}
    >
      {movie.premium && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 2,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "50%",
            padding: "1px",
          }}
        >
          <WorkspacePremiumIcon sx={{ color: "gold" }} />
        </Box>
      )}

      {userRole === "supervisor" && (
        <>
          <IconButton
            sx={{
              width: "2rem",
              height: "2rem",
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 2,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(movie);
            }}
          >
            <EditIcon sx={{ fontSize: "xl", color: "white" }} />
          </IconButton>
          <IconButton
            sx={{
              width: "2rem",
              height: "2rem",
              position: "absolute",
              top: 8,
              right: 45,
              zIndex: 2,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(movie.id);
            }}
          >
            <DeleteIcon sx={{ fontSize: "xl", color: "red" }} />
          </IconButton>
        </>
      )}

      <Card
        sx={{
          boxShadow: "none",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "black", 
        }}
      >
        <Box sx={{ position: "relative", height: "80%" }}>
          <CardMedia
            component="img"
            image={movie.poster_url || movie.banner_url}
            alt={movie.title}
            sx={{ height: "100%", objectFit: "cover" }}
          />
          <Box
            className="movie-overlay"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              opacity: 0,
              pointerEvents: "none",
              transition: "opacity 0.3s",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
            }}
          >
             <Typography variant="body2" sx={{ color: "white", mb: 0.5 }}>
              Year: {movie.release_year}
            </Typography>
            <Typography variant="body2" sx={{ color: "white", mb: 0.5 }}>
              Duration: {movie.duration} min
            </Typography>
            <Typography variant="body2" sx={{ color: "white", mb: 0.5 }}>
              Director: {movie.director}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 0.5, bgcolor: "black" }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              color: "white",
              wordBreak: "break-word",
              mt:1,
              lineHeight: 0.5,
            }}
          >
            {movie.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
              bgcolor: "black", 
              borderRadius: 1,
              px: 1,
              py: 0.5,
              width: "fit-content",
            }}
          >
            <Typography variant="body2" sx={{ color: "#fff" }}>
              {movie.rating}/10
            </Typography>
            <StarIcon sx={{ color: "yellow", fontSize: 18, ml: 0.5 }} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MovieCard;
