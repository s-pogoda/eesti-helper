import React from 'react';
import { ListItem, ListItemIcon, ListItemText, Typography, Collapse, List } from '@material-ui/core';
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import { ExpandMore, ExpandLess } from '@material-ui/icons';

export default function TranslationListItem({ arrayValue }) {

    const [open, setOpen] = React.useState(false);

    const handleClick = React.useCallback(() => {
        setOpen(!open);

    }, [open, setOpen]
    );

    const renderItem = React.useMemo(
        () => {
            if (arrayValue.length > 1) {
                return (
                    <List>
                        <ListItem button onClick={handleClick}>
                            <ListItemIcon>
                                <TripOriginIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="button" color="primary">{arrayValue[0]}</Typography>} />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <ListItem button >
                                <ListItemText primary={
                                    <Typography color="primary" >
                                        {arrayValue.slice(1).join(", ")}
                                    </Typography>} />
                            </ListItem>
                        </Collapse>
                    </List>);

            } else {
                return (
                    <ListItem>
                        <ListItemIcon><TripOriginIcon color="primary" /></ListItemIcon>
                        <ListItemText primary={<Typography variant="button" color="primary">{arrayValue[0]}</Typography>} />
                    </ListItem>);
            }
        }, [arrayValue, open, handleClick]);

    return (
        <Typography component="div">
            {renderItem}
        </Typography>);
}