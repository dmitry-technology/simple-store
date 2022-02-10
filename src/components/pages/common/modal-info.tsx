import { Box, List, ListItem, Modal, Typography } from '@mui/material';
import React, { FC, useState } from 'react';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ModalInfo: FC<{ title: string, message: string[], visible: boolean, callBack: () => void }> = (props) => {

    return <Modal
        open={props.visible}
        onClose={props.callBack}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                {props.title}
            </Typography>
            <List id="modal-modal-description" sx={{ mt: 2 }}>
                {props.message.map((e, i) => <ListItem key={i}>{e}</ListItem>)}
            </List>
        </Box>
    </Modal>
};

export default ModalInfo;
