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
    /**
     * Ende des Termins, gleiches Format wie `date`. Fehlt es, nimmt der
     * ICS-Export eine Standarddauer an. Der `EventCalendar` ignoriert das Feld.
     */
    end?: string;
    /** Mehrzeilige Beschreibung, bisher nur vom ICS-Export benutzt. */
    description?: string;
    id?: string;
};
