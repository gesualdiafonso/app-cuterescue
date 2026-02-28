// CalculateDistance.js
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Converter para número para evitar erros de string
    const p1 = Number(lat1);
    const p2 = Number(lon1);
    const p3 = Number(lat2);
    const p4 = Number(lon2);

    const R = 6371; // Radio de la Tierra en KM
    const dLat = (p3 - p1) * Math.PI / 180;
    const dLon = (p4 - p2) * Math.PI / 180; // Estava Math.Pi aqui

    const a = Math.sin(dLat/2) * Math.sin(dLat / 2) +
                Math.cos(p1 * Math.PI / 180) * Math.cos(p3 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return isNaN(distance) ? Infinity : distance;
}