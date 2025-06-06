
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const PlusIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.03 3.22.077m3.22-.077L10.875 5.79m.208-3.21a48.108 48.108 0 0 1 3.478-.397m0 0H9.404m5.622 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 0 1 3.478-.397m0 0H6.835M12 3.482v.065m0 0L12.14 5.79M12 3.482l-.14.233M12 3.482l.14.233m0 0a48.374 48.374 0 0 0-4.616.04" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const FilterIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.481 0-2.856.46-3.99 1.256A.5.5 0 0 0 7.5 5v1.793l-4.146 4.147a.5.5 0 0 0 .353.854H10v5.293l-1.146 1.146a.5.5 0 0 0 .353.854h5.586a.5.5 0 0 0 .353-.854L14 16.086V10.8h6.293a.5.5 0 0 0 .353-.854L16.5 5.793V5a.5.5 0 0 0-.51-.744A9.003 9.003 0 0 0 12 3Z" />
  </svg>
);

export const CogIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5m-15.036-7.026A7.5 7.5 0 0 0 4.5 12H3m18 0h-1.5m-1.5-1.5a7.5 7.5 0 0 0-10.5-6M15 3.564A7.462 7.462 0 0 1 12 3c-1.056 0-2.06.219-2.964.605m10.928 2.5A7.5 7.5 0 0 0 15 3.564m0 0V2.25m0 1.314a7.5 7.5 0 0 0-10.5-6m2.5 11.5A7.5 7.5 0 0 0 4.5 12m0 0H3m1.5 0a7.5 7.5 0 0 1 1.5-1.5m0 0V9m0 1.5a7.5 7.5 0 0 0 1.5 1.5m0 0H6m1.5-1.5A7.5 7.5 0 0 0 9 12m0 0h1.5m1.5 0a7.5 7.5 0 0 0 1.5-1.5m0 0V9m0 1.5a7.5 7.5 0 0 1 1.5 1.5m0 0h1.5m-1.5 0H18m1.5-1.5a7.5 7.5 0 0 0-1.5-1.5m0 0V9m0 1.5a7.5 7.5 0 0 0-1.5 1.5m0 0H18" />
  </svg>
);

export const ChartBarIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0 1 9.75 19.875V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

export const DocumentTextIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

export const CubeIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const WrenchScrewdriverIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.83-5.83M11.42 15.17A3 3 0 0 1 6.343 12.34l-2.092-2.092a3 3 0 0 1 4.242-4.242l2.092 2.092a3 3 0 0 1 2.828 4.828Z" />
  </svg>
);

export const ArrowPathIcon: React.FC<IconProps> = ({ size = 20, ...props }) => ( // Corrected size prop usage
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691V5.006h-4.992v.001M19.015 4.356v4.992m0 0h-4.992m4.992 0-3.181-3.183a8.25 8.25 0 0 0-11.667 0L2.985 7.348" />
</svg>
);

export const BriefcaseIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 0 1-2.25 2.25h-12a2.25 2.25 0 0 1-2.25-2.25V14.15M17.25 7.5V5.25A2.25 2.25 0 0 0 15 3H9a2.25 2.25 0 0 0-2.25 2.25V7.5M21 10.5h-18" />
    </svg>
);
