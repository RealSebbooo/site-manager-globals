export type ImageMeta = {
    naturalWidth: number;
    naturalHeight: number;
};

/**
 * Lädt ein Bild nur, um seine Originalmaße zu erfahren.
 * Auf dem Server wird nichts geladen — das Promise löst mit `undefined` auf.
 */
export const getImageMeta = (src: string): Promise<ImageMeta | undefined> =>
    new Promise((resolve) => {
        if (typeof window === "undefined" || !src) {
            resolve(undefined);
            return;
        }

        const img = new window.Image();
        img.onload = () =>
            resolve({
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
            });
        img.onerror = () => resolve(undefined);
        img.src = src;
    });
