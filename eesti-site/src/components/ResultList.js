import React from 'react';
import CreateIcon from '@material-ui/icons/Create';
import { Typography, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

export default function ResultList({ words, answers }) {

    const renderList = React.useMemo(
        () => {
            return (
                <List>
                    {words.map((word) => {
                        const answer = answers[word._id];
                        return (
                            <ListItem key={word._id}>
                                <ListItemIcon>
                                    <CreateIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="body1" color="error">
                                        {answer.firstCase} - {answer.secondCase} - {answer.thirdCase}
                                    </Typography>}
                                    secondary={<Typography variant="body2" color="primary">
                                        {word.firstCase} - {word.secondCase} - {word.thirdCase}
                                    </Typography>}
                                />
                            </ListItem>);
                    })}
                </List>);
        }, [words, answers]);

    return (<Typography component="div">{renderList}</Typography>);
}