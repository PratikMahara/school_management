import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Outlet, useNavigate } from "react-router-dom";

// ICONS
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import TheatersIcon from '@mui/icons-material/Theaters';
import GradingIcon from '@mui/icons-material/Grading';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ExplicitIcon from '@mui/icons-material/Explicit';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import LogoutIcon from '@mui/icons-material/Logout';
import { CardMembership } from '@mui/icons-material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import createTransitions from '@mui/material/styles/createTransitions';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

export default function School() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const navArr = [
        { link:"/", component:"Home", icon:HomeIcon },
        { link: "/school", component: "Dashboard", icon: DashboardIcon },
        { link: "/school/class", component: "Class", icon:FormatListNumberedIcon },
        { link: "/school/subject", component: "Subjects", icon: MenuBookIcon },
        { link: "/school/students", component: "Students", icon: GroupIcon },
        { link: "/school/teachers", component: "Teachers", icon: GroupIcon },
        { link: "/school/periods", component: "Schedule", icon: CalendarMonthIcon },
        { link: "/school/attendance", component: "Attendance", icon: RecentActorsIcon },
        { link: "/school/examinations", component: "Examinations", icon: ExplicitIcon },
        { link: "/school/notice", component:"Notice", icon: CircleNotificationsIcon },
        { link: "/school/busRoute", component:"BusRoute", icon: DirectionsBusIcon },
        { link: "/school/syllabus", component:"Syllabus", icon: LibraryBooksIcon },
        { link: "/school/books", component:"Books", icon: LocalLibraryIcon },
        {link:"/school/admitcard", component:"AdmitCard" , icon:CardMembership},
        {link:"/school/complaints", component:"Complaints" , icon:ChecklistIcon},
        {link:"/school/certificate", component:"Certificate", icon:CardMembership},
        { link: "/logout", component:"Log Out", icon: LogoutIcon }
        
    ]
    const navigate = useNavigate();
    const handleNavigation = (link) => {
        navigate(link)
    }
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
  sx={{
    background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
    boxShadow: '0 2px 12px rgba(30,60,114,0.12)',
    color: '#fff',
    transition: 'background 0.5s',
  }}
  position="fixed"
  open={open}
>
  <Toolbar>
    <IconButton
      color="inherit"
      aria-label="open drawer"
      onClick={handleDrawerOpen}
      edge="start"
      sx={[
        {
          marginRight: 5,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 2,
          transition: 'background 0.3s',
          '&:hover': {
            background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
          }
        },
        open && { display: 'none' },
      ]}
    >
      <MenuIcon />
    </IconButton>
    <Typography
      variant="h6"
      noWrap
      component="div"
      sx={{
        fontWeight: 700,
        letterSpacing: '0.03em',
        color: '#fff',
        textShadow: '0 2px 8px #2a5298'
      }}
    >
      Paramount SMS
    </Typography>
  </Toolbar>
</AppBar>

<Drawer
  variant="permanent"
  open={open}
  sx={{
    '& .MuiDrawer-paper': {
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      color: '#fff',
      borderRight: 'none',
      boxShadow: '4px 0 24px rgba(30,60,114,0.16)',
      transition: 'background 0.5s',
      borderTopRightRadius: 24,
      borderBottomRightRadius: 24,
    }
  }}
>
  <DrawerHeader>
    <IconButton sx={{ color: '#fff' }} onClick={handleDrawerClose}>
      {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    </IconButton>
  </DrawerHeader>
  <Divider sx={{ background: 'rgba(255,255,255,0.15)' }} />
  <List sx={{
    height: "100%",
    py: 2,
    '& .MuiListItemButton-root': {
      borderRadius: 2,
      mx: 1,
      my: 0.5,
      transition: 'background 0.3s, box-shadow 0.3s',
      '&:hover': {
        background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
        boxShadow: '0 4px 16px rgba(106,130,251,0.15)',
        color: '#fff',
        '& .MuiListItemIcon-root': {
          color: '#fff',
          textShadow: '0 2px 8px #6a82fb',
        }
      }
    }
  }}>
    {navArr && navArr.map((navItem, index) => (
      <ListItem key={index} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={[
            {
              minHeight: 48,
              px: 2.5,
              borderRadius: 2,
              mb: 1,
              background: open ? 'rgba(255,255,255,0.08)' : 'none',
              transition: 'background 0.3s, color 0.3s',
              '&:active': {
                background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
              }
            },
            open
              ? { justifyContent: 'initial' }
              : { justifyContent: 'center' },
          ]}
          onClick={() => { handleNavigation(navItem.link) }}
        >
          <ListItemIcon
            sx={[
              {
                minWidth: 0,
                justifyContent: 'center',
                color: '#b2c2f0',
                fontSize: 28,
                transition: 'color 0.3s, text-shadow 0.3s',
              },
              open
                ? { mr: 3 }
                : { mr: 'auto' },
            ]}
          >
            <navItem.icon />
          </ListItemIcon>
          <ListItemText
            primary={navItem.component}
            sx={[
              {
                opacity: open ? 1 : 0,
                color: '#fff',
                fontWeight: 500,
                textShadow: '0 1px 4px #2a5298',
                letterSpacing: '0.04em',
                fontSize: '1.05rem',
                transition: 'opacity 0.3s, color 0.3s',
              }
            ]}
          />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
  <Divider sx={{ background: 'rgba(255,255,255,0.15)' }} />
</Drawer>
            <Box component="main" sx={{ flexGrow: 1,minHeight:'100vh'}}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box>
    );
}