export function TypographyH1({ children, className, id }: { children: React.ReactNode; className?: string, id?: string }) {
    return (
        <span
            id={id}
            className={`scroll-m-20 text-4xl leading-normal font-extrabold lg:text-5xl ${
                className && className
            }`}
        >
            {children}
        </span>
    );
}

export function TypographyH2({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h2
            className={`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 ${
                className && className
            }`}
        >
            {children}
        </h2>
    );
}

export function TypographyH3({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className && className}`}>{children}</h3>
    );
}

export function TypographyH4({ children, className }: { children: React.ReactNode; className?: string }) {
    return <h4 className={`scroll-m-20 text-xl font-semibold tracking-tight ${className && className}`}>{children}</h4>;
}

export function TypographyP({ children, className }: { children: React.ReactNode; className?: string }) {
    return <p className={`leading-2 ${className && className}`}>{children}</p>;
}