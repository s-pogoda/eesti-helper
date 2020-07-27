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
                        const answerText = answer ? `${answer.firstCase} - ${answer.secondCase} - ${answer.thirdCase}` : `${word.translation[0]} - not filled`;
                        return (
                            <ListItem key={word._id}>
                                <ListItemIcon>
                                    <CreateIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="body1" color="error">
                                        {answerText}
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