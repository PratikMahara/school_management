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
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Outlet, useNavigate } from "react-router-dom";

// ICONS
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import TheatersIcon from '@mui/icons-material/Theaters';
import GradingIcon from '@mui/icons-material/Grading';
import HomeIcon from '@mui/icons-material/Home';
 import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExplicitIcon from '@mui/icons-material/Explicit';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PaymentIcon from '@mui/icons-material/Payment';
import AirlineSeatFlatIcon from '@mui/icons-material/AirlineSeatFlat';
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

export default function Student() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const navArr = [
        // {link:"/", component:"Home", icon:HomeIcon},
        // { link: "/student", component: "Dashboard", icon: DashboardIcon },
        { link: "/student/student-details", component: "Your Details", icon: DashboardIcon },
        { link: "/student/periods", component: "Periods", icon: CalendarMonthIcon },
        { link: "/student/attendance", component: "Attendance", icon:GradingIcon },
        { link: "/student/examinations", component: "Examination", icon: ExplicitIcon },
        {link:"/student/notice", component:"Notice", icon: CircleNotificationsIcon},
        {link:"/student/busRoute", component:"Bus Route", icon: DirectionsBusIcon},
        {link:"/student/fee", component:"Due Fee", icon: PaymentIcon},
        { link: "/student/result", component: "Result", icon:GradingIcon },
        {link:"/student/syllabus", component:"Student Syllabus", icon: LibraryBooksIcon},
        {link:"/student/books", component:"Student Books", icon: LocalLibraryIcon},
        {link:"/student/pastquestion", component:"Past Question", icon: LocalLibraryIcon},
        {link:"/student/10sets", component:"10 Sets", icon: LocalLibraryIcon},

        {link:"/student/leaveapplication", component:"Leave Application", icon: AirlineSeatFlatIcon},
        {link:"/logout", component:"Log Out", icon: LogoutIcon}

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
           <AppBar position="fixed" open={open}
  sx={{
    background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
    boxShadow: '0 2px 12px rgba(30,60,114,0.12)',
    color: '#fff'
  }}
>
  <Toolbar>
    <IconButton
      color="inherit"
      aria-label="open drawer"
      onClick={handleDrawerOpen}
      edge="start"
      sx={{
        marginRight: 5,
        ...(open && { display: 'none' }),
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 2,
        '&:hover': {
          background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
        }
      }}
    >
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" noWrap component="div"
      sx={{
        fontWeight: 700,
        letterSpacing: '0.03em',
        color: '#fff',
        textShadow: '0 2px 8px #2a5298'
      }}
    >
      School Management System Student
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

            <Box component="main" sx={{ flexGrow: 1 }}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box>
    );
}