// app/api/contact/route.js
export async function POST(request) {
    const { name, email, message } = await request.json();
    
    // Vous pouvez ajouter ici la logique pour envoyer un email ou enregistrer les données.
    
    return new Response(JSON.stringify({ message: 'Votre message a été envoyé avec succès.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });
}
