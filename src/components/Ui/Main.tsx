'use client';

import tw, { styled } from 'twin.macro';

const StyledMain = styled.main(() => [tw`px-4 sm:px-8 md:px-20 lg:px-32 xl:px-40 py-10`, tw`hover:bg-opacity-70`]);

export { StyledMain as Main };
