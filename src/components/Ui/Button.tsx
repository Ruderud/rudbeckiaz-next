import tw, { styled, theme } from 'twin.macro';
import { css } from 'twin.macro';

type StyledButtonProps = {
  variant?: 'primary' | 'secondary';
};

const StyledButton = styled.button<StyledButtonProps>(({ variant }) => [
  tw`rounded py-2 px-5`,
  tw`disabled:bg-gray-400`,
  tw`hover:bg-opacity-70`,
  variant === 'primary' && tw`bg-blue-500`,
  variant === 'secondary' && tw`bg-orange-500`,

  css`
    color: ${theme`colors.white`};
  `,
]);

export { StyledButton as Button };
