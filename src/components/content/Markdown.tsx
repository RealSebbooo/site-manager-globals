"use client";

/**
 * Ein kleiner Markdown-Leser, gebaut für das Handbuch in der Verwaltung und
 * im Kundenportal.
 *
 * Absichtlich selbst geschrieben statt einer Bibliothek: gebraucht wird genau
 * das, was in `docs/` vorkommt, nämlich Überschriften, Absätze, Listen,
 * Tabellen, Codeblöcke und die üblichen Betonungen. Dafür lohnt keine weitere
 * Abhängigkeit, und was hier nicht vorgesehen ist, erscheint schlicht als
 * Text statt als kaputte Seite.
 *
 * Farben kommen durchweg aus dem Theme, die Komponente kennt keine eigene
 * Palette und keinen Vereinsnamen.
 */

import React, { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

type Block =
    | { art: "ueberschrift"; stufe: number; text: string }
    | { art: "absatz"; text: string }
    | { art: "liste"; geordnet: boolean; punkte: string[] }
    | { art: "tabelle"; kopf: string[]; zeilen: string[][] }
    | { art: "code"; text: string }
    | { art: "linie" };

const zellen = (zeile: string) =>
    zeile
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((zelle) => zelle.trim());

const istTrennzeile = (zeile: string) =>
    /^\|?[\s:-]+\|[\s:|-]*$/.test(zeile) && zeile.includes("-");

/** Zerlegt den Text in Blöcke. Eine Zeile nach der anderen, ohne Rückgriff. */
const zerlege = (markdown: string): Block[] => {
    const zeilen = markdown.replace(/\r\n/g, "\n").split("\n");
    const bloecke: Block[] = [];
    let absatz: string[] = [];

    const absatzAbschliessen = () => {
        if (absatz.length === 0) return;
        bloecke.push({ art: "absatz", text: absatz.join(" ") });
        absatz = [];
    };

    for (let i = 0; i < zeilen.length; i += 1) {
        const zeile = zeilen[i];

        if (zeile.trim() === "") {
            absatzAbschliessen();
            continue;
        }

        if (zeile.startsWith("```")) {
            absatzAbschliessen();
            const inhalt: string[] = [];
            i += 1;
            while (i < zeilen.length && !zeilen[i].startsWith("```")) {
                inhalt.push(zeilen[i]);
                i += 1;
            }
            bloecke.push({ art: "code", text: inhalt.join("\n") });
            continue;
        }

        const ueberschrift = zeile.match(/^(#{1,6})\s+(.*)$/);
        if (ueberschrift) {
            absatzAbschliessen();
            bloecke.push({
                art: "ueberschrift",
                stufe: ueberschrift[1].length,
                text: ueberschrift[2].trim(),
            });
            continue;
        }

        if (/^(-{3,}|\*{3,}|_{3,})$/.test(zeile.trim())) {
            absatzAbschliessen();
            bloecke.push({ art: "linie" });
            continue;
        }

        if (zeile.trimStart().startsWith("|") && zeilen[i + 1] !== undefined &&
            istTrennzeile(zeilen[i + 1].trim())) {
            absatzAbschliessen();
            const kopf = zellen(zeile.trim());
            const reihen: string[][] = [];
            i += 2;
            while (i < zeilen.length && zeilen[i].trimStart().startsWith("|")) {
                reihen.push(zellen(zeilen[i].trim()));
                i += 1;
            }
            i -= 1;
            bloecke.push({ art: "tabelle", kopf, zeilen: reihen });
            continue;
        }

        const punkt = zeile.match(/^\s*(?:[-*]|\d+\.)\s+(.*)$/);
        if (punkt) {
            absatzAbschliessen();
            const geordnet = /^\s*\d+\./.test(zeile);
            const punkte = [punkt[1].trim()];

            while (i + 1 < zeilen.length) {
                const naechste = zeilen[i + 1];
                const weiterer = naechste.match(/^\s*(?:[-*]|\d+\.)\s+(.*)$/);

                if (weiterer) {
                    punkte.push(weiterer[1].trim());
                    i += 1;
                    continue;
                }
                // Eingerückte Folgezeile gehört zum vorigen Punkt.
                if (/^\s{2,}\S/.test(naechste)) {
                    punkte[punkte.length - 1] += " " + naechste.trim();
                    i += 1;
                    continue;
                }
                break;
            }

            bloecke.push({ art: "liste", geordnet, punkte });
            continue;
        }

        absatz.push(zeile.trim());
    }

    absatzAbschliessen();
    return bloecke;
};

const MUSTER =
    /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Betonungen, Code und Links innerhalb einer Zeile. */
const inline = (text: string): ReactNode[] => {
    const teile: ReactNode[] = [];
    let zuletzt = 0;
    let treffer: RegExpExecArray | null;

    MUSTER.lastIndex = 0;

    while ((treffer = MUSTER.exec(text)) !== null) {
        if (treffer.index > zuletzt) {
            teile.push(text.slice(zuletzt, treffer.index));
        }

        const schluessel = `${treffer.index}`;

        if (treffer[1] !== undefined) {
            teile.push(
                <Box
                    key={schluessel}
                    component="code"
                    sx={{
                        fontFamily: "monospace",
                        fontSize: "0.875em",
                        bgcolor: "action.hover",
                        px: 0.5,
                        py: 0.1,
                        borderRadius: 0.5,
                    }}
                >
                    {treffer[1]}
                </Box>,
            );
        } else if (treffer[2] !== undefined) {
            teile.push(<strong key={schluessel}>{treffer[2]}</strong>);
        } else if (treffer[3] !== undefined) {
            teile.push(<em key={schluessel}>{treffer[3]}</em>);
        } else {
            teile.push(
                <Box
                    key={schluessel}
                    component="a"
                    href={treffer[5]}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ color: "primary.main" }}
                >
                    {treffer[4]}
                </Box>,
            );
        }

        zuletzt = treffer.index + treffer[0].length;
    }

    if (zuletzt < text.length) teile.push(text.slice(zuletzt));
    return teile;
};

const GROESSEN = ["h5", "h6", "subtitle1", "subtitle2", "body1", "body1"] as const;

const BlockAnsicht = ({ block }: { block: Block }) => {
    switch (block.art) {
        case "ueberschrift":
            return (
                <Typography
                    variant={GROESSEN[block.stufe - 1]}
                    sx={{
                        fontWeight: 700,
                        mt: block.stufe === 1 ? 4 : 3,
                        mb: 1,
                        scrollMarginTop: 80,
                    }}
                >
                    {inline(block.text)}
                </Typography>
            );

        case "absatz":
            return (
                <Typography variant="body2" sx={{ my: 1.25, lineHeight: 1.7 }}>
                    {inline(block.text)}
                </Typography>
            );

        case "liste":
            return (
                <Box
                    component={block.geordnet ? "ol" : "ul"}
                    sx={{ my: 1.25, pl: 3 }}
                >
                    {block.punkte.map((punkt, index) => (
                        <Typography
                            key={index}
                            component="li"
                            variant="body2"
                            sx={{ mb: 0.5, lineHeight: 1.7 }}
                        >
                            {inline(punkt)}
                        </Typography>
                    ))}
                </Box>
            );

        case "tabelle":
            return (
                <Paper
                    variant="outlined"
                    sx={{ my: 2, overflowX: "auto", maxWidth: "100%" }}
                >
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {block.kopf.map((zelle, index) => (
                                    <TableCell
                                        key={index}
                                        sx={{ fontWeight: 700 }}
                                    >
                                        {inline(zelle)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {block.zeilen.map((zeile, index) => (
                                <TableRow key={index}>
                                    {zeile.map((zelle, spalte) => (
                                        <TableCell key={spalte}>
                                            {inline(zelle)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            );

        case "code":
            return (
                <Box
                    component="pre"
                    sx={{
                        my: 2,
                        p: 2,
                        bgcolor: "action.hover",
                        borderRadius: 1,
                        overflowX: "auto",
                        fontFamily: "monospace",
                        fontSize: "0.8125rem",
                        lineHeight: 1.6,
                    }}
                >
                    {block.text}
                </Box>
            );

        case "linie":
            return <Divider sx={{ my: 3 }} />;
    }
};

export type MarkdownProps = {
    /** Der Markdown-Text ohne Frontmatter. */
    text: string;
};

export const Markdown = ({ text }: MarkdownProps) => (
    <Box sx={{ maxWidth: "100%" }}>
        {zerlege(text).map((block, index) => (
            <BlockAnsicht key={index} block={block} />
        ))}
    </Box>
);
