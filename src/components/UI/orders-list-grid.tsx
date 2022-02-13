import * as React from 'react';
import { Popper, Box, IconButton, ListItem, Paper, Typography, Button } from '@mui/material';
import { FC, useMemo, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Order, orderSimple } from '../../models/order-type';
import { clientsSelector, ordersSelector, productsSelector, userDataSelector } from '../../redux/store';
import { useMediaQuery } from "react-responsive";
import { DataGrid, GridActionsCellItem, GridCellEditCommitParams, GridColDef, GridRenderCellParams, GridRowHeightParams, GridRowId, GridRowParams, GridRowsProp, GridValueFormatterParams } from '@mui/x-data-grid';
import { getOrdersListFields, OrderListFields } from '../../config/orders-list-columns';
import { Delete } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Product, ProductBatch } from '../../models/product';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import { Subscription } from 'rxjs';
import { clientStore, orderStore } from '../../config/servicesConfig';
import { setClients, setOrders, updateOrder } from '../../redux/actions';
import { DeliveryAddress, UserData } from '../../models/user-data';
import storeConfig from "../../config/store-config.json"
import _ from 'lodash';
import { ConfirmationData, emptyConfirmationData } from '../../models/common/confirmation-type';
import DialogConfirm from '../UI/common/dialog';
import { getRandomInteger } from '../../utils/common/random';
import ModalInfo from './common/modal-info';
import { ProductOptionConfigured } from '../../models/product-options';
import FormAddOrder from './form-add-order';


interface GridCellExpandProps {
    value: string;
    width: number;
}

const colotState = new Map([
    ["waiting", "orange"],
    ["working", "aqua"],
    ["complete", "lime"]
]);

