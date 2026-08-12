/**
 * Minimal-Form eines Termins, mit der der `EventCalendar` arbeitet.
 * Projekte mit reicherem Event-Modell mappen ihren Typ auf diesen.
 */
export type CalendarEvent = {
    /** ISO-String oder alles, was `new Date(...)` versteht */
    date: string;
    /** Überschrift im Tagesdetail */
    title: string;
    /** Ort, wird als erstes Detail angezeigt */
    location?: string;
    /** Freies Zusatzdetail (Veranstalter, Kategorie, …) */
    subtitle?: string;
    id?: string;
};
