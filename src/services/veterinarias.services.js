/** 
 * Servicio encargado de mapear 
 * la lógica de los veterinarias para caminos 
 * e informes estaticos 
 */
import veterinariasData from "../data/veterinarias-24hrs.json"

const imageMap = {
    "veterinaria-1.png": require("../../assets/images/veterinarias/veterinaria-1.png"),
    "veterinaria-2.png": require("../../assets/images/veterinarias/veterinaria-2.png"),
    "veterinaria-3.png": require("../../assets/images/veterinarias/veterinaria-3.png"),
    "veterinaria-4.png": require("../../assets/images/veterinarias/veterinaria-4.png"),
    "veterinaria-5.png": require("../../assets/images/veterinarias/veterinaria-5.png"),
    "veterinaria-6.png": require("../../assets/images/veterinarias/veterinaria-6.png"),
    "veterinaria-7.png": require("../../assets/images/veterinarias/veterinaria-7.png"),
};

export const getVeterinarias = () => {
    return veterinariasData.map((vet) => {
        // Traemos el nombre del archivo de la string
        const imageName = vet.imagen.split('/').pop();

        return{
            ...vet,
            // Substituímos a string do JSON pelo require real
            imagenSource: imageMap[imageName] || null
        }
    })
}