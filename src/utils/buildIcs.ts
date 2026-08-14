import type { CalendarEvent } from "../types/calendarEvent";

/**
 * Baut einen iCalendar-Text (RFC 5545) aus Terminen. Reine Stringarbeit, ohne
 * Abhängigkeiten, damit derselbe Code in einer API-Route und im Browser läuft.
 */

export type BuildIcsOptions = {
    events: Array<CalendarEvent>;
    /** Name, den Kalender-Clients anzeigen (X-WR-CALNAME). */
    calendarName: string;
    /** Domain für stabile UIDs, z.B. "kolbaedrescher.de". */
    uidDomain: string;
    /** Dauer für Termine ohne `end`. */
    defaultDurationMinutes?: number;
    /** Empfehlung an den Client, wie oft er nachladen soll. */
    refreshIntervalHours?: number;
    /** Erscheint in PRODID. */
    productName?: string;
    /** Kurzbeschreibung des Kalenders (X-WR-CALDESC). */
    calendarDescription?: string;
    /** Link, der bei jedem Termin mitgeschickt wird, z.B. die Terminseite. */
    eventUrl?: string;
};

/**
 * Feste Zeitzonendefinition für Europe/Berlin. Damit muss der Export nie
 * selbst zwischen Winter- und Sommerzeit umrechnen: die Termine gehen als
 * lokale Wandzeit raus, den Rest löst der Kalender-Client über diesen Block
 * auf. Die Regeln gelten in der EU seit 1996 unverändert.
 */
const EUROPE_BERLIN_VTIMEZONE = [
    "BEGIN:VTIMEZONE",
    "TZID:Europe/Berlin",
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:+0100",
    "TZOFFSETTO:+0200",
    "TZNAME:CEST",
    "DTSTART:19700329T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0200",
    "TZOFFSETTO:+0100",
    "TZNAME:CET",
    "DTSTART:19701025T030000",
    "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
];

const TZID = "Europe/Berlin";

/** Sonderzeichen, die im Format eine Bedeutung haben, maskieren. */
const escapeText = (value: string): string =>
    value
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\r\n|\r|\n/g, "\\n");

const encoder = new TextEncoder();

/**
 * Zeilen dürfen höchstens 75 Oktette lang sein, Fortsetzungen beginnen mit
 * einem Leerzeichen. Gezählt wird in Bytes, nicht in Zeichen: "Gündlingen"
 * ist in UTF-8 länger als es aussieht.
 */
const foldLine = (line: string): string => {
    if (encoder.encode(line).length <= 75) return line;

    const parts: string[] = [];
    let current = "";
    let currentBytes = 0;
    // Die erste Zeile darf 75 Oktette haben, jede Fortsetzung nur 74, weil das
    // führende Leerzeichen mitzählt.
    let limit = 75;

    for (const char of line) {
        const size = encoder.encode(char).length;

        if (currentBytes + size > limit) {
            parts.push(current);
            current = "";
            currentBytes = 0;
            limit = 74;
        }

        current += char;
        currentBytes += size;
    }

    if (current) parts.push(current);

    return parts.join("\r\n ");
};

const property = (name: string, value: string): string =>
    foldLine(`${name}:${escapeText(value)}`);

/** Die Ziffern eines Datums, ohne Zeitzonenlogik. */
type DateParts = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
};

/** Datum ohne Zonenangabe, also reine Wandzeit: "2027-01-09T20:11". */
const WALL_CLOCK = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::\d{2})?)?$/;

/**
 * Holt die Wandzeit in `Europe/Berlin` aus einem Datum, das eine Zone trägt
 * (`…Z` oder `…+02:00`). `Intl` kennt die Umstellungsregeln, deshalb wird hier
 * nicht selbst gerechnet.
 */
const partsInTimeZone = (date: Date): DateParts => {
    const formatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: TZID,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).formatToParts(date);

    const pick = (type: string) =>
        Number(formatted.find((part) => part.type === type)?.value ?? "0");

    return {
        year: pick("year"),
        month: pick("month"),
        day: pick("day"),
        hour: pick("hour"),
        minute: pick("minute"),
    };
};

/**
 * Zerlegt einen Datumsstring in seine Bestandteile. Ein String ohne Zone geht
 * bewusst nicht durch `new Date()`: `"2027-01-09T20:11"` ist Wandzeit, und die
 * Laufzeit würde ihre eigene Zone hineinrechnen. Im Browser in Freiburg käme
 * etwas anderes heraus als in einer Serverless-Funktion in UTC.
 */
const parseNaive = (value: string): DateParts | undefined => {
    const trimmed = value.trim();
    const match = WALL_CLOCK.exec(trimmed);

    if (match) {
        return {
            year: Number(match[1]),
            month: Number(match[2]),
            day: Number(match[3]),
            hour: Number(match[4] ?? "0"),
            minute: Number(match[5] ?? "0"),
        };
    }

    const parsed = new Date(trimmed);

    if (Number.isNaN(parsed.getTime())) return undefined;

    return partsInTimeZone(parsed);
};

