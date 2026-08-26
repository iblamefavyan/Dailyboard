export function simpan(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function muat(key, dataDefault = []) {
    const data = localStorage.getItem(key);

    try {
        return data ? JSON.parse(data) : dataDefault;
    } catch (error) {
        console.error(
            `Gagal memuat data dengan key "${key}":`,
            error
        );

        return dataDefault;
    }
}