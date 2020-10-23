import React from 'react';
import { Container } from '@material-ui/core';
import WordTable from './WordTable';

import request from '../requests/backend-request';

export default function ListPage() {

    const [state, setState] = React.useState({ data: [], tags: [] });

    const headers = ["Translation", "MA-infinitive / 1st Case", "DA-infinitive / 2nd Case", "ME-form / 3rd Case", "Tags"];
    const columns = ["translation", "firstCase", "secondCase", "thirdCase", "tags"];

    React.useEffect(() => {
        async function getData() {
            const [dataResponse, tagsResponse] = await Promise.all([request.findWords(), request.findTags()]);
            setState({ data: dataResponse.data, tags: tagsResponse.data });
        }
        getData();

        return () => setState({ data: [], tags: [] });
    }, [setState]);

    return (
        <Container maxWidth="lg">
            <WordTable headers={headers} columns={columns} data={state.data} tags={state.tags} />
        </Container>
    );
}
