/**
 *   geocodificación
usando open street map 
obtiene coordenadas (lat y long) a partir de una dirección textual, utilizando el servicio de nominatim (openstreetmap)
la función realiza dos intentos: con codigo postal incluido pero si no hay resultados intenta sin el codigo postal
En caso de error o falta de resultados, devuelve coordenadas nulas

@async
@param params -datos de la dirección a buscar
@param params.direccion calle + numeración
@param params.codigoPostal cod postal
@param params.provincia provincia
 *
 */

const USER_AGENT = "CuteRescueApp/1.0 (gesualdiafonsoarr@gmail.com)" // Identificación para el OSM

/**
 * Funçao principal para validar e obter coordenadas.
 * Retorna um objeto com status de sucesso para que a UI possa decidir se avança ou não.
 */
export async function geocodeAddress(direccion, provincia, codigoPostal) {
    try {
        // Chamamos a função de busca que você já possui
        const result = await getCoordinatesFromAddress({
            direccion,
            codigoPostal,
            provincia
        });

        // Verificamos se as coordenadas são válidas
        if (result.lat && result.lng) {
            return {
                success: true,
                lat: result.lat,
                lng: result.lng,
                source: result.source
            };
        }

        // Se chegou aqui, o endereço não foi encontrado nos dois intentos
        return {
            success: false,
            error: "No se pudo encontrar la ubicación exacta. Por favor, verifique la calle y el número."
        };

    } catch (error) {
        console.error("Erro crítico no geocodeAddress:", error);
        
        // Caso o erro seja o SyntaxError (HTML retornado), tratamos aqui
        if (error.message.includes("Unexpected character: <")) {
            return {
                success: false,
                error: "Servidor de mapas temporalmente ocupado. Intente de nuevo en unos segundos."
            };
        }

        return {
            success: false,
            error: "Error de conexión al validar la dirección."
        };
    }
}

export async function getCoordinatesFromAddress({
  direccion,
  codigoPostal,
  provincia,
}) {
  try {
    const normalizeCountry =
      provincia === "CABA" ? "Ciudad Autónoma de Buenos Aires" : provincia;

    // Función auxiliar para disparae el fetch
    const fetchCoords = async (queryString) => {
        const encodedQuery = encodeURIComponent(queryString);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1`;

        const response = await fetch(url, {
            headers: { "User-Agent": USER_AGENT }
        });

        if (!response.ok) throw new Error("Error al comunicarse con OpenStreatMap");

        return await response.json();
    }
    // 1° intento principal con codigo postal
    let query = `${direccion}, ${codigoPostal}, ${normalizeCountry}, Argentina`;
    let data = await fetchCoords(query);

    // 2° Intento: si falla, intenta sin el Código Postal
    if (!data || data.length === 0) {
        console.warn("Mobile: No se encontró con Código Postal, Reintentando sin él...");
        query = `${direccion}, ${normalizeCountry}, Argentina`;
        data = await fetchCoords(query);
    }

    // Si se sigue fallando
    if (!data || data.length === 0) {
        return { lat: null, lng: null, source: "OSM:no_result" };
    }

    const { lat, lon } = data[0];
    
    return {
        lat: parseFloat(lat),
        lng: parseFloat(lon),
        source: "OSM:geocodificado"
    }
  } catch (err) {
    console.error("Error en la geocodificación:", err);
    return { lat: null, lng: null, source: "OSM:error" };
  }
}


/**
 * Reverse
 * obtenemos direc textual a partir de coordenadas para mostrar direccion aprox en simulador
 * @async
 * @param {number} lat  latitud a consultar
 * @param {number} lng longitud a consultar
 */
export async function getAddressFromCoordinates(lat, lng) {

    if (!lat || !lng) return null;

    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        const response = await fetch(url, {
            headers: { "User-Agent": USER_AGENT }
        });

        if (!response.ok) throw new Error("Falla al buscar la dirección en OSM");

        const data = await response.json();

        // En el mobile los display_names es muy largo.

        return data.display_name || "Dirección no encontrada";

    } catch (err) {
        console.error("Error en la búsqueda inversa:", err);
        return null;
    }
}