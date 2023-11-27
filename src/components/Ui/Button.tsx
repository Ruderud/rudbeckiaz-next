import styled from 'styled-components';

// type StyledButtonProps = {
//   variant?: 'primary' | 'secondary';
// };

// const _StyledButton = styled.button<StyledButtonProps>(({ variant }) => [
//   tw`rounded py-2 px-5`,
//   tw`disabled:bg-gray-400`,
//   tw`hover:bg-opacity-70`,
//   variant === 'primary' && tw`bg-blue-500`,
//   variant === 'secondary' && tw`bg-orange-500`,

//   css`
//     color: ${theme`colors.white`};
//   `,
// ]);

const StyledButton = styled.button`
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  &:disabled {
    bg-color: #ccc;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

export { StyledButton as Button };
