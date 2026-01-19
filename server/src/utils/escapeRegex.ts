const escapeRegex = (string: string) => {
    const rawString = string.trim();

    return rawString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default escapeRegex;