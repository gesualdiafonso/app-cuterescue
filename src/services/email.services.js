// import emailjs from "@emailjs/browser";

// const SERVICE_ID = "service_3lt40pa";
// const TEMPLATE_ID = "template_wge46dq";
// const PUBLIC_KEY = "_1JeKVRWgqdhCbJSZ";

// emailjs.init(PUBLIC_KEY);

export const emailService = {
  async sendLocationEmail({ userEmail, petName, address, lat, lng }) {

    const googleMapsLink =
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    try {

      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Origin": "http://localhost"
            },
            body: JSON.stringify({
            service_id: "service_3lt40pa",
            template_id: "template_wge46dq",
            user_id: "_1JeKVRWgqdhCbJSZ",
            accessToken: "krjpYp2LlgQWnYE6G4z5d",
            template_params: {
                to_email: userEmail,
                pet_name: petName,
                address: address,
                screenshot_url: googleMapsLink
            }
            })
        }
        );
      const text = await response.text();

      console.log("Email enviado:", text);

    } catch (error) {

      console.error("Erro enviando email:", error);

    }
  }
};