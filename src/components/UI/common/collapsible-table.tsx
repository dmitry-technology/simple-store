import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ClearIcon from '@mui/icons-material/Clear';
import { ProductBatch, ProductConfigured } from '../../../models/product';

function createData(product: ProductConfigured, count: number) {
    return {
        title: product.base.title,
        description: product.base.description,
        picture: product.base.picture,
        count: count,
        price: product.base.basePrice,
        options: product.optionsConfigured
    };
}

function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.title}
                </TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">{row.count}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell>
                    <IconButton><ClearIcon/></IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Options
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    {row.options.map(option => <TableRow>
                                        <TableCell>{option.optionTitle}</TableCell>
                                    </TableRow>)}
                                </TableHead>
                                <TableBody>
                                    {row.options.map(option => <TableRow>
                                        <TableCell>{option.optionData.name}</TableCell>
                                    </TableRow>)}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function CollapsibleTable(batches: ProductBatch[]) {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell align='center'>Title</TableCell>
                        <TableCell align='center'>Description</TableCell>
                        <TableCell align='center'>Count</TableCell>
                        <TableCell align='center'>Price</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {batches.map((batch, index) =>
                        <Row key={index} row={createData(batch.productConfigured, batch.count)} />)}
                </TableBody>
            </Table>
        </TableContainer>
    );
}