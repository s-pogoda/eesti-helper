import React from 'react';
import { ListItem, ListItemIcon, ListItemText, Typography, Collapse, List } from '@material-ui/core';
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';

export default function TranslationListItem({ arrayValue }) {

    const [firstItem, ...otherItems] = arrayValue;
    const [open, setOpen] = React.useState(false);

    const handleClick = React.useCallback(() => setOpen((prev) => !prev), [setOpen]);

    const renderTranslationListItem = React.useMemo(
        () => {
            return (
                <List>
                    <ListItem button onClick={handleClick}>
                        <ListItemIcon>
                            <TripOriginIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="button" color="primary">{firstItem}</Typography>} />
                        { otherItems.length ? (open ? <ExpandLess /> : <ExpandMore />) : null}
                    </ListItem>
                    {otherItems.length ? (<Collapse in={open} timeout="auto" unmountOnExit>
                        <ListItem button >
                            <ListItemText primary={
                                <Typography color="primary" >
                                    {otherItems.join(", ")}
                                </Typography>} />
                        </ListItem>
                    </Collapse>) : (<></>)}
                </List>);
        }, [open, firstItem, otherItems, handleClick]);

    return (<>{renderTranslationListItem}</>);

}