const pad = (value: number, length = 2): string =>
    String(value).padStart(length, "0");

/** `{ 2027, 1, 9, 20, 11 }` → `"20270109T201100"` */
const formatParts = (parts: DateParts): string =>
    `${pad(parts.year, 4)}${pad(parts.month)}${pad(parts.day)}T${pad(
        parts.hour,
    )}${pad(parts.minute)}00`;

/**
 * Addiert Minuten auf die reinen Kalenderbestandteile. Über `Date.UTC` gerechnet,
 * damit die lokale Zeitzone des Servers keine Rolle spielt.
 */
const addMinutes = (parts: DateParts, minutes: number): DateParts => {
    const stamp = Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
    );
    const shifted = new Date(stamp + minutes * 60_000);

    return {
        year: shifted.getUTCFullYear(),
        month: shifted.getUTCMonth() + 1,
        day: shifted.getUTCDate(),
        hour: shifted.getUTCHours(),
        minute: shifted.getUTCMinutes(),
    };
};

/**
 * Kurzer, stabiler Hash als Notnagel für Termine ohne `id`. Wichtig ist nur,
 * dass derselbe Termin über Abrufe hinweg dieselbe UID bekommt, sonst legt
 * jeder Kalender bei jedem Abgleich Dubletten an.
 */
const hash = (value: string): string => {
    let result = 0;

    for (let index = 0; index < value.length; index += 1) {
        result = (result * 31 + value.charCodeAt(index)) | 0;
    }

    return Math.abs(result).toString(36);
};

const buildEvent = (
    event: CalendarEvent,
    uidDomain: string,
    defaultDurationMinutes: number,
    eventUrl?: string,
): string[] | undefined => {
    const start = parseNaive(event.date);

    if (!start) return undefined;

    const parsedEnd = event.end ? parseNaive(event.end) : undefined;
    const end = parsedEnd ?? addMinutes(start, defaultDurationMinutes);

    const uid = event.id || hash(`${event.date}|${event.title}`);

    const lines = [
        "BEGIN:VEVENT",
        // UID nicht maskieren: sie ist ein Bezeichner, kein Anzeigetext.
        foldLine(`UID:${uid}@${uidDomain}`),
        // Bewusst aus dem Termin abgeleitet statt `new Date()`: so ist der
        // erzeugte Text bei gleichen Daten byte-gleich, und ein Abo-Feed
        // wechselt nicht bei jedem Abruf seinen Inhalt.
        `DTSTAMP:${formatParts(start)}Z`,
        `DTSTART;TZID=${TZID}:${formatParts(start)}`,
        `DTEND;TZID=${TZID}:${formatParts(end)}`,
        property("SUMMARY", event.title || "Termin"),
    ];

    if (event.location) lines.push(property("LOCATION", event.location));

    const description = event.description || event.subtitle;
    if (description) lines.push(property("DESCRIPTION", description));

    if (eventUrl) lines.push(foldLine(`URL:${eventUrl}`));

    lines.push("STATUS:CONFIRMED", "TRANSP:OPAQUE", "SEQUENCE:0", "END:VEVENT");

    return lines;
};

/**
 * Erzeugt den vollständigen iCalendar-Text. Termine ohne verwertbares Datum
 * werden übersprungen, statt den ganzen Kalender kaputtzumachen.
 */
export const buildIcs = ({
    events,
    calendarName,
    uidDomain,
    defaultDurationMinutes = 120,
    refreshIntervalHours = 12,
    productName = "site-manager",
    calendarDescription,
    eventUrl,
}: BuildIcsOptions): string => {
    const refresh = `PT${Math.max(1, Math.round(refreshIntervalHours))}H`;

    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        property("PRODID", `-//${productName}//${calendarName}//DE`),
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        property("X-WR-CALNAME", calendarName),
        ...(calendarDescription
            ? [property("X-WR-CALDESC", calendarDescription)]
            : []),
        `X-WR-TIMEZONE:${TZID}`,
        // REFRESH-INTERVAL ist der Standard, X-PUBLISHED-TTL die ältere
        // Microsoft-Variante. Beides ist nur ein Wunsch an den Client.
        `REFRESH-INTERVAL;VALUE=DURATION:${refresh}`,
        `X-PUBLISHED-TTL:${refresh}`,
        ...EUROPE_BERLIN_VTIMEZONE,
    ];

    events.forEach((event) => {
        const eventLines = buildEvent(
            event,
            uidDomain,
            defaultDurationMinutes,
            eventUrl,
        );

        if (eventLines) lines.push(...eventLines);
    });

    lines.push("END:VCALENDAR");

    // Das Format schreibt CRLF vor, viele Clients sind da streng.
    return `${lines.join("\r\n")}\r\n`;
};
