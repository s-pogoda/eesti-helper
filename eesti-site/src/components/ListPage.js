import React from 'react';
import { Typography } from '@material-ui/core';
import WordTable from './WordTable';

import request from '../requests/backend-request';

export default function ListPage() {

    const [state, setState] = React.useState({ data: [] });

    const headers = ["Translation", "MA-infinitive / 1st Case", "DA-infinitive / 2nd Case", "ME-form / 3rd Case"];
    const columns = ["translation", "firstCase", "secondCase", "thirdCase"];

    React.useEffect(() => {
        async function getData() {
            const response = await request.find(["all"]);
            setState((prev) => ({ ...prev, data: response.data }));
        }
        getData();

        return () => setState({ data: [] });
    }, [setState]);

    return (
        <Typography component="div">
            <WordTable headers={headers} columns={columns} data={state.data} />
        </Typography>
    );
}