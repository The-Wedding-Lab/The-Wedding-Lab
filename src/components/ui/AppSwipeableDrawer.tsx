import { DragHandle } from "@mui/icons-material";
import { Box, SwipeableDrawer, Typography } from "@mui/material";

const AppSwipeableDrawer = ({
  open,
  onOpen,
  onClose,
  title,
  children,
  anchor = "bottom",
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  anchor?: "bottom" | "top" | "left" | "right";
}) => {
  return (
    <SwipeableDrawer
      anchor={anchor}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      sx={{
        zIndex: 999,
        "& .MuiDrawer-paper": {
          width: "100%",
          maxHeight: "90vh",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          pb: "30px",
        },
      }}
    >
      <Box sx={{ width: "100%", maxHeight: "90vh", overflow: "auto" }}>
        <Box
          className="drawer-header"
          sx={{
            position: "sticky",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2000,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              bgcolor: "background.paper",
              zIndex: 1,
              position: "relative",
            }}
          >
            <DragHandle fontSize="large" />
            <Typography
              fontSize={18}
              fontWeight={600}
              sx={{
                width: "100%",
                textAlign: "center",
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ p: 2 }}>{children}</Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default AppSwipeableDrawer;
