import { Tabs, Tab } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RouteType } from '../../../models/route-type';

type NavigatorTabsProps = {
    orientation: "vertical" | "horizontal";
    items: RouteType[];
}

function getActiveTabIndex(path: string, items: RouteType[]): number {
    let res = items.findIndex(item => path === item.path);
    return res < 0 ? 0 : res;
}

const NavigatorTabs: FC<NavigatorTabsProps> = ({ orientation, items }) => {

    const path = useLocation().pathname;
    const [activeTabIndex, setActiveTab] = useState(0);

    useEffect(() => {
        const curActiveIndex = getActiveTabIndex(path, items);
        setActiveTab(curActiveIndex);
        document.title = items[curActiveIndex].label!;
    }, [items, path]);

    return (
        <Tabs
            variant="scrollable"
            orientation={orientation}
            value={activeTabIndex > items.length - 1 ? 0 : activeTabIndex}
        >
            {items.map((item) => (
                <Tab
                    key={item.label}
                    component={Link}
                    to={item.path}
                    label={item.label}
                    iconPosition='start'
                    sx={{ display: 'flex' }}
                />
            ))}
        </Tabs>
    );
};

export default NavigatorTabs;