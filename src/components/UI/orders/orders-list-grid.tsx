import * as React from 'react';
import { Popper, Box, Paper, Typography, ListItem, List } from '@mui/material';
import { FC, useMemo, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Order, orderSimple } from '../../../models/order-type';
import { ordersSelector, userDataSelector } from '../../../redux/store';
import { useMediaQuery } from "react-responsive";
import { DataGrid, GridActionsCellItem, GridCellEditCommitParams, GridColDef, GridRenderCellParams, GridRowId, GridRowParams, GridRowsProp, GridValueFormatterParams } from '@mui/x-data-grid';
import { getOrdersListFields, OrderListFields } from '../../../config/orders-list-columns';
import { Delete } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { ProductBatch } from '../../../models/product';
import { orderState } from '../../../config/servicesConfig';
import { updateOrderAction, removeOrderAction } from '../../../redux/actions';
import { DeliveryAddress, UserData } from '../../../models/user-data';
import { ConfirmationData, emptyConfirmationData } from '../../../models/common/confirmation-type';
import DialogConfirm from '../common/dialog';
import ModalInfo from '../common/modal-info';
import { ProductOptionConfigured } from '../../../models/product-options';
import FormUpdateOrder from './order-update';

//status order from service config
const arrStatus = Array.from(orderState.keys());


