export async function pingServer(isLoading) {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    isLoading.value = true;

    while (true) {
        const isAlive = await ping(baseUrl);
        if (isAlive) {
            isLoading.value = false;
            break; // Server is alive, exit the loop
        }

        isLoading.value = true;
        console.error('Waiting for server to respond...');
        await new Promise(res => setTimeout(res, 3000)); // wait 1 second before retrying
    }
}

function ping(url) {
    return fetch(`${url}/ping`)
        .then(response => response.ok)
        .catch(() => false);
}
