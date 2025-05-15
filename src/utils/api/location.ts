import axiosInstance from '../axiosInstance';

const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

export const fetchRegions = async () => {
    try {
        const url = validateRelativeUrl("/location/getRegions");
        const response = await axiosInstance.get(url)

        return response.data
    }

    catch (error) {
        console.error("Error fetching regions:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
}

export const fetchProvinces = async(filters?: {regionId: number}) => {
    try {
        const url = validateRelativeUrl("/location/getProvinces");
        const response = await axiosInstance.get(url, {
            params: {
                regionId: filters?.regionId
            }
        })

        return response.data
    }

    catch (error) {
        console.error("Error fetching provinces:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
}


