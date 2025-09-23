const escapeRegex = (string: string) => {
    const rawString = string.trim();
    // Ký tự $& sẽ chèn vào chính chuỗi con đã khớp.
    // Ví dụ: 'c++'.replace(/[+]/g, '\\$&') sẽ trả về 'c\+\+'
    return rawString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default escapeRegex;
