'use client';

import styled from 'styled-components';

// const _StyledMain = styled.main(() => [tw`px-4 sm:px-8 md:px-20 lg:px-32 xl:px-40 py-10`, tw`hover:bg-opacity-70`]);

const StyledMain = styled.main`
  padding: 0 1rem;
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  min-height: 100vh;
`;

export { StyledMain as Main };
