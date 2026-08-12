"use client";

import React, { type FC, type ReactNode, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";

export type AddMenuItem = {
    label: string;
    key: string;
};

export type AddMenuProps = {
    items: Array<AddMenuItem>;
    onSelect: (key: string) => void;
    /** Für Screenreader, z.B. "Feld hinzufügen" */
    ariaLabel?: string;
    /** Eigenes Icon statt des Plus */
    icon?: ReactNode;
};

/** "+"-Button, der ein Menü mit Hinzufügen-Optionen öffnet. */
export const AddMenu: FC<AddMenuProps> = ({
    items,
    onSelect,
    ariaLabel = "Hinzufügen",
    icon,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const close = () => setAnchorEl(null);

    return (
        <div>
            <IconButton
                onClick={(event) => setAnchorEl(event.currentTarget)}
                size="small"
                aria-label={ariaLabel}
            >
                {icon ?? <AddIcon />}
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={close}>
                {items.map((item) => (
                    <MenuItem
                        key={item.key}
                        onClick={() => {
                            onSelect(item.key);
                            close();
                        }}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};
