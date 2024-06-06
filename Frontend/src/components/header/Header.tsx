import clientLogo from "../../assets/images/rt-logo.svg";
import ProfileIcon from "../../assets/images/profile-icon.svg";
import SearchBar from "../searchBar/SearchBar";
import { CiLight } from "react-icons/ci";
import { Avatar, Button } from "@mui/material";
import React from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <div className="row mx-0">
        <div className="col-12 header d-flex justify-content-between">
          <img className="top-bar-logo" src={clientLogo} alt="react logo" />
          <SearchBar />
          <CiLight />

          <div className="profileWrapper d-flex flex-column">
            <Button
              className="profile d-flex align-items-center"
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <div className="userImg">
                <span className="rounded-circle">
                  <img
                    className="top-bar-icon"
                    src={ProfileIcon}
                    alt="profile"
                  />
                </span>
              </div>
            </Button>
            <Button>
              <div></div>
            </Button>
          </div>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
