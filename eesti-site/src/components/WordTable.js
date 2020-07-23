import React from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';

export default function WordTable({ headers, columns, data }) {

    const [state, setState] = React.useState({ columns: [], data: [] });

    React.useEffect(
        () => {
            const _cols = [];
            for (const index in headers) {
                _cols.push({ title: headers[index], field: columns[index] });
            }

            const _data = data.map(
                (row) => {
                    const _row = {};
                    columns.map((column) => _row[column] = Array.isArray(row[column]) ? row[column][0] : row[column]);
                    return _row;
                }
            );

            setState({ columns: _cols, data: _data });

            return () => setState({ columns: [], data: [] });

        }, [headers, columns, data, setState]
    );

    const renderTable = React.useMemo(
        () => {
            return (
                <MaterialTable
                    title="Estonian Words"
                    columns={state.columns}
                    data={state.data}
                ></MaterialTable>);
        }, [state]
    );

    return (<Typography component="div">{renderTable}</Typography>);

}