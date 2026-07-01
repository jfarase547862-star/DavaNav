import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { PageProps } from '@/types';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
     resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx');
        console.log('Available pages:', Object.keys(pages));
        console.log('Looking for:', `./pages/${name}.tsx`);
        return resolvePageComponent(`./pages/${name}.tsx`, pages);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },

}
);
