import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_b4i1idl";
const TEMPLATE_ID = "template_mpbgcui";
const PUBLIC_KEY = "YLjoPbSLIq25dKE8j";

export const emailService = {
    async sendLocationEmail({ userEmail, petName, address, lat, lng }){
        // Criamos el link de google maps
        const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

        const templateParams = {
            to_email: userEmail,
            pet_name: petName,
            address: address,
            screenshot_url: googleMapsLink,
        };

        try {
            const response = await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                templateParams,
                PUBLIC_KEY
            );
            return response;
        } catch (error) {
            console.error("Erro en el servicio de emails: ", error);
            throw error;
        }
    }
}