import React from 'react';
import { Grid, Table, TableBody, TableRow, TableCell, Button } from '@material-ui/core';
import Word from './Word';

function NewPage() {

    const [words, setWords] = React.useState([]);

    const handleNewWord = React.useCallback(
        (state) => {
            console.log(state);
            setWords((prev) => [...prev, state]);
        },
        [setWords]
    );

    const renderTable = React.useMemo(() => {
        return words.map( (row, index) => { return (
                <TableRow key={index}>
                    <TableCell align="left">{row.firstCase}</TableCell>
                    <TableCell align="left">{row.secondCase}</TableCell>
                    <TableCell align="left">{row.thirdCase}</TableCell>
                    <TableCell align="left">{row.translation}</TableCell>
                </TableRow>
            )});
    }, [words]);

    return (
        <div>
            <Grid container>
                <Word onSubmit={handleNewWord}></Word>                
                <Grid item xs={10}>
                    <Table>
                        <TableBody>{renderTable}</TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary">Save</Button>
                </Grid>
            </Grid>
            
        </div>
        );
}

export default NewPage;