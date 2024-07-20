// app/page.js
import Head from 'next/head';

export default function HomePage() {
    return (
        <div>
            <Head>
                <title>Page d'accueil</title>
                <meta name="description" content="Page d'accueil de notre site" />
            </Head>
            <main>
                <h1>Bienvenue sur notre site</h1>
                <p>Découvrez nos produits à base de volailles.</p>
            </main>
        </div>
    );
}
