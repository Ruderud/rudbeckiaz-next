import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  color: string;
  textSize?: 'sm' | 'md' | 'lg';
};
export const Button = (props: ButtonProps) => {
  const { textSize = 'md', color, children, ...rest } = props;

  return (
    <button
      className={`bg-${color}-500 hover:bg-${color}-700 rounded disabled:bg-gray-400 py-2 px-5 text-${textSize}`}
      {...rest}
    >
      {children}
    </button>
  );
};
