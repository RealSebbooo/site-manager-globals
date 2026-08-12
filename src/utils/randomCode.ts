/** Ohne 0/O und 1/I — verwechslungsfrei beim Abtippen oder Vorlesen. */
const UNAMBIGUOUS_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Zufälliger Code aus verwechslungsfreien Zeichen, z.B. für Zugangscodes. */
export const randomCode = (length = 6): string =>
    Array.from(
        { length },
        () =>
            UNAMBIGUOUS_ALPHABET[
                Math.floor(Math.random() * UNAMBIGUOUS_ALPHABET.length)
            ],
    ).join("");
