"use client";

import { useCallback, useEffect, useState } from "react";
import {
    getCollection,
    type GetCollectionOptions,
} from "../database/getCollection";

export type UseCollectionResult<T> = {
    data?: Array<T>;
    loading: boolean;
    refetch: () => void;
};

export type UseCollectionOptions<T> = GetCollectionOptions & {
    /** Läuft im Client, nachdem die Dokumente geladen wurden. */
    map?: (item: T & { uid: string }) => T;
    filter?: (item: T) => boolean;
    sort?: (a: T, b: T) => number;
    /** Auf `false` setzen, um den Fetch zu unterdrücken. */
    enabled?: boolean;
};

/**
 * Lädt eine Firestore-Collection einmalig und hält sie im State.
 *
 * `map`/`filter`/`sort` müssen stabile Referenzen sein (useCallback oder
 * außerhalb der Komponente definiert), sonst läuft der Fetch in jedem Render.
 */
export const useCollection = <T,>(
    collectionName: string,
    options: UseCollectionOptions<T> = {},
): UseCollectionResult<T> => {
    const {
        map,
        filter,
        sort,
        enabled = true,
        filters,
        orderByField,
        direction,
    } = options;

    const [data, setData] = useState<Array<T> | undefined>();
    const [loading, setLoading] = useState(enabled);

    const fetchData = useCallback(async () => {
        if (!enabled) return;

        setLoading(true);
        try {
            const items = await getCollection<T>(collectionName, {
                filters,
                orderByField,
                direction,
            });

            let result: Array<T> = map
                ? items.map(map)
                : (items as unknown as Array<T>);

            if (filter) result = result.filter(filter);
            if (sort) result = [...result].sort(sort);

            setData(result);
        } catch (_error) {
            setData(undefined);
        } finally {
            setLoading(false);
        }
        // `filters` ist ein Array-Literal und wäre bei jedem Render neu —
        // deshalb bewusst über den serialisierten Wert vergleichen.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        collectionName,
        enabled,
        JSON.stringify(filters),
        orderByField,
        direction,
        map,
        filter,
        sort,
    ]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        refetch: () => {
            void fetchData();
        },
    };
};
