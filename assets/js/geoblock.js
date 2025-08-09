const allowedCountries = ['RU', 'UA', 'BY', 'MD'];
const blockedRedirectUrl = '/denied/your-country-is-not-supported';

async function getGeoLocation() {
    const apis = [
        'https://ipwho.is/',
        'https://api.ip.sb/geoip'
    ];

    for (const url of apis) {
        try {
            const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
            if (!response.ok) continue;

            const data = await response.json();
            const countryCode = (data.country_code || data.country)?.toUpperCase().substring(0, 2);

            if (countryCode && !allowedCountries.includes(countryCode)) {
                window.location.replace(blockedRedirectUrl);
            }
            return;
        } catch (e) {
            console.warn(`API ${url} failed:`, e);
            // Продолжаем с другим API
        }
    }

    // Все API упали — не блокируем
    console.warn('Все гео-API недоступны — пропускаем пользователя');
}

// Запускаем
getGeoLocation();