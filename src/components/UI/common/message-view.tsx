import { Snackbar, Alert } from "@mui/material";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { emptyMessage, UserNotificationMessage } from "../../../models/user-notification";
import { setNotificationMessage } from "../../../redux/actions";

const MessageView: FC<{data: UserNotificationMessage}> = (props) => {

    const dispatch = useDispatch();
    const [display, setDisplay] = useState(true);

    function close() {
        setDisplay(false);
        dispatch(setNotificationMessage(emptyMessage));
    }
    
    return  <Snackbar open={display} autoHideDuration={20000} onClose={close} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={close} severity={props.data.type} sx={{ width: '100%' }}>
                    {props.data.message}
                </Alert>
            </Snackbar>
};

export default MessageView;