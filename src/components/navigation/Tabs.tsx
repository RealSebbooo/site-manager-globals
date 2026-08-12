"use client";

import React, { type FC, type ReactNode, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

export type TabType = {
    title: string;
    content: ReactNode;
};

export type MyTabsProps = {
    tabs: Array<TabType>;
};

/** Horizontal scrollbare Tabs; rendert nur den aktiven Inhalt. */
export const MyTabs: FC<MyTabsProps> = ({ tabs }) => {
    const [value, setValue] = useState(0);

    if (tabs.length === 0) return null;

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={(_event, newValue: number) => setValue(newValue)}
                    sx={{ overflow: "auto" }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={tab.title}
                            label={tab.title}
                            id={`tab-${index}`}
                            aria-controls={`tabpanel-${index}`}
                        />
                    ))}
                </Tabs>
            </Box>
            {tabs.map((tab, index) => (
                <div
                    key={tab.title}
                    role="tabpanel"
                    hidden={value !== index}
                    id={`tabpanel-${index}`}
                    aria-labelledby={`tab-${index}`}
                >
                    {value === index && <Box sx={{ p: 3 }}>{tab.content}</Box>}
                </div>
            ))}
        </Box>
    );
};