const OrdersListGrid: FC = () => {

    //* dialog confirmation */
    const confirmationData = React.useRef<ConfirmationData>(emptyConfirmationData);
    const [dialogVisible, setdialogVisible] = useState(false);

    //* dialog modal */
    const textModal = useRef<string[]>(['']);
    const [modalVisible, setModalVisible] = useState(false);

    //* form edit order */
    const [formVisible, setformVisible] = useState(false);
    const [orderUpdate, setOrderUpdate] = useState(orderSimple);

    //*************************Redux***************************//
    const dispatch = useDispatch();
    const orders: Order[] = useSelector(ordersSelector);
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

    //*****************castom grid cell **********************//
    interface GridCellExpandProps {
        value: string;
        width: number;
    }

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
                        style={{ width: '50vw'}}
                    >
                        <Paper
                            elevation={1}
                            style={{ minHeight: wrapper.current!.offsetHeight - 3 }}
                        >
                            {value.split('Product name:').map((e, index) => {
                               return <List>
                                    <ListItem>
                                    <Typography key={index} variant="body2"> {e} </Typography>
                                    </ListItem>
                                </List>
                            })}
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


    //**********************Data Grid************************//
    //* column data grid */
    const [columns, setColumns] = useState<GridColDef[]>([]);

    useEffect(() => {
        setColumns(getFilteredColumns(getOrdersListFields().get(mode) as OrderListFields[]));
    }, [mode, orders, userData]);

    function getFilteredColumns(fields: OrderListFields[]): any[] {
        return getColums().filter(column => fields.includes(column.field as any));
    }

    function getColums(): any[] {
        return [
            {
                field: "id", headerName: "Id order", flex: 20, align: 'center', headerAlign: 'center'
            },
            userData.isAdmin && {
                field: "client", headerName: "Client", flex: 80, align: 'center', headerAlign: 'center'
            },
            userData.isAdmin && {
                field: "address", headerName: "Address", flex: 100, align: 'center', headerAlign: 'center',
                renderCell: renderCellExpand
            },
            userData.isAdmin && {
                field: "phone", headerName: "Phone", flex: 40, align: 'center', headerAlign: 'center'
            },
            {
                field: "products", headerName: "Product", flex: 150, align: 'center', headerAlign: 'center',
                renderCell: renderCellExpand
            },
            {
                field: "status", headerName: "Status", flex: 40, align: 'center', headerAlign: 'center',
                editable: userData.isAdmin, type: "singleSelect", valueOptions: arrStatus,
                renderCell: (params: GridRenderCellParams) => {
                    return (
                        <Box sx={{ backgroundColor: orderState.get(params.value), color: 'white', width: '80%', textAlign: 'center' }}>
                            <Typography>{params.value}</Typography>
                        </Box>
                    )
                }
            },
            {
                field: "date", headerName: "Date Time", flex: 50, align: 'center', headerAlign: 'center', type: 'date',
                valueFormatter: (params: GridValueFormatterParams) => {
                    return formatDate(params.value!.toString());
                }
            },
            {
                field: "price", headerName: "Price", flex: 20, align: 'center', headerAlign: 'center', editable: "true"
            },
            {
                field: "actions", type: 'actions', flex: 40, align: 'center', headerAlign: 'center',
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
                            disabled={isActiveOrder(params.id)}
                            onClick={() => editOrder(params.id)}
                        />,
                        <GridActionsCellItem
                            icon={<Delete />}
                            label="Delete"
                            disabled={isActiveOrder(params.id)}
                            onClick={() => rmOrder(params.id)}
                        />
                    ]
                }
            }
        ];
    }
    //* rows data grid */
    const rows = useMemo(() => getRows(orders), [orders, dialogVisible]);

    function getRows(orders: Order[]): GridRowsProp {
        return orders.filter(order => userData.isAdmin || order.client.id == userData.id)
            .map(order => {
                return {
                    ...order,
                    client: (!!order.client && !!order.client.name) ? order.client.name : 'not found',
                    phone: (!!order.client && !!order.client.phoneNumber) ? order.client.phoneNumber : 'not found',
                    address: (!!order.client && !!order.client.deliveryAddress) ? getClientAddressInfo(order.client.deliveryAddress) : 'not found',
                    products: (!!order.products && !!order.products.length) ? getInfoProduct(order.products) : 'not found',
                    price: (!!order.products) ? getOrderPrice(order.products) : 'not found'
                }
            });
    };

    //**************************call back actions******************************//
    //* table action   */
    //begin form order update
    function editOrder(id: GridRowId) {
        const order = getOrder(id.toString());
        if (!!order) {
            setOrderUpdate(order);
            setformVisible(true);
        } else {
            console.log("not found " + id)
        }
    }
    //remove order
    function rmOrder(id: GridRowId) {
        const order = getOrder(id.toString());
        if (!!order) {
            confirmationData.current.title = `remove order`;
            confirmationData.current.message = `Do you want remove order ID ${order?.id}`;
            confirmationData.current.handle = handleRemove.bind(undefined, id.toString());
            setdialogVisible(true);
        }
    }
    //show detail info
    function showOrder(id: GridRowId) {
        const order = orders.find(e => e.id === id);
        if (!!order) {
            textModal.current = getInfoOrder(order);
        } else {
            textModal.current = ["Not found"];
        }
        setModalVisible(true);
    }
    //handler remove
    function handleRemove(id: string, status: boolean): void {
        if (status) {
            try {
                dispatch(removeOrderAction(id));
            } catch (err) {
            }
        }
        setdialogVisible(false);
    }

    //* update table order */
    function onCellEdit(params: GridCellEditCommitParams) {
        const id: string = params.id.toString();
        const oldOrder = getOrder(id);
        const newOrder = { ...oldOrder, [params.field]: params.value };
        if (oldOrder != newOrder) {
            confirmationData.current.title = `update order`;
            confirmationData.current.message = `Do you want update ${params.field} order ID ${oldOrder?.id} from ${(oldOrder as any)[params.field]} at ${params.value}`;
            confirmationData.current.handle = handleUpdate.bind(undefined, newOrder as Order, id);
            setdialogVisible(true);
        }
    }
    //handler update
    function handleUpdate(order: Order, id: string, status: boolean): void {
        if (status) {
            dispatch(updateOrderAction(id, order));
        }
        setdialogVisible(false);
    }

    //*****************************Utils **********************************/
    //* get information address about client */
    function getClientAddressInfo(deliveryAddress: DeliveryAddress): string {
        let res = `St "${deliveryAddress.street}
        ${deliveryAddress.house ? ` № ${deliveryAddress.house}"` : ``}  
        ${deliveryAddress.flat ? ` apt "${deliveryAddress.floor}"` : ``}
        ${deliveryAddress.floor ? ` floor "${deliveryAddress.floor}"` : ``}
        ${deliveryAddress.comment ? ` comment "${deliveryAddress.comment}"` : ``}`;
        return res;
    }
    //* get order price */
    function getOrderPrice(products: ProductBatch[]) {
        return products.map(productBatch => {
            let priceOption = 0;
            productBatch.productConfigured.optionsConfigured.forEach(option => {
                priceOption += option.optionData.extraPay;
            })
            return (productBatch.productConfigured.base.basePrice + priceOption) * productBatch.count;
        })
            .reduce((prev, current) => prev + current, 0);
    }
    //* get order */
    function getOrder(id: string): Order | undefined {
        return orders[orders.findIndex(order => order.id === id)];
    }
    //* disable button in table */
    function isActiveOrder(id: GridRowId) {
        return userData.isAdmin ? false : getOrder(id.toString())?.status !== arrStatus[0];
    }
    //* get information about order */
    function getInfoOrder(order: Order): string[] {
        const res: string[] = [
            `Order ID  : ${order.id}`,
            `Client : ${order.client.name}`,
            `Phone : ${order.client.phoneNumber}`,
            `${!!order.client.deliveryAddress ? `Address : ${getClientAddressInfo(order.client.deliveryAddress)}` : ''}`,
            `${getInfoProduct(order.products)}`,
            `Status: ${order.status}`,
            `Total price: ${getOrderPrice(order.products)}`,
            `Data create: ${formatDate(order.date)}`
        ];
        return res;
    }
    //* parse date to YYYY:MM:DD HH:MM */
    function formatDate(date: string) {
        const res = date.split("T");
        return `${res[0]} ${res[1].substring(0, 5)}`;
    }
    //* get information about product */
    function getInfoProduct(products: ProductBatch[]) {
        let res = '';
        products.forEach(productOrder => {
            const { productConfigured, count } = productOrder;
            const option = getInfoOptions(productConfigured.optionsConfigured);
            res += `Product name: "${productConfigured.base.title}" ${!!option ? `${option} ` : ``}count: ${count}.   `
        })
        return res;

    }
    //* get information about option product */
    function getInfoOptions(options: ProductOptionConfigured[]) {
        let res = ' ';
        options.forEach(element => {
            res += `${element.optionTitle}=${element.optionData.name} `
        });
        return res;
    }
    ///********************************************************************** */

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            <Paper sx={{ width: '90vw', height: '80vh', marginTop: '2vh' }}>
                <DataGrid columns={columns} rows={rows} onCellEditCommit={onCellEdit} sortModel={[{ field: "date", sort: 'desc' }]} />
            </Paper>
            <DialogConfirm visible={dialogVisible} title={confirmationData.current.title} message={confirmationData.current.message} onClose={confirmationData.current.handle} />
            <ModalInfo title={"Detailed information about the order"} message={textModal.current} visible={modalVisible} callBack={() => setModalVisible(false)} />
            {!!formVisible && <FormUpdateOrder callBack={() => setformVisible(false)} visible={formVisible} order={orderUpdate} />}
        </Box>

    )
}

export default OrdersListGrid;