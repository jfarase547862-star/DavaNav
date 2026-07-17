import { Link as InertiaLink } from '@inertiajs/react';
import { ReactNode } from 'react';

interface TextLinkProps extends React.ComponentProps<typeof InertiaLink> {
    children?: ReactNode;
    className?: string;
}

export default function TextLink({ children, className = '', ...props }: TextLinkProps) {
    return (
        <InertiaLink
            {...props}
            className={`text-blue-600 hover:text-blue-700 hover:underline transition-colors ${className}`}
        >
            {children}
        </InertiaLink>
    );
}
