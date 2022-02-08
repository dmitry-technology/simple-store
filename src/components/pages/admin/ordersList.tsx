import { Box, IconButton, ListItem, Paper, Typography } from '@mui/material';
import { FC, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Order } from '../../../models/order-type';
import { clientSelector, ordersSelector, productsSelector } from '../../../redux/store';
import { useMediaQuery } from "react-responsive";
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowId, GridRowParams, GridRowsProp } from '@mui/x-data-grid';
import { getOrdersListFields, OrderListFields } from '../../../config/orders-list-columns';
import { Delete } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Client } from '../../../models/client-type';
import { Product } from '../../../models/product';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';




const OrdersList: FC = () => {
    //*************************Redux***************************//
    const dispatch = useDispatch();
    const orders: Order[] = useSelector(ordersSelector);
    const clients: Client[] = useSelector(clientSelector);
    const products: Product[] = useSelector(productsSelector);
    // console.log("order");
    // console.log(orders);
    // console.log("client");
    // console.log(clients);




    //********************Mobile or desktop********************//
    const isMobile = useMediaQuery({ maxWidth: 600, orientation: 'portrait' });
    const isLaptop = useMediaQuery({ maxWidth: 900 });
    const mode = useMemo(() => getMode(), [isMobile, isLaptop]);

    function getMode(): string {
        if (isMobile) {
            return 'isMobile';
        }
        if (isLaptop) {
            return 'isLaptop'
        }
        return 'isDesktop';
    }

    //************************Data Grid*************************//
    //column data grid
    const [columns, setColumns] = useState<GridColDef[]>([]);

    useEffect(() => {
        setColumns(getFilteredColumns(getOrdersListFields().get(mode) as OrderListFields[]));
    }, [mode]);

    function getFilteredColumns(fields: OrderListFields[]): any[] {
        return getColums().filter(column => fields.includes(column.field as any));
    }

    function getColums(): any[] {
        return [
            {
                field: "id", headerName: "Id order", flex: 50, align: 'center', headerAlign: 'center'
            },
            {
                field: "client", headerName: "Client", flex: 150, align: 'center', headerAlign: 'center'
            },
            {
                field: "address", headerName: "Address", flex: 150, align: 'center', headerAlign: 'center',
            },
            {
                field: "product", headerName: "Product", flex: 150, align: 'center', headerAlign: 'center'
            },
            {
                field: "status", headerName: "Status", flex: 150, align: 'center', headerAlign: 'center'
            },
            {
                field: "date", headerName: "Date", flex: 150, align: 'center', headerAlign: 'center'
            },
            {
                field: "price", headerName: "Price", flex: 100, align: 'center', headerAlign: 'center'
            },
            {
                field: "actions", type: 'actions', flex: 80, align: 'center', headerAlign: 'center',
                getActions: (params: GridRowParams) => {
                    return [
                        <GridActionsCellItem
                            icon={<Delete />}
                            label="Delete"
                            onClick={() => rmOrder(params.id)}
                        />,
                        <GridActionsCellItem
                            icon={<VisibilityIcon />}
                            label="Show Details"
                            onClick={() => showOrder(params.id)}
                        />,
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit Order"
                            onClick={() => editOrder(params.id)}
                        />
                    ]
                }
            }
        ];
    }

    //rows data gread
    const [rows, setRows] = useState<GridRowsProp>([]);

    useEffect(() => setRows(getRows(orders)), [orders]);

    function getRows(orders: Order[]): GridRowsProp {

        return orders.map(order => {

            if (clients.length > 0 && orders.length > 0) {
                console.log("true");
                const client = getClient(order.userId);
                const product = order.products.map(product => {
                    return [getProduct(product.productId), product.count];
                })
                return {
                    id: order.id,
                    client: client!.name,
                    address: client!.address,
                    products: product,  //TODO need from bd products. List with product name, option name, count
                    status: order.status,
                    date: order.dateCreate,
                    price: order.totalPrice
                }
            } else {
                console.log("else");
                return order;
            }
        });


    }

    function getProduct(id: number): Product | undefined {
        return products[products.findIndex(product => product.id === id)];
    }

    function getClient(id: number): Client | undefined {
        return clients[clients.findIndex(client => client.id === id)];
    }


    //call back actions
    function rmOrder(id: GridRowId) {
        console.log("remove order " + id);
        //TODO
    }
    function showOrder(id: GridRowId) {
        console.log("show order " + id);
        //TODO  
    }
    function editOrder(id: GridRowId) {
        console.log("edit order " + id);
        //TODO
    }






    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper sx={{ width: { xs: '100vw', sm: '80vw' }, height: '80vh', marginTop: '2vh' }}>
                <DataGrid columns={columns} rows={rows} />
            </Paper>
        </Box>
    )
}



export default OrdersList;