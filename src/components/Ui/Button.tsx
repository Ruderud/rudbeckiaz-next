import tw, { styled, theme } from 'twin.macro';
import { css } from 'twin.macro';

type StyledButtonProps = {
  variant?: 'primary' | 'secondary';
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'end';
};

const StyledButton = styled.button<StyledButtonProps>(({ variant = 'primary', textSize = 'md' }) => [
  tw`rounded py-2 px-5`,
  tw`disabled:bg-gray-400`,
  variant === 'primary' && tw`bg-blue-500`,
  variant === 'secondary' && tw`bg-orange-500`,
  textSize === 'xs' && tw`text-xs`,
  textSize === 'sm' && tw`text-sm`,
  textSize === 'lg' && tw`text-lg`,
  textSize === 'xl' && tw`text-xl`,
  textSize === 'end' && tw`text-end`,

  css`
    color: ${theme`colors.white`};
  `,
]);

export { StyledButton as Button };
