import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Tabs, Tab, Typography, Box } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
import NewPage from './components/NewPage';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return(
    <Typography 
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}

export default function App () {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          variant="fullWidth"
          aria-label="action tabs example"
        >
          <Tab label="Add" {...a11yProps(0)}/>
          <Tab label="List" {...a11yProps(1)}/>
          <Tab label="Quiz" {...a11yProps(2)}/>
        </Tabs>
      </AppBar>
      <TabPanel index={0} value={value}>
        <NewPage />
      </TabPanel>
      <TabPanel index={1} value={value}>List of learned words</TabPanel>
      <TabPanel index={2} value={value}>Quiz</TabPanel>
    </div>
    );
}
