import { ref } from 'vue';

export function useService_package() {
    const API_URL = "http://localhost:3000";
    const service_packages  = ref('');
    const loading = ref(false);
    const error = ref('');

    const fetchService_packages = async () => {
        loading.value = true;
        error.value = null;

        try {
            const res = await fetch(API_URL + `/api/service-packages`);
            if (!res.ok) {
                throw new Error('Failed to fetch service packages');    
            }
            service_packages.value = await res.json()
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    fetchService_packages();

    return {
        service_packages,
        loading,
        error,
        fetchService_packages
    }
}

export default useService_package;