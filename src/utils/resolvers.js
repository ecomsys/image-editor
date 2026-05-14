export const BaseUrlResolver = (path) => {
    const base = import.meta.env.BASE_URL || "/";
    return `${base}${path}`;
};

export const BaseUrlNoSlash = () => {
    const base = import.meta.env.BASE_URL || "/";

    // убираем все слэши в конце
    return base.replace(/\/+$/, "");
};