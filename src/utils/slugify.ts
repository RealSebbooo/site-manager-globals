/**
 * Wandelt einen Anzeigenamen in einen URL-/lesefreundlichen Slug um:
 * kleingeschrieben, Umlaute ausgeschrieben, Akzente entfernt, alles andere
 * zu Bindestrichen zusammengefasst.
 *
 * `slugify("Guggemusik Grün-Weiß e.V.")` → `"guggemusik-gruen-weiss-e-v"`
 */
export const slugify = (value: string, fallback = ""): string => {
    const slug = value
        .toLowerCase()
        .replace(/ä/g, "ae")
        .replace(/ö/g, "oe")
        .replace(/ü/g, "ue")
        .replace(/ß/g, "ss")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return slug || fallback;
};
