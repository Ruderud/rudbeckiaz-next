import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

const StyledButton = (props: ButtonProps) => {
  const { className, variant, ...rest } = props;
  const tailwindClassName = `
    ${className === undefined ? '' : className} 
    ${variant === 'primary' ? 'bg-blue-500' : 'bg-green-500'} 
    rounded py-2 px-5 disabled:bg-gray-400 hover:bg-opacity-70 text-white
  `;
  return <button className={tailwindClassName} {...rest} />;
};

export { StyledButton as Button };