const OrdersListGrid: FC = () => {

    // /* dialog confirmation */
    const confirmationData = React.useRef<ConfirmationData>(emptyConfirmationData);
    const [dialogVisible, setdialogVisible] = useState(false);

    /* dialog modal */
    const textModal = useRef<string[]>(['']);
    const [modalVisible, setModalVisible] = useState(false);


    //**form edit order */
    const [formVisible, setformVisible] = useState(false);
    const [orderUpdate, setOrderUpdate] = useState(orderSimple);

    //*************************Redux***************************//
    const dispatch = useDispatch();
    const orders: Order[] = useSelector(ordersSelector);
    const clients: UserData[] = useSelector(clientsSelector);
    const products: Product[] = useSelector(productsSelector);
    const userData: UserData = useSelector(userDataSelector);



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

    //*****************castom grid cell **********************/

    function isOverflown(element: Element): boolean {
        return (
            element.scrollHeight > element.clientHeight ||
            element.scrollWidth > element.clientWidth
        );
    }

    const GridCellExpand = React.memo(function GridCellExpand(
        props: GridCellExpandProps,
    ) {
        const { width, value } = props;
        const wrapper = React.useRef<HTMLDivElement | null>(null);
        const cellDiv = React.useRef(null);
        const cellValue = React.useRef(null);
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const [showFullCell, setShowFullCell] = React.useState(false);
        const [showPopper, setShowPopper] = React.useState(false);

        const handleMouseEnter = () => {
            const isCurrentlyOverflown = isOverflown(cellValue.current!);
            setShowPopper(isCurrentlyOverflown);
            setAnchorEl(cellDiv.current);
            setShowFullCell(true);
        };

        const handleMouseLeave = () => {
            setShowFullCell(false);
        };

        React.useEffect(() => {
            if (!showFullCell) {
                return undefined;
            }

            function handleKeyDown(nativeEvent: KeyboardEvent) {
                // IE11, Edge (prior to using Bink?) use 'Esc'
                if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
                    setShowFullCell(false);
                }
            }

            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }, [setShowFullCell, showFullCell]);

        return (
            <Box
                ref={wrapper}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                    alignItems: 'center',
                    lineHeight: '24px',
                    width: 1,
                    height: 1,
                    position: 'relative',
                    display: 'flex',
                }}
            >
                <Box
                    ref={cellDiv}
                    sx={{
                        height: 1,
                        width,
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                    }}
                />
                <Box
                    ref={cellValue}
                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                    {value}
                </Box>
                {showPopper && (
                    <Popper
                        open={showFullCell && anchorEl !== null}
                        anchorEl={anchorEl}
                        style={{ width, marginLeft: -17 }}
                    >
                        <Paper
                            elevation={1}
                            style={{ minHeight: wrapper.current!.offsetHeight - 3 }}
                        >
                            {value.split('.').map(e => <Typography variant="body2" style={{ padding: 8 }}> {e} </Typography>)}
                        </Paper>
                    </Popper>
                )}
            </Box>
        );
    });

    function renderCellExpand(params: GridRenderCellParams<string>) {
        return (
            <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
        );
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
                field: "id", headerName: "Id order", flex: 20, align: 'center', headerAlign: 'center'
            },
            {
                field: "client", headerName: "Client", flex: 80, align: 'center', headerAlign: 'center', editable: "true"
            },
            {
                field: "address", headerName: "Address", flex: 100, align: 'center', headerAlign: 'center',
                editable: "true", renderCell: renderCellExpand
            },
            {
                field: "phone", headerName: "Phone", flex: 80, align: 'center', headerAlign: 'center', editable: "true"
            },
            {
                field: "products", headerName: "Product", flex: 150, align: 'center', headerAlign: 'center', editable: "true",
                renderCell: renderCellExpand
            },
            {
                field: "status", headerName: "Status", flex: 40, align: 'center', headerAlign: 'center',
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
                field: "date", headerName: "Date Time", flex: 50, align: 'center', headerAlign: 'center', type: 'date',
                valueFormatter: (params: GridValueFormatterParams) => {
                    const res = params.value!.toString().split("T");
                    return `${res[0]} ${res[1].substring(0, 5)}`;
                }
            },
            {
                field: "price", headerName: "Price", flex: 20, align: 'center', headerAlign: 'center', editable: "true"
            },
            {
                field: "actions", type: 'actions', flex: 40, align: 'center', headerAlign: 'center',
                getActions: (params: GridRowParams) => {
                    const adminAction = [
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit Order"
                            onClick={() => editOrder(params.id)}
                        />
                    ];
                    const userAction = [
                        <GridActionsCellItem
                            icon={<VisibilityIcon />}
                            label="Show Details"
                            onClick={() => showOrder(params.id)}
                        />,
                        <GridActionsCellItem
                            icon={<Delete />}
                            label="Delete"
                            onClick={() => rmOrder(params.id)}
                        />
                    ];
                    return userData.isAdmin ? userAction.concat(adminAction) : userAction;
                }
            }
        ];
    }

    //rows data gread
    const rows = useMemo(() => getRows(orders), [orders, dialogVisible]);


    function getRows(orders: Order[]): GridRowsProp {

        return orders.filter(order => userData.isAdmin || order.client.id == userData.id)
            .map(order => {
                return {
                    ...order,
                    client: order.client.name,
                    phone: order.client.phoneNumber,
                    address: !!order.client.deliveryAddress ? getClientAddressInfo(order.client.deliveryAddress) : '',
                    products: getInfoProduct(order.products),
                    price: getOrderPrice(order.products)

                }
            });
    };

    //**************************call back actions******************************//
    //remove
    function rmOrder(id: GridRowId) {
        console.log("remove order " + id);
        const order = getOrder(id.toString());
        console.log(order);
        if (!!order) {
            confirmationData.current.title = `remove order`;
            confirmationData.current.message = `Do you want remove order ID ${order?.id}`;
            confirmationData.current.handle = handleRemove.bind(undefined, id.toString());
            setdialogVisible(true);
        }
    }

    function handleRemove(id: string, status: boolean): void {
        if (status) {
            try {
                dispatch(orderStore.remove(id));
            } catch (err) {
            }
        }
        setdialogVisible(false);
    }
    //show detail info
    async function showOrder(id: GridRowId) {
        const order = orders.find(e => e.id === id);
        if (!!order) {
            textModal.current = getInfoOrder(order);
        } else {
            textModal.current = ["Not found"];
        }
        setModalVisible(true);
    }

    //update order
    function onCellEdit(params: GridCellEditCommitParams) {
        const id: string = params.id.toString();
        const oldOrder = getOrder(id);
        const newOrder = { ...oldOrder, [params.field]: params.value };
        if (oldOrder !== newOrder) {
            confirmationData.current.title = `update order`;
            confirmationData.current.message = `Do you want update order ID ${oldOrder?.id} old value ${(oldOrder as any)[params.field]} new value ${params.value}`;
            confirmationData.current.handle = handleUpdate.bind(undefined, newOrder as Order, id);
            setdialogVisible(true);
        }
    }

    function handleUpdate(order: Order, id: string, status: boolean): void {
        if (status) {
            dispatch(updateOrder(id, order));
        }
        setdialogVisible(false);
    }

    function editOrder(id: GridRowId) {
        const order = getOrder(id.toString());
        setformVisible(true);
        if(!!order) {
            setOrderUpdate(order);
            setformVisible(true);
        } else {
            console.log("not found " + id)
        }
    }


    //******************************************************************* */


    //*****************************Utils **********************************/

    function getClientAddressInfo(deliveryAddress: DeliveryAddress): string {
        let res = `st ${deliveryAddress.street}
        ${deliveryAddress.house ? ` ${deliveryAddress.house}.` : ``}  
        ${deliveryAddress.flat ? ` flat ${deliveryAddress.floor}.` : ``}
        ${deliveryAddress.floor ? ` floor ${deliveryAddress.floor}.` : ``}`;
        return res;
    }

    function getOrderPrice(products: ProductBatch[]) {
        return products.map(productBatch => {
            let priceOption = 0;
            productBatch.productConfigured.optionsConfigured.forEach(option => {
                priceOption += option.optionData.extraPay;
            })
            return (productBatch.productConfigured.base.basePrice + priceOption) * productBatch.count;
        })
            .reduce((prev, current) => prev + current);
    }

    function getProduct(id: string): Product | undefined {
        return products[products.findIndex(product => product.id === id)];
    }

    function getOrder(id: string): Order | undefined {
        return orders[orders.findIndex(order => order.id === id)];
    }

    function getClient(id: string): UserData | undefined {
        return clients[clients.findIndex(client => client.id == id)];
    }

    function getInfoOrder(order: Order): string[] {
        const res: string[] = [
            `Order ID  : ${order.id}`,
            `Clietn : ${order.client.name}`,
            `Phone : ${order.client.phoneNumber}`,
            `${!!order.client.deliveryAddress ? `Address : ${getClientAddressInfo(order.client.deliveryAddress)}` : ''}`,
            `${getInfoProduct(order.products)}`,
            `Status: ${order.status}`,
            `Total price: ${getOrderPrice(order.products)}`,
            `Data create: ${order.date.substring(0, 10)}`
        ];
        return res;
    }

    function getInfoProduct(products: ProductBatch[]) {
        let res = '';
        products.forEach(productOrder => {
            const { productConfigured, count } = productOrder;
            const option = getInfoOptions(productConfigured.optionsConfigured);
            res += `product: ${productConfigured.base.title} ${!!option ? `options: ${option} ` : ``}count: ${count}. `
        })
        return res;

    }

    function getInfoOptions(options: ProductOptionConfigured[]) {
        let res = '';
        options.forEach(element => {
            res += `${element.optionTitle} = ${element.optionData.name}`
        });
        return res;
    }

    // /********************************************************************** */

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper sx={{ width: { xs: '100vw', sm: '80vw' }, height: '80vh', marginTop: '2vh' }}>
                <DataGrid columns={columns} rows={rows} onCellEditCommit={onCellEdit} />
            </Paper>
            <DialogConfirm visible={dialogVisible} title={confirmationData.current.title} message={confirmationData.current.message} onClose={confirmationData.current.handle} />
            <ModalInfo title={"Detailed information about the order"} message={textModal.current} visible={modalVisible} callBack={() => setModalVisible(false)} />
            <FormAddOrder callBack={() => setformVisible(false)} visible={formVisible} orders={orderUpdate} />
        </Box>

    )
}

export default OrdersListGrid;