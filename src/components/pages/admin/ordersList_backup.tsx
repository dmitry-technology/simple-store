import { Box, IconButton, ListItem, Paper, Typography } from '@mui/material';
import { FC, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Order } from '../../../models/order-type';
import { clientsSelector, ordersSelector, productsSelector } from '../../../redux/store';
import { useMediaQuery } from "react-responsive";
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowHeightParams, GridRowId, GridRowParams, GridRowsProp, GridValueFormatterParams } from '@mui/x-data-grid';
import { getOrdersListFields, OrderListFields } from '../../../config/orders-list-columns';
import { Delete } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Product } from '../../../models/product';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import { Subscription } from 'rxjs';
import { clientStore, orderStore } from '../../../config/servicesConfig';
import { setClients, setOrders } from '../../../redux/actions';
import { DeliveryAddress, UserData } from '../../../models/user-data';
import storeConfig from "../../../config/store-config.json"
import _ from 'lodash';

const colotState = new Map([
    ["waiting", "orange"],
    ["working", "aqua"],
    ["complite", "lime"]
]);

const OrdersList: FC = () => {

    //subscriber clients
    useEffect(() => {
        const subscription = subscribeToClients();
        return () => subscription.unsubscribe();
    }, [])

    function subscribeToClients(): Subscription {
        return clientStore.getAll().subscribe({
            next(clients: UserData[]) {
                dispatch(setClients(clients));
            }
        })
    }

    //subscriber orders
    useEffect(() => {
        const subscription = subscribeToOrders();
        return () => subscription.unsubscribe();
    }, [])

    function subscribeToOrders(): Subscription {
        return orderStore.getAll().subscribe({
            next(orders: Order[]) {
                dispatch(setOrders(orders));
            }
        })
    }


    //*************************Redux***************************//
    const dispatch = useDispatch();
    const orders: Order[] = useSelector(ordersSelector);
    const clients: UserData[] = useSelector(clientsSelector);
    const products: Product[] = useSelector(productsSelector);


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
                field: "id", headerName: "Id order", flex: 30, align: 'center', headerAlign: 'center'
            },
            {
                field: "client", headerName: "Client", flex: 100, align: 'center', headerAlign: 'center'
            },
            {
                field: "address", headerName: "Address", flex: 100, align: 'center', headerAlign: 'center',
            },
            {
                field: "phone", headerName: "Phone", flex: 100, align: 'center', headerAlign: 'center'
            },
            {
                field: "product", headerName: "Product", flex: 150, align: 'center', headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => {
                    return (
                        <Box sx={{ width: '100%' }}>
                            <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }}>{params.value}</Typography>
                        </Box>
                    )
                }
            },
            {
                field: "status", headerName: "Status", flex: 50, align: 'center', headerAlign: 'center',
                editable: "true", type: "singleSelect", valueOptions: storeConfig.statusOrder,
                renderCell: (params: GridRenderCellParams) => {
                    return (
                        <Box sx={{ backgroundColor: colotState.get(params.value), color: 'white', width: '80%', textAlign: 'center' }}>
                            <Typography>{params.value}</Typography>
                        </Box>
                    )
                }
            },
            {
                field: "date", headerName: "Date", flex: 50, align: 'center', headerAlign: 'center', type: 'date',
                valueFormatter: (params: GridValueFormatterParams) => {
                    return params.value!.toString().substring(0, 10);
                }
            },
            {
                field: "price", headerName: "Price", flex: 30, align: 'center', headerAlign: 'center'
            },
            {
                field: "actions", type: 'actions', flex: 80, align: 'center', headerAlign: 'center',
                getActions: (params: GridRowParams) => {
                    return [
                        <GridActionsCellItem
                            icon={<VisibilityIcon />}
                            label="Show Details"
                            onClick={() => showOrder(params.id)}
                        />,
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit Order"
                            onClick={() => editOrder(params.id)}
                        />,
                        <GridActionsCellItem
                            icon={<Delete />}
                            label="Delete"
                            onClick={() => rmOrder(params.id)}
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
                const client = getClient(order.userId);
                const products = order.products.map(product => {
                    return { product: getProduct(product.productId), count: product.count };
                });
                return {
                    id: order.id,
                    client: client!.name,
                    phone: client!.phoneNumber,
                    address: getClientAddressInfo(client!.deliveryAddress as DeliveryAddress),
                    product: getProductInfo(products as { product: Product, options: Object, count: number }[]),
                    status: order.status,
                    date: order.dateCreate,
                    price: order.totalPrice
                }
            } else {
                return {};
            }
        });
    }

    function getProductInfo(products: { product: Product, options: Object, count: number }[]): string {
        let res = '';

        products.forEach(product => {
            let options = '';
            _.keys(options).forEach(option => {
                options += option;
            });
            res += `product: ${product.product.title} options: ${options} count: ${product.count}. `
        })
        return res;
    }

    function getClientAddressInfo(deliveryAddress: DeliveryAddress): string {
        let res = `${deliveryAddress.street} ${deliveryAddress.house}`;
        return res;
    }

    function getProduct(id: string): Product | undefined {
        return products[products.findIndex(product => product.id === id)];
    }

    function getClient(id: string): UserData | undefined {
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

    //**************************** */
    function RenderExpandCellGrid() {
        return (
          <div style={{ height: 300, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} />
          </div>
        );
      }



    //****************************** */

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper sx={{ width: { xs: '100vw', sm: '80vw' }, height: '80vh', marginTop: '2vh' }}>
                <DataGrid columns={columns} rows={rows}
                />
            </Paper>
        </Box>
    )
}



export default OrdersList;