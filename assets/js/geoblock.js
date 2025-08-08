// geoblock.js

// Список разрешённых стран (в формате ISO 3166-1 alpha-2)
const allowedCountries = ['RU', 'UA', 'BY', 'MD']; // Россия, Украина, Беларусь, Молдова (ПМР — это территория Молдовы, используем MD)

// URL для перенаправления
const blockedRedirectUrl = '/denied/your-country-is-not-supported';

// Функция для получения геоданных по IP
async function getGeoLocation() {
    try {
        const response = await fetch('https://api.ip.sb/geoip');
        if (!response.ok) throw new Error('Не удалось получить данные о местоположении');

        const data = await response.json();
        const userCountryCode = data.country_code;

        if (!allowedCountries.includes(userCountryCode)) {
            window.location.replace(blockedRedirectUrl);
        }
    } catch (error) {
        console.warn('Ошибка при определении страны:', error);
        // При ошибке можно либо пропустить, либо перенаправить — зависит от политики
        // Например, можно перенаправить всех при ошибках (строгий режим), или наоборот — пропустить
        // Здесь: перенаправляем при ошибках (для безопасности)
        window.location.replace(blockedRedirectUrl);
    }
}

// Запускаем при загрузке скрипта
getGeoLocation();