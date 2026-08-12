"use client";

import React, { type FC, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { alpha, useTheme } from "@mui/material/styles";
import "../../theme/augmentation";
import type { CalendarEvent } from "../../types/calendarEvent";

export type EventCalendarProps = {
    events: Array<CalendarEvent>;
    /** Text, wenn ein Tag ausgewählt ist, aber keine Termine hat */
    emptyDayLabel?: string;
};

const WEEKDAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const MONTH_LABELS = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
];

const toDateKey = (year: number, month: number, day: number) =>
    [
        year,
        String(month + 1).padStart(2, "0"),
        String(day).padStart(2, "0"),
    ].join("-");

const eventDateKey = (value?: string) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
};

const formatDayDate = (date: string) =>
    `${new Date(date).toLocaleString("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })} Uhr`;

/** Montag = 0 … Sonntag = 6 */
const getMondayBasedWeekday = (date: Date) => (date.getDay() + 6) % 7;

/**
 * Monatskalender: Tage mit Terminen sind markiert, ein Klick klappt die
 * Termine des Tages darunter auf. Startet im Monat des nächsten Termins.
 */
export const EventCalendar: FC<EventCalendarProps> = ({
    events,
    emptyDayLabel = "Keine Termine an diesem Tag.",
}) => {
    const theme = useTheme();

    const eventsByDay = useMemo(() => {
        const map = new Map<string, Array<CalendarEvent>>();

        events.forEach((event) => {
            const key = eventDateKey(event.date);
            if (!key) return;

            map.set(key, [...(map.get(key) ?? []), event]);
        });

        map.forEach((list) =>
            list.sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
            ),
        );

        return map;
    }, [events]);

    const initialMonth = useMemo(() => {
        const now = Date.now();
        const nextEvent = events
            .filter((event) => {
                const time = new Date(event.date).getTime();
                return Number.isFinite(time) && time >= now;
            })
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
            )[0];

        const base = nextEvent ? new Date(nextEvent.date) : new Date();
        return { year: base.getFullYear(), month: base.getMonth() };
    }, [events]);

    const [view, setView] = useState(initialMonth);
    const [selectedKey, setSelectedKey] = useState<string | undefined>();

    const today = new Date();
    const todayKey = toDateKey(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );

    const firstOfMonth = new Date(view.year, view.month, 1);
    const leadingBlanks = getMondayBasedWeekday(firstOfMonth);
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

    const cells: Array<number | null> = [
        ...Array.from({ length: leadingBlanks }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    const goToMonth = (delta: number) => {
        setSelectedKey(undefined);
        setView((current) => {
            const date = new Date(current.year, current.month + delta, 1);
            return { year: date.getFullYear(), month: date.getMonth() };
        });
    };

    const selectedEvents = selectedKey
        ? (eventsByDay.get(selectedKey) ?? [])
        : [];

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 1.5, sm: 2.5 },
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.14)}`,
                backgroundColor: alpha(theme.palette.surface.main, 0.86),
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
            >
                <IconButton
                    aria-label="Vorheriger Monat"
                    onClick={() => goToMonth(-1)}
                    sx={{
                        border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
                    }}
                >
                    <ChevronLeftIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {MONTH_LABELS[view.month]} {view.year}
                </Typography>
                <IconButton
                    aria-label="Nächster Monat"
                    onClick={() => goToMonth(1)}
                    sx={{
                        border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
                    }}
                >
                    <ChevronRightIcon />
                </IconButton>
            </Stack>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: { xs: 0.5, sm: 0.75 },
                }}
            >
                {WEEKDAY_LABELS.map((label) => (
                    <Typography
                        key={label}
                        variant="caption"
                        align="center"
                        sx={{
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            color: alpha(theme.palette.text.primary, 0.6),
                            pb: 0.5,
                        }}
                    >
                        {label}
                    </Typography>
                ))}

                {cells.map((day, index) => {
                    if (day === null) return <Box key={`blank-${index}`} />;

                    const key = toDateKey(view.year, view.month, day);
                    const hasEvents = (eventsByDay.get(key) ?? []).length > 0;
                    const isToday = key === todayKey;
                    const isSelected = key === selectedKey;

                    return (
                        <Box
                            key={key}
                            onClick={() =>
                                hasEvents
                                    ? setSelectedKey(
                                          isSelected ? undefined : key,
                                      )
                                    : undefined
                            }
                            sx={{
                                position: "relative",
                                aspectRatio: "1 / 1",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 2,
                                cursor: hasEvents ? "pointer" : "default",
                                border: isToday
                                    ? `1px solid ${alpha(theme.palette.primary.main, 0.7)}`
                                    : `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                                backgroundColor: isSelected
                                    ? alpha(theme.palette.primary.main, 0.25)
                                    : hasEvents
                                      ? alpha(theme.palette.primary.main, 0.1)
                                      : "transparent",
                                transition: "background-color 150ms ease",
                                "&:hover": hasEvents
                                    ? {
                                          backgroundColor: alpha(
                                              theme.palette.primary.main,
                                              0.2,
                                          ),
                                      }
                                    : undefined,
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight:
                                        hasEvents || isToday ? 800 : 400,
                                    color:
                                        hasEvents || isToday
                                            ? theme.palette.text.primary
                                            : alpha(
                                                  theme.palette.text.primary,
                                                  0.7,
                                              ),
                                }}
                            >
                                {day}
                            </Typography>
                            {hasEvents && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: 4,
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        backgroundColor:
                                            theme.palette.primary.main,
                                    }}
                                />
                            )}
                        </Box>
                    );
                })}
            </Box>

            {selectedKey && (
                <Stack spacing={1} sx={{ mt: 2 }}>
                    {selectedEvents.length === 0 ? (
                        <Typography
                            variant="body2"
                            sx={{
                                color: alpha(theme.palette.text.primary, 0.7),
                            }}
                        >
                            {emptyDayLabel}
                        </Typography>
                    ) : (
                        selectedEvents.map((event, index) => (
                            <Paper
                                key={event.id ?? `${event.date}-${index}`}
                                variant="outlined"
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    borderColor: alpha(
                                        theme.palette.text.primary,
                                        0.12,
                                    ),
                                    backgroundColor: alpha(
                                        theme.palette.background.default,
                                        0.4,
                                    ),
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 800 }}
                                >
                                    {event.title || "Termin"}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: alpha(
                                            theme.palette.text.primary,
                                            0.72,
                                        ),
                                    }}
                                >
                                    {formatDayDate(event.date)}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: alpha(
                                            theme.palette.text.primary,
                                            0.72,
                                        ),
                                    }}
                                >
                                    {[event.location, event.subtitle]
                                        .filter(Boolean)
                                        .join(" · ") || "-"}
                                </Typography>
                            </Paper>
                        ))
                    )}
                </Stack>
            )}
        </Paper>
    );
};
