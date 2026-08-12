"use client";

import React, { type FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export type DropdownProps = {
    label?: string;
    defaultValue?: string;
    items: Array<string>;
    onChange: (value: string) => void;
};

/** Einfache Auswahlliste über eine Liste von Strings. */
export const Dropdown: FC<DropdownProps> = ({
    label,
    defaultValue,
    items,
    onChange,
}) => {
    const [value, setValue] = useState(defaultValue ?? items[0] ?? "");

    useEffect(() => {
        if (defaultValue) setValue(defaultValue);
    }, [defaultValue]);

    return (
        <Box>
            <FormControl fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select
                    fullWidth
                    value={value}
                    label={label}
                    size="small"
                    onChange={(event) => {
                        setValue(event.target.value);
                        onChange(event.target.value);
                    }}
                >
                    {items.map((item) => (
                        <MenuItem value={item} key={item}>
                            {item}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};
