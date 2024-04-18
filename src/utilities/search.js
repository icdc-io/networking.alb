const setExceptions = (key) => {
    return key.includes('exception');
};

export const returnServiceInfo = (service) => `${service.name} (${service.ext_id})`;

const searchInDataStructure = (key, value, searchString) => {
    if (typeof value !== 'object') return value.toLowerCase().includes(searchString.toLowerCase());
    if (key === "services" && Array.isArray(value)) return value.some(service => returnServiceInfo(service).includes(searchString));
    return false;
};

export const onSearch = (array, searchString) => {
    if (!searchString) return array;
    return array.filter((item) => Object.keys(item).some(key => (
        item[key] && typeof item[key] !== 'boolean' && !setExceptions(key) && typeof item[key] !== 'number'
        && key !== 'key' && key !== 'certificate' && searchInDataStructure(key, item[key], searchString)))
    );
};
