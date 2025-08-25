import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FaCrown } from "react-icons/fa";
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  fetchUserDetails,
  cancelSubscription,
  getSubscriptionStatuss,
} from "../../Utils/Api";

const UserDashboard = () => {
  interface Subscription {
    id: number;
    start_date: string;
    end_date: string;
    plan_type: string;
    status: string | null;
    expires_at?: string;
  }
  const [userData, setUserData] = useState({
    name: "",
    role: "",
    profile_picture_url: "",
  });

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const [user, subDataRaw] = await Promise.all([
          fetchUserDetails(),
          getSubscriptionStatuss(),
        ]);

        const activeSubscription: Subscription = subDataRaw.find(
          (sub) => sub.status === "active"
        );

        setUserData(user.user);

        if (activeSubscription) {
          setSubscription(activeSubscription);
          localStorage.setItem("plan", activeSubscription.plan_type);
        } else {
          setSubscription(null);
          localStorage.removeItem("plan");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        const userString = localStorage.getItem("user");
        if (userString) {
          try {
            const user = JSON.parse(userString);
            setUserData(user.user);
          } catch (err) {
            console.error("Invalid user data in localStorage");
          }
        }
        setSubscription(null);
        localStorage.removeItem("plan");
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (subscription?.end_date) {
      const calculateDaysLeft = () => {
        const endDate = new Date(subscription.end_date);
        const now = new Date();
        const timeDiff = endDate.getTime() - now.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setDaysLeft(days >= 0 ? days : 0);
      };

      calculateDaysLeft();
      const interval = setInterval(calculateDaysLeft, 1000 * 60 * 60); // Update every hour
      return () => clearInterval(interval); // Cleanup on unmount
    } else {
      setDaysLeft(null);
    }
  }, [subscription]);

  const handleOpenDialog = (type: string) => {
    setActionType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setActionType("");
  };

  const handleConfirmAction = async () => {
    if (actionType === "cancelSubscription") {
      try {
        await cancelSubscription();
        localStorage.removeItem("plan");
        setSubscription(null);
        setDaysLeft(null);
        alert("Subscription canceled successfully!");
      } catch (error) {
        console.error("Error canceling subscription:", error);
        alert("Failed to cancel subscription. Please try again.");
      }
    }
    handleCloseDialog();
  };

  const handleAddMovie = () => {
    navigate("/admin");
  };

  const handleSubscribe = () => {
    navigate("/subscription");
  };

  return (
    <Box
      sx={{
        minHeight: "30vh",
        maxHeight: "600px",
        backgroundColor: "black",
        color: "#E0E0E0",
        px: { xs: 3, sm: 5, md: 8, lg: 10 },
        py: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Box display="flex" alignItems="center" mb={{ xs: 2, sm: 3 }}>
        <IconButton
          onClick={() => navigate("/")}
          sx={{ color: "#E0E0E0", mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography
          variant="h5"
          sx={{
            color: "#E0E0E0",
            fontFamily: "'Poppins', sans-serif",
            textAlign: "left",
            fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
            fontWeight: 600,
          }}
        >
          User Dashboard
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: { xs: "100%", sm: 900, md: 1100 },
        }}
      >
        <Paper
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: "black",
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            width: { xs: "100%", sm: "50%" },
            transition: "transform 0.4s ease, box-shadow 0.4s ease",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 15px 40px rgba(0, 0, 0, 0.6)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "center" },
              gap: { xs: 3, sm: 4 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-start" },
                flex: { xs: "none", sm: "0 0 auto" },
              }}
            >
              <Avatar
                src={userData?.profile_picture_url || ""}
                alt={userData?.name || "User"}
                sx={{
                  width: { xs: 120, sm: 180, md: 220 },
                  height: { xs: 120, sm: 180, md: 220 },
                  border: "4px solid #26A69A",
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
                  transition: "transform 0.4s ease, border-color 0.4s ease",
                  "&:hover": {
                    transform: "scale(1.08)",
                    borderColor: "#80CBC4",
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                flex: { xs: "none", sm: 1 },
                textAlign: { xs: "center", sm: "left" },
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#E0E0E0",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "1.1rem", sm: "1.3rem" },
                  fontWeight: 600,
                }}
              >
                Welcome, {userData?.name || "User"}!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: userData?.role?.toLowerCase() === "supervisor" ? "#26A69A" : "#B0B0B0",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: userData?.role?.toLowerCase() === "supervisor" ? 600 : 400,
                  backgroundColor: userData?.role?.toLowerCase() === "supervisor" ? "rgba(38, 166, 154, 0.1)" : "transparent",
                  borderRadius: userData?.role?.toLowerCase() === "supervisor" ? 2 : 0,
                  px: userData?.role?.toLowerCase() === "supervisor" ? 0.5 : 0,
                  py: userData?.role?.toLowerCase() === "supervisor" ? 0.5 : 0,
                }}
              >
                Role: {userData?.role || "N/A"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#90A4AE",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                Manage your account, explore features, and stay in control.
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Paper
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: "black",
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            width: { xs: "100%", sm: "50%" },
            transition: "transform 0.4s ease, box-shadow 0.4s ease",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 15px 40px rgba(0, 0, 0, 0.6)",
            },
          }}
        >
          <Box
            sx={{
              textAlign: { xs: "center", sm: "left" },
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#E0E0E0",
                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
              }}
            >
              Subscription
            </Typography>
            {subscription ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1, sm: 2 },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#B0B0B0",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    {subscription.plan_type === "1-day"
                      ? "Basic"
                      : subscription.plan_type === "1-month"
                      ? "Standard"
                      : "Premium"}
                  </Typography>
                  <FaCrown
                    style={{
                      color: "#ebc634",
                      fontSize: "1.2rem",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "row" },
                    alignItems: { xs: "center", sm: "center" },
                    justifyContent: { xs: "flex-start", sm: "flex-start" }, // Align to the left
                    gap: { xs: 1, sm: 2 }, // Reduced gap to bring circular progress closer
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: { xs: "flex-start", sm: "flex-start" },
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#B0B0B0",
                        fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      Start Date: {subscription.start_date || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#B0B0B0",
                        fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      End Date: {subscription.end_date || "N/A"}
                    </Typography>
                  </Box>
                  {daysLeft !== null && (
                    <Box
                      sx={{
                        position: "relative",
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: { xs: 1, sm: 2 }, // Fine-tune the left margin
                      }}
                    >
                      <CircularProgress
                        variant="determinate"
                        value={(daysLeft / 30) * 100}
                        size={100}
                        thickness={4}
                        sx={{
                          color: "#26A69A",
                          position: "absolute",
                          "& .MuiCircularProgress-circle": {
                            strokeLinecap: "round",
                          },
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#E0E0E0",
                            fontSize: { xs: "1.2rem", sm: "1.4rem" },
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 700,
                          }}
                        >
                          {daysLeft}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#E0E0E0",
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 400,
                          }}
                        >
                          {daysLeft === 1 ? "Day" : "Days"} Left
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#90A4AE",
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  No active subscription. Subscribe now to unlock premium
                  features!
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleSubscribe}
                  sx={{
                    background:
                      "linear-gradient(45deg, #26A69A 30%, #4DB6AC 90%)",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    px: { xs: 3, sm: 4 },
                    py: 1.2,
                    borderRadius: 2,
                    minWidth: { xs: "120px", sm: "160px" },
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: "0 4px 12px rgba(38, 166, 154, 0.4)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #4DB6AC 30%, #80CBC4 90%)",
                      transform: "scale(1.05)",
                      boxShadow: "0 6px 18px rgba(38, 166, 154, 0.6)",
                    },
                  }}
                
               >
                  Subscribe
                </Button>
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: { xs: 2, sm: 2.5 },
                justifyContent: { xs: "center", sm: "flex-start" },
                alignItems: "center",
                mt: 2,
              }}
            >
              {subscription && (
                <Button
                  variant="contained"
                  onClick={() => handleOpenDialog("cancelSubscription")}
                  sx={{
                    backgroundColor: "red",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    px: { xs: 3, sm: 4 },
                    py: 1.2,
                    borderRadius: 2,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: "0 4px 12px rgba(239, 83, 80, 0.4)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  Cancel Subscription
                </Button>
              )}
              {userData?.role?.toLowerCase() === "supervisor" && (
                <Button
                  variant="contained"
                  onClick={handleAddMovie}
                  sx={{
                    backgroundColor: "#1976D2",
                    color: "white",
                    px: { xs: 3, sm: 4 },
                    py: 1.2,
                    borderRadius: 2,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: "0 4px 12px rgba(38, 166, 154, 0.4)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  Add Movie
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)",
            color: "#E0E0E0",
            borderRadius: 3,
            p: 2,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#E0E0E0",
            fontSize: { xs: "1rem", sm: "1.2rem" },
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Confirm Cancellation
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              color: "#B0B0B0",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Are you sure you want to cancel your subscription? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: "#90A4AE",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontFamily: "'Poppins', sans-serif",
              transition: "color 0.3s ease",
              "&:hover": {
                color: "#E0E0E0",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #EF5350 30%, #F44336 90%)",
              color: "#FFFFFF",
              px: { xs: 1, sm: 2 },
              borderRadius: 2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontFamily: "'Poppins', sans-serif",
              boxShadow: "0 4px 12px rgba(239, 83, 80, 0.4)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                background: "linear-gradient(45deg, #F44336 30%, #D32F2F 90%)",
                transform: "scale(1.05)",
                boxShadow: "0 6px 18px rgba(239, 83, 80, 0.6)",
              },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDashboard;